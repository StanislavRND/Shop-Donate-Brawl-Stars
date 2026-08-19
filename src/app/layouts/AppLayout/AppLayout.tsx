import { Outlet, ScrollRestoration } from 'react-router-dom';

import { Footer } from '@/widgets/Footer/Footer';
import { Header } from '@/widgets/Header/Header';

import styles from './AppLayout.module.scss';

export const AppLayout = () => {
  return (
    <>
      <a className={styles.skipLink} href="#content">
        Перейти к содержимому
      </a>

      <Header />
      <Outlet />
      <Footer />

      {/* Новая страница открывается сверху; назад/вперёд — прежняя позиция. */}
      <ScrollRestoration />
    </>
  );
};
