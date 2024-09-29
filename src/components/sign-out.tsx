import { signOut } from "../../auth";

export function SignOut() {
  return (
    <form
    //   action={async () => {
    //     await signOut();
    //   }}
    >
      <button
        type="submit"
        className="flex items-center justify-center text-sm border p-2 rounded-md hover:bg-gray-100 bg-white dark:bg-black"
      >
        Log out
      </button>
    </form>
  );
}
