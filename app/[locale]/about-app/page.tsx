import AboutDataDetails from '@/components/about-app/AboutDataDetails';
import { fetchData } from '@/lib/fetchData'
import React from 'react'

const page = async () => {
    const { data, error, loading } = await fetchData('/api/about-app', { cache: "no-store" })

    if (loading) return <div>Loading...</div>

    return (
        <div className='p-container space-y-10 pb-5'>
            <AboutDataDetails aboutApp={data.aboutApp} />
        </div>
    )
}

export default page