import { Children, isValidElement } from 'react';
import type { FC, ReactElement } from 'react';
import type { RoutesProps, RouteProps } from './types';
import { useCurrentPath } from './useCurrentPath';

export const Routes: FC<RoutesProps> = ({ children }) => {
  const currentPath = useCurrentPath();

  const activeRoute = Children.toArray(children).find((child) => {
    if (isValidElement(child)) {
      const routeChild = child as ReactElement<RouteProps>;

      if (routeChild.props.path === currentPath) {
        return true;
      }
    }
    return false;
  });

  if (!activeRoute) return <h1>Not Found</h1>;

  return activeRoute as ReactElement;
};