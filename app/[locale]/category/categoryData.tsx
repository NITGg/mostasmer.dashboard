import { Brand } from "@/components/brands/Brands";
import { SearchParams } from "../user-roles/page";
import { BrandOffer } from "@/components/brands/offers/BrandOffers";
import Categories from "@/components/category/Categories";

export interface Category {
  id: number;
  name: string;
  imageUrl?: string;
  parentId?: number;
  brands?: Brand[];
  brandOffers?: BrandOffer[];
  parent?: Category;
  subcategories?: Category[];
}

interface CategoryApiResponse {
  categories: Category[];
  totalCount: number;
  totalPages: number;
}

const fetchBrands = async (
  searchParams: SearchParams,
  locale: string
): Promise<{
  data: CategoryApiResponse | null;
  error: string | null;
}> => {
  try {
    const queryParams = new URLSearchParams({
      limit: searchParams.limit?.toString() ?? "10",
      sort: searchParams.sort?.toString() ?? "",
      lang: locale,
    });

    if (searchParams.skip)
      queryParams.append("skip", searchParams.skip.toString());
    if (searchParams.keyword)
      queryParams.append("keyword", searchParams.keyword.toString());

    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL
      }/api/category?${queryParams.toString()}`,
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

const CategoryData = async ({
  searchParams,
  locale,
}: {
  searchParams: SearchParams;
  locale: string;
}) => {
  const { data, error } = await fetchBrands(searchParams, locale);

  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!data) return <div className="text-red-500">no data</div>;
  return (
    <Categories
      categories={data.categories}
      count={data.totalCount}
      totalPages={data.totalPages}
    />
  );
};

export default CategoryData;
