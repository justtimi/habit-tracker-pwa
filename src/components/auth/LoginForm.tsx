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
    <form action={formAction}>
      <h1>Login</h1>

      {state.error && <p style={{ color: "red" }}>{state.error}</p>}
      <div className="">
        <label htmlFor="email">Email:</label>
        <input name="email" type="email" required />
      </div>
      <div className="">
        <label htmlFor="password">Password:</label>
        <input name="password" type="password" required />
      </div>

      <button type="submit" disabled={isPending}>
        {isPending ? "Loading..." : "Log In"}
      </button>
    </form>
  );
};

export default LoginForm;
