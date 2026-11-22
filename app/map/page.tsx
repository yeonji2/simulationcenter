import type { Metadata } from "next";
import Link from "next/link";
import { MAP_VIEWBOX, ROOMS, type Room } from "@/lib/rooms";

export const metadata: Metadata = {
  title: "센터 지도 | 단국대학교 간호시뮬레이션센터",
};

const FILL: Record<Room["category"], string> = {
  교육실: "fill-sky-100",
  시뮬레이션: "fill-emerald-100",
  지원공간: "fill-slate-100",
};

function RoomShape({ room }: { room: Room }) {
  const narrow = room.w < 130;
  const lines = narrow ? room.label.split(" ") : [room.label];
  const cx = room.x + room.w / 2;
  const cy = room.y + room.h / 2;
  const hasSub = !!room.seats && room.w >= 140;
  // 중앙 복도는 아래쪽이 실들로 가려지므로 빈 윗부분에 라벨을 둔다.
  const startY =
    room.id === "corridor-1" ? room.y + 36 : cy - ((lines.length - 1) * 20) / 2 - (hasSub ? 10 : 0);

  return (
    <Link href={`/rooms/${room.id}`} aria-label={`${room.name} 사진 보기`}>
      <g className="group cursor-pointer">
        <rect
          x={room.x}
          y={room.y}
          width={room.w}
          height={room.h}
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
          shapeRendering="crispEdges"
          className={`${room.id === "corridor-1" ? "fill-white" : FILL[room.category]} stroke-slate-500 transition-colors group-hover:fill-sky-300`}
        />
        {room.id === "prism" && (
          <rect
            x={room.x + 6}
            y={room.y + 6}
            width={room.w - 12}
            height={room.h - 12}
            fill="none"
            stroke="#2563eb"
            strokeWidth={2}
            vectorEffect="non-scaling-stroke"
            strokeDasharray="8 6"
            pointerEvents="none"
          />
        )}
        {lines.map((l, i) => (
          <text
            key={l + i}
            x={cx}
            y={startY + i * 20}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={18}
            fontWeight={700}
            className="fill-slate-800"
            pointerEvents="none"
          >
            {l}
          </text>
        ))}
        {hasSub && (
          <text
            x={cx}
            y={startY + lines.length * 20 + 6}
            textAnchor="middle"
            fontSize={15}
            className="fill-slate-600"
            pointerEvents="none"
          >
            {room.seats}석
          </text>
        )}
        {room.photos.length > 0 && (
          <g pointerEvents="none">
            <circle cx={room.x + room.w - 16} cy={room.y + 16} r={11} fill="#0b3a75" />
            <text
              x={room.x + room.w - 16}
              y={room.y + 17}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={12}
              fontWeight={700}
              fill="#fff"
            >
              {room.photos.length}
            </text>
          </g>
        )}
      </g>
    </Link>
  );
}

export default function MapPage() {
  const ordered = [...ROOMS].sort((a, b) => Number(b.id === "corridor-1") - Number(a.id === "corridor-1"));
  const groups: Room["category"][] = ["교육실", "시뮬레이션", "지원공간"];

  return (
    <main className="mx-auto max-w-6xl px-5 py-12">
      <h1 className="text-3xl font-bold tracking-tight">센터 지도</h1>
      <p className="mt-3 text-slate-600">
        의학관 2층 간호시뮬레이션센터의 평면도입니다. 방을 클릭하면 해당 공간의 사진 페이지로 이동합니다.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-600">
        <span className="flex items-center gap-2">
          <i className="inline-block h-3 w-5 rounded-sm border border-slate-500 bg-sky-100" /> 교육실
        </span>
        <span className="flex items-center gap-2">
          <i className="inline-block h-3 w-5 rounded-sm border border-slate-500 bg-emerald-100" /> 시뮬레이션
        </span>
        <span className="flex items-center gap-2">
          <i className="inline-block h-3 w-5 rounded-sm border border-slate-500 bg-slate-100" /> 지원공간
        </span>
        <span className="flex items-center gap-2">
          <i className="inline-block h-4 w-4 rounded-full bg-[#0b3a75]" /> 사진 장수
        </span>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-3">
        <svg
          viewBox={MAP_VIEWBOX}
          role="group"
          aria-label="간호시뮬레이션센터 평면도"
          className="min-w-[860px]"
        >
          <rect x={150} y={478} width={1660} height={552} fill="#f8fafc" />
          {ordered.map((r) => (
            <RoomShape key={r.id} room={r} />
          ))}
        </svg>
      </div>
      <p className="mt-2 text-xs text-slate-500">
        실시설계 도면(P-102)을 바탕으로 단순화한 개략도이며 축척과 실제 치수는 다를 수 있습니다.
      </p>

      <section className="mt-12">
        <h2 className="text-xl font-bold">실 목록</h2>
        <div className="mt-4 grid gap-8 sm:grid-cols-3">
          {groups.map((g) => (
            <div key={g}>
              <h3 className="text-sm font-semibold text-slate-500">{g}</h3>
              <ul className="mt-2 space-y-1">
                {ROOMS.filter((r) => r.category === g).map((r) => (
                  <li key={r.id}>
                    <Link href={`/rooms/${r.id}`} className="text-[#0b3a75] underline-offset-2 hover:underline">
                      {r.name}
                    </Link>
                    <span className="ml-2 text-xs text-slate-500">
                      {r.photos.length > 0 ? `사진 ${r.photos.length}장` : "사진 준비 중"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
