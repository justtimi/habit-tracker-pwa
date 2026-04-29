import { getLocalDate } from "@/lib/dates";
import { HabitsService } from "@/lib/habitsUI";
import { calculateCurrentStreak } from "@/lib/streaks";
import { getHabitSlug } from "@/lib/slug";
import { Habit } from "@/types/habit";
import { useRouter } from "next/navigation";

const HabitCard = ({
  habit,
  refresh,
}: {
  habit: Habit;
  refresh: () => void;
}) => {
  const router = useRouter();
  const today = getLocalDate();
  const isCompletedToday = habit.completions.includes(today);
  const streak = calculateCurrentStreak(habit.completions);
  const slug = getHabitSlug(habit.name);

  return (
    <div
      className={`p-5 rounded-xl border transition-all duration-200 ${
        isCompletedToday
          ? "bg-green-50 border-green-300"
          : "bg-white border-gray-200 hover:shadow-md"
      }`}
      data-testid={`habit-card-${slug}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3
            className={`text-lg font-semibold ${
              isCompletedToday ? "line-through text-gray-500" : ""
            }`}
          >
            {habit.name}
          </h3>

          <p
            className="text-sm text-gray-500 mt-1"
            data-testid={`habit-streak-${slug}`}
          >
            🔥 {streak} day streak
          </p>
        </div>

        <input
          type="checkbox"
          checked={isCompletedToday}
          onChange={() => {
            HabitsService.toggleHabit(habit.id, today);
            refresh();
          }}
          className="w-5 h-5 accent-black cursor-pointer"
          data-testid={`habit-complete-${slug}`}
        />
      </div>

      <div className="flex gap-3 mt-4">
        <button
          onClick={() => router.push(`/dashboard/habits/${habit.id}/edit`)}
          className="px-3 py-1 text-sm border rounded-md hover:bg-gray-100 transition"
          data-testid={`habit-edit-${slug}`}
        >
          Edit
        </button>

        <button
          data-testid={`habit-delete-${slug}`}
          onClick={() => {
            HabitsService.deleteHabit(habit.id);
            refresh();
          }}
          className="px-3 py-1 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default HabitCard;
