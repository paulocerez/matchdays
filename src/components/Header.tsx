import React from "react";
import { SignOut } from "./sign-out";

export default function Header() {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-[13px] font-bold text-primary-foreground">
          M
        </span>
        <span className="text-sm font-semibold tracking-tight">Matchdays</span>
      </div>
      <SignOut />
    </header>
  );
}
