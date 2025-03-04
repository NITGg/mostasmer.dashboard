import { Suspense } from "react";
import BrandsData from "./BrandsData";
import LoadingTable from "@/components/ui/LoadingTable";

const BrandsPage = ({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) => {
  const key = JSON.stringify(searchParams);

  return (
    <div className="p-container space-y-6">
      <Suspense key={key} fallback={<LoadingTable />}>
        <BrandsData searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default BrandsPage;
