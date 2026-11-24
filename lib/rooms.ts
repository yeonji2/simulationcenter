// 실시설계 도면 P-102(평면도) 기준 실 정보. 좌표(x, y, w, h)는 도면 이미지 픽셀 기준의 개략 위치(축척 없음)이다.

export type Photo = { src: string; caption: string; width?: number; height?: number; compact?: boolean };

// AI로 생성한 가상 이미지(Canva). 실제 촬영 사진이 아니며 실제 인물이 아니다.
const aiPhoto = (file: string, caption: string): Photo => ({
  src: "/images/rooms/" + file,
  caption: caption + " (AI 생성 가상 이미지, 실제 모습과 다를 수 있음)",
  width: 1920,
  height: 1080,
});
const debriefFront = aiPhoto("debrief-u-front.jpg", "디브리핑 장면 — U자형 테이블에 보라색 실습복 학생들이 앉고 교수자가 서서 디브리핑하는 모습");

// 실제 현장 사진(시공 중 촬영). 방별로 맨 앞에 보여 준다.
const sitePhoto = (name: string, caption: string, portrait = false): Photo => ({
  src: "/images/rooms/site/" + name,
  caption: "현장 사진 — " + caption,
  width: portrait ? 901 : 1600,
  height: portrait ? 1600 : 901,
  compact: portrait,
});
const SITE: Record<string, Photo[]> = {
  "station": [
    sitePhoto("site-station-1.jpg", "센터 출입구 — D-PULSE center 사인"),
    sitePhoto("site-station-2.jpg", "스테이션 — 안내 데스크와 수납장"),
    sitePhoto("site-station-3.jpg", "스테이션 — DANKOOK UNIVERSITY College of Nursing"),
    sitePhoto("site-station-4.jpg", "스테이션에서 복도 방향을 본 모습"),
  ],
  "prism": [
    sitePhoto("site-prism-1.jpg", "몰입형 시뮬레이션룸(PRISM) — 입구 사이니지와 내부"),
    sitePhoto("site-prism-2.jpg", "몰입형 시뮬레이션룸 내부"),
  ],
  "ward": [
    sitePhoto("site-ward-1.jpg", "다목적 시뮬레이션룸 입구 사이니지"),
    sitePhoto("site-ward-2.jpg", "다목적 시뮬레이션룸 입구 — 유리 벽 너머로 천장 커튼 레일이 보입니다"),
    sitePhoto("site-ward-3.jpg", "다목적 시뮬레이션룸 내부 — 천장 커튼 레일과 싱크대"),
    sitePhoto("site-ward-4.jpg", "다목적 시뮬레이션룸 내부 — 유리 벽과 수납장"),
  ],
  "storage-2": [
    sitePhoto("site-storage-2-1.jpg", "창고 2 — 기존 분전함"),
  ],
  "trauma-sim": [
    sitePhoto("site-trauma-sim-1.jpg", "외상응급 시뮬레이션룸 입구 사이니지"),
    sitePhoto("site-trauma-sim-2.jpg", "외상응급 시뮬레이션룸 내부 — 원목 수납장 벽과 음수대"),
    sitePhoto("site-trauma-sim-4.jpg", "관찰 창 너머로 본 외상응급 시뮬레이션룸"),
  ],
  "living-lab": [
    sitePhoto("site-living-lab-1.jpg", "리빙랩 입구 사이니지와 내부"),
    sitePhoto("site-living-lab-2.jpg", "리빙랩 내부 — 바닥이 한 단 높은 공간"),
    sitePhoto("site-living-lab-3.jpg", "리빙랩 내부 — 바닥이 한 단 높은 공간"),
  ],
  "debrief-1": [
    sitePhoto("site-debrief-1-1.jpg", "디브리핑룸 1 입구 사이니지"),
  ],
  "debrief-4": [
    sitePhoto("site-debrief-3-1.jpg", "디브리핑룸 3 입구 사이니지와 복도"),
    sitePhoto("site-debrief-3-2.jpg", "디브리핑룸 3 입구 사이니지", true),
  ],
};

export type Edge = "top" | "right" | "bottom" | "left";

export type Room = {
  id: string;
  name: string;
  /** 지도에 표시할 이름 (공백 기준으로 줄바꿈) */
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  category: "교육실" | "시뮬레이션" | "지원공간";
  /** 지도에서 실선 대신 점선으로 그릴 변 */
  dashedEdges?: Edge[];
  /** 옆 방이 이미 그린 변이라 이 방에서는 그리지 않을 변 */
  hiddenEdges?: Edge[];
  summary: string;
  seats?: number;
  facts: string[];
  photos: Photo[];
};

export const MAP_VIEWBOX = "150 478 1660 552";

const BASE_ROOMS: Room[] = [
  // 지도 왼쪽 3칸. 높이 비율은 도면 치수(5,150 / 1,625 / 5,025mm)를 따른다.
  {
    id: "child-sim",
    name: "아동건강시뮬레이션룸",
    label: "아동건강\n시뮬레이션룸",
    x: 163, y: 497, w: 183, h: 228,
    category: "시뮬레이션",
    summary: "아동간호 시나리오를 실습하는 시뮬레이션 공간입니다. 아래의 조정실에서 실습 장면을 관찰합니다.",
    facts: ["세면대 설치"],
    photos: [aiPhoto("child-sim-1.jpg", "아동건강시뮬레이션룸 — 인큐베이터, 영아 처치대, 환자 병상")],
  },
  {
    id: "control-child-maternal",
    name: "조정실",
    label: "조정실",
    x: 163, y: 725, w: 183, h: 72,
    category: "지원공간",
    summary: "아동건강시뮬레이션룸과 모성건강시뮬레이션룸 사이에서 두 공간의 실습을 조작하고 관찰하는 조정실입니다.",
    facts: [],
    photos: [],
  },
  {
    id: "maternal-sim",
    name: "모성건강시뮬레이션룸",
    label: "모성건강\n시뮬레이션룸",
    x: 163, y: 797, w: 183, h: 218,
    category: "시뮬레이션",
    summary: "산모와 신생아를 위한 모성간호 시나리오를 실습하는 시뮬레이션 공간입니다.",
    facts: [],
    photos: [aiPhoto("maternal-sim-1.jpg", "모성건강시뮬레이션룸 — 임산부 환자 시뮬레이터와 병상, 신생아 침대")],
  },
  {
    id: "debrief-4",
    name: "디브리핑룸 3",
    label: "디브리핑룸 3",
    x: 346, y: 497, w: 144, h: 228,
    category: "교육실",
    summary: "시뮬레이션 실습 후 학습자가 함께 모여 성찰하고 피드백을 나누는 소규모 디브리핑룸입니다.",
    seats: 16,
    facts: ["좌석 16석", "유리 칠판 설치"],
    photos: [debriefFront],
  },
  {
    id: "debrief-5",
    name: "디브리핑룸 4",
    label: "디브리핑룸 4",
    x: 490, y: 497, w: 288, h: 228,
    category: "교육실",
    summary: "시뮬레이션 실습 후 학습자가 함께 모여 성찰하고 피드백을 나누는 중규모 디브리핑룸입니다.",
    seats: 20,
    facts: ["좌석 20석", "유리 칠판 설치"],
    photos: [
      { src: "/images/rooms/debrief-room-4.jpg", caption: "디브리핑룸 4 — 학생들이 둘러앉아 디브리핑하는 장면 (가상 이미지, 실제 모습과 다를 수 있음)", width: 1165, height: 645 },
    ],
  },
  {
    id: "ward",
    name: "다목적 시뮬레이션룸",
    label: "다목적 시뮬레이션",
    x: 778, y: 497, w: 407, h: 228,
    dashedEdges: ["right"], // 디브리핑룸 2와의 경계는 점선
    category: "시뮬레이션",
    summary:
      "병상 3개와 천장 커튼 레일을 갖춘 다목적 시뮬레이션룸입니다. 병동 환경을 비롯한 다양한 시나리오를 실습합니다. 투명 유리 벽으로 복도에서도 실습 장면을 볼 수 있습니다. 오른쪽은 디브리핑룸 2와 구역이 나뉩니다.",
    facts: ["병상 3개", "싱크대 설치", "천장 커튼 레일"],
    photos: [
      { src: "/images/rooms/ward-1.jpg", caption: "다목적 시뮬레이션룸 — 병상과 천장 커튼 레일" },
      { src: "/images/rooms/ward-2.jpg", caption: "다목적 시뮬레이션룸 — 3D 제안 렌더" },
      { src: "/images/rooms/ward-3.jpg", caption: "다목적 시뮬레이션룸 — 3D 제안 렌더" },
    ],
  },
  {
    id: "debrief-2",
    name: "디브리핑룸 2",
    label: "디브리핑룸 2",
    x: 1185, y: 497, w: 315, h: 228,
    hiddenEdges: ["left"], // 다목적 시뮬레이션룸 쪽에서 점선으로 그림
    category: "교육실",
    summary: "다목적 시뮬레이션룸 오른쪽에 구역을 나눈 디브리핑룸입니다. 시뮬레이션 직후 이어서 성찰과 피드백을 진행합니다.",
    seats: 25,
    facts: ["좌석 25석", "유리 칠판 설치"],
    photos: [
      { src: "/images/rooms/debrief-room-2.jpg", caption: "디브리핑룸 2 — 공간 이미지 (실제 시공 모습과 다를 수 있음)", width: 1132, height: 655 },
    ],
  },
  {
    id: "storage-1",
    name: "조정실",
    label: "조정실",
    x: 1500, y: 497, w: 78, h: 185,
    category: "지원공간",
    summary: "시뮬레이션 운영을 위한 조정실입니다.",
    facts: [],
    photos: [],
  },
  {
    id: "prism",
    name: "Immersive Room (PRISM)",
    label: "Immersive Room\n(PRISM)",
    x: 1578, y: 497, w: 212, h: 185,
    category: "시뮬레이션",
    summary:
      "천장 프로젝터로 벽면 전체에 병동·현장 영상을 투사하는 Immersive 시뮬레이션 공간입니다. 교통사고·낙상 같은 외상 상황을 실제와 가깝게 재현해 팀 기반 대응 훈련에 활용할 계획입니다.",
    facts: ["규모 3,900 × 4,000mm", "히든도어 설치"],
    photos: [
      {
        src: "/images/rooms/prism-1.png",
        caption: "Immersive 룸 활용 예시 — 구급차 내부 영상을 투사한 외상 응급 대응 훈련 (메드닉스 참고 이미지)",
        width: 486,
        height: 393,
        compact: true,
      },
    ],
  },
  {
    id: "debrief-1",
    name: "디브리핑룸 1",
    label: "디브리핑룸 1",
    x: 1500, y: 682, w: 290, h: 270,
    category: "교육실",
    summary: "센터에서 가장 큰 디브리핑룸으로, 여러 팀이 함께 실습 영상을 보고 성찰과 피드백을 나눕니다.",
    seats: 27,
    facts: ["좌석 27석", "유리 칠판 설치", "양문 출입문"],
    photos: [
      { src: "/images/rooms/large-seminar-1.jpg", caption: "디브리핑룸 1 앞 — 출입문과 안내 사이니지 (3D 제안 렌더, 이미지 속 표기는 '대형세미나실')" },
      { src: "/images/rooms/large-seminar-2.jpg", caption: "디브리핑룸 1 — 3D 제안 렌더 (이미지 속 표기는 '대형 세미나실')" },
      aiPhoto("seminar-debrief.jpg", "디브리핑룸 1 — 현장 공간을 바탕으로 그린 디브리핑 장면"),
    ],
  },
  {
    id: "storage-2",
    name: "창고 2",
    label: "창고 2",
    x: 1500, y: 952, w: 290, h: 63,
    category: "지원공간",
    summary: "실습 물품과 장비를 보관하는 창고입니다.",
    facts: ["기존 분전함 위치"],
    photos: [],
  },
  {
    id: "debrief-6",
    name: "디브리핑룸 5",
    label: "디브리핑룸 5",
    x: 490, y: 725, w: 180, h: 290,
    category: "교육실",
    summary: "시뮬레이션 실습 후 학습자가 함께 모여 성찰하고 피드백을 나누는 소규모 디브리핑룸입니다.",
    seats: 16,
    facts: ["좌석 16석", "유리 칠판 설치"],
    photos: [
      { src: "/images/rooms/debrief-room-5.jpg", caption: "디브리핑룸 5 — 네모난 테이블과 의자가 놓인 공간 (실제 시공 모습과 다를 수 있음)", width: 1150, height: 654 },
    ],
  },
  {
    id: "corridor-2",
    name: "복도 2",
    label: "복도 2",
    x: 346, y: 725, w: 144, h: 290,
    category: "지원공간",
    summary: "디브리핑룸 5 옆에서 디브리핑룸 3과 왼쪽 시뮬레이션 공간을 잇는 복도입니다.",
    facts: ["싱크대 설치"],
    photos: [],
  },
  {
    id: "corridor-1",
    name: "복도 1",
    label: "복도 1",
    x: 670, y: 725, w: 830, h: 290,
    category: "지원공간",
    summary: "다목적 시뮬레이션룸 앞에서 리빙랩·외상응급 시뮬레이션룸·조정실·스테이션으로 이어지는 중앙 복도입니다. 양개형 유리 자동문으로 다목적 시뮬레이션룸과 연결됩니다.",
    facts: ["양개형 유리 자동문", "금속 보드 칠판 설치"],
    photos: [{ src: "/images/rooms/corridor-1.jpg", caption: "중앙 복도 — 유리 벽 너머로 다목적 시뮬레이션룸이 보입니다" }],
  },
  {
    id: "living-lab",
    name: "리빙랩 (Living Lab)",
    label: "리빙랩",
    x: 763, y: 795, w: 120, h: 220,
    dashedEdges: ["right"], // 조정실 1과의 경계는 점선
    category: "시뮬레이션",
    summary:
      "가정집 환경을 재현한 공간입니다. 표준화환자와 간호학생이 집 안에서 서로 이야기하며 상담하고, 외상 예방과 생활환경 위험요인 관리를 연습합니다. 조정실 1에서 유리 창으로 관찰합니다.",
    facts: ["가정집 환경 구현", "표준화환자 시뮬레이션", "바닥 +300mm (단차)", "세면대 설치"],
    photos: [
      { src: "/images/rooms/living-lab-1.jpg", caption: "리빙랩 — 현장 공간(한 단 높은 원목 바닥)을 바탕으로 가정집 거실에서 표준화환자와 간호학생이 이야기하는 모습 (AI 생성 가상 이미지, 실제 모습과 다를 수 있음)", width: 1920, height: 1080 },
    ],
  },
  {
    id: "control-1",
    name: "조정실 1",
    label: "조정실 1",
    x: 883, y: 795, w: 74, h: 220,
    hiddenEdges: ["left"], // 리빙랩 쪽에서 점선으로 그림
    category: "지원공간",
    summary: "교수·오퍼레이터가 시뮬레이터를 조작하고 실습 장면을 관찰하는 조정실입니다.",
    facts: ["관찰 창 설치"],
    photos: [], // 자기 사진은 없고, 아래 SHARE_PHOTOS_WITH 에 따라 리빙랩 사진을 함께 보여준다
  },
  {
    id: "trauma-sim",
    name: "외상응급 시뮬레이션룸",
    label: "외상응급 시뮬레이션",
    x: 957, y: 795, w: 215, h: 220,
    category: "시뮬레이션",
    summary:
      "고충실도 성인 환자 시뮬레이터를 갖춘 외상응급 시뮬레이션 공간입니다. 외상환자 초기 사정, 응급상황 대응, 의사소통을 실제 임상 상황처럼 통합적으로 훈련합니다.",
    facts: ["고충실도 시뮬레이션", "병상 1개", "세면대 설치"],
    photos: [
            aiPhoto("trauma-scenario.jpg", "외상응급 시뮬레이션룸 — 현장 공간에서 고충실도 환자 시뮬레이터로 외상 시나리오를 실습하는 모습"),
      { src: "/images/rooms/signage-1.jpg", caption: "출입구 — 유리 자동문과 안내 사이니지 (3D 제안 렌더, 사이니지 표기는 '시뮬실01')" },
    ],
  },
  {
    id: "control-2",
    name: "조정실 2",
    label: "조정실 2",
    x: 1172, y: 795, w: 78, h: 220,
    category: "지원공간",
    summary: "시뮬레이션 운영을 위한 조정실입니다.",
    facts: [],
    photos: [],
  },
  {
    id: "station",
    name: "스테이션",
    label: "스테이션",
    x: 1250, y: 795, w: 110, h: 220,
    category: "지원공간",
    summary: "센터 출입구에서 가장 먼저 만나는 안내 데스크와 수납 공간입니다. 입구 쪽에서 디브리핑룸 1과 다목적 시뮬레이션룸이 한눈에 보입니다.",
    facts: ["출입구 안내 데스크", "오픈 수납장", "게시판"],
    photos: [
      { src: "/images/rooms/station-1.jpg", caption: "출입구 스테이션" },
      { src: "/images/rooms/station-2.jpg", caption: "출입구 스테이션 — 3D 제안 렌더" },
      { src: "/images/rooms/entrance-sign-1.jpg", caption: "출입구 사이니지" },
      { src: "/images/rooms/entrance-sign-2.jpg", caption: "출입구 사이니지" },
    ],
  },
];

// 다른 방의 사진을 함께 보여주는 방: 조정실 1은 리빙랩과 붙어 있어 같은 사진을 보여준다.
const SHARE_PHOTOS_WITH: Record<string, string> = { "control-1": "living-lab" };

const ROOMS_WITH_PHOTOS: Room[] = BASE_ROOMS.map((r) => ({ ...r, photos: [...(SITE[r.id] ?? []), ...r.photos] }));

export const ROOMS: Room[] = ROOMS_WITH_PHOTOS.map((r) => {
  const from = SHARE_PHOTOS_WITH[r.id];
  const source = from ? ROOMS_WITH_PHOTOS.find((x) => x.id === from) : undefined;
  return source ? { ...r, photos: source.photos } : r;
});

export function getRoom(id: string) {
  return ROOMS.find((r) => r.id === id);
}

export const CENTER = {
  name: "단국대학교 간호시뮬레이션센터",
  english: "D-PULSE Center",
  college: "단국대학교 간호대학",
  campus: "천안캠퍼스",
  address: "충남 천안시 동남구 단대로 119",
  building: "의학관 2층",
  area: "약 380㎡ (약 115평)",
  // 사업계획서 5쪽 '시설 개수' 표: 시뮬레이션 룸 3→5개, 디브리핑 룸 3→5개 (조정실·사무실·복도는 별도)
  simRooms: 5,
  debriefRooms: 5,
  seats: 104,
  faculty: 14,
  dedicatedFaculty: 13,
};
