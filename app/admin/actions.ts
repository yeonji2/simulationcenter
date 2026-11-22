"use server";

import { redirect } from "next/navigation";
import { adminConfigured, checkPassword, clearFails, clientKey, endSession, lockedFor, recordFail, startSession } from "@/lib/admin-auth";

export type LoginState = { error?: string };

export async function login(_prev: LoginState, fd: FormData): Promise<LoginState> {
  const key = await clientKey();
  const wait = lockedFor(key);
  if (wait) return { error: `비밀번호를 여러 번 잘못 입력해 잠시 막혔습니다. 약 ${wait}분 뒤에 다시 시도해 주세요.` };
  if (!adminConfigured()) return { error: "관리자 비밀번호가 서버에 설정되어 있지 않습니다." };

  const password = String(fd.get("password") ?? "");
  if (!checkPassword(password)) {
    recordFail(key);
    return { error: "비밀번호가 맞지 않습니다." };
  }
  clearFails(key);
  await startSession();
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin");
}
