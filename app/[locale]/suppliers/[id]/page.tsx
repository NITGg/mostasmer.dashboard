import Store from '@/components/users/id/Store'
import UserDetails from '@/components/users/id/UserDetails'
import { fetchData } from '@/lib/fetchData'
import { cookies } from 'next/headers'
import React from 'react'

const Users = async ({ params, searchParams }: { params: { id: string }, searchParams: any }) => {
    const token = cookies().get('token')?.value;

    const user = await fetchData(`/api/user/${params.id}?fields=id,email,fullname,phone,imageUrl,lastLoginAt,status,lang,isConfirmed,passwordLastUpdated,createdAt,updatedAt,Address=id-address-lat-long,userRoles=role=name-id`);
    const roles = await fetchData('/api/role', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    return (
        <div>
            <title>{user.data.user?.fullname ?? 'User'}</title>
            {(user?.loading) ? "" :
                <div className='space-y-5 lg:space-y-10'>
                    < UserDetails user={user.data.user} roles={roles.data.roles} searchParams={searchParams} />
                    <Store userId={user.data.user.id} />
                </div>
            }
        </div>
    )
}

export default Users