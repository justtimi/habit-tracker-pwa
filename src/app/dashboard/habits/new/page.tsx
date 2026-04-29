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

    const session = AuthService.getSession();
    if (!session) {
      return { success: false, error: "Not logged in", code: "AUTH" };
    }

    const validation = validateHabitName(name);

    if (!validation.valid) {
      return { success: false, error: validation.error, code: "VALIDATION" };
    }

    const result = HabitsService.createHabit(session.userId, name, description);

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

  return (
    <form action={formAction}>
      <div className="flex flex-col gap-4 p-4">
        <label htmlFor="name">Name:</label>
        <input name="name" type="text" required />
      </div>
      <div className="">
        <label htmlFor="description">Description:</label>
        <input name="description" type="text" required />
      </div>
      <div className="">
        <label htmlFor="frequency">Frequency: </label>
        <select name="frequency" id="frequency">
          <option value="daily">Daily</option>
        </select>
      </div>

      <button type="submit" disabled={isPending}>
        {isPending ? "Creating..." : "Create Habit"}
      </button>

      {state.error && <p className="text-red-500">{state.error}</p>}
      {state.success && (
        <p className="text-green-500">Habit created successfully</p>
      )}
    </form>
  );
};

export default New;
