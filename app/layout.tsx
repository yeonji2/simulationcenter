import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "단국대학교 간호시뮬레이션센터",
  description:
    "단국대학교 간호대학 간호시뮬레이션센터(D-PULSE Center) 소개와 센터 지도, 실별 사진을 안내합니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full bg-white font-sans text-slate-900">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
            <Link href="/" className="text-base font-bold tracking-tight text-[#0b3a75]">
              단국대학교 간호시뮬레이션센터
            </Link>
            <nav className="flex gap-1 text-sm font-medium">
              <Link href="/" className="rounded-md px-3 py-2 text-slate-700 hover:bg-slate-100">
                센터 소개
              </Link>
              <Link href="/map" className="rounded-md px-3 py-2 text-slate-700 hover:bg-slate-100">
                센터 지도
              </Link>
              <Link href="/apply" className="rounded-md px-3 py-2 text-slate-700 hover:bg-slate-100">
                교육신청
              </Link>            </nav>
          </div>
        </header>
        {children}
        <footer className="mt-20 border-t border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-6xl px-5 py-8 text-sm leading-6 text-slate-500">
            <p className="font-semibold text-slate-700">단국대학교 간호대학 간호시뮬레이션센터 (D-PULSE Center)</p>
            <p>충남 천안시 동남구 단대로 119 단국대학교 천안캠퍼스 의학관 2층</p>
            <p className="mt-2">
              본 페이지의 공간·사진은 실시설계 도면과 3D 제안 이미지를 바탕으로 하며, 시공 과정에서 달라질 수 있습니다.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
