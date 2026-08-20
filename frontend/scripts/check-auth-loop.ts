// Проверка circuit breaker'а: сервер отдаёт 401 на /me и /refresh.
// Ожидание: ровно один refresh, повторные /me не порождают новых запросов,
// прямой /auth/refresh не перехватывается, resetSession всё возвращает.

import http from 'node:http';
import assert from 'node:assert/strict';

import {
  api,
  apiRequest,
  isSessionExpired,
  resetSession,
  setOnUnauthorized,
  ApiError,
} from '../src/shared/api/http';

let meCalls = 0;
let refreshCalls = 0;

const server = http.createServer((req, res) => {
  if (req.url === '/api/v1/users/me') meCalls += 1;
  if (req.url === '/api/v1/auth/refresh') refreshCalls += 1;
  res.writeHead(401, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ detail: 'unauthorized' }));
});

let unauthorizedCount = 0;

const expectReject = async (promise: Promise<unknown>): Promise<ApiError> => {
  try {
    await promise;
    throw new Error('ожидали reject');
  } catch (error) {
    if (error instanceof ApiError) return error;
    throw error;
  }
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  await new Promise<void>((resolve) => server.listen(9999, resolve));
  api.defaults.baseURL = 'http://127.0.0.1:9999/api/v1';
  setOnUnauthorized(() => {
    unauthorizedCount += 1;
  });

  // --- Сценарий: /me и /refresh оба возвращают 401 ---

  // 5 параллельных /me — все должны разделить ОДИН refresh
  await Promise.allSettled([
    apiRequest('/users/me'),
    apiRequest('/users/me'),
    apiRequest('/users/me'),
    apiRequest('/users/me'),
    apiRequest('/users/me'),
  ]);

  assert.equal(refreshCalls, 1, `refresh должен быть вызван ровно 1 раз, было ${refreshCalls}`);
  assert.equal(unauthorizedCount, 1, 'onUnauthorized должен сработать 1 раз');
  assert.ok(isSessionExpired(), 'circuit breaker должен быть активирован');

  // Повторные /me после неудачного refresh: сами запросы доходят (это явные
  // вызовы), но НЕ порождают новых refresh — цикл невозможен
  await Promise.allSettled([apiRequest('/users/me'), apiRequest('/users/me')]);
  await delay(50);
  assert.equal(meCalls, 7, `2 явных /me = 2 запроса, было ${meCalls}`);
  assert.equal(refreshCalls, 1, `новых refresh быть не должно, было ${refreshCalls}`);
  assert.equal(unauthorizedCount, 1, 'onUnauthorized больше не вызывается');

  // Прямой /auth/refresh не перехватывается интерцептором (нет цикла)
  const error = await expectReject(apiRequest('/auth/refresh', { method: 'POST' }));
  assert.equal(error.status, 401);
  assert.equal(refreshCalls, 2, 'прямой refresh — это явный вызов, без авто-повторов');

  // resetSession (новый логин) снимает блокировку
  resetSession();
  assert.ok(!isSessionExpired());
  await expectReject(apiRequest('/users/me'));
  assert.equal(refreshCalls, 3, 'после resetSession refresh снова работает');
  resetSession();

  console.log('ВСЕ ПРОВЕРКИ ПРОЙДЕНЫ: циклов нет, refresh' + ' single-flight работает');
  server.close();
  process.exit(0);
}

main().catch((error) => {
  console.error('ПРОВАЛ:', error);
  server.close();
  process.exit(1);
});
