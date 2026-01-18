import { getWeekNumber } from './weekUtils';

export function calculateStreaks(dates, completionsPerWeek) {
  if (!dates.length) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      consistency: '0%',
      weekStreak: 0,
      longestWeekStreak: 0,
      weekConsistency: '0%',
      weeks: []
    };
  }

  // --- Deduplicate per calendar day for daily streaks ---
  const uniqueDates = Array.from(
    new Set(dates.map(d => new Date(d).toISOString().split('T')[0]))
  );
  const sorted = uniqueDates.slice().sort();

  // ----- DAILY STREAKS -----
  let longest = 1;
  let current = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diffDays = (curr - prev) / (1000 * 60 * 60 * 24);
    if (diffDays === 1) current++;
    else current = 1;
    if (current > longest) longest = current;
  }

  const lastDate = new Date(sorted[sorted.length - 1]);
  const today = new Date();
  if ((today - lastDate) / (1000 * 60 * 60 * 24) > 1) current = 0;

  // Daily consistency
  const totalDays = Math.floor((today - new Date(sorted[0])) / (1000 * 60 * 60 * 24)) + 1;
  const consistencyPercent = Math.round((sorted.length / totalDays) * 100);

  // ----- WEEKLY STREAKS -----
  const weeksMap = {};
  dates.forEach(dateStr => {
    const d = new Date(dateStr);
    const year = d.getFullYear();
    const week = getWeekNumber(d);
    const key = `${year}-W${week}`;
    if (!weeksMap[key]) weeksMap[key] = 0;
    weeksMap[key]++;
  });

  // Fill all weeks between first and last date
  const first = new Date(sorted[0]);
  const last = new Date(sorted[sorted.length - 1]);
  let currentWeek = new Date(first);
  while (currentWeek <= last) {
    const year = currentWeek.getFullYear();
    const week = getWeekNumber(currentWeek);
    const key = `${year}-W${week}`;
    if (!weeksMap[key]) weeksMap[key] = 0; // missing week = 0 completions
    currentWeek.setDate(currentWeek.getDate() + 7);
  }

  // Build array of weeks with completions and hitGoal
  const weeks = Object.keys(weeksMap).sort().map(key => ({
    week: key,
    completions: weeksMap[key],
    hitGoal: completionsPerWeek === 0 ? weeksMap[key] === 0 : weeksMap[key] >= completionsPerWeek
  }));

  // Calculate week streaks
  let weekStreak = 0;
  let longestWeekStreak = 0;
  let successfulWeeks = 0;
  let lastWeekIndex = null;

  weeks.forEach(wk => {
    const [year, weekStr] = wk.week.split('-W');
    const weekIndex = parseInt(year) * 52 + parseInt(weekStr);
    const success = wk.hitGoal;

    if (success) {
      if (lastWeekIndex !== null && weekIndex !== lastWeekIndex + 1) weekStreak = 1;
      else weekStreak++;
      if (weekStreak > longestWeekStreak) longestWeekStreak = weekStreak;
      successfulWeeks++;
    } else {
      weekStreak = 0;
    }

    lastWeekIndex = weekIndex;
  });

  const weekConsistency = weeks.length ? Math.round((successfulWeeks / weeks.length) * 100) + '%' : '0%';

  return {
    currentStreak: current,
    longestStreak: longest,
    consistency: consistencyPercent + '%',
    weekStreak,
    longestWeekStreak,
    weekConsistency,
    weeks
  };
}
