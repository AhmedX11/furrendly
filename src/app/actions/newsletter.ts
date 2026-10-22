"use server";
import { z } from "zod";
import { db } from "@/db";
import { subscribers } from "@/db/schema";

export async function subscribe(_: unknown, fd: FormData) {
  const parsed = z.email().max(255).safeParse(String(fd.get("email") ?? "").trim().toLowerCase());
  if (!parsed.success) return { ok: false, msg: "Enter a valid email" };
  await db.insert(subscribers).values({ email: parsed.data }).onConflictDoNothing();
  return { ok: true, msg: "You're in! Treats incoming 🎉" };
}
