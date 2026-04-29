import { getLocalDate } from "@/lib/dates";
import { HabitsService } from "@/lib/habitsUI";
import { calculateCurrentStreak } from "@/lib/streaks";
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

  return (
    <div>
      {habit.name}

      <input
        type="checkbox"
        name=""
        id=""
        checked={isCompletedToday}
        onChange={() => {
          HabitsService.toggleHabit(habit.id, today);
          refresh();
        }}
      />
      <button onClick={() => router.push(`/dashboard/habits/${habit.id}/edit`)}>
        Edit
      </button>
      <button
        onClick={() => {
          HabitsService.deleteHabit(habit.id);
          refresh();
        }}
      >
        Delete
      </button>
    </div>
  );
};

export default HabitCard;
