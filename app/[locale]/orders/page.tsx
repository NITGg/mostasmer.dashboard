// import OrderRows from '@/components/orders/OrderRows'
// import { cookies } from 'next/headers'
// import React from 'react'

// const page = async ({ searchParams }: { searchParams: any }) => {
//     const token = cookies().get('token')?.value;
//     let loading = false;

//     const fetchDashboard = async (token: string) => {
//         try {
//             loading = true
//             const queryParams = new URLSearchParams({
//                 limit: searchParams.limit ?? '10',
//                 fields: 'id,user=fullname-email-imageUrl-phone,userAddress=id-address-lat-long,createdAt,address,totalPrice,status,phone,createdAt,supplierId',
//                 lang: 'en',
//                 sort: '-createdAt'
//             });
//             if (searchParams.keyword) {
//                 queryParams.append("keyword", searchParams.keyword);
//                 queryParams.append("sort", '-fullname');
//             }

//             if (searchParams.skip) queryParams.append("skip", searchParams.skip);
//             if (searchParams.items) queryParams.append("items", searchParams.items);

//             const res = await fetch(`${process.env.BASE_URL}/api/order-supplier-or-admin?${queryParams.toString()}`, {
//                 method: "GET",
//                 credentials: "include",
//                 headers: {
//                     "Authorization": `Bearer ${token}`
//                 },
//             })
//             if (!res.ok) {
//                 return { data: null, error: await res.text() }
//             }
//             const data = await res.json();
//             return { data: data, error: null }
//         } catch (error: any) {
//             return { data: null, error: error?.message }
//         } finally {
//             loading = false
//         }
//     }
//     const { data, error } = await fetchDashboard(token as string);


//     return (
//         <div className='p-container'>
//             <OrderRows orders={data.orders} count={data.count} loading={loading} />
//         </div>
//     )
// }

// export default page


import { fetchData } from '@/lib/fetchData';
import { cookies } from 'next/headers';
import React from 'react'

const page = async ({ searchParams }: { searchParams: any }) => {
    const queryParams = new URLSearchParams({
        fields: "id,name,description,price,stock,purchaseCount,available,categoryId,images=id-url,discounts",
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
    if (userData?.data?.user?.role != 'admin') queryParams.append('sellerId', userData?.data?.user?.id);
    if (searchParams.skip) queryParams.append("skip", searchParams.skip);
    if (searchParams.keyword) queryParams.append("keyword", searchParams.keyword);

    const { data, error } = await fetchData(`/api/products?${queryParams.toString()}`, {
        method: "GET",
        credentials: "include",
        cache: "no-cache"
    });

    return (
        <div>
        
        orders
        </div>
    )
}

export default page