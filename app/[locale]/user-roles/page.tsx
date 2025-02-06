import { LoadingIcon } from "@/components/icons";
import { cookies } from "next/headers";
import React from "react";
import UserRoles from "@/components/user-roles/UserRoles";

const Page = async ({ searchParams }: { searchParams: any }) => {
  const token = cookies().get("token")?.value;
  let loading: boolean = false;

  const fetchDashboard = async (token: string) => {
    try {
      loading = true;
      const queryParams = new URLSearchParams({
        limit: searchParams.limit ?? "10",
      });

      if (searchParams.keyword) {
        queryParams.append("keyword", searchParams.keyword);
        queryParams.append("sort", "name");
      }

      if (searchParams.skip) queryParams.append("skip", searchParams.skip);

      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/roles`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        return { data: null, error: await res.text() };
      }
      const data = await res.json();

      return { data: data, error: null };
    } catch (error: any) {
      console.log(error.message);
      return { data: null, error: error?.message };
    } finally {
      loading = false;
    }
  };
  const { data, error } = await fetchDashboard(token as string);

  return (
    <div className="p-container space-y-10">
      {loading && <LoadingIcon />}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && data && (
        <UserRoles
          userRoles={data.roles}
          count={data.totalRoles}
          loading={loading}
        />
      )}
    </div>
  );
};

export default Page;
