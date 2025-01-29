import Brands from '@/components/brands/Brands';
import Products from '@/components/products/Products'
import React from 'react'
import { Brand } from '@/components/brands/Brands';

interface BrandApiResponse {
    brands: Brand[];
    count: number;
}

const Page = async ({ searchParams }: { searchParams: any }) => {
    let loading = false;
    const fetchData = async (): Promise<{ data: BrandApiResponse | null, error: string | null }> => {
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
            const res = await fetch(`${process.env.BASE_URL}/api/brand?${queryParams.toString()}`, {
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
            <Brands 
                initialBrands={data?.brands} 
                initialCount={data?.count} 
            />
        </div>
    )
}

export default Page