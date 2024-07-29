import axios from "axios";
import * as cheerio from "cheerio";

const params = {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
  },
};

interface Matchday {
  date: string;
  time: string;
  teams: string;
  competition: string;
}

const matchdays: Matchday[] = [];

export default async function scrapeMatchdayData() {
  matchdays.length = 0;
  const response = await axios.get(
    "https://onefootball.com/de/team/fc-barcelona-5/spiele",
    params
  );

  const html = response.data;
  const $ = cheerio.load(html);
  //parsing the HTML using cheerio
  // load function loads HTML into Cheerio, returning a Cheerio object which can be used to traverse the DOM and manipulate data
  // Cheerio object is similar to an array of DOM elements, DOM can be further traversed through that object

  const $matchcard = $("article.SimpleMatchCard_simpleMatchCard__yTuUP");

  $matchcard.each((index, element) => {
    const $element = $(element);
    const datetimeString = $element.find("time").text().trim();

    // regex datetime pattern -> (dd.dd.dd)(dd:dd), d = digit (0-9) - every digit is separated by a literal dot
    const datetimeRegex = /(\d{2}\.\d{2}\.\d{2})(\d{2}:\d{2})/;
    const regexMatch = datetimeString.match(datetimeRegex);
    let currentDate = new Date();
    let date = currentDate.toLocaleDateString("de-DE");
    let time =
      currentDate.toLocaleTimeString("de-DE", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }) + " CET";

    if (regexMatch) {
      const id = Math.floor(Math.random() * 10000);

      if (regexMatch.length % 2 === 0 && regexMatch.length !== 0) {
        date = regexMatch[1]!;
        time = regexMatch[2]! + " CET";
      } else {
        let currentDate = new Date();
        date = currentDate.toLocaleDateString("de-DE");
        time = regexMatch[2]! + " CET";
      }

      if (regexMatch && regexMatch.length === 3) {
        date = regexMatch[1];
        time = regexMatch[2] + " CET";
      }

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
        date,
        time,
        teams,
        competition,
      };

      matchdays.push(matchday);
    }
  });
  console.log(matchdays);
  return matchdays;
}

scrapeMatchdayData();
