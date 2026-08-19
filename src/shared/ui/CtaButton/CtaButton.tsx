import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import styles from './CtaButton.module.scss';

type CtaButtonProps = {
  to: string;
  children: ReactNode;
};

/** Основная золотая кнопка-действие со стрелкой. */
export const CtaButton = ({ to, children }: CtaButtonProps) => (
  <Link to={to} className={styles.button}>
    {children}
    <ArrowRight size={18} className={styles.icon} />
  </Link>
);
