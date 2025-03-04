import { Suspense } from "react";
import { SearchParams } from "../../user-roles/page";
import UserData from "./UserData";
import LoadingTable from "@/components/ui/LoadingTable";
import UserTabsSection from "@/components/users/id/UserTabsSection";
import UserOrdersData from "./UserOrdersData";
import UserNotificationsData from "./UserNotificationsData";

const Page = async ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: SearchParams;
}) => {
  const key = JSON.stringify(searchParams);

  return (
    <div className="p-container space-y-10 pb-4">
      <Suspense fallback={<LoadingTable />}>
        <UserData params={params} />
      </Suspense>
      <UserTabsSection>
        <Suspense key={key} fallback={<LoadingTable />}>
          <UserOrdersData params={params} searchParams={searchParams} />
        </Suspense>
        <Suspense key={key} fallback={<LoadingTable />}>
          <UserNotificationsData params={params} searchParams={searchParams} />
        </Suspense>
      </UserTabsSection>
    </div>
  );
};

export default Page;
