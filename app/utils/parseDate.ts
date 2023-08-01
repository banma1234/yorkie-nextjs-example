export function parseDate(date: Date) {
  let [month, day, year] = date.toLocaleDateString("en").split("/");

  month = Number(month) > 9 ? month : "0" + month;
  day = Number(day) > 9 ? day : "0" + day;
  year = year.slice(2);

  return `${month}-${day}-${year}`;
}
