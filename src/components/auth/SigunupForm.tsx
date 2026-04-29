"use client";
import { AuthService } from "@/lib/auth";
import { useActionState } from "react";
import { useRouter } from "next/navigation";

interface ActionState {
  error: string | null;
  success: boolean;
}

const SignupForm = () => {
  const router = useRouter();

  async function handleSignup(prevState: ActionState, formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = AuthService.signup(email, password);
    if (result.success) {
      router.push("/dashboard");
      return {
        error: null,
        success: true,
      };
    }
    return {
      error: result.message,
      success: false,
    };
  }

  const [state, formAction, isPending] = useActionState(handleSignup, {
    error: null,
    success: false,
  });
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7] px-4">
      <form
        action={formAction}
        className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-5"
      >
        <div className="text-center space-y-1">
          <h1 className="text-xl font-semibold text-gray-900">
            Create Account
          </h1>
          <p className="text-sm text-gray-500">Start tracking your habits</p>
        </div>

        {state.error && (
          <div className="text-sm text-red-500 bg-red-50 border border-red-100 p-2 rounded-lg">
            {state.error}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-sm text-gray-600">Email</label>
          <input
            name="email"
            type="email"
            required
            className="
              w-full px-3 py-2.5
              rounded-lg border border-gray-200
              bg-gray-50
              transition-all duration-200
              focus:bg-white
              focus:border-blue-400
              focus:ring-4 focus:ring-blue-100
              outline-none
            "
            data-testid="auth-signup-email"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-gray-600">Password</label>
          <input
            name="password"
            type="password"
            required
            className="
              w-full px-3 py-2.5
              rounded-lg border border-gray-200
              bg-gray-50
              transition-all duration-200
              focus:bg-white
              focus:border-blue-400
              focus:ring-4 focus:ring-blue-100
              outline-none
            "
            data-testid="auth-signup-password"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="
            w-full py-2.5 rounded-lg
            bg-black text-white font-medium
            hover:bg-gray-900
            active:scale-[0.99]
            transition
            disabled:opacity-50
          "
        >
          {isPending ? "Creating Account..." : "Sign Up"}
        </button>

        <div className="text-center text-sm text-gray-500 pt-2">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="text-blue-500 hover:text-blue-600 font-medium"
            data-testid="auth-signup-submit"
          >
            Log in
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
