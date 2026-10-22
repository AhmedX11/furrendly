"use client";
import { useActionState, useState } from "react";
import clsx from "clsx";
import { Loader2 } from "lucide-react";
import { login, register, type AuthState } from "@/app/account/actions";

export function AuthForms({ next }: { next?: string }) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loginState, loginAction, loginPending] = useActionState<AuthState, FormData>(login, undefined);
  const [regState, regAction, regPending] = useActionState<AuthState, FormData>(register, undefined);
  const state = mode === "login" ? loginState : regState;
  const pending = mode === "login" ? loginPending : regPending;

  return (
    <div className="rounded-[2.5rem] border-2 border-ink bg-white p-8 shadow-[0_8px_0_0_#0e3b2e] sm:p-10">
      <div className="grid grid-cols-2 rounded-full bg-sage-light p-1.5" role="tablist">
        {(["login", "register"] as const).map((m) => (
          <button
            key={m}
            role="tab"
            aria-selected={mode === m}
            onClick={() => setMode(m)}
            className={clsx(
              "rounded-full py-2.5 font-display font-semibold transition",
              mode === m ? "bg-leaf text-white shadow" : "text-leaf-dark",
            )}
          >
            {m === "login" ? "Sign in" : "Create account"}
          </button>
        ))}
      </div>
      <h2 className="mt-8 text-3xl font-bold">{mode === "login" ? "Welcome back!" : "Join the pack"}</h2>
      <p className="mt-1 text-ink/60">{mode === "login" ? "Sign in to see your orders and autoship." : "It takes 20 seconds. Treat-speed."}</p>

      <form key={mode} action={mode === "login" ? loginAction : regAction} className="mt-6 space-y-4" noValidate>
        <input type="hidden" name="next" value={next ?? "/account"} />
        {mode === "register" && <F name="name" label="Your name" autoComplete="name" err={state?.fieldErrors?.name} />}
        <F name="email" label="Email" type="email" autoComplete="email" err={state?.fieldErrors?.email} />
        <F
          name="password"
          label="Password"
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          err={state?.fieldErrors?.password}
        />
        {state?.error && <p role="alert" className="rounded-2xl bg-coral/10 p-3 text-sm font-bold text-coral">{state.error}</p>}
        <button className="btn-primary w-full text-lg" disabled={pending}>
          {pending && <Loader2 className="size-5 animate-spin" />}
          {mode === "login" ? "Sign in" : "Create account"}
        </button>
      </form>
    </div>
  );
}

function F({ name, label, err, ...rest }: { name: string; label: string; err?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={name} className="label">{label}</label>
      <input id={name} name={name} className={clsx("input", err && "border-coral")} aria-invalid={!!err} {...rest} />
      {err && <p className="mt-1 text-sm font-bold text-coral">{err}</p>}
    </div>
  );
}
