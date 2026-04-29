import { Habit } from "@/types/habit";
import { getItem, setItem } from "./storage";
import { toggleHabitCompletion } from "./habits";
import { HABIT_KEY } from "./constants";

const getAllHabits = (): Habit[] => {
  const habits = getItem<Habit[]>(HABIT_KEY) || [];
  return habits;
};
const saveHabits = (habits: Habit[]): void => {
  setItem<Habit[]>(HABIT_KEY, habits);
};
const getHabitsByUser = (userId: string): Habit[] => {
  const habits = getAllHabits();
  return habits.filter((habit) => habit.userId === userId);
};
const createHabit = (
  userId: string,
  name: string,
  description: string,
): { success: boolean; message: string } => {
  if (!name.trim()) {
    return { success: false, message: "Habit name is required" };
  }
  const habits = getAllHabits();
  const newHabit: Habit = {
    id: crypto.randomUUID(),
    name: name.trim(),
    description: description.trim(),
    userId,
    frequency: "daily",
    createdAt: new Date().toISOString(),
    completions: [],
  };
  saveHabits([...habits, newHabit]);
  return { success: true, message: "Habit created successfully" };
};

const updateHabit = (
  habitId: string,
  updates: { name?: string; description?: string },
): Habit | null => {
  const habits = getAllHabits();
  const index = habits.findIndex((habit) => habit.id === habitId);
  if (index === -1) return null;
  const existing = habits[index];

  const cleanName =
    updates.name && updates.name.trim().length > 0
      ? updates.name.trim()
      : existing.name;
  const cleanDescription =
    updates.description && updates.description.trim().length > 0
      ? updates.description.trim()
      : existing.description;

  const updated: Habit = {
    ...existing,
    name: cleanName,
    description: cleanDescription,
  };
  habits[index] = updated;
  saveHabits(habits);

  return updated;
};

const deleteHabit = (habitId: string): boolean => {
  const habits = getAllHabits();
  const updated = habits.filter((habit) => habit.id !== habitId);
  if (updated.length === habits.length) return false;
  saveHabits(updated);
  return true;
};
const toggleHabit = (habitId: string, date: string): Habit | null => {
  const habits = getAllHabits();
  const index = habits.findIndex((habit) => habit.id === habitId);

  if (index === -1) return null;
  const updatedHabit = toggleHabitCompletion(habits[index], date);
  habits[index] = updatedHabit;
  saveHabits(habits);

  return updatedHabit;
};

export const HabitsService = {
  getAllHabits,
  saveHabits,
  deleteHabit,
  toggleHabit,
  updateHabit,
  getHabitsByUser,
  createHabit,
};
