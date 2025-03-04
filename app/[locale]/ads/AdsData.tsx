import { cookies } from "next/headers";
import { SearchParams } from "../user-roles/page";
import { Ad } from "@/redux/reducers/adsReducer";
import AdsList from "@/components/ads/AdsList";

interface BadgeApiResponse {
  ads: Ad[];
  totalCount: number;
  totalPages: number;
}

const fetchAds = async (
  searchParams: SearchParams
): Promise<{ data: BadgeApiResponse | null; error: string | null }> => {
  try {
    const token = cookies().get("token")?.value;
    if (!token) return { data: null, error: "No token provided" };

    const queryParams = new URLSearchParams({
      limit: searchParams.limit?.toString() ?? "10",
      items: "title,adType",
      sort: searchParams.sort?.toString() ?? "",
    });

    if (searchParams.keyword)
      queryParams.append("keyword", searchParams.keyword.toString());
    if (searchParams.skip)
      queryParams.append("skip", searchParams.skip.toString());
    if (searchParams.items)
      queryParams.append("items", searchParams.items.toString());

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/ads?${queryParams}`,
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
    return { data, error: null };
  } catch (error: any) {
    console.log(error.message);
    return { data: null, error: error?.message };
  }
};

const AdsData = async ({ searchParams }: { searchParams: SearchParams }) => {
  const { data, error } = await fetchAds(searchParams);

  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!data) return <div className="text-red-500">no data</div>;

  return (
    <AdsList
      ads={data.ads}
      count={data.totalCount}
      totalPages={data.totalPages}
    />
  );
};

export default AdsData;
