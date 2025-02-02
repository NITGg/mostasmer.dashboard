import GiftCards from "@/components/gift-cards/GiftCards";
import { LoadingIcon } from "@/components/icons";
import { cookies } from "next/headers";
import React from "react";

const Page = async ({ searchParams }: { searchParams: any }) => {
  const token = cookies().get("token")?.value;
  let loading = false;

  const fetchDashboard = async (token: string) => {
    try {
      const queryParams = new URLSearchParams({
        limit: searchParams.limit ?? "10",
        // items: "type",
      });
      if (searchParams.type) {
        queryParams.append("type", searchParams.type);
      }

      if (searchParams.skip) queryParams.append("skip", searchParams.skip);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL
        }/api/gift?${queryParams.toString()}`,
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
        <GiftCards
          loading={loading}
          giftCards={data.gifts}
          count={data.count}
        />
      )}
    </div>
  );
};

export default Page;
