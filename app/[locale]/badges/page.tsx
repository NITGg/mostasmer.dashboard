import Badges from "@/components/badges/Badges";
import { cookies } from "next/headers";
import React from "react";

const Page = async ({ searchParams }: { searchParams: any }) => {
  const token = cookies().get("token")?.value;
  let loading: boolean = false;

  const fetchDashboard = async (token: string) => {
    try {
      loading = true;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/badges`,
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
    <div className="p-container space-y-10 py-3">
      {error && <p>{error}</p>}
      {!error && (
        <Badges
          loading={loading}
          badges={data?.badges}
          count={data?.badges.length}
        />
      )}
    </div>
  );
};

export default Page;
