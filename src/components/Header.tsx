import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import router from "next/router";
import React from "react";
import SignOut from "./sign-out";

export default function Header() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex flex-row py-4 justify-between items-center">
        <h1 className="text-3xl font-medium tracking-tight text-blue-600">
          Matchdays.
        </h1>
        <SignOut />
      </div>
    );
  }
}
