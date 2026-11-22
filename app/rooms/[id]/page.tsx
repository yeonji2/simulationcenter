import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRoom, ROOMS } from "@/lib/rooms";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return ROOMS.map((r) => ({ id: r.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const room = getRoom(id);
  return { title: room ? `${room.name} | 단국대학교 간호시뮬레이션센터` : "실 정보" };
}

export default async function RoomPage({ params }: Props) {
  const { id } = await params;
  const room = getRoom(id);
  if (!room) notFound();

  const index = ROOMS.findIndex((r) => r.id === room.id);
  const prev = ROOMS[(index - 1 + ROOMS.length) % ROOMS.length];
  const next = ROOMS[(index + 1) % ROOMS.length];

  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <Link href="/map" className="text-sm font-medium text-[#0b3a75] hover:underline">
        ← 센터 지도로 돌아가기
      </Link>

      <p className="mt-6 text-sm font-semibold text-sky-700">{room.category}</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight">{room.name}</h1>
      <p className="mt-4 max-w-3xl leading-8 text-slate-700">{room.summary}</p>

      {room.facts.length > 0 && (
        <ul className="mt-5 flex flex-wrap gap-2">
          {room.facts.map((f) => (
            <li key={f} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
              {f}
            </li>
          ))}
        </ul>
      )}

      <section className="mt-10">
        <h2 className="text-xl font-bold">사진</h2>
        {room.photos.length > 0 ? (
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            {room.photos.map((p, i) => (
              <figure
                key={p.src + i}
                className={`${i === 0 && room.photos.length % 2 === 1 ? "sm:col-span-2" : ""} ${p.compact ? "max-w-xl" : ""}`}
              >
                <Image
                  src={p.src}
                  alt={p.caption}
                  width={p.width ?? 1920}
                  height={p.height ?? 1080}
                  sizes="(min-width: 1024px) 960px, 100vw"
                  className="w-full rounded-xl border border-slate-200"
                  priority={i === 0}
                  unoptimized={p.src.endsWith(".svg")}
                />
                <figcaption className="mt-2 text-sm text-slate-500">{p.caption}</figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className="mt-4 flex aspect-video items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-500">
            사진 준비 중입니다.
          </div>
        )}
        {room.photos.length > 0 && (
          <p className="mt-4 text-xs text-slate-500">3D 제안 렌더링·참고 이미지·AI 생성 가상 이미지이며 실제 시공 모습과 다를 수 있습니다.</p>
        )}
      </section>

      <nav className="mt-12 flex justify-between border-t border-slate-200 pt-6 text-sm">
        <Link href={`/rooms/${prev.id}`} className="text-[#0b3a75] hover:underline">
          ← {prev.name}
        </Link>
        <Link href={`/rooms/${next.id}`} className="text-[#0b3a75] hover:underline">
          {next.name} →
        </Link>
      </nav>
    </main>
  );
}
