import { useState, type ComponentPropsWithRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';

import styles from './Input.module.scss';

type InputProps = ComponentPropsWithRef<'input'> & {
  label: string;
  error?: string;
};

/** Однородное поле формы: label, input, ошибка валидации и глазок пароля. */
export const Input = ({
  label,
  error,
  id,
  type = 'text',
  className,
  ...rest
}: InputProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword && isPasswordVisible ? 'text' : type;

  // className дописывается к базовым стилям, а не затирает их
  const fieldClass = [
    styles.field,
    isPassword && styles.withToggle,
    error && styles.fieldError,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.wrapper}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>

      <div className={styles.inputWrap}>
        <input
          id={id}
          type={inputType}
          className={fieldClass}
          aria-invalid={Boolean(error)}
          {...rest}
        />

        {isPassword && (
          <button
            type="button"
            className={styles.toggle}
            onClick={() => setIsPasswordVisible((visible) => !visible)}
            aria-label={isPasswordVisible ? 'Скрыть пароль' : 'Показать пароль'}
          >
            {!isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error && (
        <p className={styles.errorText} role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
