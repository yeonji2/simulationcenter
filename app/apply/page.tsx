import type { Metadata } from "next";
import { PARTNER_ORGS, PROGRAMS, type Course, type Program } from "@/lib/programs";

export const metadata: Metadata = {
  title: "교육신청 | 단국대학교 간호시뮬레이션센터",
  description: "Dan-CIS 프로그램(지역사회 간호사·인근대학 교원·인근대학 간호학생) 대상과 교육과정을 안내합니다.",
};

function CourseTable({ course }: { course: Course }) {
  return (
    <div className="mt-6">
      <h4 className="text-base font-bold">{course.title}</h4>
      {course.note && <p className="mt-1 text-sm leading-6 text-slate-600">{course.note}</p>}
      <div className="mt-3 overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full min-w-[560px] border-collapse text-left text-sm">
          {course.columns && (
            <thead className="bg-slate-50">
              <tr>
                <th className="w-32 border-b border-slate-200 px-4 py-3 font-semibold text-slate-500">구분</th>
                {course.columns.map((c) => (
                  <th key={c} className="border-b border-l border-slate-200 px-4 py-3 font-semibold text-[#0b3a75]">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {course.rows.map((row) => (
              <tr key={row.label} className="align-top">
                <th className="w-32 border-b border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-700">
                  {row.label}
                </th>
                {row.cells.map((items, i) => (
                  <td key={i} className="border-b border-l border-slate-200 px-4 py-3 leading-6 text-slate-700">
                    <ul className="space-y-1">
                      {items.map((t) => (
                        <li key={t} className="flex gap-2">
                          <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProgramSection({ p }: { p: Program }) {
  return (
    <section id={p.id} className="scroll-mt-24 border-t border-slate-200 pt-12">
      <p className="text-sm font-bold tracking-wide text-sky-700">
        {p.code} · {p.name}
      </p>
      <h2 className="mt-1 text-2xl font-bold tracking-tight">{p.subtitle}</h2>

      <dl className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 p-5 sm:col-span-2">
          <dt className="text-sm font-semibold text-slate-500">목적</dt>
          <dd className="mt-1 leading-7 text-slate-800">{p.purpose}</dd>
        </div>
        <div className="rounded-xl border border-slate-200 p-5">
          <dt className="text-sm font-semibold text-slate-500">교육 대상</dt>
          <dd className="mt-2 space-y-3">
            {p.targets.map((t) => (
              <div key={t.title}>
                <p className="font-semibold text-slate-900">{t.title}</p>
                {t.examples && <p className="mt-0.5 text-sm leading-6 text-slate-600">{t.examples}</p>}
              </div>
            ))}
          </dd>
        </div>
        <div className="rounded-xl border border-slate-200 p-5">
          <dt className="text-sm font-semibold text-slate-500">운영</dt>
          <dd className="mt-2 font-semibold text-slate-900">{p.frequency}</dd>
          <dt className="mt-4 text-sm font-semibold text-slate-500">특징</dt>
          <dd className="mt-1">
            <ul className="space-y-1 text-sm leading-6 text-slate-700">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </dd>
        </div>
      </dl>

      {p.courses.map((c) => (
        <CourseTable key={c.title} course={c} />
      ))}
    </section>
  );
}

export default function ApplyPage() {
  return (
    <main className="mx-auto max-w-5xl px-5 py-12">
      <p className="text-sm font-bold tracking-wide text-sky-700">DAN-CIS PROGRAM</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight">교육신청</h1>
      <p className="mt-4 max-w-3xl leading-8 text-slate-700">
        단국대학교 간호시뮬레이션센터(D-PULSE Center)는 지역사회 간호사, 인근대학 교원, 인근대학 간호학생을 대상으로
        외상간호 시뮬레이션 교육을 제공하는 <strong>Dan-CIS 프로그램</strong>을 운영합니다. 대상에 맞는 프로그램을
        확인해 주세요.
      </p>

      <div className="mt-8 flex items-center gap-3 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-[#0b3a75]">
        <span
          aria-hidden
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0b3a75] text-sm font-bold text-white"
        >
          i
        </span>
        <p className="text-sm font-semibold sm:text-base">
          해당하는 프로그램 카드를 클릭하면 상세 안내(대상·운영·교육과정)로 이동합니다.
        </p>
      </div>

      <nav aria-label="프로그램 바로가기" className="mt-5 grid gap-4 sm:grid-cols-3">
        {PROGRAMS.map((p, i) => (
          <a
            key={p.id}
            href={`#${p.id}`}
            className="group relative flex min-h-[230px] flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-[#0b3a75] to-[#1459a8] p-6 text-white shadow-md transition hover:-translate-y-1 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b3a75]"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute -right-1 -top-5 select-none text-8xl font-black text-white/10"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="relative w-fit rounded-full bg-amber-300 px-3.5 py-1 text-base font-extrabold tracking-tight text-[#0b3a75]">
              {p.code}
            </span>
            <p className="relative mt-4 text-lg font-bold leading-snug">{p.targets.map((t) => t.title).join(" · ")}</p>
            <p className="relative mt-2 text-sm leading-6 text-white/90">{p.subtitle}</p>
            <span className="relative mt-auto flex items-center justify-between pt-5 text-sm font-bold">
              <span>클릭해서 자세히 보기</span>
              <span
                aria-hidden
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#0b3a75] transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </span>
          </a>
        ))}
      </nav>

      <div className="mt-12 space-y-14">
        {PROGRAMS.map((p) => (
          <ProgramSection key={p.id} p={p} />
        ))}
      </div>

      <section className="mt-14 border-t border-slate-200 pt-12">
        <h2 className="text-2xl font-bold tracking-tight">운영 계획과 참여 기관</h2>
        <p className="mt-3 max-w-3xl leading-8 text-slate-700">
          2027년부터 2031년까지 학기마다 Dan-C, Dan-I, Dan-S를 각각 1회 운영하며(참여 인원 각 10명), 2028년 2학기부터는
          일부 학기에 Dan-C를 2회(간호사 20명) 운영합니다. 학기당 평균 3.3회, 14.2시간 규모입니다.
        </p>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          {Object.entries(PARTNER_ORGS).map(([k, v]) => (
            <div key={k} className="rounded-xl border border-slate-200 p-5">
              <dt className="text-sm font-semibold text-slate-500">대상 기관 — {k}</dt>
              <dd className="mt-1 leading-7 text-slate-800">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-14 rounded-xl bg-slate-100 p-8 text-center">
        <h2 className="text-xl font-bold">교육 신청 접수</h2>
        <p className="mt-2 text-slate-600">
          신청 접수 방법(신청서·문의처)은 확정되는 대로 이곳에 안내됩니다.
        </p>
        <button
          type="button"
          disabled
          className="mt-5 cursor-not-allowed rounded-lg bg-slate-300 px-6 py-3 font-semibold text-slate-600"
        >
          접수 준비 중
        </button>
      </section>

      <p className="mt-8 text-xs leading-5 text-slate-500">
        출처: 단국대학교 간호대학 실습교육 지원사업 사업계획서(외부 교육역량 지원). 운영 시기와 세부 내용은 사업 진행에
        따라 달라질 수 있습니다.
      </p>
    </main>
  );
}
