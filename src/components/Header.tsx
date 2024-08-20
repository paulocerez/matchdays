import React from "react";
import SignOut from "./sign-out";

export default function Header() {
  return (
    <div className="flex flex-row py-4 justify-between items-center">
      <h1 className="text-3xl font-medium tracking-tight text-blue-600">
        Matchdays.
      </h1>
      <SignOut />
    </div>
  );
}
