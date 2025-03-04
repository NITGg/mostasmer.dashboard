import { cookies } from "next/headers";
import React, { Suspense } from "react";
import UserRoles from "@/components/user-roles/UserRoles";
import { UserRole } from "@/redux/reducers/userRolesReducer";
import LoadingTable from "@/components/ui/LoadingTable";

interface RoleApiResponse {
  roles: UserRole[];
  totalRoles: number;
  totalPages: number;
}
export type SearchParams = Record<string, string | string[] | undefined>;

const fetchRoles = async (
  searchParams: SearchParams
): Promise<{ data: RoleApiResponse | null; error: string | null }> => {
  const token = cookies().get("token")?.value;
  try {
    const queryParams = new URLSearchParams({
      limit: searchParams.limit?.toString() ?? "10",
      items: "name",
      sort: searchParams.sort?.toString() ?? "",
    });

    if (searchParams.keyword)
      queryParams.append("keyword", searchParams.keyword.toString());

    if (searchParams.skip)
      queryParams.append("skip", searchParams.skip.toString());

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/roles?${queryParams}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      return { data: null, error: await res.text() };
    }
    const data = await res.json();

    return { data: data, error: null };
  } catch (error: any) {
    console.log(error.message);
    return { data: null, error: error?.message };
  }
};

const RolesData = async ({ searchParams }: { searchParams: SearchParams }) => {
  const { data, error } = await fetchRoles(searchParams);

  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!data) return <div className="text-red-500">no data</div>;

  return (
    <UserRoles
      userRoles={data.roles}
      count={data.totalRoles}
      totalPages={data.totalPages}
    />
  );
};
const Page = async ({ searchParams }: { searchParams: SearchParams }) => {
  const key = JSON.stringify(searchParams);

  return (
    <div className="p-container space-y-10">
      <Suspense key={key} fallback={<LoadingTable />}>
        <RolesData searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default Page;
