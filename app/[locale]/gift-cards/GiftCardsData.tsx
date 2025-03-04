import { cookies } from "next/headers";
import { SearchParams } from "../user-roles/page";
import { GiftCard } from "@/redux/reducers/giftCardsReducers";
import GiftCards from "@/components/gift-cards/GiftCards";

interface GiftCardsApiResponse {
  gifts: GiftCard[];
  totalCount: number;
  totalPages: number;
}

const fetchGiftCards = async (
  searchParams: SearchParams
): Promise<{ data: GiftCardsApiResponse | null; error: string | null }> => {
  try {
    const token = cookies().get("token")?.value;
    if (!token) return { data: null, error: "No token provided" };

    const queryParams = new URLSearchParams({
      limit: searchParams.limit?.toString() ?? "10",
      sort: searchParams.sort?.toString() ?? "-createdAt",
      fields:
        "id,userFrom=fullname-phone,userTo=fullname,point,paymentamount,expird,createdAt,validTo,message,name,email",
      items: "name,phone,email,message",
    });

    if (searchParams.keyword)
      queryParams.append("keyword", searchParams.keyword.toString());
    if (searchParams.skip)
      queryParams.append("skip", searchParams.skip.toString());
    if (searchParams.items)
      queryParams.append("items", searchParams.items.toString());

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/gift?${queryParams}`,
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

const GiftCardsData = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  const { data, error } = await fetchGiftCards(searchParams);

  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!data) return <div className="text-red-500">no data</div>;
  console.log("data", data);

  return (
    <GiftCards
      giftCards={data.gifts}
      count={data.totalCount}
      totalPages={data.totalPages}
    />
  );
};

export default GiftCardsData;
