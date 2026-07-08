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
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cosa stai cercando?"
        className="w-full rounded-full border border-ink/20 bg-white py-2.5 pl-5 pr-12 text-[15px] text-ink transition placeholder:text-ash focus:border-ink focus:outline-none focus:ring-2 focus:ring-cobalt/25"
        aria-label="Cerca annunci"
      />
      <button
        type="submit"
        className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-ink text-paper transition hover:bg-swiss active:scale-95"
        aria-label="Cerca"
      >
        <SearchIcon className="h-4 w-4" />
      </button>
    </form>
  );
}

export default function SearchBar() {
  return (
    <Suspense fallback={<div className="h-11 w-full rounded-full bg-smoke" />}>
      <SearchBarInner />
    </Suspense>
  );
}
