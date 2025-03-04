"use client";
import usePushQuery from "@/hooks/usePushQuery";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { SearchIcon } from "./icons";
import { useTranslations } from "next-intl";

export default function SearchBar() {
  const t = useTranslations("navbar");
  const searchParams = useSearchParams();
  const pushQuery = usePushQuery();

  const [search, setSearch] = useState(searchParams.get("keyword") ?? "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    pushQuery("keyword", search);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center relative border focus-within:outline p-2 w-80 rounded-lg bg-white shadow-[0px_0px_5px_-1px_#00000026]"
    >
      <input
        type="text"
        placeholder={t("search")}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="size-full outline-none bg-transparent text-black pl-9"
      />
      <button
        type="submit"
        className=" text-black absolute left-0 bg-white h-full p-[10px] rounded-lg shadow-[0px_0px_5px_0px_#00000026]"
      >
        <SearchIcon className="size-4" />
      </button>
    </form>
  );
}
