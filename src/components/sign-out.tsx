"use client";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function SignOut() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/", redirect: true })}
      className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
    >
      <LogOut className="h-3.5 w-3.5" />
      Sign out
    </button>
  );
}
