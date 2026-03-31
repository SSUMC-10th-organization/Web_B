import type { MouseEvent, ReactNode } from "react";
import { getCurrentPath, navigateTo } from "./utils";

type Props = {
  to: string;
  children: ReactNode;
};

export const Link = ({ to, children }: Props) => {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (getCurrentPath() === to) return;
    navigateTo(to);
  };

  return (
    <a href={to} onClick={handleClick}>
      {children}
    </a>
  );
};
