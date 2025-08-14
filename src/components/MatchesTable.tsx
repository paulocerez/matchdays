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
import { SelectMatch } from "@/db/schema";

export default function MatchesTable({ matches }: { matches: SelectMatch[] }) { 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(false);
  }, [matches]);

  if (loading) {
    return <div className="text-center py-8">Loading matches...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  if (matches.length === 0) {
    return <div className="text-center py-8 text-gray-500">No matches found.</div>;
  }

  return (
    <Table>
      <TableCaption>Your upcoming matches.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">Date & Time</TableHead>
          <TableHead>Competition</TableHead>
          <TableHead className="text-right">Matchup</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {matches.map((match) => (
          <TableRow key={match.id}>
            <TableCell className="font-medium">
              {new Date(match.datetime).toLocaleString()}
            </TableCell>
            <TableCell>{match.competition}</TableCell>
            <TableCell className="text-right">{match.match}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
