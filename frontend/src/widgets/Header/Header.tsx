import { LogIn, Menu, Moon, ShoppingCart, Sun, User, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

import { NAV_LINKS } from '@/shared/config/navigation';
import { useCurrentUser, useLogout } from '@/shared/hooks/useAuth';
import { useTheme } from '@/shared/hooks/useTheme';
import { Logo } from '@/shared/ui/Logo/Logo';

import styles from './Header.module.scss';

export const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { user } = useCurrentUser();
  const logout = useLogout();
  const isLoggedIn = user !== null;

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Logo onClick={closeMenu} />

        <nav className={styles.nav} aria-label="Основная навигация">
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

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.iconButton}
            onClick={toggleTheme}
            aria-label="Переключить тему"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {isLoggedIn ? (
            <>
              <button
                type="button"
                className={`${styles.iconButton} ${styles.authAction}`}
                aria-label="Корзина"
              >
                <ShoppingCart size={18} />
              </button>

              <button
                type="button"
                className={`${styles.iconButton} ${styles.authAction}`}
                aria-label={`Профиль (${user?.username})`}
                title="Выйти"
                onClick={() => void logout.mutateAsync()}
              >
                <User size={18} />
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className={`${styles.loginButton} ${styles.authAction}`}
            >
              <LogIn size={16} />
              Войти
            </Link>
          )}

          <button
            type="button"
            className={styles.burger}
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div id="mobile-menu" className={styles.mobileMenu}>
          <nav className={styles.mobileNav} aria-label="Мобильная навигация">
            {NAV_LINKS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={closeMenu}
                className={({ isActive }) =>
                  isActive
                    ? `${styles.mobileRow} ${styles.mobileRowActive}`
                    : styles.mobileRow
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </nav>

          {isLoggedIn ? (
            <div className={styles.mobileNav}>
              <button
                type="button"
                className={styles.mobileRow}
                onClick={closeMenu}
              >
                <ShoppingCart size={18} />
                Корзина
              </button>
              <button
                type="button"
                className={styles.mobileRow}
                onClick={() => {
                  void logout.mutateAsync();
                  closeMenu();
                }}
              >
                <User size={18} />
                Профиль
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className={styles.mobileLoginButton}
              onClick={closeMenu}
            >
              <LogIn size={16} />
              Войти
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
