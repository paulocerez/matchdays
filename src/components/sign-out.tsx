import { handleSignOut } from "@/actions/handleSignOut";
import { Button } from "./ui/button";
import { signOut } from "../../auth";

export default function SignOut() {
  return (
    // <Button type="button" variant="secondary" onClick={handleSignOut}>
    //   Sign Out
    // </Button>
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <button type="submit">Sign Out</button>
    </form>
  );
}
