import type { ReactNode, FC } from 'react';

export interface LinkProps {
  to: string;
  children: ReactNode;
}

export interface RouteProps {
  path: string;
  component: FC;
}

export interface RoutesProps {
  children: ReactNode;
}