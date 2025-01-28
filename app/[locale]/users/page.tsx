import UserHeader from '@/components/users/UserHeader'
import UsersRows from '@/components/users/UsersRows'
import { cookies } from 'next/headers'
import React from 'react'

const Users = async ({ searchParams }: { searchParams: any }) => {
    const token = cookies().get('token')?.value;
    let loading = false;

    const fetchDashboard = async (token: string) => {
        try {
            loading = true
            const queryParams = new URLSearchParams({
                userRoles: "some_role=name=customer",
                fields: "id,fullname,phone,imageUrl,status,email",
                limit: searchParams.limit ?? '10',
                items: 'fullname,phone,email',
                isDelete: "false",
            });
            if (searchParams.keyword) {
                queryParams.append("keyword", searchParams.keyword);
                queryParams.append("sort", '-fullname');
            }

            if (searchParams.skip) queryParams.append("skip", searchParams.skip);
            if (searchParams.items) queryParams.append("items", searchParams.items);

            const res = await fetch(`${process.env.BASE_URL}/api/user?${queryParams.toString()}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
            })
            if (!res.ok) {
                return { data: null, error: await res.text() }
            }
            const data = await res.json();
            return { data: data, error: null }
        } catch (error: any) {
            return { data: null, error: error?.message }
        } finally {
            loading = false
        }
    }
    const { data, error } = await fetchDashboard(token as string);

    return (
        <div className='p-container'>
            <div className='space-y-10'>
                <UserHeader type='users' />
                <div className='bg-white border rounded-xl overflow-hidden'>
                    {/* <UsersRows
                        loading={loading}
                        users={data?.users}
                        count={data?.count}
                    /> */}
                    users
                </div>
            </div>
        </div>
    )
}

export default Users