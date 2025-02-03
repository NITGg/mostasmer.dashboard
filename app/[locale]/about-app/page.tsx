import AboutDataDetails from '@/components/about-app/AboutDataDetails';
import React from 'react';

const page = async ({ searchParams }: { searchParams: any }) => {
    let loading = false;
    const fetchData = async () => {
        try {
            loading = true;
            const res = await fetch(`${process.env.BASE_URL}/api/about-app`, {
                method: "GET",
                credentials: "include",
                cache: "no-store"
            });
            if (!res.ok) {
                return { data: null, error: await res.text() };
            }
            const data = await res.json();
            return { data: data, error: null };
        } catch (error: any) {
            return { data: null, error: error?.message };
        } finally {
            loading = false;
        }
    };

    const { data, error } = await fetchData();

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className='p-container space-y-10 pb-5'>
            <AboutDataDetails aboutApp={data?.aboutApp} />
        </div>
    );
};

export default page;