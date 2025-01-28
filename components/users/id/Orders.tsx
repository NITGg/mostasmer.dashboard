import { fetchData } from '@/lib/fetchData'
import { cookies } from 'next/headers'
import React from 'react'
import OrderTitle from './OrderTitle';
import OrderRows from './OrderRows';

const Orders = async ({ searchParams }: { searchParams: { skip: string, items: string, limit: string } }) => {
    const token = cookies().get('token')?.value as string;
    const queryParams = new URLSearchParams({
        fields: "id,totalPrice,status,address,userAddress=id-lat-long-address",
        lang: "en",
        // items: 'fullname,phone,email',
        limit: searchParams.limit ?? '10',
    });

    if (searchParams.skip) queryParams.append("skip", searchParams.skip);
    if (searchParams.items) queryParams.append("items", searchParams.items);

    const { data, loading, } = await fetchData(`/api/order?${queryParams.toString()}`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        cache: 'no-store'
    })


    return (
        data?.orders?.length &&
        <div className='p-container'>
            <div className='space-y-10 bg-white p-3 md:p-5 rounded-lg'>
                <div className='text-lg md:text-2xl lg:text-3xl font-bold text-center'>
                    <OrderTitle />
                </div>
                <OrderRows
                    orders={data.orders}
                    count={data.count}
                    loading={loading}
                />
            </div>
        </div>
    )
}

export default Orders