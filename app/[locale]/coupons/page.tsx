import CouponHeader from '@/components/coupon/CouponHeader'
import { fetchData } from '@/lib/fetchData'
import React from 'react'

const page = async () => {
    const { data, error, loading } = await fetchData('/api/coupons', { cache: "no-store" })

    return (
        <div className='p-container space-y-10 pb-5'>
            <CouponHeader data={data} />
        </div>
    )
}

export default page