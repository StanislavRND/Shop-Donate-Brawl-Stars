import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, type ReactNode } from 'react';

import { setOnUnauthorized } from '@/shared/api/http';
import { CURRENT_USER_KEY } from '@/shared/hooks/useAuth';
import { router } from '@/app/router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * Провайдер server-state + связка http-клиента с приложением:
 * если refresh токен невалиден — чистим auth state и уходим на /login.
 */
export const AppProviders = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    setOnUnauthorized(() => {
      // Останавливаем зависшие /me-запросы и фиксируем «нет пользователя».
      // removeQueries НЕ используем: активный observer тут же пересоздал бы
      // query и получил новый /me → бесконечный цикл. Вместо этого useCurrentUser
      // отключается через enabled (circuit breaker в http.ts).
      void queryClient.cancelQueries({ queryKey: CURRENT_USER_KEY });
      queryClient.setQueryData(CURRENT_USER_KEY, null);
      if (router.state.location.pathname !== '/login') {
        void router.navigate('/login', { replace: true });
      }
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
