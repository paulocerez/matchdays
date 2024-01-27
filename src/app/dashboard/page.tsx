import React from "react";

// import { CreatePost } from "~/app/_components/create-post";
// import { api } from "~/trpc/server";

const sampleClubs = [
  {
    clubId: 1,
    clubName: "FC Barcelona",
    clubLogo: "logo",
  },
];

// const isSelected = () => {};

export default function Dashboard() {
  return (
    <main className="flex min-h-screen justify-center bg-gradient-to-b from-[#c4cedd] to-[#e0e7f2] text-white">
      <div className="m-10 flex flex-col justify-center space-y-8">
        <h1 className="text-5xl font-medium">Welcome, Paulo! 👋🏼</h1>
        <h2 className="text-bl text-xl">
          Choose your favourite football clubs:
        </h2>

        <ul className="flex flex-col space-y-8 md:flex-row md:space-x-4 md:space-y-0">
          {sampleClubs.map((club) => (
            <li key={club.clubId}>
              <button
                // onClick={isSelected}
                className="w-full rounded-lg bg-blue-500 p-4 text-center"
              >
                {club.clubName}
              </button>
            </li>
          ))}
        </ul>

        <button className="rounded-lg bg-black p-4 hover:bg-slate-700">
          Apply selection
        </button>
      </div>
    </main>
  );
}
