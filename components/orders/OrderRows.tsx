'use client'
import { EyeIcon, LoadingIcon, } from '../icons';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Pagination from '@/components/ui/Pagination';
import Status from '../Status';
import { DateToText } from '@/lib/DateToText';
import { Link } from '@/i18n/routing';

const OrderRows = ({ loading, orders, count }: { loading: boolean, orders: any, count: any }) => {
    const [limit, setLimit] = useState(10)
    const t = useTranslations('orders')
    const startIndex = 0;
    const endIndex = startIndex + limit;

    return (
        <div>
            <div className=' overflow-auto w-[calc(100vw-42px)] md:w-full h-[calc(100vh-250px)]'>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 sticky ">
                    <thead className="text-xs text-gray-700 uppercase bg-white-50 table-header-group ">
                        <tr>
                            <th scope="col" className="px-6 py-5 uppercase sticky top-0 z-50 bg-gray-100">
                                {t('id')}
                            </th>
                            <th scope="col" className="px-6 py-5 uppercase sticky top-0 z-50 bg-gray-100">
                                {t('name')}
                            </th>
                            <th scope="col" className="px-6 py-5 uppercase sticky top-0 z-50 bg-gray-100">
                                {t('phone')}
                            </th>
                            <th scope="col" className="px-6 py-5 uppercase sticky top-0 z-50 bg-gray-100">
                                {t('address')}
                            </th>
                            <th scope="col" className="px-6 py-5 uppercase sticky top-0 z-50 bg-gray-100">
                                {t('status')}
                            </th>
                            <th scope="col" className="px-6 py-5 uppercase sticky top-0 z-50 bg-gray-100">
                                {t('totalPrice')}
                            </th>
                            <th scope="col" className="px-6 py-5 uppercase sticky top-0 z-50 bg-gray-100">
                                {t('createdAt')}
                            </th>
                            <th scope="col" className="px-6 py-5 uppercase sticky top-0 z-50 bg-gray-100 text-center">
                                {t('action')}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            loading ?
                                <tr className="odd:bg-white even:bg-primary/5">
                                    <td colSpan={4} scope="row" className="px-6 py-4">
                                        <div className='w-full flex justify-center'>
                                            <LoadingIcon className='animate-spin size-6' />
                                        </div>
                                    </td>
                                </tr>
                                :
                                <>
                                    {
                                        !(orders?.length) ?
                                            <tr className="odd:bg-white even:bg-primary/5 border-b">
                                                <td colSpan={5} scope="row" className="px-6 py-4 text-center font-bold">
                                                    {t('notfoundUser')}
                                                </td>
                                            </tr>
                                            :
                                            orders
                                                .slice(startIndex, endIndex)
                                                .map((item: any, i: any) => (
                                                    <tr key={i} className="odd:bg-white even:bg-primary/5 border-b">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {item.id}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {item.user.fullname}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {item.phone}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {item.address}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <Status
                                                                status={item.status}
                                                                orderId={item.id}
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {item.totalPrice}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {DateToText(item.createdAt, 'en')}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className='flex justify-center'>
                                                                <div className='flex gap-2 items-center'>
                                                                    <Link href={`/orders/${item.id}`}>
                                                                        <div className='odd:hover:bg-purple-50 odd:focus:bg-purple-100 even:hover:bg-white evne:focus:bg-white py-2 px-5 rounded-md w-fit duration-200'>
                                                                            <EyeIcon className='fill-purple-500 size-8' />
                                                                        </div>
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                    }
                                </>
                        }
                    </tbody>
                </table>
            </div>
            <Pagination
                limit={limit}
                setLimit={setLimit}
                length={orders.length}
                count={count} currentPage={0} onPageChange={function (page: number): void {
                    throw new Error('Function not implemented.');
                } } data={[]}            />
        </div>
    )
}

export default OrderRows;
