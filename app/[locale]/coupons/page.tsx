// // import CouponHeader from '@/components/coupon/CouponHeader'
// // import { fetchData } from '@/lib/fetchData'
// // import React from 'react'

// // const page = async () => {
// //     const { data, error, loading } = await fetchData('/api/coupons', { cache: "no-store" })

// //     return (
// //         <div className='p-container space-y-10 pb-5'>
// //             <CouponHeader data={data} />
// //         </div>
// //     )
// // }

// // export default page

// import { fetchData } from '@/lib/fetchData';
// import { cookies } from 'next/headers';
// import React from 'react'

// const page = async ({ searchParams }: { searchParams: any }) => {
//     const queryParams = new URLSearchParams({
//         fields: "id,name,description,price,stock,purchaseCount,available,categoryId,images=id-url,discounts",
//         limit: searchParams.limit ?? '10',
//         items: 'fullname,phone,email'
//     });

//     const token = cookies().get('token')?.value
//     const userData = await fetchData(`/api/verify-me`, {
//         method: "GET",
//         credentials: "include",
//         headers: {
//             "Authorization": `Bearer ${token}`
//         }
//     })
//     if (userData?.data?.user?.role != 'admin') queryParams.append('sellerId', userData?.data?.user?.id);
//     if (searchParams.skip) queryParams.append("skip", searchParams.skip);
//     if (searchParams.keyword) queryParams.append("keyword", searchParams.keyword);

//     const { data, error } = await fetchData(`/api/products?${queryParams.toString()}`, {
//         method: "GET",
//         credentials: "include",
//         cache: "no-cache"
//     });

//     return (
//         <div>
        
//         coupons
//         </div>
//     )
// }

// export default page

'use client';
import React, { useEffect, useState } from 'react';
import CouponHeader from '@/components/coupon/CouponHeader';

const CouponPage = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/coupons`);
                const result = await response.json();
                setData(result.coupons);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading || !data) return <div>Loading...</div>;

    return (
        <div className="p-container space-y-10 pb-5">
            <CouponHeader data={data} />
        </div>
    );
};

export default CouponPage;
