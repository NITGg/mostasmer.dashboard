import AdsHeader from '@/components/ads/AdsHeader'
import { fetchData } from '@/lib/fetchData'
import React from 'react'

const page = async () => {
    const { data, error, loading } = await fetchData('/api/ads?fields=id,imageUrl,route,title,duration,startDate,endDate,pro', { cache: "no-store" })

    return (
        <div className='p-container space-y-10 pb-5'>
            <AdsHeader data={data} />
        </div>
    )
}

export default page