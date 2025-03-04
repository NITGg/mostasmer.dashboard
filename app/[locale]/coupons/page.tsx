import React, { Suspense } from "react";
import LoadingTable from "@/components/ui/LoadingTable";
import { SearchParams } from "../user-roles/page";
import CouponsData from "./CouponsData";

const page = async ({ searchParams }: { searchParams: SearchParams }) => {
  const key = JSON.stringify(searchParams);

  return (
    <div className="p-container space-y-10 pb-5">
      <Suspense key={key} fallback={<LoadingTable />}>
        <CouponsData searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default page;
