'use client'
import { Link } from '@/i18n/routing'
import React, { useEffect, useState } from 'react'
import { DeleteIcon, EditIcon, LoadingIcon, PluseCircelIcon, EyeIcon,AddPlusIcon } from '../icons'
import { useLocale, useTranslations } from 'next-intl'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import PopupCategory from './AddCategroy'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { deleteCategory, setcategories } from '@/redux/reducers/categoriesReducer'
import toast from 'react-hot-toast'
import { useAppContext } from '@/context/appContext'
import ImageApi from '../ImageApi'
import Table from '@/components/ui/Table'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
// import Table from '../Table?'

interface CategoriesProps {
  categories: any[];  // Changed from initialCategories
  count: number;
}

const Categories: React.FC<CategoriesProps> = ({ categories: initialCategories, count }) => {
    const [open, setOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false as any);
    const [cateUpdate, setCateUpdate] = useState(null as any);
    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(count);
    const [currentItems, setCurrentItems] = useState<number>(0);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const { token } = useAppContext();
    const t = useTranslations('category');
    const locale = useLocale();
    const dispatch = useAppDispatch();
    const categories = useAppSelector(state => state.category.categories);

    // Get current pagination state from URL or defaults
    const currentPage = Number(searchParams.get('page')) || 1;
    const pageSize = Number(searchParams.get('limit')) || 10;

    // Function to update URL and fetch data
    const updatePaginationAndFetch = async (page: number, limit: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', page.toString());
        params.set('limit', limit.toString());
        router.push(`${pathname}?${params.toString()}`);
        
        await fetchCategories(page, limit);
    };

    // Add new function to fetch total count
    const fetchTotalCount = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/category?lang=${locale}&limit=0&skip=0`,
                {
                    cache: 'no-store',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) throw new Error('Failed to fetch total count');

            const data = await response.json();
            setTotalRecords(data.totalCount || data.categories?.length || 0);
        } catch (error) {
            console.error('Error fetching total count:', error);
        }
    };

    // Modify fetchCategories to use the total count
    const fetchCategories = async (page: number, limit: number) => {
        try {
            setLoading(true);
            const skip = (page - 1) * limit;
            
            let url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/category?lang=${locale}`;
            
            // Handle "All" case
            if (limit === 0) {
                url += '&limit=0&skip=0';
            } else {
                url += `&limit=${limit}&skip=${skip}`;
            }

            const response = await fetch(url, {
                cache: 'no-store',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch categories');

            const data = await response.json();
            
            // Update current items count
            setCurrentItems(data.categories.length);
            dispatch(setcategories(data.categories));
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    // Modify the initialization useEffect
    useEffect(() => {
        const initializeData = async () => {
            setIsInitialLoading(true);
            
            // Set initial data
            dispatch(setcategories(initialCategories));
            setCurrentItems(initialCategories?.length || 0);

            try {
                // Fetch total count first
                await fetchTotalCount();

                // Then fetch paginated data
                if (!searchParams.has('page') || !searchParams.has('limit')) {
                    await updatePaginationAndFetch(1, 10);
                } else {
                    await fetchCategories(currentPage, pageSize);
                }
            } catch (error) {
                console.error('Error initializing data:', error);
            } finally {
                setIsInitialLoading(false);
            }
        };

        initializeData();
    }, [locale]);

    // Also fetch new total count when items are added/deleted
    useEffect(() => {
        if (!isInitialLoading) {
            fetchTotalCount();
        }
    }, [categories?.length]);

    // Handle page change
    const handlePageChange = (newPage: number) => {
        updatePaginationAndFetch(newPage, pageSize);
    };

    // Handle page size change
    const handlePageSizeChange = (newSize: number) => {
        updatePaginationAndFetch(1, newSize); // Reset to first page when changing page size
    };

    // Delete category handler
    const handleDeleteCate = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/category/${openDelete}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            if (!response.ok) throw new Error('Failed to delete category');

            dispatch(deleteCategory(openDelete));
            setOpenDelete(false);
            toast.success(t('successDelete'));
            
            // Refresh the current page after deletion
            fetchCategories(currentPage, pageSize);
        } catch (error: any) {
            toast.error(error?.message || 'Failed to delete category');
        } finally {
            setLoading(false);
        }
    };

    // Table headers configuration
    const tableHeaders = [
        { name: 'categoryImages', className: 'w-[200px]' },
        { name: 'categoryName', className: 'w-[500px]' },
        { name: 'categoryAction', className: 'w-[200px] text-right' }
    ];

    // Table row render function
    const renderTableRows = () => {
        return categories?.map((category: any) => (
            <tr key={category.id} className="odd:bg-white even:bg-primary/5 border-b">
                <td className="px-6 py-4">
                    <ImageApi
                        src={category.imageUrl || '/imgs/notfound.png'}
                        alt={category.name}
                        loader={() => category.imageUrl}
                        loading='lazy'
                        height={40}
                        width={40}
                        className='object-cover rounded'
                    />
                </td>
                <td className="px-6 py-4 font-medium">
                    {/* Display name based on current locale */}
                    {category.name}
                </td>
                <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => {
                                setOpen(true);
                                setCateUpdate(category);
                            }}
                            className='text-blue-500 hover:text-blue-700'
                        >
                            <EditIcon className='w-5 h-5 text-[#00a18f] hover:text-gray-700' />
                        </button>
                        <button
                            onClick={() => setOpenDelete(category.id)}
                            className='text-red-500 hover:text-red-700'
                        >
                            <DeleteIcon className='w-5 h-5 text-[#00a18f] hover:text-gray-700' />
                        </button>
                        <Link
                            href={`/brands`}
                            className='text-green-500 hover:text-green-700'
                        >
                            <EyeIcon className='w-5 h-5 text-[#00a18f] hover:text-gray-700' />
                        </Link>
                    </div>
                </td>
            </tr>
        ));
    };

    return (
        <div className='p-container space-y-6'>
            <div className='flex justify-between items-center'>
                <h4 className='font-bold text-lg md:text-xl lg:text-2xl'>{t('categories')}</h4>
                {/* <button
                    onClick={() => setOpen(true)}
                    className='px-5 py-2  rounded-md text-white font-medium'
                >
                    <div className='flex gap-3 border-2 border-[#02161e] rounded-md px-2 py-1 bg-[#02161e] text-white'>
                        <PluseCircelIcon className='size-6 text-teal-500' />
                        <div className='flex-1'>{t('addCategory')}</div>
                    </div>
                </button> */}

<button
          onClick={() => {
            setOpen(true)
          }}
          className="px-5 py-2 bg-primary rounded-md text-white font-medium"
        >
          <div className="flex gap-3">
            <PluseCircelIcon className="size-6" />
            <div className="flex-1">{t("addCategory")}</div>
          </div>
        </button>
                
            </div>

                    <Table
                        data={categories || initialCategories}
                        headers={tableHeaders}
                        count={totalRecords}
                        loading={loading || isInitialLoading}
                        showDateFilter={false}
                        pageSize={pageSize}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                        onPageSizeChange={handlePageSizeChange}
                        showExport={true}
                        bgColor="#02161e"
                        currentItems={currentItems}
                        initialData={initialCategories}
                    >
                {renderTableRows()}
            </Table>

            {/* Add/Edit Category Dialog */}
            <Dialog 
                open={open} 
                onOpenChange={() => {
                    setCateUpdate(null);
                    setOpen(false);
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('category')}</DialogTitle>
                        <DialogDescription> </DialogDescription>
                        <PopupCategory 
                            setOpen={setOpen} 
                            category={cateUpdate}
                            locale={locale}
                        />
                    </DialogHeader>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDelete} onOpenChange={setOpenDelete}>
                <DialogContent className="bg-white p-0 rounded-lg">
                    <div className="p-6 space-y-6">
                        <DialogHeader className="space-y-4 text-center">
                            <DialogTitle className="text-xl font-bold text-black">
                                {t('deleteConfirmTitle')}
                            </DialogTitle>
                            <DialogDescription className="text-gray-500 text-base">
                                {t('deleteConfirm')}
                            </DialogDescription>

                        </DialogHeader>
                        
                        <div className='flex justify-center gap-4 p-4'>
                            <button 
                                onClick={handleDeleteCate} 
                                className='bg-teal-500 hover:bg-[#003e35] hover:bg-teal-600 px-8 py-2 rounded-3xl text-white transition-colors w-28'
                            >
                                {loading ? (
                                    <LoadingIcon className='size-5 animate-spin' />
                                ) : (
                                    t('yes')
                                )}
                            </button>
                            <button 
                                onClick={() => setOpenDelete(false)} 
                                className='bg-white border border-gray-700 drop-shadow-2xl font-bold hover:bg-gray-200 px-8 py-2 rounded-3xl text-black transition-colors w-28'
                            >
                                {t('no')}
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>


        </div>
        
    );
};

export default Categories;