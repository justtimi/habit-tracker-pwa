import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DashboardComponent from "@/components/habits/Dashboard";
import { AuthService } from "@/lib/auth";
import { HabitsService } from "@/lib/habitsUI";

describe("habit form", () => {
  beforeEach(() => {
    localStorage.clear();

    AuthService.signup("test@user.com", "123456");
  });

  it("shows a validation error when habit name is empty", () => {
    render(<DashboardComponent />);

    fireEvent.click(screen.getByTestId("create-habit-button"));

    fireEvent.click(screen.getByTestId("habit-save-button"));

    expect(screen.getByText("Habit name is required")).toBeInTheDocument();
  });

  it("creates a new habit and renders it in the list", async () => {
    render(<DashboardComponent />);

    fireEvent.click(screen.getByTestId("create-habit-button"));

    fireEvent.change(screen.getByTestId("habit-name-input"), {
      target: { value: "Drink Water" },
    });

    fireEvent.change(screen.getByTestId("habit-description-input"), {
      target: { value: "Stay hydrated" },
    });

    fireEvent.click(screen.getByTestId("habit-save-button"));

    await waitFor(() => {
      expect(screen.getByText("Drink Water")).toBeInTheDocument();
    });
  });

  it("edits an existing habit and preserves immutable fields", async () => {
    const session = AuthService.getSession();

    const habit = HabitsService.createHabit(
      session!.userId,
      "Read Books",
      "Read daily"
    );

    const habits = HabitsService.getHabitsByUser(session!.userId);
    const created = habits[0];

    HabitsService.updateHabit(created.id, {
      name: "Read More Books",
      description: "Updated description",
    });

    const updated = HabitsService.getHabitsByUser(session!.userId)[0];

    expect(updated.id).toBe(created.id);
    expect(updated.userId).toBe(created.userId);
    expect(updated.createdAt).toBe(created.createdAt);
    expect(updated.name).toBe("Read More Books");
    expect(updated.description).toBe("Updated description");
  });

  it("deletes a habit only after explicit confirmation", () => {
    const session = AuthService.getSession();

    const habit = HabitsService.createHabit(
      session!.userId,
      "To Delete",
      "temp",
      "daily"
    );

    HabitsService.deleteHabit(habit.id);

    const remaining = HabitsService.getHabitsByUser(session!.userId);

    expect(remaining.find((h) => h.id === habit.id)).toBeUndefined();
  });

  it("toggles completion and updates the streak display", () => {
    const session = AuthService.getSession();

    const habit = HabitsService.createHabit(
      session!.userId,
      "Streak Test",
      "test"
    );

    const today = new Date().toISOString().split("T")[0];

    HabitsService.toggleHabit(habit.id, today);

    const updated = HabitsService.getHabitsByUser(session!.userId)[0];

    expect(updated.completions).toContain(today);
  });
});