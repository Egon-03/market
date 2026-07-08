"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function SearchBarInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    router.push(`/annunci?${params.toString()}`);
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full" role="search">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cosa stai cercando?"
        className="w-full rounded-l-lg border border-r-0 border-gray-300 px-4 py-2 text-sm outline-none focus:border-emerald-500"
        aria-label="Cerca annunci"
      />
      <button
        type="submit"
        className="rounded-r-lg bg-emerald-600 px-4 text-white transition hover:bg-emerald-700"
        aria-label="Cerca"
      >
        🔍
      </button>
    </form>
  );
}

export default function SearchBar() {
  return (
    <Suspense fallback={<div className="h-9 w-full rounded-lg bg-gray-100" />}>
      <SearchBarInner />
    </Suspense>
  );
}
