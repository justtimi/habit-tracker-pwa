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
    <form action={formAction}>
      <h1>Create Account</h1>

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
        {isPending ? "Creating Account..." : "Sign Up"}
      </button>
    </form>
  );
};

export default SignupForm;
