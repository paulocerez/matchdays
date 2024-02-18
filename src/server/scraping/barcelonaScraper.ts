import axios from "axios";
import * as cheerio from "cheerio";

const params = {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
  },
};

interface Matchday {
  id: number;
  date: string;
  time: string;
  teams: string;
  competition: string;
}

const matchdays: Matchday[] = [];

export default async function scrapeMatchdayData() {
  const response = await axios.get(
    "https://onefootball.com/de/team/fc-barcelona-5/spiele",
    params
  );

  const html = response.data;
  const $ = cheerio.load(html); //parsing the HTML using cheerio
  // load function loads HTML into Cheerio, returning a Cheerio object which can be used to traverse the DOM and manipulate data
  // Cheerio object is similar to an array of DOM elements, DOM can be further traversed through that object

  const $matchcard = $("article.SimpleMatchCard_simpleMatchCard__yTuUP");

  $matchcard.each((index, element) => {
    const $element = $(element);
    const datetimeString = $element.find("time").text().trim();

    const regex = /(\d{2}\.\d{2}\.\d{2})(\d{2}:\d{2})/;
    const match = datetimeString.match(regex);

    if (match) {
      const id = Math.floor(Math.random() * 10000);
      const date = match[1]!;
      const time = match[2]! + " CET";

      const competition = $element.find("footer p").text().trim();
      const $teamElements = $element.find(
        ".SimpleMatchCardTeam_simpleMatchCardTeam__name__7Ud8D"
      );

      let teams = "";
      $teamElements.each((teamIndex, teamElement) => {
        if (teams.length > 0) {
          teams += " : ";
        }
        teams += $(teamElement).text().trim();
      });

      const matchday: Matchday = {
        id,
        date,
        time,
        teams,
        competition,
      };

      matchdays.push(matchday);
    }
  });
  return matchdays;
}
