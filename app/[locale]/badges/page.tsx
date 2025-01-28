import Badges from "@/components/badges/Badges";
import { cookies } from "next/headers";
import React from "react";

const Page = async ({ searchParams }: { searchParams: any }) => {
  const token = cookies().get("token")?.value;
  let loading: boolean = false;

  const fetchDashboard = async (token: string) => {
    try {
      loading = true;
      // const queryParams = new URLSearchParams({
      //   // userRoles: "some_role=name=customer",
      //   fields: "id,fullname,phone,imageUrl,email",
      //   limit: searchParams.limit ?? "10",
      //   items: "fullname,phone,email",
      //   // isDelete: "false",
      // });
      // if (searchParams.keyword) {
      //   queryParams.append("keyword", searchParams.keyword);
      //   queryParams.append("sort", "-fullname");
      // }

      // if (searchParams.skip) queryParams.append("skip", searchParams.skip);
      // if (searchParams.items) queryParams.append("items", searchParams.items);

      // const res = await fetch(
      //   `${
      //     process.env.NEXT_PUBLIC_BASE_URL
      //   }/api/user-type?${queryParams.toString()}`,
      //   {
      //     method: "GET",
      //     credentials: "include",
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }
      // );
      const res = await fetch(
        // `${process.env.NEXT_PUBLIC_BASE_URL}/api/user-types`,
        `${process.env.NEXT_PUBLIC_BASE_URL11}/api/badges`,
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

      return { data: data, error: null };
    } catch (error: any) {
      console.log(error.message);

      return { data: null, error: error?.message };
    } finally {
      loading = false;
    }
  };
  const { data, error } = await fetchDashboard(token as string);

  return (
    <div className="p-container">
      <div className="space-y-10">
        <div className="rounded-xl py-5">
          {!error && (
            <Badges
              loading={loading}
              badges={data?.badges}
              count={data?.badges.length}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
