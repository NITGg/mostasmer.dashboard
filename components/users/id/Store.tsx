import ImageApi from '@/components/ImageApi';
import { fetchData } from '@/lib/fetchData'
import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import StoreData from './StoreData';

const Store = async ({ userId }: { userId: string }) => {
    const token = cookies().get('token')?.value;
    const { data, error } = await fetchData(`/api/user-store/${userId}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    });

    return (
        data?.store &&
        <div className='p-container'>
            <div className='grid grid-cols-12 lg:gap-5  bg-white p-3 md:p-5 rounded-lg'>
                <div className={'col-span-12 md:col-span-8'}>
                    <StoreData store={data.store} />
                </div>
                <div className={'col-span-12 md:col-span-4'}>
                    <div className=" p-4 bg-white border rounded-lg shadow-md">
                        <div className="flex items-center justify-center w-full h-40 bg-gray-100 rounded-lg">
                            <Image
                                width={500}
                                height={500}
                                src={'/imgs/pdf.png'}
                                alt="PDF Preview"
                                className="object-cover h-full"
                            />
                        </div>
                        <h3 className="mt-4 text-lg font-bold text-gray-800">PDF Document</h3>
                        <p className="text-sm text-gray-600">Click to see the trading licences</p>
                        <Link target='_blank' href={process.env.BASE_URL + data?.store?.tradingLicence} className="block  px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600">
                            View
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Store