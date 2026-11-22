"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { deleteApplication } from "@/lib/applications";
import { isAdmin, adminConfigured, checkPassword, clearFails, clientKey, endSession, lockedFor, recordFail, startSession } from "@/lib/admin-auth";

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

/** 신청 1건 삭제: 관리자 로그인이 확인된 경우에만 동작한다. */
export async function removeApplication(fd: FormData) {
  if (!(await isAdmin())) return;
  const id = String(fd.get("id") ?? "");
  if (!id) return;
  await deleteApplication(id);
  revalidatePath("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin");
}
