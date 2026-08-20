import type { PropsWithChildren } from 'react';

import styles from './Container.module.scss';

/** Центрирует контент и ограничивает его ширине контейнера проекта. */
export const Container = ({ children }: PropsWithChildren) => (
  <div className={styles.container}>{children}</div>
);
