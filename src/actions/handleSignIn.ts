import { signIn } from "../../auth";

export async function handleSignIn() {
  await signIn("google", { redirectTo: "/home" });
}
