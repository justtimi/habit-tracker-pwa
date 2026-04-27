import { Habit } from "@/types/habit";

export function toggleHabitCompletion(habit: Habit, date: string): Habit {
  const exists = habit.completions.includes(date);

  const newCompletions = exists
    ? habit.completions.filter((completion) => completion !== date)
    : [...habit.completions, date];

  return { ...habit, completions: newCompletions };
}
