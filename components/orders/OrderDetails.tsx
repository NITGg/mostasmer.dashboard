'use client'
import { useTranslations } from 'next-intl'
import React from 'react'
import ImageApi from '../ImageApi'
import { EyeIcon, LoadingIcon } from '../icons'
import { Link } from '@/i18n/routing'
import { DateToText } from '@/lib/DateToText'
import Status from '../Status'
import { useAppContext } from '@/context/appContext'

const OrderDetails = ({ order, products, pets, loading }: { order: any, products: any, pets: any, loading: boolean, }) => {
    const t = useTranslations();
    const { user } = useAppContext();
    return (
        <div className='p-container'>
            <div className='space-y-5 lg:space-y-10'>
                <div className='flex gap-10 md:gap-10 lg:gap-20 xl:gap-40 flex-col md:flex-row'>
                    <div>
                        <ul>
                            <li className='md:text-lg'>{t('orders.id')} : {order?.id}</li>
                            <li className='md:text-lg'>{t('orders.createdAt') as any} : {DateToText(order?.createdAt)}</li>
                            <li className='md:text-lg'>{t('orders.totalPrice')} : {order.totalPrice && order.totalPrice?.toFixed(1)}</li>
                            <li className='md:text-lg flex items-center gap-2'>{t('orders.status')} : <Status status={order.status} orderId={order.id} /></li>
                            <li className='md:text-lg flex items-center gap-2'>{t('orders.address')} : <Link target='_blank' className='text-red-500' href={`https://www.google.com/maps?q=${order?.userAddress?.lat},${order?.userAddress?.long}`}>
                                {order?.userAddress?.address?.slice(0, 20) ?? order?.address?.slice(0, 20)}...
                            </Link></li>
                        </ul>
                    </div>
                    <div className='flex-1'>
                        <div className=' overflow-auto w-[calc(100vw-83px)] md:w-full max-h-96'>
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 sticky ">
                                <thead className="text-xs text-gray-700 uppercase bg-white-50 table-header-group ">
                                    <tr>
                                        <th scope="col" className="px-6 py-5 uppercase sticky top-0 z-50 bg-gray-100">
                                            {t('user.image') as any}
                                        </th>
                                        <th scope="col" className="px-6 py-5 uppercase sticky top-0 z-50 bg-gray-100">
                                            {t('user.type') as any}
                                        </th>
                                        <th scope="col" className="px-6 py-5 uppercase sticky top-0 z-50 bg-gray-100">
                                            {t('user.name') as any}
                                        </th>
                                        <th scope="col" className="px-6 py-5 uppercase sticky top-0 z-50 bg-gray-100">
                                            {t('user.phone') as any}
                                        </th>
                                        {user?.role == 'admin' &&
                                            <th scope="col" className="px-6 py-5 uppercase sticky top-0 z-50 bg-gray-100">
                                                {t('user.details') as any}
                                            </th>
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        loading ?
                                            <tr className="odd:bg-white even:bg-primary/5">
                                                <td colSpan={5} scope="row" className="px-6 py-4">
                                                    <div className='w-full flex justify-center'>
                                                        <LoadingIcon className='animate-spin size-6' />
                                                    </div>
                                                </td>
                                            </tr>
                                            :
                                            <>
                                                <tr key={'user'} className="odd:bg-white even:bg-primary/5 border-b">
                                                    <td scope="row" className="px-6 py-4">
                                                        <div className='size-16'>
                                                            <ImageApi
                                                                src={order.supplier?.imageUrl || '/notfound.png'}
                                                                alt="Avatar"
                                                                className='size-full rounded-full object-cover border-2'
                                                                width={50}
                                                                height={50}
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {t('user.user')}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {order?.supplier?.fullname}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {order?.supplier?.phone}
                                                    </td>
                                                    {user?.role == 'admin' &&
                                                        <td className="px-6 py-4">
                                                            <Link href={`/users/${order?.supplier?.id}`}>
                                                                <EyeIcon className='fill-purple-500 size-8' />
                                                            </Link>
                                                        </td>
                                                    }
                                                </tr>
                                                <tr key={order?.supplier?.id} className="odd:bg-white even:bg-primary/5 border-b">
                                                    <td scope="row" className="px-6 py-4">
                                                        <div className='size-16'>
                                                            <ImageApi
                                                                src={order?.supplier?.imageUrl || '/notfound.png'}
                                                                alt="Avatar"
                                                                className='size-full rounded-full object-cover border-2'
                                                                width={50}
                                                                height={50}
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {t('user.supplier')}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {order?.supplier?.fullname}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {order?.supplier?.phone}
                                                    </td>
                                                    {user?.role == 'admin' &&
                                                        <td className="px-6 py-4">
                                                            <Link href={`/suppliers/${order?.supplier?.id}`}>
                                                                <EyeIcon className='fill-purple-500 size-8' />
                                                            </Link>
                                                        </td>
                                                    }
                                                </tr>
                                            </>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div>
                    <div>
                        {products?.length ?
                            <div className='space-y-10 bg-white rounded-lg'>
                                <h4 className='text-center text-lg md:text-xl lg:text-2xl xl:text-4xl'>
                                    {t('product.productDetails')}
                                </h4>
                                <div>
                                    <div className=' overflow-auto w-[calc(100vw-83px)] md:w-full max-h-96'>
                                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 sticky ">
                                            <thead className="text-xs text-gray-700 uppercase bg-white-50 table-header-group ">
                                                <tr>
                                                    <th scope="col" className="px-6 py-5 uppercase whitespace-nowrap sticky top-0 z-50 bg-gray-100">
                                                        {t('product.image')}
                                                    </th>
                                                    <th scope="col" className="px-6 py-5 uppercase whitespace-nowrap sticky top-0 z-50 bg-gray-100">
                                                        {t('product.name')}
                                                    </th>
                                                    <th scope="col" className="px-6 py-5 uppercase whitespace-nowrap sticky top-0 z-50 bg-gray-100">
                                                        {t('product.quantity')}
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    loading ?
                                                        <tr className="odd:bg-white even:bg-primary/5">
                                                            <td colSpan={6} scope="row" className="px-6 py-4">
                                                                <div className='w-full flex justify-center'>
                                                                    <LoadingIcon className='animate-spin size-6' />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        :
                                                        <>
                                                            {
                                                                products?.map((item: any, i: number) => {
                                                                    return (
                                                                        <tr key={i} className="odd:bg-white even:bg-primary/5 border-b">
                                                                            <td scope="row" className="px-6 py-4">
                                                                                <div className='size-16'>
                                                                                    <Link href={`/products/${item.id}`}>
                                                                                        <ImageApi
                                                                                            src={item.image.url || '/notfound.png'}
                                                                                            alt="Avatar"
                                                                                            className='size-full rounded-full object-cover border-2'
                                                                                            width={50}
                                                                                            height={50}
                                                                                        />
                                                                                    </Link>
                                                                                </div>
                                                                            </td>
                                                                            <td scope="row" className="px-6 py-4">
                                                                                {item?.name}
                                                                            </td>
                                                                            <td scope="row" className="px-6 py-4">
                                                                                {item?.quantity}
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                        </>
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div> : ""
                        }
                    </div>
                    <div>
                        {pets?.length ?
                            <div className='space-y-10 bg-white rounded-lg'>
                                <h4 className='text-center text-lg md:text-xl lg:text-2xl xl:text-4xl'>
                                    {t('product.petDetails')}
                                </h4>
                                <div>
                                    <div className=' overflow-auto w-[calc(100vw-83px)] md:w-full max-h-96'>
                                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 sticky ">
                                            <thead className="text-xs text-gray-700 uppercase bg-white-50 table-header-group ">
                                                <tr>
                                                    <th scope="col" className="px-6 py-5 uppercase whitespace-nowrap sticky top-0 z-50 bg-gray-100">
                                                        {t('product.image')}
                                                    </th>
                                                    <th scope="col" className="px-6 py-5 uppercase whitespace-nowrap sticky top-0 z-50 bg-gray-100">
                                                        {t('product.name')}
                                                    </th>
                                                    <th scope="col" className="px-6 py-5 uppercase whitespace-nowrap sticky top-0 z-50 bg-gray-100">
                                                        {t('product.quantity')}
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    loading ?
                                                        <tr className="odd:bg-white even:bg-primary/5">
                                                            <td colSpan={6} scope="row" className="px-6 py-4">
                                                                <div className='w-full flex justify-center'>
                                                                    <LoadingIcon className='animate-spin size-6' />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        :
                                                        <>
                                                            {
                                                                pets?.map((item: any, i: number) => {
                                                                    return (
                                                                        <tr key={i} className="odd:bg-white even:bg-primary/5 border-b">
                                                                            <td scope="row" className="px-6 py-4">
                                                                                <div className='size-16'>
                                                                                    <Link href={`/products/${item.id}`}>
                                                                                        <ImageApi
                                                                                            src={item.image.url || '/notfound.png'}
                                                                                            alt="Avatar"
                                                                                            className='size-full rounded-full object-cover border-2'
                                                                                            width={50}
                                                                                            height={50}
                                                                                        />
                                                                                    </Link>
                                                                                </div>
                                                                            </td>
                                                                            <td scope="row" className="px-6 py-4">
                                                                                {item?.name}
                                                                            </td>
                                                                            <td scope="row" className="px-6 py-4">
                                                                                1
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                        </>
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div> : ""
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderDetails