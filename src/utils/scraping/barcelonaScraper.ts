import { generateMatchIdentifier, InsertMatch } from "@/db/schema";
import axios from "axios";
import * as cheerio from "cheerio";
import dayjs from "dayjs";

const params = {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
  },
};

export default async function scrapeMatchdayData(): Promise<InsertMatch[]> {
  const matches: InsertMatch[] = [];
  const response = await axios.get(
    "https://onefootball.com/de/team/fc-barcelona-5/spiele",
    params
  );

  const html = response.data;
  const $ = cheerio.load(html);

  $("article.SimpleMatchCard_simpleMatchCard__yTuUP").each((_, element) => {
    const $element = $(element);
    const $timeElement = $element.find("time");
    const datetimeAttribute = $timeElement.attr("datetime");
    const competition = $element.find("footer p").text().trim();
    const teams = $element
      .find(".SimpleMatchCardTeam_simpleMatchCardTeam__name__7Ud8D")
      .map((_, el) => $(el).text().trim())
      .get()
      .join(" : ");

    if (datetimeAttribute) {
      const dateObject = new Date(datetimeAttribute); // convert to Date

      // Check if the date is valid
      if (!isNaN(dateObject.getTime())) {
        matches.push({
          datetime: dateObject,
          match: teams,
          competition,
          matchIdentifier: generateMatchIdentifier(teams, dateObject),
        });
      } else {
        console.warn(
          "Invalid date format for match:",
          teams,
          datetimeAttribute
        );
      }
    } else {
      console.warn("No datetime attribute found for match:", teams);
    }
  });
  return matches;
}

scrapeMatchdayData();
