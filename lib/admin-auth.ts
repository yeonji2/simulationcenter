import { cookies, headers } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

// 관리자 인증: 비밀번호는 환경변수(ADMIN_PASSWORD)에만 있고, 로그인 후에는 서명된 쿠키(8시간)로 구분한다.
// 환경변수가 없으면 로그인은 항상 실패한다(안전한 쪽으로 닫힘).

const COOKIE = "admin_session";
const MAX_AGE_SEC = 60 * 60 * 8;

const secret = () => process.env.ADMIN_SESSION_SECRET ?? "";

export const adminConfigured = () => !!process.env.ADMIN_PASSWORD && secret().length >= 16;

const sign = (payload: string) => createHmac("sha256", secret()).update(payload).digest("hex");

/** 비밀번호 비교(길이와 무관하게 같은 시간이 걸리도록 해시 후 비교) */
export function checkPassword(input: string) {
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (!expected) return false;
  const h = (v: string) => createHmac("sha256", "admin-pw-compare").update(v).digest();
  return timingSafeEqual(h(input), h(expected));
}

export async function startSession() {
  const payload = String(Date.now() + MAX_AGE_SEC * 1000);
  const token = `${payload}.${sign(payload)}`;
  const secure = (await headers()).get("x-forwarded-proto") === "https";
  (await cookies()).set(COOKIE, token, { httpOnly: true, sameSite: "lax", secure, path: "/", maxAge: MAX_AGE_SEC });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin() {
  if (!adminConfigured()) return false;
  const value = (await cookies()).get(COOKIE)?.value;
  if (!value) return false;
  const [payload, sig] = value.split(".");
  if (!payload || !sig) return false;
  const expected = sign(payload);
  if (sig.length !== expected.length || !timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  return Number(payload) > Date.now();
}

// 로그인 시도 제한: 같은 접속지에서 5번 틀리면 5분간 잠근다(서버 메모리 기준).
const fails = new Map<string, { n: number; until: number }>();
const MAX_FAILS = 5;
const LOCK_MS = 5 * 60 * 1000;

export async function clientKey() {
  const h = await headers();
  return (h.get("x-forwarded-for")?.split(",")[0] ?? h.get("x-real-ip") ?? "local").trim();
}
export function lockedFor(key: string) {
  const f = fails.get(key);
  return f && f.until > Date.now() ? Math.ceil((f.until - Date.now()) / 60000) : 0;
}
export function recordFail(key: string) {
  const f = fails.get(key) ?? { n: 0, until: 0 };
  f.n += 1;
  if (f.n >= MAX_FAILS) { f.until = Date.now() + LOCK_MS; f.n = 0; }
  fails.set(key, f);
}
export function clearFails(key: string) {
  fails.delete(key);
}
