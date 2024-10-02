"use client";
import { useEffect, useState } from "react";
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Matchday } from "@/types/matchdays";

export default function MatchesTable() {
  // State consists of array of Matchdays
  const [matchdays, setMatchdays] = useState<Matchday[]>([]);

  useEffect(() => {
    async function fetchMatches() {
      const response = await fetch("/api/matches");
      const data = await response.json();
      console.log(response);
      console.log(data);
      setMatchdays(data);
    }
    fetchMatches();
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
        {Array.isArray(matchdays) && matchdays.length > 0 ? (
          matchdays.map(
            (matchday) =>
              matchday && (
                <TableRow key={matchday.id}>
                  <TableCell className="font-medium">
                    {matchday.date} {matchday.time}
                  </TableCell>
                  <TableCell>{matchday.competition}</TableCell>
                  <TableCell className="text-right">{matchday.teams}</TableCell>
                </TableRow>
              )
          )
        ) : (
          <div>No matchdays scraped yet.</div>
        )}
      </TableBody>
    </Table>
  );
}
