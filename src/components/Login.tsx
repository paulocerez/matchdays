import { signIn } from "next-auth/react";

export async function Login() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#0b3ceb] to-[#669ae8] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-medium tracking-tight sm:text-[5rem]">
          Matchdays.
        </h1>
        <div className="flex flex-col items-center gap-8">
          <p className="max-w-lg text-center text-xl leading-8 text-white">
            The Google Calendar integration for your favorite football clubs.
            Never miss a game again. ⚽️
          </p>

          <div className="flex flex-col items-center justify-center gap-4">
            <button
              onClick={() => signIn("google")}
              className="flex flex-row gap-2 rounded-lg bg-white/10 px-6 py-3 font-semibold no-underline transition hover:bg-white/20"
            >
              Sign in using Google
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
