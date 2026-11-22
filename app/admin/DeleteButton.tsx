"use client";

import { removeApplication } from "./actions";

export default function DeleteButton({ id, name }: { id: string; name: string }) {
  return (
    <form action={removeApplication}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        onClick={(e) => {
          if (!confirm(`'${name}' 님의 신청을 삭제할까요?\n삭제하면 되돌릴 수 없습니다.`)) e.preventDefault();
        }}
        className="whitespace-nowrap rounded-md border border-red-200 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
      >
        삭제
      </button>
    </form>
  );
}
