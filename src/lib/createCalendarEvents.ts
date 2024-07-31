import { Matchday, Session } from "@/types/matchdays";

export async function createCalendarEvents(
  matchdays: Matchday[],
  session: Session
) {
  try {
    const fetchPromises = matchdays.map((matchday: Matchday) => {
      const event = {
        summary: matchday.teams,
        description: matchday.teams + matchday.competition + matchday.date,
        start: {
          dateTime: new Date(`${matchday.date}T${matchday.time}`).toISOString(),
          timezone: "Etc/UTC",
        },
        end: {
          dateTime: new Date(
            new Date(`${matchday.date}T${matchday.time}`).getTime() +
              120 * 60000
          ).toISOString(),
          timezone: "Etc/UTC",
        },
      };

      return fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            //   Google Provider Token from NextAuth
            Authorization: "Bearer " + session.accessToken,
          },
          body: JSON.stringify({ event }),
        }
      );
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
}
