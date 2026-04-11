/** @vitest-environment jsdom */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createElement, type ReactNode } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AuthPage from "@/app/auth/page";

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: { children: ReactNode; href: string }) =>
    createElement("a", { href, ...props }, children),
}));

const originalFetch = globalThis.fetch;

function mockFetch429() {
  globalThis.fetch = vi.fn(async (input: RequestInfo | URL) => {
    const url = typeof input === "string" ? input : String(input);
    if (url.includes("/api/auth/me")) {
      return {
        ok: true,
        json: async () => ({ data: { user: null } }),
      } as Response;
    }
    if (url.includes("/api/auth/login")) {
      return {
        status: 429,
        ok: false,
        headers: {
          get: (name: string) => (name.toLowerCase() === "retry-after" ? "60" : null),
        },
        json: async () => ({
          success: false,
          error: {
            message: "Too many login attempts. Try again in a few minutes.",
            code: "RATE_LIMITED",
            details: { cooldownSeconds: 60 },
          },
        }),
      } as Response;
    }
    throw new Error(`unexpected fetch: ${url}`);
  }) as typeof fetch;
}

describe("AuthPage login 429 UI", () => {
  beforeEach(() => {
    mockFetch429();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.clearAllMocks();
  });

  it("shows cooldown and error message when login returns 429", async () => {
    const user = userEvent.setup();
    render(createElement(AuthPage));

    await waitFor(() => {
      expect(screen.getByText(/No active session yet/i)).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("auth-mode-login"));
    await user.clear(screen.getByTestId("auth-email"));
    await user.type(screen.getByTestId("auth-email"), "unit-test@example.com");
    await user.clear(screen.getByTestId("auth-password"));
    await user.type(screen.getByTestId("auth-password"), "wrong-pass");

    await user.click(screen.getByTestId("auth-submit"));

    await waitFor(() => {
      expect(screen.getByTestId("auth-submit")).toHaveTextContent(/Retry in 60s/);
    });
    expect(screen.getByText(/Too many attempts/i)).toBeInTheDocument();
    expect(screen.getByTestId("auth-error")).toHaveTextContent(/Too many login attempts/i);
  });
});
