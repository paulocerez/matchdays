import axios from "axios";

async function scrapeMatchdayData() {
  const response = await axios.get(
    "https://onefootball.com/de/team/fc-barcelona-5/spiele"
  );

  return response;
}
