import OnBoardingHeader from '@/components/onBoarding/OnBoardingHeader'
import { fetchData } from '@/lib/fetchData'
import React from 'react'

const page = async () => {
    const { data, error, loading } = await fetchData('/api/on-boarding', { cache: "no-store" })

    return (
        <div className='p-container space-y-10 pb-5'>
            <OnBoardingHeader data={data} />
        </div>
    )
}

export default page