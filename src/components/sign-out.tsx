"use client";
import { signOut } from "next-auth/react";

export function SignOut() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/", redirect: true })}
      className="flex items-center justify-center text-sm border p-2 rounded-md hover:bg-gray-100 bg-white dark:bg-black"
    >
      Sign out
    </button>
  );
}
