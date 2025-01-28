import Categories from '@/components/category/Categories'
import CategoryHeader from '@/components/category/CategoryHeader'
import ProductCategory from '@/components/category/ProductCategory'
import SubCategory from '@/components/category/SubCategory'
import { fetchData } from '@/lib/fetchData'
import React from 'react'

const page = async ({ params }: { params: { id: string, locale: string } }) => {
    const { data } = await fetchData(`/api/categories/${params.id}?fields=id,name,imageUrl,parent=id-name`, {
        cache: 'no-cache'
    })

    return (
        <div>
            <CategoryHeader category={data?.category} />
            <SubCategory
                categoryId={data?.category?.id}
                locale={params.locale}
            />
            <ProductCategory
                categoryId={data?.category?.id}
                locale={params.locale}
            />
        </div>
    )
}

export default page