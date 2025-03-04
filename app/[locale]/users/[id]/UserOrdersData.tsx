import UserOrders from "@/components/users/id/userOrders/UserOrders";
import { SearchParams } from "../../user-roles/page";
import { cookies } from "next/headers";

export interface UserOrder {
  id: number;
  brandId: number;
  userId: number;
  brand: { name: string };
  user: { fullname: string };
  totalPrice: number;
  createdAt: string;
}

interface UserOrdersApiResponse {
  userOrders: UserOrder[];
  totalUserOrder: number;
  totalPages: number;
}

const fetchUserOrders = async ({
  searchParams,
  userId,
}: {
  searchParams: SearchParams;
  userId: string;
}): Promise<{ data: UserOrdersApiResponse | null; error: string | null }> => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return { data: null, error: "No token provided" };

    const queryParams = new URLSearchParams({
      limit: searchParams.limit?.toString() ?? "10",
      // items: "brand.name,user.fullname",
      sort: searchParams.sort?.toString() ?? "-createdAt",
      fields: "id,brand=name,user=fullname,totalPrice,createdAt",
      userId,
    });

    if (searchParams.keyword)
      queryParams.append("keyword", searchParams.keyword.toString());
    if (searchParams.skip)
      queryParams.append("skip", searchParams.skip.toString());
    if (searchParams.items)
      queryParams.append("items", searchParams.items.toString());

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL11}/api/user/orders?${queryParams}`,
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

const UserOrdersData = async ({
  params,
  searchParams,
}: {
  searchParams: SearchParams;
  params: { id: string };
}) => {
  const { data, error } = await fetchUserOrders({
    searchParams,
    userId: params.id,
  });

  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!data) return <div className="text-red-500">no data</div>;
  // if(data.userOrders.length === 0) return <div className="text-red-500">no data</div>;

  return (
    <UserOrders
      totalPages={data.totalPages}
      userOrders={data.userOrders}
      totalUserOrders={data.totalUserOrder}
    />
  );
};

export default UserOrdersData;
