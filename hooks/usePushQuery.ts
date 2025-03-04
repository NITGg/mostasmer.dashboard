"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const usePushQuery = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pushQuery = (key: string, term: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (term) {
      params.set(key, term);
    } else {
      params.delete(key);
    }

    if (key === "limit" || key === "keyword" || key === "sort") {
      params.set("skip", "0");
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  return pushQuery;
};

export default usePushQuery;
