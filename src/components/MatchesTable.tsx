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

interface MatchesTableProps {
  matches: SelectMatch[];
}

export default function MatchesTable({ matches }: MatchesTableProps) {
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
