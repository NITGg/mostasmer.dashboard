import { cookies } from "next/headers";
import { SearchParams } from "../user-roles/page";
import { Coupon } from "@/types/coupon";
import Coupons from "@/components/coupons/Coupons";

interface CouponsApiResponse {
  coupons: Coupon[];
  totalCount: number;
  totalPages: number;
}

const fetchCoupons = async (
  searchParams: SearchParams
): Promise<{ data: CouponsApiResponse | null; error: string | null }> => {
  try {
    const token = cookies().get("token")?.value;
    if (!token) return { data: null, error: "No token provided" };

    const queryParams = new URLSearchParams({
      limit: searchParams.limit?.toString() ?? "10",
      items: "description",
      sort: searchParams.sort?.toString() ?? "-createdAt",
    });

    if (searchParams.keyword)
      queryParams.append("keyword", searchParams.keyword.toString());
    if (searchParams.skip)
      queryParams.append("skip", searchParams.skip.toString());
    if (searchParams.items)
      queryParams.append("items", searchParams.items.toString());

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/coupons?${queryParams}`,
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

const CouponsData = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  const { data, error } = await fetchCoupons(searchParams);

  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!data) return <div className="text-red-500">no data</div>;

  return (
    <Coupons
      coupons={data.coupons}
      count={data.totalCount}
      totalPages={data.totalPages}
    />
  );
};

export default CouponsData;
