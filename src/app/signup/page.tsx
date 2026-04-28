"use client";
import { AuthService } from "@/lib/auth";
import React from "react";
import { useRouter } from "next/navigation";

const Signup = () => {
  const router = useRouter();

  const signup = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

    const log = AuthService.signup(email, password);
    if (log.success) router.push("/dashboard");
  };
  return (
    <form onSubmit={signup}>
      <div className="">
        <label htmlFor="email">Email:</label>
        <input type="text" name="email"/>
      </div>
      <div className="">
        <label htmlFor="password">Password:</label>
        <input type="text" name="password"/>
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

export default Signup;
