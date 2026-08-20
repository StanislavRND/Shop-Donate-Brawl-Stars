import type { MouseEventHandler } from 'react';
import { Link } from 'react-router-dom';

import styles from './Logo.module.scss';

type LogoProps = {
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

export const Logo = ({ onClick }: LogoProps) => (
  <Link to="/" className={styles.logo} onClick={onClick}>
    <img src="/vanta_logo.png" alt="" className={styles.image} />
    <span className={styles.text}>
      Vanta <span className={styles.accent}>Shop</span>
    </span>
  </Link>
);
