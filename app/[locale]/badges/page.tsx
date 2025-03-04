import { Suspense } from "react";
import BadgesData from "./BadgesData";
import { SearchParams } from "../user-roles/page";
import LoadingTable from "@/components/ui/LoadingTable";

const Badges = ({ searchParams }: { searchParams: SearchParams }) => {
  const key = JSON.stringify(searchParams);
  return (
    <div className="p-container space-y-10">
      <Suspense key={key} fallback={<LoadingTable />}>
        <BadgesData searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default Badges;
