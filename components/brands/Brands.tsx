'use client'
import React, { useEffect, useState } from 'react'
import { DeleteIcon, EyeIcon, LoadingIcon, PluseCircelIcon } from '../icons'
import { useLocale, useTranslations } from 'next-intl'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import toast from 'react-hot-toast'
import { useAppContext } from '@/context/appContext'
import mlang from '@/lib/mLang'
import ImageApi from '../ImageApi'
import Table from '@/components/ui/Table'
import { useRouter } from 'next/navigation'
import AddBrand from './AddBrand'

type SupportedLocale = 'ar' | 'en';

interface Brand {
    id: number;
    name: string;
    phone: string;
    logo: string;
    validFrom: string;
    validTo: string;
    purchaseCount: number;
}

interface BrandsProps {
    initialBrands?: Brand[];
    initialCount?: number;
}

const Brands: React.FC<BrandsProps> = ({ initialBrands, initialCount }) => {
    const [brands, setBrands] = useState<Brand[]>(initialBrands || []);
    const [count, setCount] = useState(initialCount || 0);
    const [openDelete, setOpenDelete] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const { token } = useAppContext();
    const [isAddBrandOpen, setIsAddBrandOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const t = useTranslations('brand')
    const locale = useLocale() as SupportedLocale;
    const router = useRouter()

        const handleViewBrand = (id: number) => {
            router.push(`/${locale}/brands/${id}`)
        }

    // Fetch brands data
    useEffect(() => {
        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brand?sort=-purchaseCount`);
            const data = await response.json();
            setBrands(data.brands);
            setCount(data.brands.length);
        } catch (error) {
            console.error('Error fetching brands:', error);
            toast.error('Failed to fetch brands');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBrand = async (id: number) => {
        try {
            setLoading(true);
            const myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${token}`);

            const formdata = new FormData(); // Create an empty FormData object

            const requestOptions = {
                method: "DELETE",
                headers: myHeaders,
                body: formdata, // Include the FormData object in the request
                redirect: "follow"
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/${id}`, requestOptions);

            if (!response.ok) throw new Error('Failed to delete brand');

            await fetchBrands(); // Refresh the list
            setOpenDelete(null);
            toast.success(t('successDelete'));
        } catch (error: any) {
            toast.error(error?.message || 'Failed to delete brand');
        } finally {
            setLoading(false);
        }
    };

    // Table headers configuration
    const tableHeaders = [
        { name: 'image', className: 'w-[100px]' },
        { name: 'brandName', className: 'w-[200px]' },
        { name: 'BrandContactNumber', className: 'w-[200px]' },
        { name: 'BrandValidFrom', className: 'w-[150px]' },
        { name: 'BrandValidTo', className: 'w-[150px]' },
        { name: 'BrandStatus', className: 'w-[100px]' },
        { name: 'brandAction', className: 'w-[100px] text-right' }
    ];

    // Table row render function
    const renderTableRows = () => {
        return brands?.map((brand) => (
            <tr key={brand.id} className="odd:bg-white even:bg-primary/5 border-b">
                <td className="px-6 py-4">
                    <ImageApi
                        src={brand.logo || '/imgs/notfound.png'}
                        alt={mlang(brand.name, locale)}
                        loader={() => brand.logo}
                        loading='lazy'
                        height={40}
                        width={40}
                        className='object-cover rounded-full'
                    />
                </td>
                <td className="px-6 py-4 font-medium">
                    {mlang(brand.name, locale)}
                </td>
                <td className="px-6 py-4">
                    {brand.phone}
                </td>
                <td className="px-6 py-4">
                    {new Date(brand.validFrom).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                    {new Date(brand.validTo).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                    {new Date(brand.validTo) > new Date() ? 'Active' : 'Not Active'}
                </td>
                <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
<button
    onClick={() => handleViewBrand(brand.id)}
    className='text-green-500 hover:text-green-700'
    aria-label={t('viewBrand')}
>
    <EyeIcon className='w-5 h-5 text-[#00a18f] hover:text-gray-700' />
    {/* <PluseCircelIcon className='w-5 h-5 text-[#00a18f] hover:text-gray-700' /> */}
</button>
                        <button
                            onClick={() => setOpenDelete(brand.id)}
                            className='text-red-500 hover:text-red-700'
                            aria-label={t('deleteBrand')}
                        >
                            <DeleteIcon className='w-5 h-5 text-[#00a18f] hover:text-gray-700' />
                        </button>
                    </div>
                </td>
            </tr>
        ))
    };

    return (
        <div className='p-container space-y-6'>
            <div className='flex justify-between items-center'>
                <h4 className='font-bold text-lg md:text-xl lg:text-2xl'>{t('title')}</h4>
                <button
                    onClick={() => setIsAddBrandOpen(true)}
                    className='px-5 py-2  rounded-md text-white font-medium'
                >
                    <div className='flex gap-3  border-2 border-[#02161e] rounded-md px-2 py-1 bg-[#02161e] text-white'>
                        <PluseCircelIcon className='size-6 text-teal-500' />
                        <div className='flex-1'>{t('brandaddButton')}</div>
                    </div>
                </button>
            </div>

            <Table
                data={brands}
                headers={tableHeaders}
                count={count}
                loading={loading}
                showDateFilter={false}
                currentPage={currentPage}
                pageSize={pageSize}
                onPageChange={(page) => setCurrentPage(page)}
                onPageSizeChange={(size) => setPageSize(size)}
                showExport={true}
                bgColor="#02161e"
            >
                {renderTableRows()}
            </Table>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!openDelete} onOpenChange={() => setOpenDelete(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('branddeleteButton')}</DialogTitle>
                        <DialogDescription>{t('deleteMessage')}</DialogDescription>
                    </DialogHeader>
                    <div className='flex gap-2'>
                        <button 
                            onClick={() => setOpenDelete(null)} 
                            className='px-3 py-2 rounded-md border'
                        >
                            {t('cancel_delete_brand')}
                        </button>
                        <button 
                            onClick={() => openDelete && handleDeleteBrand(openDelete)} 
                            className='px-3 py-2 rounded-md bg-red-500 text-white'
                        >
                            {loading ? <LoadingIcon className='size-5 animate-spin' /> : t('deleteBrand')}
                        </button>
                    </div>
                </DialogContent>
            </Dialog>

            <AddBrand 
                isOpen={isAddBrandOpen} 
                onClose={() => setIsAddBrandOpen(false)} 
            />
        </div>
    )
}

export type { Brand, BrandsProps };
export default Brands