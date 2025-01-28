import Pets from '@/components/pets/Pets';
import { fetchData } from '@/lib/fetchData';
import { cookies } from 'next/headers';
import React from 'react'

const page = async ({ searchParams }: { searchParams: any }) => {
    const queryParams = new URLSearchParams({
        fields: "id,name,description,price,available,age,speciesId,images=id-url,discounts",
        limit: searchParams.limit ?? '10',
        items: 'fullname,phone,email'
    });

    const token = cookies().get('token')?.value
    const userData = await fetchData(`/api/verify-me`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    if (userData?.data?.user?.role != 'admin') queryParams.append('ownerId', userData?.data?.user?.id);
    if (searchParams.skip) queryParams.append("skip", searchParams.skip);
    if (searchParams.keyword) queryParams.append("keyword", searchParams.keyword);

    const { data, error } = await fetchData(`/api/pets?${queryParams.toString()}`, {
        method: "GET",
        credentials: "include",
        cache: "no-cache"
    });

    return (
        <div>
            <Pets pets={data?.pets} count={data?.count} />
        </div>
    )
}

export default page