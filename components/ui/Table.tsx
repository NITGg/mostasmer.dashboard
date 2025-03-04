"use client";
import { useTranslations } from "next-intl";
import React from "react";
import clsx from "clsx";
import { ArrowDown, ArrowUp } from "lucide-react";
import usePushQuery from "@/hooks/usePushQuery";
import { useSearchParams } from "next/navigation";

export interface TableHeader {
  name: string;
  className?: string;
  key?: string;
  label?: string;
  exclude?: boolean;
  sortable?: boolean;
}

interface TableProps {
  headers: TableHeader[];
  bgColor?: boolean;
  children: React.ReactNode;
  pagination: React.ReactNode;
}

const Table = ({ headers, children, pagination, bgColor }: TableProps) => {
  const t = useTranslations("Tablecomponent");
  const pushQuery = usePushQuery();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") ?? "";
  const currentOrder = currentSort.startsWith("-") ? "desc" : "asc";
  const currentSortField = currentSort.replace("-", "");

  const handleSort = (key: string) => {
    if (!key) return;

    if (currentSortField === key) {
      if (currentOrder === "asc") {
        pushQuery("sort", `-${key}`);
      } else {
        pushQuery("sort", "");
      }
    } else {
      pushQuery("sort", key);
    }
  };

  return (
    <div className="w-full mx-auto">
      <div
        className={clsx(
          "rounded-t-3xl overflow-auto h-[65dvh] lg:h-[500px]",
          "border border-gray-200 bg-white sidebar-scrolling"
        )}
      >
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead
            className={clsx(
              "text-xs uppercase sticky top-0 z-50 text-white bg-[#02161e]",
              bgColor && "!text-[#02161e] bg-[#dfe2e8]"
            )}
          >
            <tr>
              {headers.map(({ name, className, key, sortable }) => (
                <th
                  key={name}
                  scope="col"
                  className={clsx(
                    "px-6 py-4 whitespace-nowrap select-none font-bold",
                    className,
                    sortable &&
                      "cursor-pointer hover:opacity-80 transition-opacity"
                  )}
                  onClick={() => sortable && key && handleSort(key)}
                >
                  <div className="flex items-center gap-1">
                    {t(name)}
                    {sortable && key && (
                      <div className="flex flex-col">
                        <ArrowUp
                          className={clsx(
                            "size-[10px] transition",
                            currentSortField === key && currentOrder === "asc"
                              ? "text-primary font-bold"
                              : "text-gray-400"
                          )}
                        />
                        <ArrowDown
                          className={clsx(
                            "size-[10px] transition",
                            currentSortField === key && currentOrder === "desc"
                              ? "text-primary font-bold"
                              : "text-gray-400"
                          )}
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">{children}</tbody>
        </table>
      </div>

      {pagination}
    </div>
  );
};

export default Table;
