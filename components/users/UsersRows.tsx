'use client'
import { EyeIcon, LoadingIcon, } from '../icons';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Pagination from '@/components/ui/Pagination';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import ImageApi from '../ImageApi';

const UsersRows = ({ loading, users, count }: { loading: boolean, users: any, count: any }) => {
    const [limit, setLimit] = useState(10)
    const t = useTranslations('user')
    const startIndex = 0;
    const endIndex = startIndex + limit;
    const pathname = usePathname();

    return (
        <div>
            <div className=' overflow-auto w-[calc(100vw-42px)] md:w-full h-[calc(100vh-250px)]'>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 sticky ">
                    <thead className="text-xs text-gray-700 uppercase bg-white-50 table-header-group ">
                        <tr>
                            <th scope="col" className="px-6 py-5 uppercase sticky top-0 z-50 bg-gray-100">
                                {t('table.image')}
                            </th>
                            <th scope="col" className="px-6 py-5 uppercase sticky top-0 z-50 bg-gray-100">
                                {t('table.name')}
                            </th>
                            <th scope="col" className="px-6 py-5 uppercase sticky top-0 z-50 bg-gray-100">
                                {t('table.email')}
                            </th>
                            <th scope="col" className="px-6 py-5 uppercase sticky top-0 z-50 bg-gray-100">
                                {t('table.phone')}
                            </th>
                            <th scope="col" className="px-6 py-5 uppercase sticky top-0 z-50 bg-gray-100 text-center">
                                {t('table.action')}
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
                                        !(users?.length) ?
                                            <tr className="odd:bg-white even:bg-primary/5 border-b">
                                                <td colSpan={5} scope="row" className="px-6 py-4 text-center font-bold">
                                                    {t('notfoundUser')}
                                                </td>
                                            </tr>
                                            :
                                            users
                                                .slice(startIndex, endIndex)
                                                .map((item: any, i: any) => (
                                                    <tr key={i} className="odd:bg-white even:bg-primary/5 border-b">
                                                        <td scope="row" className="px-6 py-4">
                                                            <div className='size-16'>
                                                                <ImageApi
                                                                    src={item.imageUrl ?? '/imgs/notfound.png'}
                                                                    alt="Avatar"
                                                                    className='size-full rounded-full object-cover border-2'
                                                                    width={200}
                                                                    height={200}
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {item.fullname}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {item.email}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {item.phone}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className='flex justify-center'>
                                                                <div className='flex gap-2 items-center'>
                                                                    <Link href={`${pathname}/${item.id}`}>
                                                                        <div className='odd:hover:bg-purple-50 odd:focus:bg-purple-100 even:hover:bg-white evne:focus:bg-white py-2 px-5 rounded-md w-fit duration-200'>
                                                                            <EyeIcon className='fill-purple-500 size-8' />
                                                                        </div>
                                                                    </Link>
                                                                    <div>
                                                                        {/* <BlockUser userId={item.id} block={item?.isBlock} /> */}
                                                                    </div>
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
                length={users?.length}
                count={count} currentPage={0} onPageChange={function (page: number): void {
                    throw new Error('Function not implemented.');
                } } data={[]}            />
        </div>
    )
}

export default UsersRows;
