import HeaderSpecies from '@/components/species/HeaderSpecies'
import PetsSpecies from '@/components/species/PetsSpecies'
import { fetchData } from '@/lib/fetchData'
import React from 'react'

const page = async ({ params }: { params: { id: string, locale: string } }) => {
    const { data } = await fetchData(`/api/species/${params.id}?fields=id,name,imageUrl`, {
        cache: 'no-cache'
    })
    return (
        <div>
            <HeaderSpecies
                species={data?.species}
                locale={params?.locale}
            />
            <PetsSpecies
                speciesId={data?.species?.id}
                locale={params?.locale}
            />
        </div>
    )
}

export default page