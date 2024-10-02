import { format, toZonedTime } from "date-fns-tz";

export default function convertDatetime(
  dateString: string,
  timeString: string
): string {
  // Parse the date and time
  const [day, month, yearShort] = dateString.split(".").map(Number);
  const [hours, minutes] = timeString.split(":").map(Number);

  const fullYear = 2000 + yearShort; // Convert 2-digit year to 4-digit year

  // Create a date string in ISO format
  const isoString = `${fullYear}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")}T${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:00`;

  // Create a Date object in CET/CEST
  const cetDate = toZonedTime(isoString, "Europe/Berlin");

  // Format the date in ISO 8601 format with UTC offset for GCal
  const formattedDate = format(cetDate, "yyyy-MM-dd'T'HH:mm:ssXXX", {
    timeZone: "Europe/Berlin",
  });

  console.log("Formatted date for Google Calendar:", formattedDate);
  return formattedDate;
}

convertDatetime("10.09.24", "14:00");
