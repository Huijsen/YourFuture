// Count all entries in this week (duplicates allowed)
export function countThisWeek(dates) {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  startOfWeek.setHours(0,0,0,0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23,59,59,999);

  return dates.filter(d => {
    const date = new Date(d);
    return date >= startOfWeek && date <= endOfWeek;
  }).length;
}

export function countDone(dates, daysPerWeek) {
  if (daysPerWeek === 0) {
    if (!dates.length) return 0;

    const firstDate = new Date(dates[0]);
    const lastDate = new Date();
    let count = 0;

    for (
      let d = new Date(firstDate);
      d <= lastDate;
      d.setDate(d.getDate() + 1)
    ) {
      const dayString = d.toISOString().split('T')[0];
      if (!dates.some(date => date.slice(0, 10) === dayString)) {
        count++;
      }
    }
    return count;
  } else {
    return dates.length;
  }
}
