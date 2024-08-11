import { signIn } from "../../auth";
import Image from "next/image";

export default function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google");
      }}
      className="flex flex-row gap-2 rounded-lg bg-white/10 px-6 py-3 font-semibold no-underline transition hover:bg-white/20"
    >
      <button type="submit">Signin with Google</button>
    </form>
  );
}
