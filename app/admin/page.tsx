import type { Metadata } from "next";
import Link from "next/link";
import { isAdmin } from "@/lib/admin-auth";
import { listApplications, type ProgramId } from "@/lib/applications";
import { PROGRAMS } from "@/lib/programs";
import DeleteButton from "./DeleteButton";
import LoginForm from "./LoginForm";
import { logout } from "./actions";

export const metadata: Metadata = {
  title: "관리자 | 단국대학교 간호시뮬레이션센터",
  robots: { index: false, follow: false },
};

// 로그인 여부는 요청마다 달라지므로 항상 서버에서 새로 그린다.
export const dynamic = "force-dynamic";

const CODE: Record<ProgramId, string> = { "dan-c": "Dan-C", "dan-i": "Dan-I", "dan-s": "Dan-S" };

function fmt(iso: string) {
  return new Date(iso).toLocaleString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ program?: string }> }) {
  if (!(await isAdmin())) {
    return (
      <main className="mx-auto max-w-md px-5 py-16">
        <h1 className="text-2xl font-bold tracking-tight">관리자 로그인</h1>
        <p className="mt-2 text-sm text-slate-600">관리자만 접속할 수 있습니다. 비밀번호를 입력해 주세요.</p>
        <LoginForm />
      </main>
    );
  }

  const { program } = await searchParams;
  const all = await listApplications();
  const filter = PROGRAMS.some((p) => p.id === program) ? (program as ProgramId) : null;
  const rows = filter ? all.filter((a) => a.program === filter) : all;
  const count = (id: ProgramId) => all.filter((a) => a.program === id).length;

  return (
    <main className="mx-auto max-w-6xl px-5 py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold tracking-wide text-sky-700">ADMIN</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">교육신청 관리</h1>
        </div>
        <div className="flex gap-2">
          <a
            href="/admin/export"
            className="rounded-lg border border-[#0b3a75] px-4 py-2 text-sm font-semibold text-[#0b3a75] hover:bg-slate-50"
          >
            CSV 내려받기
          </a>
          <form action={logout}>
            <button type="submit" className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900">
              로그아웃
            </button>
          </form>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="프로그램별 보기">
        <Link
          href="/admin"
          className={`rounded-full px-4 py-2 text-sm font-semibold ${!filter ? "bg-[#0b3a75] text-white" : "border border-slate-300 text-slate-700 hover:bg-slate-50"}`}
        >
          전체 {all.length}건
        </Link>
        {PROGRAMS.map((p) => (
          <Link
            key={p.id}
            href={`/admin?program=${p.id}`}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${filter === p.id ? "bg-[#0b3a75] text-white" : "border border-slate-300 text-slate-700 hover:bg-slate-50"}`}
          >
            {p.code} {count(p.id)}건
          </Link>
        ))}
      </div>

      {rows.length === 0 ? (
        <p className="mt-8 rounded-lg bg-slate-100 p-8 text-center text-slate-600">
          {all.length === 0 ? "아직 접수된 교육 신청이 없습니다." : "이 프로그램의 신청이 없습니다."}
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full min-w-[900px] border-collapse text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                {["접수일시", "프로그램", "이름", "소속 기관", "직위·학년", "연락처", "이메일", "문의·요청사항", "관리"].map((h) => (
                  <th key={h} className="whitespace-nowrap border-b border-slate-200 px-4 py-3 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => (
                <tr key={a.id} className="align-top odd:bg-white even:bg-slate-50/50">
                  <td className="whitespace-nowrap border-b border-slate-100 px-4 py-3 text-slate-600">{fmt(a.createdAt)}</td>
                  <td className="whitespace-nowrap border-b border-slate-100 px-4 py-3">
                    <span className="whitespace-nowrap rounded-full bg-amber-300 px-2.5 py-0.5 text-xs font-extrabold text-[#0b3a75]">{CODE[a.program]}</span>
                  </td>
                  <td className="whitespace-nowrap border-b border-slate-100 px-4 py-3 font-semibold">{a.name}</td>
                  <td className="border-b border-slate-100 px-4 py-3">{a.organization}</td>
                  <td className="border-b border-slate-100 px-4 py-3">{a.position}</td>
                  <td className="whitespace-nowrap border-b border-slate-100 px-4 py-3">{a.phone}</td>
                  <td className="border-b border-slate-100 px-4 py-3 break-all">{a.email}</td>
                  <td className="max-w-xs whitespace-pre-wrap border-b border-slate-100 px-4 py-3 text-slate-600">{a.message || "—"}</td>
                  <td className="border-b border-slate-100 px-4 py-3">
                    <DeleteButton id={a.id} name={a.name} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="mt-4 text-xs text-slate-500">
        신청 정보는 이 서버의 data/applications.json 파일에 저장됩니다. 개인정보이므로 외부에 공유하지 마세요.
      </p>
    </main>
  );
}
