"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { SearchIcon } from "@/components/icons";

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
    <form onSubmit={onSubmit} className="group relative flex w-full" role="search">
      <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-stone-400 transition group-focus-within:text-emerald-600" />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cosa stai cercando?"
        className="w-full rounded-full border border-stone-200 bg-stone-50 py-2.5 pl-11 pr-24 text-sm shadow-inner transition placeholder:text-stone-400 focus:border-emerald-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
        aria-label="Cerca annunci"
      />
      <button
        type="submit"
        className="absolute right-1.5 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-gradient-to-b from-emerald-500 to-emerald-600 px-4 py-1.5 text-sm font-bold text-white shadow transition hover:from-emerald-600 hover:to-emerald-700 active:scale-95"
        aria-label="Cerca"
      >
        Cerca
      </button>
    </form>
  );
}

export default function SearchBar() {
  return (
    <Suspense fallback={<div className="h-11 w-full rounded-full bg-stone-100" />}>
      <SearchBarInner />
    </Suspense>
  );
}
