import Link from "next/link";
import { CENTER } from "@/lib/rooms";

const STATS = [
  {
    value: `각 ${CENTER.simRooms}개 실`,
    label: `시뮬레이션룸 ${CENTER.simRooms}개 · 디브리핑룸 ${CENTER.debriefRooms}개 (조정실·지원공간 별도)`,
  },
  { value: `${CENTER.seats}석`, label: "디브리핑룸 5곳 좌석 합계" },
  { value: CENTER.area, label: "의학관 2층 실시설계 기준" },
  { value: `${CENTER.faculty}명`, label: `간호대학 전임교원 (시뮬레이션 전담 ${CENTER.dedicatedFaculty}명)` },
];

const HIGHLIGHTS = [
  {
    title: "외상응급시뮬레이션룸",
    tag: "외상 시뮬레이션",
    body: "고충실도 성인 환자 시뮬레이터로 외상환자 초기 사정, 응급상황 대응, 의사소통을 실제 임상처럼 훈련합니다.",
  },
  {
    title: "Immersive Room (PRISM)",
    tag: "몰입형 환경",
    body: "교통사고·낙상 등 다양한 외상 상황을 실제와 유사하게 구현해 팀 기반 임상 대응 교육을 강화합니다.",
  },
  {
    title: "Living Lab",
    tag: "지역사회·가정 간호",
    body: "가정집 환경에서 표준화환자와 간호학생이 상담하며 외상 예방과 생활환경 위험요인 관리를 연습합니다.",
  },
  {
    title: "디브리핑룸",
    tag: "성찰과 피드백",
    body: "실습 녹화 영상을 함께 보며 학습자의 임상 판단과 의사소통, 상황 대응 과정을 돌아보고 피드백합니다.",
  },
];

export default function Home() {
  return (
    <main>
      <section className="bg-[#0b3a75] text-white">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
          <p className="text-sm font-semibold tracking-widest text-sky-200">
            DANKOOK UNIVERSITY COLLEGE OF NURSING
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            단국대학교
            <br />
            간호시뮬레이션센터
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-sky-50">
            외상 예방부터 급성기 대응, 회복과 재활 준비까지. 실제 임상에 가까운 환경에서 간호의 전 과정을
            안전하게 연습하는 {CENTER.english}입니다.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/map"
              className="rounded-lg bg-white px-6 py-3 text-base font-semibold text-[#0b3a75] hover:bg-sky-50"
            >
              센터 지도 보기
            </Link>
            <a
              href="#location"
              className="rounded-lg border border-white/50 px-6 py-3 text-base font-semibold text-white hover:bg-white/10"
            >
              오시는 길
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-10 max-w-6xl px-5">
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <dt className="text-2xl font-bold text-[#0b3a75]">{s.value}</dt>
              <dd className="mt-2 text-sm leading-6 text-slate-600">{s.label}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-5">
        <h2 className="text-2xl font-bold tracking-tight">센터 둘러보기</h2>
        <p className="mt-2 text-slate-600">영상으로 센터의 복도와 스테이션, 각 교육 공간을 미리 둘러보세요.</p>
        <video
          className="mt-6 aspect-video w-full rounded-xl border border-slate-200 bg-black"
          controls
          preload="metadata"
          playsInline
          aria-label="단국대학교 간호시뮬레이션센터 소개 영상"
        >
          <source src="/videos/intro-guide.mp4" type="video/mp4" />
          이 브라우저에서는 영상을 재생할 수 없습니다.
        </video>
        <p className="mt-2 text-xs text-slate-500">소개 영상의 일부 장면은 가상으로 구성된 화면이며 실제 시공 모습과 다를 수 있습니다.</p>
      </section>

      <section className="mx-auto mt-20 grid max-w-6xl gap-10 px-5 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">센터 소개</h2>
          <p className="mt-4 leading-8 text-slate-700">
            단국대학교 간호시뮬레이션센터는 간호대학생과 지역사회 간호사가 환자 안전을 지키며 임상 역량을
            키우는 시뮬레이션 교육 공간입니다. 다목적시뮬레이션룸과 시뮬레이션실, 조정실, 디브리핑룸, 몰입형 환경을
            한 층에 유기적으로 배치해, 각 실이 독립적으로 운영되면서도 필요할 때 함께 연계됩니다.
          </p>
          <p className="mt-4 leading-8 text-slate-700">
            5년 연속 A등급을 받은 권역외상센터를 갖춘 단국대학교병원과 협력해 실제 외상 사례를 시나리오에
            반영하고, 충남권 외상간호 시뮬레이션 교육의 거점으로 성장하는 것을 목표로 합니다.
          </p>
        </div>
        <div id="location" className="scroll-mt-20 rounded-xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-2xl font-bold tracking-tight">위치</h2>
          <dl className="mt-4 space-y-4 text-slate-700">
            <div>
              <dt className="text-sm font-semibold text-slate-500">캠퍼스·건물</dt>
              <dd className="mt-1 text-lg font-semibold">
                {CENTER.college} {CENTER.campus} {CENTER.building}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-slate-500">주소</dt>
              <dd className="mt-1">{CENTER.address}</dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-slate-500">규모</dt>
              <dd className="mt-1">
                시뮬레이션룸 {CENTER.simRooms}개 · 디브리핑룸 {CENTER.debriefRooms}개 · 총 {CENTER.seats}석 · {CENTER.area}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-slate-500">교수진</dt>
              <dd className="mt-1">
                간호대학 전임교원 {CENTER.faculty}명 (시뮬레이션 전담 전임교원 {CENTER.dedicatedFaculty}명)
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-5">
        <h2 className="text-2xl font-bold tracking-tight">주요 교육 공간</h2>
        <p className="mt-2 text-slate-600">외상간호 역량을 단계적으로 기르는 네 가지 공간입니다.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {HIGHLIGHTS.map((h) => (
            <article key={h.title} className="rounded-xl border border-slate-200 p-6">
              <p className="text-sm font-semibold text-sky-700">{h.tag}</p>
              <h3 className="mt-1 text-xl font-bold">{h.title}</h3>
              <p className="mt-3 leading-7 text-slate-700">{h.body}</p>
            </article>
          ))}
        </div>
        <div className="mt-10 rounded-xl bg-slate-100 p-8 text-center">
          <p className="text-lg font-semibold">각 실의 모습이 궁금하다면 센터 지도를 열어보세요.</p>
          <p className="mt-1 text-slate-600">지도에서 방을 클릭하면 해당 공간의 사진 페이지로 이동합니다.</p>
          <Link
            href="/map"
            className="mt-5 inline-block rounded-lg bg-[#0b3a75] px-6 py-3 font-semibold text-white hover:bg-[#09305f]"
          >
            센터 지도 보기
          </Link>
        </div>
      </section>
    </main>
  );
}
