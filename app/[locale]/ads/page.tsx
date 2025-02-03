import AdsHeader from "@/components/ads/AdsHeader";
import { LoadingIcon } from "@/components/icons";
import React from "react";

const page = async ({ searchParams }: { searchParams: any }) => {
  let loading = false;

  const fetchDashboard = async () => {
    try {
      loading = true;
      const queryParams = new URLSearchParams({
        limit: searchParams.limit ?? "10",
        items: "title,description",
      });
      if (searchParams.keyword) {
        queryParams.append("keyword", searchParams.keyword);
        queryParams.append("sort", "-title");
      }

      if (searchParams.skip) queryParams.append("skip", searchParams.skip);
      if (searchParams.items) queryParams.append("items", searchParams.items);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/ads?${queryParams.toString()}`,
        {
          method: "GET",
          credentials: "include",
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
  const { data, error } = await fetchDashboard();
  return (
    <div className="p-container space-y-10 pb-5">
      {loading && <LoadingIcon />}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && data && (
        <AdsHeader data={data?.ads} count={data?.count} />
      )}
    </div>
  );
};

export default page;
