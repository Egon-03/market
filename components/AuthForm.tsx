"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction, registerAction, type ActionState } from "@/lib/actions";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const action = mode === "login" ? loginAction : registerAction;
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    action,
    undefined
  );

  return (
    <div className="mx-auto max-w-md animate-fade-up py-6">
      <div className="card relative overflow-hidden p-8">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600"
          aria-hidden="true"
        />
        <h1 className="text-2xl font-extrabold tracking-tight text-stone-900">
          {mode === "login" ? "Bentornato 👋" : "Crea il tuo account gratuito"}
        </h1>
        <p className="mt-1.5 text-sm text-stone-500">
          {mode === "login"
            ? "Accedi per gestire i tuoi annunci e i tuoi messaggi."
            : "Registrarsi è gratis e richiede meno di un minuto."}
        </p>

        <form action={formAction} className="mt-7 space-y-5">
          {mode === "register" && (
            <>
              <div>
                <label htmlFor="name" className="label">
                  Nome
                </label>
                <input id="name" name="name" type="text" required minLength={2} className="input" />
              </div>
              <div>
                <label htmlFor="phone" className="label">
                  Telefono <span className="font-normal text-stone-400">(facoltativo)</span>
                </label>
                <input id="phone" name="phone" type="tel" className="input" />
              </div>
            </>
          )}
          <div>
            <label htmlFor="email" className="label">
              E-mail
            </label>
            <input id="email" name="email" type="email" required autoComplete="email" className="input" />
          </div>
          <div>
            <label htmlFor="password" className="label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={mode === "register" ? 8 : undefined}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              className="input"
            />
          </div>

          {state?.error && (
            <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {state.error}
            </p>
          )}

          <button type="submit" disabled={pending} className="btn-primary w-full !py-3">
            {pending
              ? "Attendere…"
              : mode === "login"
                ? "Accedi"
                : "Registrati gratis"}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-stone-500">
          {mode === "login" ? (
            <>
              Non hai un account?{" "}
              <Link href="/registrati" className="font-bold text-emerald-700 hover:underline">
                Registrati gratis
              </Link>
            </>
          ) : (
            <>
              Hai già un account?{" "}
              <Link href="/accedi" className="font-bold text-emerald-700 hover:underline">
                Accedi
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
