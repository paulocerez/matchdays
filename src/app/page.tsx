import Link from "next/link";

// import { CreatePost } from "~/app/_components/create-post";
// import { api } from "~/trpc/server";
// import { getServerAuthSession } from "~/server/auth";
import { LogIn } from "lucide-react";

export default function Home() {
  //   const hello = await api.post.hello.query({
  //     text: "my friend, nice to have you here.",
  //   });
  //   const session = await getServerAuthSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#4877c7] to-[#0661e8] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-medium tracking-tight sm:text-[5rem]">
          Matchdays.
        </h1>
        <div className="flex flex-col items-center gap-8">
          <p className="max-w-lg text-center text-xl leading-8 text-white">
            The Google Calendar integration for your favorite football clubs.
            Never miss a game again. ⚽️
          </p>

          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-center text-2xl text-white">
              {/* {session && <span>Logged in as {session.user?.name}</span>} */}
            </p>
            <Link
              href="/api/auth/signin"
              className="flex flex-row gap-2 rounded-lg bg-white/10 px-6 py-3 font-semibold no-underline transition hover:bg-white/20"
            >
              Sign in
              <LogIn />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
