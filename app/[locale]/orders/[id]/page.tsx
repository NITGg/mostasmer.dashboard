import OrderDetails from '@/components/orders/OrderDetails';
import { fetchData } from '@/lib/fetchData'

const Page = async ({ params }: { params: { id: string } }) => {
    const { data, error, loading } = await fetchData(`/api/order-details/${params.id}`, { cache: 'no-store' })
    return (
        <div>
            <OrderDetails order={data.order} products={data.products} pets={data.pets} loading={loading} />
        </div>
    )
}

export default Page