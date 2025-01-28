import { fetchData } from '@/lib/fetchData'
import Image from 'next/image';
import React from 'react'
import ImageApi from '../ImageApi';

const PetsSpecies = async ({ speciesId, locale }: { speciesId: string, locale: string }) => {
    const { data } = await fetchData(`/api/pets?speciesId=${speciesId}&fields=images=id-url,name,id&lang=${locale}`, {
        cache: 'no-cache'
    });

    return (
        !data.pets?.length ? "" :
            <div className='lg:w-[calc(100vw-23rem)] p-container py-10'>
                <div className='space-y-5'>
                    <div>
                        <h2 className='text-2xl font-bold'>
                            Pets :
                        </h2>
                    </div>
                    <div className='flex gap-5 overflow-x-auto'>
                        {data.pets?.map((product: any) => (
                            <div
                                // href={`/${product.id}`}
                                className='border bg-white rounded-lg shadow-md w-56'
                                key={product.id}>
                                <div
                                    className='w-56 h-56 flex justify-center items-center'>
                                    <ImageApi
                                        src={product.images[0]?.url ?? '/imgs/notfound.png'}
                                        alt={product.name}
                                        height={500}
                                        width={500}
                                        className='size-full border-b object-cover object-top rounded-t-md'
                                    />
                                </div>
                                <div className='py-5 flex justify-between items-center px-3'>
                                    <div>
                                        <h4 className='text-lg font-medium'>{product.name}</h4>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
    )
}

export default PetsSpecies