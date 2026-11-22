"use client";

import { useActionState } from "react";
import { submitApplication, type ApplyState } from "./actions";

type Option = { id: string; code: string; label: string };

const input =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:border-[#0b3a75] focus:outline-none focus:ring-2 focus:ring-[#0b3a75]/20";
const label = "block text-sm font-semibold text-slate-700";

export default function ApplyForm({ programs }: { programs: Option[] }) {
  const [state, action, pending] = useActionState<ApplyState, FormData>(submitApplication, {});
  const v = state.values ?? {};

  if (state.ok) {
    return (
      <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <p className="text-xl font-bold text-emerald-900">교육 신청이 접수되었습니다.</p>
        <p className="mt-2 text-emerald-800">입력하신 연락처로 안내드리겠습니다. 감사합니다.</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5" noValidate>
      {/* 자동 입력 프로그램을 걸러내기 위한 숨김 입력칸: 사람은 보이지 않으므로 비워 둔다 */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          웹사이트
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div>
        <label htmlFor="program" className={label}>
          신청 프로그램 <span className="text-red-600">*</span>
        </label>
        <select id="program" name="program" required defaultValue={v.program ?? ""} className={input}>
          <option value="" disabled>
            프로그램을 선택해 주세요
          </option>
          {programs.map((p) => (
            <option key={p.id} value={p.id}>
              {p.code} · {p.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={label}>
            이름 <span className="text-red-600">*</span>
          </label>
          <input id="name" name="name" required maxLength={40} autoComplete="name" defaultValue={v.name} className={input} />
        </div>
        <div>
          <label htmlFor="organization" className={label}>
            소속 기관 <span className="text-red-600">*</span>
          </label>
          <input
            id="organization"
            name="organization"
            required
            maxLength={80}
            autoComplete="organization"
            placeholder="예: ○○대학교, ○○병원"
            defaultValue={v.organization}
            className={input}
          />
        </div>
        <div>
          <label htmlFor="position" className={label}>
            직위 · 학년 <span className="text-red-600">*</span>
          </label>
          <input
            id="position"
            name="position"
            required
            maxLength={40}
            placeholder="예: 간호사, 교수, 3학년"
            defaultValue={v.position}
            className={input}
          />
        </div>
        <div>
          <label htmlFor="phone" className={label}>
            연락처 <span className="text-red-600">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            maxLength={20}
            autoComplete="tel"
            placeholder="010-1234-5678"
            defaultValue={v.phone}
            className={input}
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className={label}>
          이메일 <span className="text-red-600">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          maxLength={100}
          autoComplete="email"
          defaultValue={v.email}
          className={input}
        />
      </div>

      <div>
        <label htmlFor="message" className={label}>
          문의 · 요청사항 <span className="font-normal text-slate-500">(선택)</span>
        </label>
        <textarea id="message" name="message" rows={4} maxLength={1000} defaultValue={v.message} className={input} />
      </div>

      <div className="rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-600">
        <p className="font-semibold text-slate-700">개인정보 수집·이용 안내</p>
        <p className="mt-1">
          수집 항목: 이름, 소속 기관, 직위·학년, 연락처, 이메일, 요청사항 · 이용 목적: 교육 신청 접수와 교육 안내.
          동의하지 않을 수 있으나, 동의하지 않으면 신청이 어렵습니다.
        </p>
        <label className="mt-3 flex items-start gap-2 font-semibold text-slate-800">
          <input type="checkbox" name="consent" className="mt-1 h-4 w-4" />
          <span>개인정보 수집·이용에 동의합니다. <span className="text-red-600">*</span></span>
        </label>
      </div>

      {state.error && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-[#0b3a75] px-6 py-3.5 text-lg font-bold text-white transition-colors hover:bg-[#09305f] disabled:cursor-wait disabled:opacity-60 sm:w-auto"
      >
        {pending ? "접수하는 중…" : "교육 신청하기"}
      </button>
    </form>
  );
}
