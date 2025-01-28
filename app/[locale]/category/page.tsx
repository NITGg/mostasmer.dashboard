import Categories from '@/components/category/Categories';
import Products from '@/components/products/Products'
import React from 'react'

const page = async ({ searchParams }: { searchParams: any }) => {
    let loading = false;
    const fetchData = async () => {
        try {
            loading = true
            const queryParams = new URLSearchParams({
                // fields: "id,name,images=url-id",
                // limit: searchParams.limit ?? '10',
                items: 'fullname,phone,email',
                parent: 'null'
            });
            if (searchParams.skip) queryParams.append("skip", searchParams.skip);
            if (searchParams.keyword) queryParams.append("keyword", searchParams.keyword);
            const res = await fetch(`${process.env.BASE_URL}/api/categories?${queryParams.toString()}`, {
                method: "GET",
                credentials: "include",
                cache: "no-cache"
            })
            if (!res.ok) {
                return { data: null, error: await res.text() }
            }
            const data = await res.json();
            return { data: data, error: null }
        } catch (error: any) {
            return { data: null, error: error?.message }
        } finally {
            loading = false
        }
    }
    const { data, error } = await fetchData();

    return (
        <div>
            <Categories categories={data?.categories} count={data?.count} />
        </div>
    )
}

export default page