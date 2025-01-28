import DeleteUser from '@/components/users/id/DeleteUser'
import Orders from '@/components/users/id/Orders'
import UserDetails from '@/components/users/id/UserDetails'
import { fetchData } from '@/lib/fetchData'
import { cookies } from 'next/headers'
import React from 'react'

const Users = async ({ params, searchParams }: { params: { id: string }, searchParams: { skip: string; limit: string, items: string } }) => {
    const token = cookies().get('token')?.value;

    const user = await fetchData(`/api/user/${params.id}?fields=id,email,fullname,phone,imageUrl,lastLoginAt,status,lang,isConfirmed,passwordLastUpdated,createdAt,updatedAt,Address=id-address-lat-long,userRoles=role=name-id`);
    const roles = await fetchData('/api/role', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    return (
        <div className='space-y-10'>
            <title>{user.data.user?.fullname ?? 'User'}</title>
            {(user?.loading) ? "" : < UserDetails user={user.data.user} roles={roles.data.roles} />}
            <Orders searchParams={searchParams} />
            <div className='flex justify-end'>
                <DeleteUser userId={user?.data?.user?.id} />
            </div>
        </div>
    )
}

export default Users