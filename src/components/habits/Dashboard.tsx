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
    <div className="max-w-6xl ">
      <Header />
      <div className="w-full ">
        <div className="">
          <div className="">
            <h3>{completedToday} completed today</h3>
          </div>
          <button
            onClick={() => router.push("/dashboard/habits/new")}
            className="px-4 py-2 bg-black text-white rounded"
          >
            + New Habit
          </button>
        </div>

        {habits.length === 0 ? (
          <div className="mt-6 text-gray-500">
            No habits yet. Create your first one 👇
          </div>
        ) : (
          <HabitList habits={habits} refresh={refresh} />
        )}
      </div>
    </div>
  );
};

export default DashboardComponent;
