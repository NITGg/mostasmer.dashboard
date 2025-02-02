import { LoadingIcon } from "@/components/icons";
import DeleteUser from "@/components/users/id/DeleteUser";
import UserDetails from "@/components/users/id/UserDetails";
import { fetchData } from "@/lib/fetchData";
import { cookies } from "next/headers";
import React from "react";

const Users = async ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { skip: string; limit: string; items: string };
}) => {
  const token = cookies().get("token")?.value;

  const user = await fetchData(`/api/user/${params.id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const type = await fetchData(`/api/user/user-type/${params.id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const walletHistory = await fetchData(
    `/api/user/wallet/wallet-history/${params.id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return (
    <div className="space-y-10">
      <title>{user.data?.fullname ?? "User"}</title>
      {user.loading && <LoadingIcon />}
      {user.error && <p className="text-red-500">{user.error}</p>}
      {!user.loading && !user.error && user.data && (
        <UserDetails
          user={user.data}
          type={type?.data}
          walletHistory={walletHistory?.data}
        />
      )}
      {user.data && (
        <div className="flex justify-end">
          <DeleteUser userId={user.data} />
        </div>
      )}
    </div>
  );
};

export default Users;
