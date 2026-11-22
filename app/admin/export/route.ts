import { isAdmin } from "@/lib/admin-auth";
import { listApplications } from "@/lib/applications";

export const dynamic = "force-dynamic";

const CODE: Record<string, string> = { "dan-c": "Dan-C", "dan-i": "Dan-I", "dan-s": "Dan-S" };

// 엑셀에서 수식으로 실행되지 않도록 =, +, -, @ 로 시작하는 값 앞에 작은따옴표를 붙인다.
function cell(v: string) {
  const safe = /^[=+\-@\t\r]/.test(v) ? `'${v}` : v;
  return `"${safe.replace(/"/g, '""')}"`;
}

export async function GET() {
  if (!(await isAdmin())) return new Response("관리자 로그인이 필요합니다.", { status: 401 });

  const rows = await listApplications();
  const head = ["접수일시", "프로그램", "이름", "소속 기관", "직위·학년", "연락처", "이메일", "문의·요청사항"];
  const lines = [
    head.map(cell).join(","),
    ...rows.map((a) =>
      [new Date(a.createdAt).toLocaleString("ko-KR"), CODE[a.program] ?? a.program, a.name, a.organization, a.position, a.phone, a.email, a.message]
        .map(cell)
        .join(","),
    ),
  ];
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return new Response("﻿" + lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="applications-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
