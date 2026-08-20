import type { ComponentPropsWithoutRef } from 'react';

import styles from './SubmitButton.module.scss';

/** Кнопка отправки формы на всю ширину. */
export const SubmitButton = ({
  className,
  children,
  ...rest
}: ComponentPropsWithoutRef<'button'>) => (
  <button
    type="submit"
    className={className ? `${styles.button} ${className}` : styles.button}
    {...rest}
  >
    {children}
  </button>
);
