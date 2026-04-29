"use client";

import { AuthService } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useActionState } from "react";

interface ActionState {
  error: string | null;
  success: boolean;
}

const LoginForm = () => {
  const router = useRouter();
  const handleLogin = (prev: ActionState, formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = AuthService.login(email, password);

    if (result.success) {
      router.push("/dashboard");
      return {
        success: true,
        error: null,
      };
    }
    return {
      success: false,
      error: result.message,
    };
  };

  const [state, formAction, isPending] = useActionState(handleLogin, {
    error: null,
    success: false,
  });
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7] px-4">
      <form
        action={formAction}
        className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-5 backdrop-blur-xl"
      >
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Sign in
          </h1>
          <p className="text-sm text-gray-500">Use your account to continue</p>
        </div>

        {state.error && (
          <div className="text-sm text-red-500 bg-red-50 border border-red-100 p-2 rounded-lg">
            {state.error}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-sm text-gray-600">Email</label>

          <div className="relative">
            <input
              name="email"
              type="email"
              required
              className="
        w-full pl-10 pr-3 py-2.5
        rounded-lg border border-gray-200
        bg-gray-50 text-gray-900
        transition-all duration-200 ease-out
        focus:bg-white
        focus:scale-[1.01]
        focus:border-blue-400
        focus:ring-4 focus:ring-blue-100
        outline-none hover:bg-white hover:border-gray-300
      "
              data-testid="auth-login-email"
            />

            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              ✉️
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm text-gray-600">Password</label>

          <div className="relative">
            <input
              name="password"
              type="password"
              required
              className="
        w-full pl-10 pr-3 py-2.5
        rounded-lg border border-gray-200
        bg-gray-50 text-gray-900
        transition-all duration-200 ease-out
        focus:bg-white
        focus:scale-[1.01]
        focus:border-blue-400
        focus:ring-4 focus:ring-blue-100
        outline-none hover:bg-white hover:border-gray-300
      "
      data-testid= "auth-login-password"
            />

            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              🔒
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2.5 rounded-lg bg-black text-white font-medium hover:bg-gray-900 active:scale-[0.99] transition disabled:opacity-50"
        >
          {isPending ? "Signing in..." : "Log In"}
        </button>

        <div className="text-center text-sm text-gray-500 pt-2">
          Don’t have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/signup")}
            className="text-blue-500 hover:text-blue-600 font-medium" data-testid="auth-login-submit"
          >
            Sign up
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
