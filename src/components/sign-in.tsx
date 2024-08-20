"use client";
import { handleSignIn } from "@/actions/handleSignIn";
import { Button } from "./ui/button";

export default function SignIn() {
  return (
    <Button
      type="button"
      variant="secondary"
      onClick={handleSignIn}
      className="flex flex-row gap-2 rounded-lg bg-white/10 px-6 py-3 font-semibold no-underline transition hover:bg-white/20"
    >
      Sign in with Google
    </Button>
  );
}
