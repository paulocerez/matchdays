"use server";
import { signOut } from "../../auth";

export default function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
      className="flex flex-row gap-2 rounded-lg bg-white/10 px-6 py-3 font-semibold no-underline transition hover:bg-white/20"
    >
      <button type="submit">Signout</button>
    </form>
  );
}
