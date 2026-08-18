"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOut } from "./sign-out";

const NAV = [
  { href: "/matches", label: "Fixtures" },
  { href: "/stats", label: "Stats" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-4 sm:gap-6">
        <Link href="/matches" className="flex items-center gap-2.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#A50044] text-[13px] font-bold text-white">
            M
          </span>
          <span className="text-sm font-semibold tracking-tight">Matchdays</span>
        </Link>

        <nav className="flex items-center gap-1">
          {NAV.map((item) => {
            const active = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  active
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <SignOut />
    </header>
  );
}
