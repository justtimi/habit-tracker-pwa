import { User, Session } from "@/types/auth";
import { getItem, setItem, removeItem } from "./storage";
import { USER_KEY, SESSION_KEY } from "./constants";

const signup = async (
  email: string,
  password: string,
): Promise<{ success: boolean; message: string }> => {
  if (!email.trim() || !password.trim()) {
    return { success: false, message: "Email and password are required" };
  }
  const users = getItem<User[]>(USER_KEY) || [];
  const normalized = email.toLowerCase().trim();
  const trimmedPassword = password.trim();
  const existingUser = users.find((u) => u.email === normalized);
  if (existingUser) return { success: false, message: "User already exists" };
  const user: User = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    email: normalized,
    password: trimmedPassword,
  };
  users.push(user);
  setItem<User[]>(USER_KEY, users);
  const session: Session = {
    userId: user.id,
    email: user.email,
  };
  setItem<Session>(SESSION_KEY, session);
  return { success: true, message: "Signup successful" };
};
const login = async (
  email: string,
  password: string,
): Promise<{ success: boolean; message: string }> => {
  if (!email.trim() || !password.trim()) {
    return { success: false, message: "Email and password are required" };
  }
  const users = getItem<User[]>(USER_KEY) || [];
  const normalized = email.toLowerCase().trim();
  const trimmedPassword = password.trim();
  const user = users.find(
    (u) => u.email === normalized && u.password === trimmedPassword,
  );

  if (!user) {
    return { success: false, message: "Invalid email or password" };
  }

  const session: Session = {
    userId: user.id,
    email: user.email,
  };
  setItem<Session>(SESSION_KEY, session);
  return { success: true, message: "Login successful" };
};
const logout = (): void => {
  removeItem(SESSION_KEY);
};

const getSession = (): Session | null => {
  return getItem<Session>(SESSION_KEY);
};

export const AuthService = {
  signup,
  login,
  logout,
  getSession,
};
