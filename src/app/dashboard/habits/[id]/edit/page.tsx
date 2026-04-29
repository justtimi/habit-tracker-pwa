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

  if (!habit)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Habit not found
      </div>
    );

  const inputClass = `
    w-full pl-4 pr-3 py-2.5
    rounded-lg border border-gray-200
    bg-gray-50 text-gray-900
    transition-all duration-200 ease-out
    focus:bg-white
    focus:scale-[1.01]
    focus:border-blue-400
    focus:ring-4 focus:ring-blue-100
    outline-none hover:bg-white hover:border-gray-300
  `;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7] px-4">
      <form
        action={formAction}
        className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-5"
      >
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Edit Habit
          </h1>
          <p className="text-sm text-gray-500">
            Update your habit details
          </p>
        </div>

        {state.error && (
          <div className="text-sm text-red-500 bg-red-50 border border-red-100 p-2 rounded-lg">
            {state.error}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-sm text-gray-600">
            Habit Name
          </label>
          <input
            name="name"
            defaultValue={habit.name}
            required
            className={inputClass}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-gray-600">
            Description
          </label>
          <input
            name="description"
            defaultValue={habit.description}
            required
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2.5 rounded-lg bg-black text-white font-medium hover:bg-gray-900 active:scale-[0.99] transition disabled:opacity-50"
        >
          {isPending ? "Updating..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}