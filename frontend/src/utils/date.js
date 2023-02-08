export function formatDate(date) {
  if (typeof date === "string") {
    date = new Date(date);
  }

  const today = new Date();
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  if (date.toDateString() === today.toDateString()) {
    return "today";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "yesterday";
  } else if (date > yesterday && date < today) {
    return daysOfWeek[date.getUTCDay()];
  } else {
    const dd = date.getUTCDate();
    const mm = date.getUTCMonth() + 1;
    const yy = date.getUTCFullYear().toString().substr(-2);
    return `${dd}/${mm}/${yy}`;
  }
}
