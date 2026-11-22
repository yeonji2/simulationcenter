"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  return (
    <form action={action} className="mt-6 space-y-4">
      <div>
        <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
          관리자 비밀번호
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          autoFocus
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base focus:border-[#0b3a75] focus:outline-none focus:ring-2 focus:ring-[#0b3a75]/20"
        />
      </div>
      {state.error && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-[#0b3a75] px-6 py-3 font-bold text-white hover:bg-[#09305f] disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? "확인하는 중…" : "로그인"}
      </button>
    </form>
  );
}
