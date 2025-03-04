import UserNotifications from "@/components/users/id/userNotifications/UserNotifications";
import { SearchParams } from "../../user-roles/page";
import { cookies } from "next/headers";

export interface UserNotification {
  id: number;
  brandId: number;
  userId: number;
  brand: { name: string };
  user: { name: string };
  createdAt: string;
}

interface UserNotificationsApiResponse {
  userNotifications: UserNotification[];
  totalUserNotifications: number;
  totalPages: number;
}

const fetchUserNotifications = async ({
  searchParams,
  userId,
}: {
  searchParams: SearchParams;
  userId: string;
}): Promise<{
  data: UserNotificationsApiResponse | null;
  error: string | null;
}> => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return { data: null, error: "No token provided" };

    const queryParams = new URLSearchParams({
      limit: searchParams.limit?.toString() ?? "10",
      // items: "totalPrice,createdAt",
      sort: searchParams.sort?.toString() ?? "-createdAt",
      // userId,
    });

    // if (searchParams.keyword)
    //   queryParams.append("keyword", searchParams.keyword.toString());
    if (searchParams.skip)
      queryParams.append("skip", searchParams.skip.toString());
    // if (searchParams.items)
    // queryParams.append("items", searchParams.items.toString());

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL11}/api/user/notification?${queryParams}`,
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

const UserNotificationsData = async ({
  params,
  searchParams,
}: {
  searchParams: SearchParams;
  params: { id: string };
}) => {
  const { data, error } = await fetchUserNotifications({
    searchParams,
    userId: params.id,
  });

  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!data) return <div className="text-red-500">no data</div>;

  return (
    <UserNotifications
      totalPages={data.totalPages}
      totalUserNotifications={data.totalUserNotifications}
      userNotifications={data.userNotifications}
    />
  );
};

export default UserNotificationsData;
