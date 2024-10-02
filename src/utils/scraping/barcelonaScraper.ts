import { InsertMatch } from "@/db/schema/teams";
import axios from "axios";
import * as cheerio from "cheerio";
import convertDatetime from "../datetimeConverter";

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
    const datetimeString = $element.find("time").text().trim();
    const datetimeRegex = /(\d{2}\.\d{2}\.\d{2})(\d{2}:\d{2})/;
    const regexMatch = datetimeString.match(datetimeRegex);

    if (regexMatch && regexMatch.length === 3) {
      const date = regexMatch[1];
      const time = regexMatch[2];
      console.log(date, time);
      const formattedDateTime = convertDatetime(date, time);
      const competition = $element.find("footer p").text().trim();
      const teams = $element
        .find(".SimpleMatchCardTeam_simpleMatchCardTeam__name__7Ud8D")
        .map((_, el) => $(el).text().trim())
        .get()
        .join(" : ");

      matches.push({
        datetime: formattedDateTime,
        match: teams,
        competition,
      });
    }
  });
  console.log(matches);
  return matches;
}

scrapeMatchdayData();
