import { Suspense } from "react";
import UsersData from "./UsersData";
import LoadingTable from "@/components/ui/LoadingTable";

const Users = ({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) => {
  const key = JSON.stringify(searchParams);
  return (
    <div className="p-container space-y-10">
      <Suspense key={key} fallback={<LoadingTable />}>
        <UsersData searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default Users;
