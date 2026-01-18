// Weekly streak only checks unique days per week
import { getWeekNumber } from './weekUtils';

export default function calculateWeekStreak(dates, completionsPerWeek) {
  const weeks = {};

  dates.forEach(dateStr => {
    const d = new Date(dateStr);
    const year = d.getFullYear();
    const week = getWeekNumber(d);
    const key = `${year}-W${week}`;

    if (!weeks[key]) weeks[key] = 0;
    weeks[key]++; // count every completion, even same day
  });

  const weekKeys = Object.keys(weeks).sort();
  let weekStreak = 0;
  let longestWeekStreak = 0;

  weekKeys.forEach(wk => {
    if (weeks[wk] >= completionsPerWeek) {
      weekStreak++;
      if (weekStreak > longestWeekStreak) longestWeekStreak = weekStreak;
    } else {
      weekStreak = 0;
    }
  });

  return { weekStreak, longestWeekStreak };
}
