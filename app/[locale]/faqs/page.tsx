import FAQsDetails from '@/components/faqs/FAQsDetails'
import FAQTitle from '@/components/faqs/FAQTitle'
import { fetchData } from '@/lib/fetchData'
import React from 'react'

const page = async () => {
    const { data, error, loading } = await fetchData('/api/faqs', { cache: "no-store" })
    if (loading) return <div>Loading...</div>
    return (
        <div className='p-container space-y-10 pb-5'>
            <div className='space-y-5 lg:space-y-10'>
                <FAQTitle />
                <div>
                    <FAQsDetails faqs={data.faqs} />
                </div>
            </div>
        </div>
    )
}

export default page