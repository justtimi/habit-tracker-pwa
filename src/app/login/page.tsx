"use client";

import { AuthService } from "@/lib/auth";

const login = (e: React.SubmitEvent<HTMLFormElement>) => {
  e.preventDefault();

  const form = e.currentTarget;

  const email = (form.elements.namedItem("email") as HTMLInputElement).value;
  const password = (form.elements.namedItem("password") as HTMLInputElement)
    .value;

  AuthService.login(email, password);
};

const Login = () => {
  return (
    <form onSubmit={login}>
      <input name="email" placeholder="Email" />
      <input name="password" type="password" placeholder="Password" />

      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
