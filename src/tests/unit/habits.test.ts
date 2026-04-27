import { describe, it, expect } from "vitest";
import { toggleHabitCompletion } from "@/lib/habits";
import { Habit } from "@/types/habit";

describe("toggleHabitCompletion", () => {
  it("adds a completion date when the date is not present", () => {
    const result = toggleHabitCompletion(
      {
        id: "1",
        userId: "user1",
        name: "Read books",
        description: "Read for 30 minutes daily",
        frequency: "daily",
        createdAt: "2026-04-01",
        completions: [],
      },
      "2026-04-27",
    );
    expect(result.completions).toEqual(["2026-04-27"]);
  });
  it("removes a completion date when the date already exists", () => {
    const result = toggleHabitCompletion(
      {
        id: "1",
        userId: "user1",
        name: "Read books",
        description: "Read for 30 minutes daily",
        frequency: "daily",
        createdAt: "2026-04-01",
        completions: ["2026-04-27"],
      },
      "2026-04-27",
    );
    expect(result.completions).toEqual([]);
  });
  it("does not mutate the original habit object", () => {
    const habit: Habit = {
      id: "3",
      userId: "user2",
      name: "Drink water",
      description: "Stay hydrated",
      frequency: "daily",
      createdAt: "2026-03-15",
      completions: ["2026-04-25", "2026-04-26", "2026-04-27"],
    };

    const originalSnapshot = [...habit.completions];

    const result = toggleHabitCompletion(habit, "2026-04-28");

    expect(habit.completions).toEqual(originalSnapshot);
    expect(habit.completions).not.toBe(result.completions);
  });
  it("prevents duplicate completion dates even after multiple toggles", () => {
    const habit: Habit = {
      id: "3",
      userId: "user2",
      name: "Drink water",
      description: "Stay hydrated",
      frequency: "daily",
      createdAt: "2026-03-15",
      completions: [],
    };
    const afterFirstToggle = toggleHabitCompletion(habit, "2026-04-27");
    const afterSecondToggle = toggleHabitCompletion(
      afterFirstToggle,
      "2026-04-27",
    );
    const afterThirdToggle = toggleHabitCompletion(
      afterSecondToggle,
      "2026-04-27",
    );
    const occurrences = afterThirdToggle.completions.filter(
      (date) => date === "2026-04-27",
    ).length;

    expect(occurrences).toBeLessThanOrEqual(1);
  });
});
