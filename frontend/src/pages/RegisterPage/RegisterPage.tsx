import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Link } from 'react-router-dom';

import { registerUser } from '@/shared/api/auth';
import { ApiError } from '@/shared/api/http';
import { CodeStep } from './components/CodeStep/CodeStep';
import { FormCard } from '@/shared/ui/FormCard/FormCard';
import { Input } from '@/shared/ui/Input/Input';
import { SubmitButton } from '@/shared/ui/SubmitButton/SubmitButton';

import styles from './RegisterPage.module.scss';

type RegisterFormValues = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export const RegisterPage = () => {
  const [step, setStep] = useState<'credentials' | 'code'>('credentials');
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<RegisterFormValues>();

  // Шаг 1: отправляем данные регистрации, переходим к вводу кода.
  const onRegister: SubmitHandler<RegisterFormValues> = async (values) => {
    setServerError('');
    setIsSubmitting(true);
    try {
      await registerUser({
        email: values.email,
        username: values.username,
        password: values.password,
      });
      setRegisteredEmail(values.email);
      setStep('code');
    } catch (error) {
      setServerError(
        error instanceof ApiError
          ? error.message
          : 'Не удалось зарегистрироваться, попробуйте ещё раз',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 'code') {
    return (
      <main id="content">
        <FormCard
          title="Подтверждение email"
          subtitle={`Мы отправили код на ${registeredEmail}.`}
        >
          <CodeStep
            email={registeredEmail}
            onBack={() => {
              setStep('credentials');
              setServerError('');
            }}
          />
        </FormCard>
      </main>
    );
  }

  return (
    <main id="content">
      <FormCard title="Регистрация">
        <form className={styles.form} onSubmit={handleSubmit(onRegister)} noValidate>
          {serverError && (
            <p className={styles.formError} role="alert">
              {serverError}
            </p>
          )}

          <Input
            id="register-username"
            label="Логин"
            type="text"
            placeholder="brawler2026"
            autoComplete="username"
            error={errors.username?.message}
            {...registerField('username', {
              required: 'Придумайте логин',
              minLength: { value: 3, message: 'Минимум 3 символа' },
              maxLength: { value: 32, message: 'Максимум 32 символа' },
              pattern: {
                value: /^[a-zA-Z0-9_]+$/,
                message: 'Только латиница, цифры и подчёркивание',
              },
            })}
          />

          <Input
            id="register-email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            error={errors.email?.message}
            {...registerField('email', {
              required: 'Укажите email',
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: 'Некорректный email',
              },
            })}
          />

          <Input
            id="register-password"
            label="Пароль"
            type="password"
            placeholder="••••••"
            autoComplete="new-password"
            error={errors.password?.message}
            {...registerField('password', {
              required: 'Придумайте пароль',
              minLength: { value: 8, message: 'Минимум 8 символов' },
            })}
          />

          <Input
            id="register-confirm-password"
            label="Подтверждение пароля"
            type="password"
            placeholder="••••••"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...registerField('confirmPassword', {
              required: 'Повторите пароль',
              validate: (value) =>
                value === getValues('password') || 'Пароли не совпадают',
            })}
          />

          <SubmitButton disabled={isSubmitting}>
            {isSubmitting ? 'Регистрируем...' : 'Зарегистрироваться'}
          </SubmitButton>
        </form>

        <p className={styles.switch}>
          Уже есть аккаунт?{' '}
          <Link to="/login" className={styles.switchLink}>
            Войти
          </Link>
        </p>
      </FormCard>
    </main>
  );
};
