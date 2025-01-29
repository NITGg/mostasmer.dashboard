import BrandDetails from '@/components/brands/BrandDetails'
import { Metadata } from 'next'
import { Suspense } from 'react'

interface Props {
    params: {
        id: string
    }
}

export const metadata: Metadata = {
    title: 'Brand Details',
    description: 'View brand details and information',
}

function Loading() {
    return <div>Loading...</div>
}

export default function BrandPage({ params }: Props) {
    return (
        <div className='bg-[#f0f2f5]'>

        <Suspense fallback={<Loading />}>
            <BrandDetails brandId={params.id} />
        </Suspense>
        </div>
    )
}