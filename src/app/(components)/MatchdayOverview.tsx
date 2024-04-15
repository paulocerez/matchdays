"use client";
import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
} from "@/components/ui/table";

interface Matchday {
  id: number;
  date: string;
  time: string;
  teams: string;
  competition: string;
}

export default function Overview() {
  // State consists of array of Matchdays
  const [matchdays, setMatchdays] = useState<Matchday[]>([]);
  const { data: session } = useSession();

  const createCalendarEvents = async () => {
    try {
      const fetchPromises = matchdays.map((matchday) => {
        const event = {
          summary: matchday.teams,
          description: matchday.teams + matchday.competition + matchday.date,
          start: {
            dateTime: new Date(
              `${matchday.date}T${matchday.time}`
            ).toISOString(),
            timezone: "Etc/UTC",
          },
          end: {
            dateTime: new Date(
              `${matchday.date}T${matchday.time}`
            ).toISOString(),
            timezone: "Etc/UTC",
          },
        };

        return fetch("/api/add-event", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + session,
          },
          body: JSON.stringify({ event }),
        });
      });

      //   create fetch promise for each matchday object
      const responses = await Promise.all(fetchPromises);
      //   for each HTTP request we check for successful completion
      const results = await Promise.all(
        responses.map((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
      );

      console.log(results);
      alert("Matchdays added to Google Calendar!");
    } catch (error) {
      console.error("Couldn't create an event due to: ", error);
      alert("Failed to add matchdays to Google Calendar.");
    }
  };

  useEffect(() => {
    fetch("/api/matchdays")
      .then((response) => response.json())
      //   update state
      .then((data) => setMatchdays(data));
  }, []);

  return (
    <Table>
      <TableCaption>Your selected matchdays.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Datetime</TableHead>
          <TableHead>Competition</TableHead>
          <TableHead className="text-right">Matchup</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {matchdays.map((matchday) => (
          <TableRow key={matchday.id}>
            <TableCell className="font-medium">
              {matchday.date} {matchday.time}
            </TableCell>
            <TableCell>{matchday.competition}</TableCell>
            <TableCell className="text-right">{matchday.teams}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
