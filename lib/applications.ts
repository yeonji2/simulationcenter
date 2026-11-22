import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

// 교육신청 저장소: 이 컴퓨터의 data/applications.json 파일(.gitignore 처리됨, 깃허브에 올라가지 않음).
// 인터넷에 배포할 때는 서버가 파일을 영구 보관하지 못하는 환경이 있어 데이터베이스로 바꿔야 한다.

export type ProgramId = "dan-c" | "dan-i" | "dan-s";

export type Application = {
  id: string;
  createdAt: string; // ISO
  program: ProgramId;
  name: string;
  organization: string;
  position: string;
  phone: string;
  email: string;
  message: string;
};

export type NewApplication = Omit<Application, "id" | "createdAt">;

// 배포 서버에서는 영구 디스크(볼륨)가 붙은 폴더를 DATA_DIR 환경변수로 지정한다. 없으면 프로젝트의 data 폴더를 쓴다.
const FILE = path.join(process.env.DATA_DIR || path.join(process.cwd(), "data"), "applications.json");

// 동시에 들어온 신청이 서로 덮어쓰지 않도록 한 번에 하나씩 처리한다.
let chain: Promise<unknown> = Promise.resolve();
function locked<T>(fn: () => Promise<T>): Promise<T> {
  const run = chain.then(fn, fn);
  chain = run.catch(() => undefined);
  return run;
}

async function readAll(): Promise<Application[]> {
  try {
    const parsed: unknown = JSON.parse(await fs.readFile(FILE, "utf8"));
    return Array.isArray(parsed) ? (parsed as Application[]) : [];
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw e;
  }
}

export function listApplications() {
  return locked(async () => (await readAll()).sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
}

export function deleteApplication(id: string) {
  return locked(async () => {
    const all = await readAll();
    const next = all.filter((a) => a.id !== id);
    if (next.length === all.length) return false;
    await fs.mkdir(path.dirname(FILE), { recursive: true });
    const tmp = `${FILE}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(next, null, 2), "utf8");
    await fs.rename(tmp, FILE);
    return true;
  });
}

export function addApplication(input: NewApplication) {
  return locked(async () => {
    const all = await readAll();
    const record: Application = { ...input, id: randomUUID(), createdAt: new Date().toISOString() };
    all.push(record);
    await fs.mkdir(path.dirname(FILE), { recursive: true });
    const tmp = `${FILE}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(all, null, 2), "utf8");
    await fs.rename(tmp, FILE);
    return record;
  });
}
