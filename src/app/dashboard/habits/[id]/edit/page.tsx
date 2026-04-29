"use client";

import { useActionState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { HabitsService } from "@/lib/habitsUI";
import { AuthService } from "@/lib/auth";
import { validateHabitName } from "@/lib/validators";

type ActionState = {
  success: boolean;
  error: string | null;
  code?: "AUTH" | "VALIDATION" | "UNKNOWN" | null;
};

export default function EditHabitPage() {
  const router = useRouter();
  const params = useParams();
  const habitId = params.id as string;

  const session = AuthService.getSession();

  const habit = session
    ? HabitsService.getHabitsByUser(session.userId).find(
        (h) => h.id === habitId
      )
    : null;

  const handleSubmit = (
    prevState: ActionState,
    formData: FormData
  ): ActionState => {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    if (!session) {
      return { success: false, error: "Not logged in", code: "AUTH" };
    }

    const validation = validateHabitName(name);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
        code: "VALIDATION",
      };
    }

    const updated = HabitsService.updateHabit(habitId, {
      name,
      description,
    });

    if (!updated) {
      return {
        success: false,
        error: "Habit not found",
        code: "UNKNOWN",
      };
    }

    return {
      success: true,
      error: null,
      code: null,
    };
  };

  const [state, formAction, isPending] =
    useActionState<ActionState, FormData>(handleSubmit, {
      success: false,
      error: null,
      code: null,
    });

  useEffect(() => {
    if (state.code === "AUTH") {
      router.replace("/");
    }

    if (state.success) {
      router.push("/dashboard");
    }
  }, [state, router]);

  if (!habit) return <p>Habit not found</p>;

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input
        name="name"
        defaultValue={habit.name}
        placeholder="Habit name"
      />

      <input
        name="description"
        defaultValue={habit.description}
        placeholder="Description"
      />

      <button type="submit" disabled={isPending}>
        {isPending ? "Updating..." : "Update Habit"}
      </button>

      {state.error && <p className="text-red-500">{state.error}</p>}
    </form>
  );
}