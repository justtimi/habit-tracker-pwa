"use client";
import { AuthService } from "@/lib/auth";
import { HabitsService } from "@/lib/habitsUI";
import { validateHabitName } from "@/lib/validators";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

type ErrorCode = "AUTH" | "VALIDATION" | "UNKNOWN";

type ActionState = {
  success: boolean;
  error: string | null;
  code?: ErrorCode | null;
};

const New = () => {
  const router = useRouter();
  const handleSubmit = (
    prevState: ActionState,
    formData: FormData,
  ): ActionState => {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const frequency = formData.get("frequency") as string;

    const session = AuthService.getSession();
    if (!session) {
      return { success: false, error: "Not logged in", code: "AUTH" };
    }

    const validation = validateHabitName(name);

    if (!validation.valid) {
      return { success: false, error: validation.error, code: "VALIDATION" };
    }

    const result = HabitsService.createHabit(session.userId, name, description, frequency);

    return {
      success: result.success,
      error: result.success ? null : result.message,
      code: result.success ? null : "UNKNOWN",
    };
  };

  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    handleSubmit,
    {
      success: false,
      error: null,
      code: undefined,
    },
  );

  useEffect(() => {
    if (state.code === "AUTH") {
      router.replace("/");
    }
    if (state.success) {
      router.push("/dashboard");
    }
  }, [state.code, state.success, router]);

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
        data-testid="habit-form"
      >
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            New Habit
          </h1>
          <p className="text-sm text-gray-500">
            Start building consistency
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
            type="text"
            required
            className={inputClass}
            data-testid="habit-name-input"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-gray-600">
            Description
          </label>
          <input
            name="description"
            type="text"
            className={inputClass}
            data-testid="habit-description-input"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-gray-600">
            Frequency
          </label>
          <select
            name="frequency"
            className={inputClass}
            data-testid="habit-frequency-select"
          >
            <option value="daily">Daily</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2.5 rounded-lg bg-black text-white font-medium hover:bg-gray-900 active:scale-[0.99] transition disabled:opacity-50"
          data-testid="habit-save-button"
        >
          {isPending ? "Creating..." : "Create Habit"}
        </button>
      </form>
    </div>
  );
};

export default New;
