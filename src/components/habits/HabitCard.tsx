import { getLocalDate } from "@/lib/dates";
import { HabitsService } from "@/lib/habitsUI";
import { calculateCurrentStreak } from "@/lib/streaks";
import { Habit } from "@/types/habit";

const HabitCard = ({
  habit,
  refresh,
}: {
  habit: Habit;
  refresh: () => void;
}) => {
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
      <button
        onClick={() => {
          HabitsService.deleteHabit(habit.id);
          refresh();
        }}
      ></button>
    </div>
  );
};

export default HabitCard;
