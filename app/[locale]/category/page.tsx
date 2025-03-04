import React, { Suspense } from "react";
import { SearchParams } from "../user-roles/page";
import CategoryData from "./categoryData";
import LoadingTable from "@/components/ui/LoadingTable";

const page = async ({
  searchParams,
  params: { locale },
}: {
  searchParams: SearchParams;
  params: { locale: string };
}) => {
  return (
    <div>
      <Suspense fallback={<LoadingTable />}>
        <CategoryData locale={locale} searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default page;
