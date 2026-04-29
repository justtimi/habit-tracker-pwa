import { Habit } from "@/types/habit";
import HabitCard from "./HabitCard";

const HabitList = ({
  habits,
  refresh,
}: {
  habits: Habit[];
  refresh: () => void;
}) => {
  return (
    <div className="mt-6 flex flex-col gap-3">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          refresh={refresh}
        />
      ))}
    </div>
  );
};

export default HabitList;
