import { getLocalDate, getLocalDateFromDate, createLocalDate } from "./dates";

export function calculateCurrentStreak(
  completions: string[],
  today?: string,
): number {
  const completionSet = new Set(completions);
  const referenceDate = today ?? getLocalDate();
  const todayCompleted = completionSet.has(referenceDate);

  const yesterdayDate = createLocalDate(referenceDate);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = getLocalDateFromDate(yesterdayDate);

  const yesterdayCompleted = completionSet.has(yesterday);

  if (!todayCompleted && !yesterdayCompleted) {
    return 0;
  }

  const startDate = completionSet.has(referenceDate)
    ? createLocalDate(referenceDate)
    : createLocalDate(yesterday);

  let streak = 0;
  let current = startDate;

  while (true) {
    const dateString = getLocalDateFromDate(current);
    if (!completionSet.has(dateString)) break;

    streak++;
    current.setDate(current.getDate() - 1);
  }
  return streak;
}
