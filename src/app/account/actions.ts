"use server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users, orders } from "@/db/schema";
import { createSession, destroySession } from "@/lib/auth";
import { and, isNull } from "drizzle-orm";

export type AuthState = { error?: string; fieldErrors?: Record<string, string> } | undefined;

const registerSchema = z.object({
  name: z.string().trim().min(2, "Tell us your name").max(120),
  email: z.email("Enter a valid email").max(255),
  password: z.string().min(8, "At least 8 characters").max(128),
});
const loginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
});

function safeNext(v: FormDataEntryValue | null) {
  const s = typeof v === "string" ? v : "";
  return s.startsWith("/") && !s.startsWith("//") ? s : "/account";
}

function errs(e: z.ZodError) {
  const out: Record<string, string> = {};
  for (const i of e.issues) out[String(i.path[0])] ??= i.message;
  return out;
}

export async function register(_: AuthState, fd: FormData): Promise<AuthState> {
  const parsed = registerSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { fieldErrors: errs(parsed.error) };
  const email = parsed.data.email.toLowerCase();
  const existing = await db.query.users.findFirst({ where: eq(users.email, email), columns: { id: true } });
  if (existing) return { fieldErrors: { email: "An account with this email already exists — sign in instead" } };
  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const [user] = await db.insert(users).values({ name: parsed.data.name, email, passwordHash }).returning({ id: users.id });
  // Attach any earlier guest orders placed with this email
  await db.update(orders).set({ userId: user.id }).where(and(eq(orders.email, email), isNull(orders.userId)));
  await createSession(user.id);
  redirect(safeNext(fd.get("next")));
}

export async function login(_: AuthState, fd: FormData): Promise<AuthState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { fieldErrors: errs(parsed.error) };
  const user = await db.query.users.findFirst({ where: eq(users.email, parsed.data.email.toLowerCase()) });
  const ok = user && (await bcrypt.compare(parsed.data.password, user.passwordHash));
  if (!ok) return { error: "That email and password don't match. Try again?" };
  await createSession(user.id);
  redirect(safeNext(fd.get("next")));
}

export async function logout() {
  await destroySession();
  redirect("/account");
}
