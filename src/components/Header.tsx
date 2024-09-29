import React from "react";
import { SignOut } from "./sign-out";

export default function Header() {
  return (
    <div className="flex flex-row justify-between items-center">
      <h1 className="text-xl font-medium tracking-tight text-blue-600">
        Matchdays.
      </h1>
      <SignOut />
    </div>
  );
}
