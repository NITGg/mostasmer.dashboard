import Brands, { Brand } from "@/components/brands/Brands";

interface BrandApiResponse {
  brands: Brand[];
  totalCount: number;
  totalPages: number;
}

const fetchBrands = async (
  searchParams: Record<string, string | string[] | undefined>
): Promise<{
  data: BrandApiResponse | null;
  error: string | null;
}> => {
  try {
    const queryParams = new URLSearchParams({
      items: "name,email",
      limit: searchParams.limit?.toString() ?? "10",
      sort: searchParams.sort?.toString() ?? "-createdAt",
    });

    if (searchParams.skip)
      queryParams.append("skip", searchParams.skip.toString());
    if (searchParams.keyword)
      queryParams.append("keyword", searchParams.keyword.toString());

    if (searchParams.ids) {
      queryParams.append("ids", searchParams.ids.toString());
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand?${queryParams.toString()}`,
      {
        method: "GET",
        credentials: "include",
        cache: "no-cache",
      }
    );

    if (!res.ok) {
      return { data: null, error: await res.text() };
    }
    const data = await res.json();
    return { data, error: null };
  } catch (error: any) {
    console.error("Fetch error:", error);
    return { data: null, error: error?.message };
  }
};

const BrandsData = async ({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) => {
  const { data, error } = await fetchBrands(searchParams);

  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!data) return <div className="text-red-500">no data</div>;
  return (
    <Brands
      brands={data.brands}
      count={data.totalCount}
      totalPages={data.totalPages}
    />
  );
};

export default BrandsData;
