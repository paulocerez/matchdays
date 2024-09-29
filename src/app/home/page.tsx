import Header from "@/components/Header";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { auth } from "../../../auth";
import MatchesTable from "@/components/MatchesTable";

export default async function Home() {
  const session = await auth();
  const username = session?.user.name;

  return (
    <main className="flex min-h-screen flex-col gap-8 text-black p-4 lg:px-64">
      <Header />
      <div className="space-y-16">
        <div className="flex flex-col items-center space-y-6  md:flex-row md:justify-between md:items-center">
          <div className="flex flex-col space-y-2">
            <h1 className="text-2xl">Welcome, {username || "my friend"}. 👋🏼</h1>
            <h2 className="text-md lg:text-lg">
              These are your upcoming matches.
            </h2>
          </div>
          <div>
            <Button
              type="button"
              variant="secondary"
              className="flex flex-row items-center p-4 rounded-lg"
            >
              <Image
                src="/google_calendar.png"
                width={20}
                height={20}
                alt="GCal Logo"
                className="mr-2"
              />
              Add to calendar
            </Button>
          </div>
        </div>
        <div>
          <MatchesTable />
        </div>
      </div>
    </main>
  );
}
