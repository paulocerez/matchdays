import axios from "axios";
// import cheerio from "cheerio";

async function scrapeMatchdayData() {
  const response: Response = await axios.get(
    "https://onefootball.com/de/team/fc-barcelona-5/spiele",
  );

  return response;
}

console.log(scrapeMatchdayData());
