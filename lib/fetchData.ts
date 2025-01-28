'use server'
export const fetchData = async (api: string, config?: RequestInit) => {
    try {
        const res = await fetch(`${process.env.BASE_URL}${api}`, config)
        if (!res.ok) {
            return { data: null, error: await res.json(), loading: false }
        }
        const data = await res.json()
        return { data: data, error: null, loading: false }
    } catch (error) {
        console.error(error);
        return { data: null, error, loading: false }
    }
}