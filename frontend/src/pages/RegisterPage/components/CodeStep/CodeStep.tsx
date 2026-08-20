import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { resendVerificationCode, verifyEmail } from '@/shared/api/auth';
import { ApiError } from '@/shared/api/http';
import { Input } from '@/shared/ui/Input/Input';
import { SubmitButton } from '@/shared/ui/SubmitButton/SubmitButton';

import styles from './CodeStep.module.scss';

type CodeFormValues = {
  code: string;
};

const RESEND_TIMEOUT_SECONDS = 60;

/** Таймер повторной отправки кода: 60 → 0, затем можно отправить снова. */
const useResendTimer = () => {
  const [secondsLeft, setSecondsLeft] = useState(RESEND_TIMEOUT_SECONDS);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const intervalId = setInterval(
      () => setSecondsLeft((seconds) => seconds - 1),
      1000,
    );
    return () => clearInterval(intervalId);
  }, [secondsLeft]);

  return {
    secondsLeft,
    restart: () => setSecondsLeft(RESEND_TIMEOUT_SECONDS),
  };
};

type CodeStepProps = {
  email: string;
  /** Вернуться к шагу 1 (исправить данные регистрации). */
  onBack: () => void;
};

/** Шаг 2 регистрации: ввод кода подтверждения из письма. */
export const CodeStep = ({ email, onBack }: CodeStepProps) => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const resendTimer = useResendTimer();

  const {
    register: registerCodeField,
    handleSubmit: handleCodeSubmit,
    setError: setCodeError,
    formState: { errors: codeErrors },
  } = useForm<CodeFormValues>();

  // Подтверждаем email кодом из письма.
  const onVerifyCode: SubmitHandler<CodeFormValues> = async ({ code }) => {
    setServerError('');
    setIsSubmitting(true);
    try {
      await verifyEmail({ email, code });
      navigate('/login', { replace: true });
    } catch (error) {
      setCodeError('code', {
        message:
          error instanceof ApiError
            ? error.message
            : 'Не удалось подтвердить код, попробуйте ещё раз',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Повторная отправка кода (после 60-секундного таймера).
  const onResend = async () => {
    if (resendTimer.secondsLeft > 0 || isResending) return;
    setServerError('');
    setIsResending(true);
    try {
      await resendVerificationCode({ email });
      resendTimer.restart();
    } catch (error) {
      setServerError(
        error instanceof ApiError ? error.message : 'Не удалось отправить код',
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleCodeSubmit(onVerifyCode)} noValidate>
        {serverError && (
          <p className={styles.formError} role="alert">
            {serverError}
          </p>
        )}

        <Input
          id="register-code"
          label="Код из письма"
          type="text"
          inputMode="numeric"
          placeholder="000000"
          maxLength={6}
          autoComplete="one-time-code"
          className={styles.codeInput}
          error={codeErrors.code?.message}
          {...registerCodeField('code', {
            required: 'Введите код из письма',
            pattern: { value: /^\d{6}$/, message: 'Код — 6 цифр из письма' },
          })}
        />

        <SubmitButton disabled={isSubmitting}>
          {isSubmitting ? 'Подтверждаем...' : 'Подтвердить'}
        </SubmitButton>

        <button
          type="button"
          className={styles.resend}
          onClick={onResend}
          disabled={resendTimer.secondsLeft > 0 || isResending}
        >
          {resendTimer.secondsLeft > 0
            ? `Отправить код повторно через ${resendTimer.secondsLeft}с`
            : isResending
              ? 'Отправляем...'
              : 'Отправить код повторно'}
        </button>
      </form>

      <p className={styles.switch}>
        Ошиблись при вводе данных?{' '}
        <button type="button" className={styles.linkButton} onClick={onBack}>
          Изменить
        </button>
      </p>
    </>
  );
};
