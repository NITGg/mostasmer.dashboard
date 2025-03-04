import UserDetails from "@/components/users/id/UserDetails";
import { fetchData } from "@/lib/fetchData";
import { cookies } from "next/headers";
import DeleteUser from "@/components/users/id/DeleteUser";

const UserData = async ({ params }: { params: { id: string } }) => {
  const token = cookies().get("token")?.value;
  const [user, type, walletHistory] = await Promise.all([
    fetchData(`/api/user/${params.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
    fetchData(`/api/user/user-type/${params.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
    fetchData(`/api/user/wallet/wallet-history/${params.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  ]);
  if (user.error)
    return <div className="text-red-500">Error: {user.error}</div>;
  if (!user.data) return <div className="text-red-500">no data</div>;

  return (
    <>
      <title>{user.data.fullname}</title>
      <h1>{user.data.fullname}</h1>
      <UserDetails
        user={user.data}
        type={type?.data}
        walletHistory={walletHistory?.data}
      />

      <div className="flex justify-end">
        <DeleteUser userId={user.data} />
      </div>
    </>
  );
};
export default UserData;
