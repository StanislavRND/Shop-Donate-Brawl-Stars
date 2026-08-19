import { NavLink } from 'react-router-dom';

import { NAV_LINKS } from '@/shared/config/navigation';
import { Container } from '@/shared/ui/Container/Container';
import { Logo } from '@/shared/ui/Logo/Logo';
import { TelegramLink } from '@/shared/ui/TelegramLink/TelegramLink';

import styles from './Footer.module.scss';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Logo />
            <p className={styles.description}>
              Премиальный магазин доната для Brawl Stars: гемы, Brawl Pass и
              специальные предложения по выгодным ценам.
            </p>
          </div>

          <nav className={styles.nav} aria-label="Навигация в подвале">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  isActive
                    ? `${styles.navLink} ${styles.navLinkActive}`
                    : styles.navLink
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <TelegramLink />
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Vanta Shop. Все права защищены.
          </p>
        </div>
      </Container>
    </footer>
  );
};
