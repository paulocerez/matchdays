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
    async function fetchScrapedMatches() {
      const response = await fetch("/api/scrape");
      const data = await response.json();
      console.log(response, data);
      setMatchdays(data);
    }
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
