// =============================================================================
// Axios-клиент для backend API.
//
// Токены живут в HttpOnly cookies, поэтому withCredentials: true.
// Response interceptor: при 401 на обычном запросе — один раз вызываем
// /auth/refresh (single-flight) и повторяем исходный запрос. Сами
// /auth/refresh и /auth/login из interceptor исключены — циклы невозможны.
// Если refresh не удался — пользователь разлогинен и отправлен на /login.
// =============================================================================

import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

/** Ошибка API: HTTP-статус + человекочитаемое сообщение из detail. */
export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

type ApiErrorBody = {
  detail?: unknown;
  message?: unknown;
};

/** Оборачиваем любую ошибку axios в ApiError с сообщением из detail. */
const toApiError = (error: unknown): ApiError => {
  if (error instanceof ApiError) return error;

  if (error instanceof AxiosError) {
    const status = error.response?.status ?? 0;
    const data = error.response?.data as ApiErrorBody | undefined;
    const detail = data?.detail ?? data?.message;

    if (typeof detail === 'string') {
      return new ApiError(status, detail);
    }
    // Ошибки валидации FastAPI — массив; берём первый msg
    if (Array.isArray(detail)) {
      const first = detail[0] as { msg?: string } | undefined;
      if (first?.msg) return new ApiError(status, first.msg);
    }
    return new ApiError(status, `Ошибка запроса (HTTP ${status})`);
  }

  return new ApiError(0, 'Ошибка сети — проверьте соединение');
};

/** Обработчик «сессия истекла»: назначается один раз при старте приложения. */
let onUnauthorized: (() => void) | null = null;

export const setOnUnauthorized = (handler: () => void) => {
  onUnauthorized = handler;
};

// -----------------------------------------------------------------------------
// Circuit breaker: после первого неудачного refresh сессия считается мёртвой.
// Пока флаг установлен, /me и авто-refresh больше не выполняются вообще.
// Сбрасывается только при успешном логине (resetSession в useLogin).
// -----------------------------------------------------------------------------
let sessionExpired = false;

export const isSessionExpired = (): boolean => sessionExpired;

export const resetSession = () => {
  sessionExpired = false;
};

export const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
});

type RetriableConfig = InternalAxiosRequestConfig & { _isRetry?: boolean };

// Единственный параллельный refresh: конкурентные 401 ждут один и тот же запрос
let refreshPromise: Promise<unknown> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    const axiosError = error instanceof AxiosError ? error : null;
    const config = axiosError?.config as RetriableConfig | undefined;
    const url = config?.url ?? '';
    const status = axiosError?.response?.status;

    // 1) /auth/refresh и /auth/login никогда не перехватываются повторно
    // 2) _isRetry — исходный запрос повторяется не более одного раза
    // 3) sessionExpired — после неудачного refresh никакого авто-обновления
    const canRetry =
      status === 401 &&
      config !== undefined &&
      !config._isRetry &&
      !sessionExpired &&
      !url.includes('/auth/refresh') &&
      !url.includes('/auth/login');

    if (canRetry) {
      config._isRetry = true;
      try {
        if (!refreshPromise) {
          refreshPromise = api
            .post('/auth/refresh')
            .finally(() => {
              refreshPromise = null;
            });
        }
        await refreshPromise;

        // Refresh успешен — повторяем исходный запрос ровно один раз
        return api.request(config);
      } catch {
        // Один вызов onUnauthorized на всех конкурентов, ждущих этот refresh
        if (!sessionExpired) {
          sessionExpired = true;
          onUnauthorized?.();
        }
        return Promise.reject(new ApiError(401, 'Сессия истекла'));
      }
    }

    return Promise.reject(toApiError(error));
  },
);

type RequestOptions = {
  method?: 'GET' | 'POST';
  body?: unknown;
  signal?: AbortSignal;
};

/** Запрос к API: возвращает data, ошибкиreject'ятся как ApiError. */
export const apiRequest = async <T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> => {
  try {
    const response = await api.request<T>({
      url: path,
      method: options.method ?? 'GET',
      data: options.body,
      signal: options.signal,
    });
    return response.data;
  } catch (error) {
    throw toApiError(error);
  }
};
