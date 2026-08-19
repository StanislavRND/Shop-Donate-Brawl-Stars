import { LogIn, Menu, Moon, ShoppingCart, Sun, User, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

import { NAV_LINKS } from '@/shared/config/navigation';
import { useTheme } from '@/shared/hooks/useTheme';
import { Logo } from '@/shared/ui/Logo/Logo';

import styles from './Header.module.scss';

export const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Мок авторизации: реального бэкенда пока нет, состояние локальное.
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);

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
                aria-label="Профиль"
                title="Выйти"
                onClick={logout}
              >
                <User size={18} />
              </button>
            </>
          ) : (
            <button
              type="button"
              className={`${styles.loginButton} ${styles.authAction}`}
              onClick={login}
            >
              <LogIn size={16} />
              Войти
            </button>
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
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={closeMenu}
                className={({ isActive }) =>
                  isActive
                    ? `${styles.mobileLink} ${styles.mobileLinkActive}`
                    : styles.mobileLink
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {isLoggedIn ? (
            <div className={styles.mobileAuth}>
              <button
                type="button"
                className={styles.mobileAuthButton}
                onClick={closeMenu}
              >
                <ShoppingCart size={18} />
                Корзина
              </button>
              <button
                type="button"
                className={styles.mobileAuthButton}
                onClick={() => {
                  logout();
                  closeMenu();
                }}
              >
                <User size={18} />
                Профиль
              </button>
            </div>
          ) : (
            <button
              type="button"
              className={styles.mobileLoginButton}
              onClick={() => {
                login();
                closeMenu();
              }}
            >
              <LogIn size={16} />
              Войти
            </button>
          )}
        </div>
      )}
    </header>
  );
};
