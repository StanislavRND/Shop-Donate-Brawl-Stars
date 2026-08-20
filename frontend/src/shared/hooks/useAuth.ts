import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  fetchMe,
  login as loginRequest,
  logout as logoutRequest,
} from '@/shared/api/auth';
import { isSessionExpired, resetSession } from '@/shared/api/http';

export const CURRENT_USER_KEY = ['auth', 'me'] as const;

/**
 * Текущий пользователь. Если сессии нет — data === null, без ошибок в UI.
 * После неудачного refresh (circuit breaker) запрос полностью отключён —
 * авто-циклы /me → /refresh невозможны до следующего успешного логина.
 */
export const useCurrentUser = () => {
  const query = useQuery({
    queryKey: CURRENT_USER_KEY,
    queryFn: fetchMe,
    enabled: !isSessionExpired(),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  return {
    user: query.data ?? null,
    isLoading: query.isPending,
  };
};

/** Логин: при успехе сбрасываем circuit breaker и кладём пользователя в кэш. */
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { login: string; password: string }) =>
      loginRequest(payload),
    onSuccess: ({ user }) => {
      resetSession();
      queryClient.setQueryData(CURRENT_USER_KEY, user);
    },
  });
};

/** Logout: сбрасываем auth state в кэше. */
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutRequest,
    onSettled: () => {
      queryClient.setQueryData(CURRENT_USER_KEY, null);
      queryClient.removeQueries({ queryKey: CURRENT_USER_KEY });
    },
  });
};
