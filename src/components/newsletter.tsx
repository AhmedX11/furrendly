"use client";
import { useActionState } from "react";
import { subscribe } from "@/app/actions/newsletter";

export function Newsletter() {
  const [state, action, pending] = useActionState(subscribe, null);
  if (state?.ok) return <p className="mt-6 rounded-full bg-white/15 px-5 py-3 font-bold">{state.msg}</p>;
  return (
    <form action={action} className="mt-6 max-w-sm">
      <div className="flex gap-2">
        <label className="sr-only" htmlFor="nl-email">Email</label>
        <input id="nl-email" name="email" type="email" required placeholder="Your email for treats & deals" className="w-full rounded-full border-2 border-ink bg-white px-4 py-2.5 text-sm text-ink outline-none" />
        <button className="btn-sun !px-5 !py-2.5 text-sm" disabled={pending}>Join</button>
      </div>
      {state && !state.ok && <p className="mt-2 text-sm font-bold text-sun">{state.msg}</p>}
    </form>
  );
}
