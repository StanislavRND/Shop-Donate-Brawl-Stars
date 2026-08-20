import { useForm, type SubmitHandler } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import { ApiError } from '@/shared/api/http';
import { useLogin } from '@/shared/hooks/useAuth';
import { FormCard } from '@/shared/ui/FormCard/FormCard';
import { Input } from '@/shared/ui/Input/Input';
import { SubmitButton } from '@/shared/ui/SubmitButton/SubmitButton';

import styles from './LoginPage.module.scss';

type LoginFormValues = {
  email: string;
  password: string;
};

export const LoginPage = () => {
  const navigate = useNavigate();
  const login = useLogin();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>();

  const onSubmit: SubmitHandler<LoginFormValues> = async (values) => {
    try {
      await login.mutateAsync({
        login: values.email,
        password: values.password,
      });
      navigate('/', { replace: true });
    } catch (error) {
      // 403 — email не подтверждён, 401 — неверные данные, иначе — общая ошибка
      setError('root', {
        message:
          error instanceof ApiError ? error.message : 'Не удалось войти, попробуйте ещё раз',
      });
    }
  };

  return (
    <main id="content">
      <FormCard title="Авторизация">
        <form
          className={styles.form}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          {errors.root && (
            <p className={styles.formError} role="alert">
              {errors.root.message}
            </p>
          )}

          <Input
            id="login-email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email', {
              required: 'Укажите email',
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: 'Некорректный email',
              },
            })}
          />

          <Input
            id="login-password"
            label="Пароль"
            type="password"
            placeholder="••••••"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password', {
              required: 'Введите пароль',
              minLength: { value: 8, message: 'Минимум 8 символов' },
            })}
          />

          <SubmitButton disabled={login.isPending}>
            {login.isPending ? 'Входим...' : 'Войти'}
          </SubmitButton>
        </form>

        <p className={styles.switch}>
          Нет аккаунта?{' '}
          <Link to="/register" className={styles.switchLink}>
            Зарегистрироваться
          </Link>
        </p>
      </FormCard>
    </main>
  );
};
