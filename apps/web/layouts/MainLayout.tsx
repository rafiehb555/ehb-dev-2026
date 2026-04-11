import type { ReactNode } from "react";

/**
 * EHB MainLayout – Header, Footer, Global Search.
 * Shared across landing, home, industries, services.
 */
export function MainLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
