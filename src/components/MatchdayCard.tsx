import React from "react";

export default function MatchdayCard() {
  // const { data: matchdays, isLoading } = trpc.useQuery(['scraping.getBarcelonaMatchdays']);

  // if (isLoading) return <div>Loading...</div>;
  // if (!matchdays) return <div>No matchday data available.</div>;

  return (
    <div>
      {/* {matchdays.map((matchday, index) => (
		  <div key={index}>
			<p>Date: {matchday.date}</p>
			<p>Time: {matchday.time}</p>
			<p>Teams: {matchday.teams}</p>
			<p>Competition: {matchday.competition}</p>
		  </div>
		))} */}
    </div>
  );
}
