import { LoadingIcon } from "@/components/icons";
import UsersRows from "@/components/users/UsersRows";
import { cookies } from "next/headers";
import React from "react";

const Users = async ({ searchParams }: { searchParams: any }) => {
  const token = cookies().get("token")?.value;
  let loading = false;

  const fetchDashboard = async (token: string) => {
    try {
      loading = true;
      const queryParams = new URLSearchParams({
        fields: "id,fullname,phone,imageUrl,email",
        limit: searchParams.limit ?? "10",
        items: "fullname,phone,email",
        isDeleted: "false",
      });
      if (searchParams.keyword) {
        queryParams.append("keyword", searchParams.keyword);
        queryParams.append("sort", "-fullname");
      }

      if (searchParams.skip) queryParams.append("skip", searchParams.skip);
      if (searchParams.items) queryParams.append("items", searchParams.items);

      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_BASE_URL
        }/api/user?${queryParams.toString()}`,
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
        <UsersRows loading={loading} users={data?.users} count={data?.count} />
      )}
    </div>
  );
};

export default Users;
