"use client";

import { signIn, signOut } from "next-auth/react";

type AuthControlsProps = {
  isAuthenticated: boolean;
  userName?: string | null;
};

export default function AuthControls({ isAuthenticated, userName }: AuthControlsProps) {
  if (isAuthenticated) {
    return (
      <div className="auth-controls">
        <span className="auth-user">Welcome back, {userName ?? "Agent"}</span>
        <button className="auth-button" onClick={() => signOut({ callbackUrl: "/" })}>
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button className="auth-button" onClick={() => signIn("google")}>
      Sign in with Google
    </button>
  );
}
