import { Suspense } from "react";
import { SearchParams } from "../user-roles/page";
import LoadingTable from "@/components/ui/LoadingTable";
import GiftCardsData from "./GiftCardsData";

const Page = async ({ searchParams }: { searchParams: SearchParams }) => {
  const key = JSON.stringify(searchParams);

  return (
    <div className="p-container space-y-10 pb-5">
      <Suspense key={key} fallback={<LoadingTable />}>
        <GiftCardsData searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default Page;
