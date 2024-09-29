import { signIn } from "../../auth";
import { Button } from "./ui/button";

export default function SignIn() {
  return (
    <div className="w-full">
      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: "/home" });
        }}
      >
        <Button
          type="submit"
          variant="secondary"
          className="flex flex-row gap-2 rounded-lg text-white bg-white/10 px-6 py-3 font-semibold no-underline transition hover:bg-white/20"
        >
          {/* <GoogleIcon className="mr-2" /> */}
          Sign in with Google
        </Button>
      </form>
    </div>
  );
}
