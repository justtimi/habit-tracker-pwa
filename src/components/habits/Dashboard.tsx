"use client";
import { useState } from "react";
import Header from "./Header";
import { useRouter } from "next/navigation";
import { Habit } from "@/types/habit";
import HabitList from "./HabitList";
import { HabitsService } from "@/lib/habitsUI";
import { AuthService } from "@/lib/auth";
import { getLocalDate } from "@/lib/dates";

const DashboardComponent = () => {
  const session = AuthService.getSession();

  const [habits, setHabits] = useState<Habit[]>(
    session ? HabitsService.getHabitsByUser(session.userId) : [],
  );
  const completedToday = habits.filter((h) =>
    h.completions.includes(getLocalDate()),
  ).length;
  const router = useRouter();

  const refresh = () => {
    if (!session) return;
    setHabits(HabitsService.getHabitsByUser(session.userId));
  };
  return (
    <div
      data-testid="dashboard-page"
      className="min-h-screen bg-[#F5F5F7] px-4 pb-24"
    >
      <div className="max-w-xl mx-auto space-y-6">
        <Header />

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Today
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {completedToday} completed today
            </p>
          </div>

          <button
            data-testid="create-habit-button"
            onClick={() => router.push("/dashboard/habits/new")}
            className="
              px-4 py-2 rounded-full
              bg-black text-white text-sm font-medium
              hover:bg-gray-900
              active:scale-[0.98]
              transition
            "
          >
            + New
          </button>
        </div>
        {habits.length === 0 ? (
          <div
            data-testid="empty-state"
            className="
              mt-10 text-center
              text-gray-500
              bg-white border border-gray-200
              rounded-2xl p-8 shadow-sm
            "
          >
            <p className="text-sm">
              No habits yet.
            </p>
            <p className="text-xs mt-2 text-gray-400">
              Tap “New” to create your first habit.
            </p>
          </div>
        ) : (
          <HabitList habits={habits} refresh={refresh} />
        )}
      </div>
    </div>
  );
};

export default DashboardComponent;
