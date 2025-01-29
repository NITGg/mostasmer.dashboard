import UserTypes from "@/components/user-types/UserTypes";
import { cookies } from "next/headers";
import React from "react";

const Page = async ({ searchParams }: { searchParams: any }) => {
  const token = cookies().get("token")?.value;
  let loading: boolean = false;

  const fetchDashboard = async (token: string) => {
    try {
      loading = true;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user-types`,
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
      {!error && (
        <UserTypes
          loading={loading}
          userTypes={data?.data}
          count={data?.data.length}
        />
      )}
    </div>
  );
};

export default Page;
