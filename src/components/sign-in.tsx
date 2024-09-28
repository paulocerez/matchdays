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
          variant="default"
          className="w-full sm:w-40 flex items-center justify-center"
        >
          {/* <GoogleIcon className="mr-2" /> */}
          Sign in with Google
        </Button>
      </form>
    </div>
  );
}
