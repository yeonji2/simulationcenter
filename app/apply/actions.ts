"use server";

import { headers } from "next/headers";
import { addApplication, type ProgramId } from "@/lib/applications";

export type ApplyState = {
  ok?: boolean;
  error?: string;
  /** 오류가 났을 때 입력값을 되돌려 채우기 위한 값(개인정보 보호를 위해 성공 시에는 비운다) */
  values?: Record<string, string>;
};

const PROGRAMS: ProgramId[] = ["dan-c", "dan-i", "dan-s"];

// 같은 접속지에서 10분에 5건까지만 접수(도배 방지, 서버 메모리 기준)
const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;

export async function submitApplication(_prev: ApplyState, fd: FormData): Promise<ApplyState> {
  const get = (k: string) => String(fd.get(k) ?? "").trim();
  const values = {
    program: get("program"),
    name: get("name"),
    organization: get("organization"),
    position: get("position"),
    phone: get("phone"),
    email: get("email"),
    message: get("message"),
  };

  // 사람이 보지 못하는 입력칸이 채워져 있으면 자동 입력 프로그램으로 보고 조용히 무시한다.
  if (get("website")) return { ok: true };

  const h = await headers();
  const ip = (h.get("x-forwarded-for")?.split(",")[0] ?? h.get("x-real-ip") ?? "local").trim();
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_HITS) return { error: "짧은 시간에 너무 많이 신청하셨습니다. 잠시 후 다시 시도해 주세요.", values };

  const fail = (error: string): ApplyState => ({ error, values });

  if (!PROGRAMS.includes(values.program as ProgramId)) return fail("신청할 프로그램을 선택해 주세요.");
  if (!values.name || values.name.length > 40) return fail("이름을 입력해 주세요.");
  if (!values.organization || values.organization.length > 80) return fail("소속 기관(학교·병원 등)을 입력해 주세요.");
  if (!values.position || values.position.length > 40) return fail("직위 또는 학년을 입력해 주세요.");
  if (!/^[0-9+\-\s()]{8,20}$/.test(values.phone)) return fail("연락처를 숫자로 정확히 입력해 주세요. 예: 010-1234-5678");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) || values.email.length > 100) return fail("이메일 주소를 정확히 입력해 주세요.");
  if (values.message.length > 1000) return fail("요청사항은 1000자 이내로 입력해 주세요.");
  if (fd.get("consent") !== "on") return fail("개인정보 수집·이용에 동의해 주셔야 신청할 수 있습니다.");

  try {
    await addApplication({ ...values, program: values.program as ProgramId });
  } catch {
    return fail("신청을 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.");
  }
  hits.set(ip, [...recent, now]);
  return { ok: true };
}
