import SignIn from "@/components/sign-in";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
      {/* faint grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.15] [mask-image:radial-gradient(60%_50%_at_50%_40%,black,transparent)]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(240 5% 25% / 0.4) 1px, transparent 1px), linear-gradient(90deg, hsl(240 5% 25% / 0.4) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center text-center">
        <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          FC Barcelona
        </span>

        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          Never miss a match.
        </h1>

        <p className="mt-4 text-balance text-base leading-relaxed text-muted-foreground">
          Every fixture, automatically synced to your Google Calendar. Set it
          once — we keep it up to date.
        </p>

        <div className="mt-10 w-full">
          <SignIn />
        </div>

        <p className="mt-6 text-xs text-muted-foreground/70">
          We only add events to your calendar. Nothing else.
        </p>
      </div>
    </main>
  );
}
