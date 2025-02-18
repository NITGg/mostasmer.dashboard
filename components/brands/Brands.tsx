// // // // // 'use client'
// // // // // import React, { useEffect, useState } from 'react'
// // // // // import { DeleteIcon, LoadingIcon, PluseCircelIcon } from '../icons'
// // // // // import { PencilSquareIcon, TrashIcon,ArrowTopRightOnSquareIcon, ArrowPathIcon,PencilIcon } from '@heroicons/react/24/outline'
// // // // // import { BrandEyeIcon, Restore_brand,ArrowTopRightOnSquareIconn,TrashIconn,PencilIconn,EyeIcon,EyeIcon2 } from '../icons'

// // // // // import { useLocale, useTranslations } from 'next-intl'
// // // // // import { 
// // // // //     Dialog, 
// // // // //     DialogContent, 
// // // // //     DialogDescription, 
// // // // //     DialogHeader, 
// // // // //     DialogTitle,
// // // // //     DialogFooter 
// // // // // } from '@/components/ui/dialog'
// // // // // import toast from 'react-hot-toast'
// // // // // import { useAppContext } from '@/context/appContext'
// // // // // import mlang from '@/lib/mLang'
// // // // // import ImageApi from '@/components/ImageApi'
// // // // // import Table from '@/components/ui/Table'
// // // // // import { useRouter, useSearchParams, useParams } from 'next/navigation'
// // // // // import AddBrand from './AddBrand'
// // // // // // import LanguageSwitcher from '@/components/LanguageSwitcher'

// // // // // type SupportedLocale = 'ar' | 'en';

// // // // // interface Brand {
// // // // //     id: number;
// // // // //     name: string;
// // // // //     phone: string;
// // // // //     logo: string;
// // // // //     validFrom: string;
// // // // //     validTo: string;
// // // // //     purchaseCount: number;
// // // // //     isActive: boolean;
// // // // //     ratio?: number;
// // // // //     url?: string;
// // // // //     isDeleted: boolean;
// // // // //     status: 'ACTIVE' | 'INACTIVE' | 'DELETED' | 'ADMINACTIVE';
// // // // // }

// // // // // interface BrandsProps {
// // // // //     initialBrands?: Brand[];
// // // // //     initialCount?: number;
// // // // //     validTo: string;
// // // // //     purchaseCount: number;
// // // // //     isActive: boolean;
// // // // //     ratio?: number;
// // // // //     url?: string;

// // // // // }

// // // // // const Brands: React.FC<BrandsProps> = ({ initialBrands, initialCount }) => {
// // // // //     const [brands, setBrands] = useState<Brand[]>(initialBrands || []);
// // // // //     const [count, setCount] = useState(initialCount || 0);
// // // // //     const [openDelete, setOpenDelete] = useState<number | null>(null);
// // // // //     const [loading, setLoading] = useState(false);
// // // // //     const { token } = useAppContext();
// // // // //     const [isAddBrandOpen, setIsAddBrandOpen] = useState(false)
// // // // //     const [currentPage, setCurrentPage] = useState(1);
// // // // //     const [pageSize, setPageSize] = useState(10);
// // // // //     const searchParams = useSearchParams()
// // // // //     const categoryId = searchParams.get('categoryId')
// // // // //     const categoryName = searchParams.get('categoryName')
    
// // // // //     // Add state for filtered brands if needed
// // // // //     const [filteredBrands, setFilteredBrands] = useState<Brand[]>([])

// // // // //     // Add new state for brand categories
// // // // //     const [brandCategories, setBrandCategories] = useState<any[]>([])

// // // // //     const t = useTranslations('brand')
// // // // //     const locale = useLocale() as SupportedLocale;
// // // // //     const router = useRouter()

// // // // //     // Add state for categories dialog
// // // // //     const [showCategoriesDialog, setShowCategoriesDialog] = useState(false)

// // // // //     // Add categoryName state
// // // // //     const [categoryNameState, setCategoryNameState] = useState<string>('');

// // // // //     // Inside the Brands component, add state for editing
// // // // //     const [editingBrand, setEditingBrand] = useState<Brand | null>(null)

// // // // //     // Add categoryId from route params
// // // // //     const params = useParams()
// // // // //     const categoryIdFromRoute = params?.categoryId as string
    
// // // // //     // Update handleViewBrand to fetch brand categories
// // // // //     const handleViewBrand = async (id: number) => {
// // // // //         try {
// // // // //             const response = await fetch(
// // // // //                 `${process.env.NEXT_PUBLIC_BASE_URL}/api/offers?brandId=${id}&fields=id,category=id-name-imageUrl`,
// // // // //                 {
// // // // //                     headers: {
// // // // //                         'Authorization': `Bearer ${token}`
// // // // //                     }
// // // // //                 }
// // // // //             )
            
// // // // //             if (!response.ok) throw new Error('Failed to fetch brand offers')
            
// // // // //             const data = await response.json()
// // // // //             // Extract unique categories from offers
// // // // //             const uniqueCategories = data.offers.reduce((acc: any[], offer: any) => {
// // // // //                 const categoryExists = acc.some(cat => cat.id === offer.category.id)
// // // // //                 if (!categoryExists && offer.category) {
// // // // //                     acc.push({
// // // // //                         id: offer.category.id,
// // // // //                         name: offer.category.name,
// // // // //                         imageUrl: offer.category.imageUrl || '/imgs/notfound.png'
// // // // //                     })
// // // // //                 }
// // // // //                 return acc
// // // // //             }, [])
            
// // // // //             setBrandCategories(uniqueCategories)
// // // // //             setShowCategoriesDialog(true)
// // // // //         } catch (error) {
// // // // //             console.error('Error fetching brand offers:', error)
// // // // //             toast.error('Failed to fetch brand categories')
// // // // //         }
// // // // //     }

// // // // //     // Update fetchBrands function to use offers endpoint
// // // // //     const fetchBrands = async (page: number, limit: number) => {
// // // // //         try {
// // // // //             setLoading(true)
// // // // //             const skip = (page - 1) * limit
            
// // // // //             // Get brandIds from URL if they exist
// // // // //             const brandIds = searchParams.get('ids')
            
// // // // //             // Construct URL with proper parameters
// // // // //             const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brand`)
// // // // //             url.searchParams.set('limit', limit.toString())
// // // // //             url.searchParams.set('skip', skip.toString())
            
// // // // //             if (brandIds) {
// // // // //                 url.searchParams.set('ids', brandIds)
// // // // //             }
            
// // // // //             const response = await fetch(url, {
// // // // //                 headers: {
// // // // //                     'Authorization': `Bearer ${token}`,
// // // // //                     'Content-Type': 'application/json'
// // // // //                 }
// // // // //             })

// // // // //             if (!response.ok) throw new Error('Failed to fetch brands')

// // // // //             const data = await response.json()
// // // // //             setBrands(data.brands || [])
// // // // //             setCount(data.totalCount || 0)
// // // // //         } catch (error) {
// // // // //             console.error('Error fetching brands:', error)
// // // // //             toast.error('Failed to fetch brands')
// // // // //         } finally {
// // // // //             setLoading(false)
// // // // //         }
// // // // //     }

// // // // //     // Update useEffect to react to URL parameter changes
// // // // //     useEffect(() => {
// // // // //         fetchBrands(currentPage, pageSize)
// // // // //     }, [searchParams, currentPage, pageSize])

// // // // //     const fetchCategoryName = async (id: string) => {
// // // // //         try {
// // // // //             const response = await fetch(
// // // // //                 `${process.env.NEXT_PUBLIC_BASE_URL}/api/category/${id}?lang=${locale}`,
// // // // //                 {
// // // // //                     headers: {
// // // // //                         'Authorization': `Bearer ${token}`
// // // // //                     }
// // // // //                 }
// // // // //             )
// // // // //             if (!response.ok) throw new Error('Failed to fetch category')
// // // // //             const data = await response.json()
// // // // //             setCategoryNameState(data.category.name)
// // // // //         } catch (error) {
// // // // //             console.error('Error fetching category:', error)
// // // // //         }
// // // // //     }

// // // // //     // Add pagination calculations
// // // // //     const paginatedBrands = brands.slice(
// // // // //         (currentPage - 1) * pageSize,
// // // // //         currentPage * pageSize
// // // // //     );

    
// // // // //     const handleDeleteBrand = async (id: number) => {
// // // // //         try {
// // // // //             setLoading(true)
            
// // // // //             const response = await fetch(
// // // // //                 `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/${id}/delete`, 
// // // // //                 {
// // // // //                     method: 'PATCH',
// // // // //                     headers: {
// // // // //                         'Authorization': `Bearer ${token}`,
// // // // //                         'Content-Type': 'application/json'
// // // // //                     }
// // // // //                 }
// // // // //             )

// // // // //             const data = await response.json()

// // // // //             if (!response.ok) {
// // // // //                 throw new Error(data.message || t('deleteFailed'))
// // // // //             }

// // // // //             // Update both isDeleted and status in the local state
// // // // //             setBrands(prevBrands => 
// // // // //                 prevBrands.map(brand => 
// // // // //                     brand.id === id 
// // // // //                         ? { ...brand, isDeleted: true, status: 'DELETED' }
// // // // //                         : brand
// // // // //                 )
// // // // //             )
            
// // // // //             setOpenDelete(null)
// // // // //             toast.success(data.message || t('successDelete'))
// // // // //         } catch (error: any) {
// // // // //             console.error('Delete brand error:', error)
// // // // //             toast.error(error.message || t('deleteFailed'))
// // // // //         } finally {
// // // // //             setLoading(false)
// // // // //         }
// // // // //     }

// // // // //     const handleRestoreBrand = async (id: number) => {
// // // // //         try {
// // // // //             setLoading(true)
            
// // // // //             const response = await fetch(
// // // // //                 `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/${id}/restore`,
// // // // //                 {
// // // // //                     method: 'PATCH',
// // // // //                     headers: {
// // // // //                         'Authorization': `Bearer ${token}`,
// // // // //                         'Content-Type': 'application/json'
// // // // //                     }
// // // // //                 }
// // // // //             )

// // // // //             const data = await response.json()

// // // // //             if (!response.ok) {
// // // // //                 throw new Error(data.message || t('restoreFailed'))
// // // // //             }

// // // // //             // Update the brand in the local state with the returned data
// // // // //             setBrands(prevBrands => 
// // // // //                 prevBrands.map(brand => 
// // // // //                     brand.id === id 
// // // // //                         ? { 
// // // // //                             ...brand, 
// // // // //                             isDeleted: false,
// // // // //                             status: data.brand.status // Use the status from the server response
// // // // //                         }
// // // // //                         : brand
// // // // //                 )
// // // // //             )

// // // // //             toast.success(data.message || t('successRestore'))
// // // // //         } catch (error: any) {
// // // // //             console.error('Restore brand error:', error)
// // // // //             toast.error(error.message || t('restoreFailed'))
// // // // //         } finally {
// // // // //             setLoading(false)
// // // // //         }
// // // // //     }

// // // // //     // Table headers configuration
// // // // //     const tableHeaders = [
// // // // //         { name: 'image', className: 'w-[100px]' },
// // // // //         { name: 'brandName', className: 'w-[200px]' },
// // // // //         { name: 'BrandContactNumber', className: 'w-[200px]' },
// // // // //         { name: 'BrandValidFrom', className: 'w-[150px]' },
// // // // //         { name: 'BrandValidTo', className: 'w-[150px]' },
// // // // //         { name: 'BrandStatus', className: 'w-[100px]' },
// // // // //         { name: 'brandAction', className: 'w-[100px] text-right' }
// // // // //     ];

// // // // //     // Table row render function
// // // // //     const renderTableRows = () => {
// // // // //         if (!brands?.length) return [];

// // // // //         return brands.map((brand: Brand) => {
// // // // //             // Determine the display status and background color
// // // // //             const displayStatus = brand.status === 'ADMINACTIVE' ? 'ACTIVE' : brand.status;
// // // // //             const statusColor = brand.status === 'DELETED' ? 'bg-red-100 text-red-800' : 
// // // // //                                 displayStatus === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
// // // // //                                 'bg-yellow-100 text-yellow-800';
// // // // //             const rowBackground = brand.status === 'DELETED' ? 'bg-red-100/60' : 'odd:bg-white even:bg-primary/5';

// // // // //             return (
// // // // //                 <tr 
// // // // //                     key={brand.id} 
// // // // //                     className={`border-b ${rowBackground}`}
// // // // //                 >
// // // // //                     <td className="px-6 py-4">
// // // // //                         <div className="size-12">
// // // // //                             <ImageApi
// // // // //                                 src={brand.logo || '/imgs/notfound.png'}
// // // // //                                 alt={mlang(brand.name, locale)}
// // // // //                                 loader={() => brand.logo}
// // // // //                                 loading='lazy'
// // // // //                                 height={48}
// // // // //                                 width={48}
// // // // //                                 className='object-cover rounded-full w-full h-full'
// // // // //                             />
// // // // //                         </div>
// // // // //                     </td>
// // // // //                     <td className="px-6 py-4 font-medium">
// // // // //                         {mlang(brand.name, locale)}
// // // // //                     </td>
// // // // //                     <td className="px-6 py-4">
// // // // //                         {brand.phone || t('noPhone')}
// // // // //                     </td>
// // // // //                     <td className="px-6 py-4">
// // // // //                         {brand.validFrom ? new Date(brand.validFrom).toLocaleDateString(locale) : '-'}
// // // // //                     </td>
// // // // //                     <td className="px-6 py-4">
// // // // //                         {brand.validTo ? new Date(brand.validTo).toLocaleDateString(locale) : '-'}
// // // // //                     </td>
// // // // //                     <td className="px-6 py-4">
// // // // //                         <span className={`px-2 py-1 rounded-full text-xs ${statusColor}`}>
// // // // //                             {displayStatus === 'DELETED' 
// // // // //                                 ? t('deleted')
// // // // //                                 : displayStatus === 'ACTIVE'
// // // // //                                     ? t('active')
// // // // //                                     : t('notActive')
// // // // //                             }
// // // // //                         </span>
// // // // //                     </td>
// // // // //                     <td className="px-6 py-4 text-right">
// // // // //                         <div className="flex justify-end gap-3">
// // // // //                             {brand.status !== 'DELETED' ? (
// // // // //                                 <>
// // // // //                                     {/* View Categories button */}
// // // // //                                     <button
// // // // //                                         onClick={() => handleViewBrand(brand.id)}
// // // // //                                         className='text-green-500 hover:text-green-700'
// // // // //                                         aria-label={t('viewCategories')}
// // // // //                                     >
// // // // //                                         <BrandEyeIcon className='w-5 h-5 text-[#00a18f] hover:text-gray-700' />
// // // // //                                     </button>
                                    

// // // // //                                     {/* View Details button */}
// // // // //                                     <button
// // // // //                                         onClick={() => router.push(`/${locale}/brands/${brand.id}`)}
// // // // //                                         className='text-blue-500 hover:text-blue-700'
// // // // //                                         aria-label={t('viewBrandDetails')}
// // // // //                                     >
// // // // //                                         <ArrowTopRightOnSquareIconn className='w-5 h-5 text-[#00a18f] hover:text-gray-700' />
// // // // //                                     </button>
// // // // //                                     {/* Edit button */}
// // // // //                                     <button
// // // // //                                         onClick={() => setEditingBrand(brand)}
// // // // //                                         className='text-blue-500 hover:text-blue-700'
// // // // //                                         aria-label={t('editBrand')}
// // // // //                                     >
// // // // //                                         <PencilIconn className='w-5 h-5 text-[#00a18f] hover:text-gray-700' />
// // // // //                                     </button>


// // // // //                                     {/* Delete button */}
// // // // //                                     <button
// // // // //                                         onClick={() => setOpenDelete(brand.id)}
// // // // //                                         className='text-red-500 hover:text-red-700'
// // // // //                                         aria-label={t('deleteBrand')}
// // // // //                                     >
// // // // //                                         <TrashIconn className='w-5 h-5 text-[#00a18f] hover:text-gray-700' />
// // // // //                                     </button>
// // // // //                                 </>
// // // // //                             ) : (
// // // // //                                 // Restore button for deleted brands
// // // // //                                 <button
// // // // //                                     onClick={() => handleRestoreBrand(brand.id)}
// // // // //                                     className='flex items-center gap-2 text-primary hover:text-primary/70'
// // // // //                                     aria-label={t('restoreBrand')}
// // // // //                                 >
// // // // //                                     <Restore_brand   className='w-5 h-5' />
// // // // //                                     <span>{t('restore')}</span>
// // // // //                                 </button>
// // // // //                             )}
// // // // //                         </div>
// // // // //                     </td>
// // // // //                 </tr>
// // // // //             );
// // // // //         });
// // // // //     }

// // // // //     // Add this function to handle language change
// // // // //     const handleLanguageChange = (newLocale: string) => {
// // // // //         // Preserve the current URL parameters when changing language
// // // // //         const params = new URLSearchParams(searchParams.toString())
// // // // //         router.push(`/${newLocale}/brands?${params.toString()}`)
// // // // //     }

// // // // //     // Add event listener for offer changes
// // // // //     useEffect(() => {
// // // // //         const handleOffersChange = () => {
// // // // //             // Refresh the brands list when offers change
// // // // //             fetchBrands(currentPage, pageSize)
// // // // //         }

// // // // //         window.addEventListener('brandOffersChanged', handleOffersChange)

// // // // //         return () => {
// // // // //             window.removeEventListener('brandOffersChanged', handleOffersChange)
// // // // //         }
// // // // //     }, [currentPage, pageSize])

// // // // //     return (
// // // // //         <div className='p-container space-y-6'>
// // // // //             <div className='flex justify-between items-center'>
// // // // //                 <div className='flex items-center gap-4'>
// // // // //                     <h4 className='font-bold text-lg md:text-xl lg:text-2xl'>{t('title')}</h4>
// // // // //                     {searchParams.get('ids') && categoryName && (
// // // // //                         <div className='flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full'>
// // // // //                             <span className='text-sm text-primary'>
// // // // //                                 {t('filteredBy')}: {decodeURIComponent(categoryName)}
// // // // //                             </span>
// // // // //                             <button
// // // // //                                 onClick={() => router.push(`/${locale}/brands`)}
// // // // //                                 className='text-primary hover:text-primary/70'
// // // // //                                 aria-label={t('clear_filter')}
// // // // //                             >
// // // // //                                 <TrashIcon className='w-5 h-5' />
// // // // //                             </button>
// // // // //                         </div>
// // // // //                     )}
// // // // //                 </div>
// // // // //                 {/* <button
// // // // //                     onClick={() => setIsAddBrandOpen(true)}
// // // // //                     className='px-5 py-2  rounded-md text-white font-medium'
// // // // //                 >
// // // // //                     <div className='flex gap-3  border-2 border-[#02161e] rounded-md px-2 py-1 bg-[#02161e] text-white'>
// // // // //                         <PluseCircelIcon className='size-6 text-teal-500' />
// // // // //                         <div className='flex-1'>{t('brandaddButton')}</div>
// // // // //                     </div>
// // // // //                 </button> */}

// // // // // <button
// // // // //           onClick={() => {
// // // // //             setIsAddBrandOpen(true);
// // // // //           }}    
// // // // //           className="px-5 py-2 bg-primary rounded-md text-white font-medium"
// // // // //         >

// // // // //           <div className="flex gap-3">
// // // // //             <PluseCircelIcon className="size-6" />
// // // // //             <div className="flex-1">{t("brandaddButton")}</div>
// // // // //           </div>
// // // // //         </button>
// // // // //             </div>

// // // // //             <Table
// // // // //                 data={brands}
// // // // //                 headers={tableHeaders}
// // // // //                 count={count}
// // // // //                 loading={loading}
// // // // //                 showDateFilter={false}
// // // // //                 currentPage={currentPage}
// // // // //                 pageSize={pageSize}
// // // // //                 onPageChange={(page) => setCurrentPage(page)}
// // // // //                 onPageSizeChange={(size) => {
// // // // //                     setPageSize(size)
// // // // //                     setCurrentPage(1)
// // // // //                 }}
// // // // //                 showExport={true}
// // // // //                 bgColor="#02161e"
// // // // //             >
// // // // //                 {renderTableRows()}
// // // // //             </Table>

// // // // //             {/* Delete Confirmation Dialog */}
// // // // //             <Dialog open={!!openDelete} onOpenChange={() => setOpenDelete(null)}>
// // // // //                 <DialogContent>
// // // // //                     <DialogHeader>
// // // // //                         <DialogTitle>{t('branddeleteButton')}</DialogTitle>
// // // // //                         <DialogDescription>{t('deleteMessage')}</DialogDescription>
// // // // //                     </DialogHeader>
// // // // //                     <div className='flex gap-2'>
// // // // //                         <button 
// // // // //                             onClick={() => setOpenDelete(null)} 
// // // // //                             className='px-3 py-2 rounded-md border'
// // // // //                         >
// // // // //                             {t('cancel_delete_brand')}
// // // // //                         </button>
// // // // //                         <button 
// // // // //                             onClick={() => openDelete && handleDeleteBrand(openDelete)} 
// // // // //                             className='px-3 py-2 rounded-md bg-red-500 text-white'
// // // // //                         >
// // // // //                             {loading ? <LoadingIcon className='size-5 animate-spin' /> : t('deleteBrand')}
// // // // //                         </button>
// // // // //                     </div>
// // // // //                 </DialogContent>
// // // // //             </Dialog>

// // // // //             {/* Add the AddBrand dialog with editing support */}
// // // // //             <AddBrand 
// // // // //                 isOpen={isAddBrandOpen || !!editingBrand} 
// // // // //                 onClose={() => {
// // // // //                     setIsAddBrandOpen(false)
// // // // //                     setEditingBrand(null)
// // // // //                 }}
// // // // //                 brandToEdit={editingBrand}
// // // // //             />

// // // // //             {/* Brand Categories Dialog */}
// // // // //             <Dialog open={showCategoriesDialog} onOpenChange={setShowCategoriesDialog}>
// // // // //                 <DialogContent>
// // // // //                     <DialogHeader>
// // // // //                         <DialogTitle>{t('brandCategories')}</DialogTitle>
// // // // //                         <DialogDescription>
// // // // //                             {brandCategories.length > 0 
// // // // //                                 ? t('brandCategoriesDescription')
// // // // //                                 : t('noCategoriesFound')}
// // // // //                         </DialogDescription>
// // // // //                     </DialogHeader>
// // // // //                     {brandCategories.length > 0 ? (
// // // // //                         <div className="grid grid-cols-2 gap-4">
// // // // //                             {brandCategories.map((category) => (
// // // // //                                 <div 
// // // // //                                     key={category.id}
// // // // //                                     className="p-4 border rounded-lg flex items-center gap-3"
// // // // //                                 >
// // // // //                                     <div className="w-10 h-10 flex-shrink-0">
// // // // //                                         <ImageApi
// // // // //                                             src={category.imageUrl}
// // // // //                                             alt={mlang(category.name, locale)}
// // // // //                                             loader={() => category.imageUrl}
// // // // //                                             loading='lazy'
// // // // //                                             height={40}
// // // // //                                             width={40}
// // // // //                                             className='object-cover rounded w-full h-full'
// // // // //                                         />
// // // // //                                     </div>
// // // // //                                     <span className="flex-1 truncate">
// // // // //                                         {mlang(category.name, locale)}
// // // // //                                     </span>
// // // // //                                 </div>
// // // // //                             ))}
// // // // //                         </div>
// // // // //                     ) : (
// // // // //                         <div className="text-center py-4 text-gray-500">
// // // // //                             {t('noCategoriesFound')}
// // // // //                         </div>
// // // // //                     )}
// // // // //                 </DialogContent>
// // // // //             </Dialog>

// // // // //             {/* <LanguageSwitcher onChange={handleLanguageChange} /> */}
// // // // //         </div>
// // // // //     )
// // // // // }

// // // // // export type { Brand, BrandsProps };
// // // // // export default Brands


// // // // 'use client'
// // // // import React, { useEffect, useState } from 'react'
// // // // import { CategoryIconn,CategoryIconn_green, DeleteIcon, LoadingIcon, PluseCircelIcon } from '../icons'
// // // // import { PencilSquareIcon, TrashIcon,ArrowTopRightOnSquareIcon, ArrowPathIcon,PencilIcon } from '@heroicons/react/24/outline'
// // // // import { BrandEyeIcon, Restore_brand,ArrowTopRightOnSquareIconn,TrashIconn,PencilIconn,EyeIcon,EyeIcon2 } from '../icons'

// // // // import { useLocale, useTranslations } from 'next-intl'
// // // // import { 
// // // //     Dialog, 
// // // //     DialogContent, 
// // // //     DialogDescription, 
// // // //     DialogHeader, 
// // // //     DialogTitle,
// // // //     DialogFooter 
// // // // } from '@/components/ui/dialog'
// // // // import toast from 'react-hot-toast'
// // // // import { useAppContext } from '@/context/appContext'
// // // // import mlang from '@/lib/mLang'
// // // // import ImageApi from '@/components/ImageApi'
// // // // import Table from '@/components/ui/Table'
// // // // import { useRouter, useSearchParams, useParams } from 'next/navigation'
// // // // import AddBrand from './AddBrand'
// // // // // import LanguageSwitcher from '@/components/LanguageSwitcher'

// // // // type SupportedLocale = 'ar' | 'en';

// // // // interface Brand {
// // // //     id: number;
// // // //     name: string;
// // // //     phone: string;
// // // //     logo: string;
// // // //     validFrom: string;
// // // //     validTo: string;
// // // //     purchaseCount: number;
// // // //     isActive: boolean;
// // // //     ratio?: number;
// // // //     url?: string;
// // // //     isDeleted: boolean;
// // // //     status: 'ACTIVE' | 'INACTIVE' | 'DELETED' | 'ADMINACTIVE';
// // // // }

// // // // interface BrandsProps {
// // // //     initialBrands?: Brand[];
// // // //     initialCount?: number;
// // // //     validTo: string;
// // // //     purchaseCount: number;
// // // //     isActive: boolean;
// // // //     ratio?: number;
// // // //     url?: string;

// // // // }

// // // // const Brands: React.FC<BrandsProps> = ({ initialBrands, initialCount }) => {
// // // //     const [brands, setBrands] = useState<Brand[]>(initialBrands || []);
// // // //     const [count, setCount] = useState(initialCount || 0);
// // // //     const [openDelete, setOpenDelete] = useState<number | null>(null);
// // // //     const [loading, setLoading] = useState(false);
// // // //     const { token } = useAppContext();
// // // //     const [isAddBrandOpen, setIsAddBrandOpen] = useState(false)
// // // //     const [currentPage, setCurrentPage] = useState(1);
// // // //     const [pageSize, setPageSize] = useState(10);
// // // //     const searchParams = useSearchParams()
// // // //     const categoryId = searchParams.get('categoryId')
// // // //     const categoryName = searchParams.get('categoryName')
    
// // // //     // Add state for filtered brands if needed
// // // //     const [filteredBrands, setFilteredBrands] = useState<Brand[]>([])

// // // //     // Add new state for brand categories
// // // //     const [brandCategories, setBrandCategories] = useState<any[]>([])

// // // //     const t = useTranslations('brand')
// // // //     const locale = useLocale() as SupportedLocale;
// // // //     const router = useRouter()

// // // //     // Add state for categories dialog
// // // //     const [showCategoriesDialog, setShowCategoriesDialog] = useState(false)

// // // //     // Add categoryName state
// // // //     const [categoryNameState, setCategoryNameState] = useState<string>('');

// // // //     // Inside the Brands component, add state for editing
// // // //     const [editingBrand, setEditingBrand] = useState<Brand | null>(null)

// // // //     // Add categoryId from route params
// // // //     const params = useParams()
// // // //     const categoryIdFromRoute = params?.categoryId as string
    
// // // //     // Update handleViewBrand to fetch brand categories
// // // //     const handleViewBrand = async (id: number) => {
// // // //         try {
// // // //             const response = await fetch(
// // // //                 `${process.env.NEXT_PUBLIC_BASE_URL}/api/offers?brandId=${id}`,
// // // //                 {
// // // //                     headers: {
// // // //                         'Authorization': `Bearer ${token}`
// // // //                     }
// // // //                 }
// // // //             )
            
// // // //             if (!response.ok) throw new Error('Failed to fetch brand offers')
            
// // // //             const data = await response.json()
// // // //             // Extract unique categories from offers
// // // //             const uniqueCategories = data.offers.reduce((acc: any[], offer: any) => {
// // // //                 const categoryExists = acc.some(cat => cat.id === offer.category.id)
// // // //                 if (!categoryExists && offer.category) {
// // // //                     acc.push({
// // // //                         id: offer.category.id,
// // // //                         name: offer.category.name,
// // // //                         imageUrl: offer.category.imageUrl || '/imgs/notfound.png'
// // // //                     })
// // // //                 }
// // // //                 return acc
// // // //             }, [])
            
// // // //             setBrandCategories(uniqueCategories)
// // // //             setShowCategoriesDialog(true)
// // // //         } catch (error) {
// // // //             console.error('Error fetching brand offers:', error)
// // // //             toast.error('Failed to fetch brand categories')
// // // //         }
// // // //     }

// // // //     // Update fetchBrands function to use offers endpoint
// // // //     const fetchBrands = async (page: number, limit: number) => {
// // // //         try {
// // // //             setLoading(true)
// // // //             const skip = (page - 1) * limit
            
// // // //             // Get brandIds from URL if they exist
// // // //             const brandIds = searchParams.get('ids')
            
// // // //             // Construct URL with proper parameters
// // // //             const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brand`)
// // // //             url.searchParams.set('limit', limit.toString())
// // // //             url.searchParams.set('skip', skip.toString())
            
// // // //             if (brandIds) {
// // // //                 url.searchParams.set('ids', brandIds)
// // // //             }
            
// // // //             const response = await fetch(url, {
// // // //                 headers: {
// // // //                     'Authorization': `Bearer ${token}`,
// // // //                     'Content-Type': 'application/json'
// // // //                 }
// // // //             })

// // // //             if (!response.ok) throw new Error('Failed to fetch brands')

// // // //             const data = await response.json()
// // // //             setBrands(data.brands || [])
// // // //             setCount(data.totalCount || 0)
// // // //         } catch (error) {
// // // //             console.error('Error fetching brands:', error)
// // // //             toast.error('Failed to fetch brands')
// // // //         } finally {
// // // //             setLoading(false)
// // // //         }
// // // //     }

// // // //     // Update useEffect to react to URL parameter changes
// // // //     useEffect(() => {
// // // //         fetchBrands(currentPage, pageSize)
// // // //     }, [searchParams, currentPage, pageSize])

// // // //     const fetchCategoryName = async (id: string) => {
// // // //         try {
// // // //             const response = await fetch(
// // // //                 `${process.env.NEXT_PUBLIC_BASE_URL}/api/category/${id}?lang=${locale}`,
// // // //                 {
// // // //                     headers: {
// // // //                         'Authorization': `Bearer ${token}`
// // // //                     }
// // // //                 }
// // // //             )
// // // //             if (!response.ok) throw new Error('Failed to fetch category')
// // // //             const data = await response.json()
// // // //             setCategoryNameState(data.category.name)
// // // //         } catch (error) {
// // // //             console.error('Error fetching category:', error)
// // // //         }
// // // //     }

// // // //     // Add pagination calculations
// // // //     const paginatedBrands = brands.slice(
// // // //         (currentPage - 1) * pageSize,
// // // //         currentPage * pageSize
// // // //     );

    
// // // //     const handleDeleteBrand = async (id: number) => {
// // // //         try {
// // // //             setLoading(true)
            
// // // //             const response = await fetch(
// // // //                 `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/${id}/delete`, 
// // // //                 {
// // // //                     method: 'PATCH',
// // // //                     headers: {
// // // //                         'Authorization': `Bearer ${token}`,
// // // //                         'Content-Type': 'application/json'
// // // //                     }
// // // //                 }
// // // //             )

// // // //             const data = await response.json()

// // // //             if (!response.ok) {
// // // //                 throw new Error(data.message || t('deleteFailed'))
// // // //             }

// // // //             // Update both isDeleted and status in the local state
// // // //             setBrands(prevBrands => 
// // // //                 prevBrands.map(brand => 
// // // //                     brand.id === id 
// // // //                         ? { ...brand, isDeleted: true, status: 'DELETED' }
// // // //                         : brand
// // // //                 )
// // // //             )
            
// // // //             setOpenDelete(null)
// // // //             toast.success(data.message || t('successDelete'))
// // // //         } catch (error: any) {
// // // //             console.error('Delete brand error:', error)
// // // //             toast.error(error.message || t('deleteFailed'))
// // // //         } finally {
// // // //             setLoading(false)
// // // //         }
// // // //     }

// // // //     const handleRestoreBrand = async (id: number) => {
// // // //         try {
// // // //             setLoading(true)
            
// // // //             const response = await fetch(
// // // //                 `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/${id}/restore`,
// // // //                 {
// // // //                     method: 'PATCH',
// // // //                     headers: {
// // // //                         'Authorization': `Bearer ${token}`,
// // // //                         'Content-Type': 'application/json'
// // // //                     }
// // // //                 }
// // // //             )

// // // //             const data = await response.json()

// // // //             if (!response.ok) {
// // // //                 throw new Error(data.message || t('restoreFailed'))
// // // //             }

// // // //             // Update the brand in the local state with the returned data
// // // //             setBrands(prevBrands => 
// // // //                 prevBrands.map(brand => 
// // // //                     brand.id === id 
// // // //                         ? { 
// // // //                             ...brand, 
// // // //                             isDeleted: false,
// // // //                             status: data.brand.status // Use the status from the server response
// // // //                         }
// // // //                         : brand
// // // //                 )
// // // //             )

// // // //             toast.success(data.message || t('successRestore'))
// // // //         } catch (error: any) {
// // // //             console.error('Restore brand error:', error)
// // // //             toast.error(error.message || t('restoreFailed'))
// // // //         } finally {
// // // //             setLoading(false)
// // // //         }
// // // //     }

// // // //     // Table headers configuration
// // // //     const tableHeaders = [
// // // //         { name: 'image', className: 'w-[100px]' },
// // // //         { name: 'brandName', className: 'w-[200px]' },
// // // //         { name: 'BrandContactNumber', className: 'w-[200px]' },
// // // //         { name: 'BrandValidFrom', className: 'w-[150px]' },
// // // //         { name: 'BrandValidTo', className: 'w-[150px]' },
// // // //         { name: 'BrandStatus', className: 'w-[100px]' },
// // // //         { name: 'brandAction', className: 'w-[100px] text-right' }
// // // //     ];

// // // //     // Table row render function
// // // //     const renderTableRows = () => {
// // // //         if (!brands?.length) return [];

// // // //         return brands.map((brand: Brand) => {
// // // //             // Determine the display status and background color
// // // //             const displayStatus = brand.status === 'ADMINACTIVE' ? 'ACTIVE' : brand.status;
// // // //             const statusColor = brand.status === 'DELETED' ? 'bg-red-100 text-red-800' : 
// // // //                                 displayStatus === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
// // // //                                 'bg-yellow-100 text-yellow-800';
// // // //             const rowBackground = brand.status === 'DELETED' ? 'bg-red-100/60' : 'odd:bg-white even:bg-primary/5';

// // // //             return (
// // // //                 <tr 
// // // //                     key={brand.id} 
// // // //                     className={`border-b ${rowBackground}`}
// // // //                 >
// // // //                     <td className="px-6 py-4">
// // // //                         <div className="size-12">
// // // //                             <ImageApi
// // // //                                 src={brand.logo || '/imgs/notfound.png'}
// // // //                                 alt={mlang(brand.name, locale)}
// // // //                                 loader={() => brand.logo}
// // // //                                 loading='lazy'
// // // //                                 height={48}
// // // //                                 width={48}
// // // //                                 className='object-cover rounded-full w-full h-full'
// // // //                             />
// // // //                         </div>
// // // //                     </td>
// // // //                     <td className="px-6 py-4 font-medium">
// // // //                         {mlang(brand.name, locale)}
// // // //                     </td>
// // // //                     <td className="px-6 py-4">
// // // //                         {brand.phone || t('noPhone')}
// // // //                     </td>
// // // //                     <td className="px-6 py-4">
// // // //                         {brand.validFrom ? new Date(brand.validFrom).toLocaleDateString(locale) : '-'}
// // // //                     </td>
// // // //                     <td className="px-6 py-4">
// // // //                         {brand.validTo ? new Date(brand.validTo).toLocaleDateString(locale) : '-'}
// // // //                     </td>
// // // //                     <td className="px-6 py-4">
// // // //                         <span className={`px-2 py-1 rounded-full text-xs ${statusColor}`}>
// // // //                             {displayStatus === 'DELETED' 
// // // //                                 ? t('deleted')
// // // //                                 : displayStatus === 'ACTIVE'
// // // //                                     ? t('active')
// // // //                                     : t('notActive')
// // // //                             }
// // // //                         </span>
// // // //                     </td>
// // // //                     <td className="px-6 py-4 text-right">
// // // //                         <div className="flex justify-end gap-3">
// // // //                             {brand.status !== 'DELETED' ? (
// // // //                                 <>
// // // //                                     {/* View Categories button */}
// // // //                                     <button
// // // //                                         onClick={() => handleViewBrand(brand.id)}
// // // //                                         className='text-green-500 hover:text-green-700 text-[#24ae9f]'
// // // //                                         aria-label={t('viewCategories')}
// // // //                                     >
// // // //                                         <CategoryIconn_green className='w-5 h-5 text-[#24ae9f]/80 hover:text-gray-700' />
// // // //                                     </button>
                                    

// // // //                                     {/* View Details button */}
// // // //                                     <button
// // // //                                         onClick={() => router.push(`/${locale}/brands/${brand.id}`)}
// // // //                                         className='text-blue-500 hover:text-blue-700'
// // // //                                         aria-label={t('viewBrandDetails')}
// // // //                                     >
// // // //                                         <ArrowTopRightOnSquareIconn className='w-5 h-5 text-[#00a18f] hover:text-gray-700' />
// // // //                                     </button>



// // // //                                     {/* Edit button */}
// // // //                                     {/* <button
// // // //                                         onClick={() => setEditingBrand(brand)}
// // // //                                         className='text-blue-500 hover:text-blue-700'
// // // //                                         aria-label={t('editBrand')}
// // // //                                     >
// // // //                                         <PencilIconn className='w-5 h-5 text-[#00a18f] hover:text-gray-700' />
// // // //                                     </button> */}


// // // //                                     {/* Delete button */}
// // // //                                     <button
// // // //                                         onClick={() => setOpenDelete(brand.id)}
// // // //                                         className='text-red-500 hover:text-red-700'
// // // //                                         aria-label={t('deleteBrand')}
// // // //                                     >
// // // //                                         <TrashIconn className='w-5 h-5 text-[#00a18f] hover:text-gray-700' />
// // // //                                     </button>
// // // //                                 </>
// // // //                             ) : (
// // // //                                 // Restore button for deleted brands
// // // //                                 <button
// // // //                                     onClick={() => handleRestoreBrand(brand.id)}
// // // //                                     className='flex items-center gap-2 text-primary hover:text-primary/70'
// // // //                                     aria-label={t('restoreBrand')}
// // // //                                 >
// // // //                                     <Restore_brand   className='w-5 h-5' />
// // // //                                     <span>{t('restore')}</span>
// // // //                                 </button>
// // // //                             )}
// // // //                         </div>
// // // //                     </td>
// // // //                 </tr>
// // // //             );
// // // //         });
// // // //     }

// // // //     // Add this function to handle language change
// // // //     const handleLanguageChange = (newLocale: string) => {
// // // //         // Preserve the current URL parameters when changing language
// // // //         const params = new URLSearchParams(searchParams.toString())
// // // //         router.push(`/${newLocale}/brands?${params.toString()}`)
// // // //     }

// // // //     // Add event listener for offer changes
// // // //     useEffect(() => {
// // // //         const handleOffersChange = () => {
// // // //             // Refresh the brands list when offers change
// // // //             fetchBrands(currentPage, pageSize)
// // // //         }

// // // //         window.addEventListener('brandOffersChanged', handleOffersChange)

// // // //         return () => {
// // // //             window.removeEventListener('brandOffersChanged', handleOffersChange)
// // // //         }
// // // //     }, [currentPage, pageSize])

// // // //     return (
// // // //         <div className='p-container space-y-6'>
// // // //             <div className='flex justify-between items-center'>
// // // //                 <div className='flex items-center gap-4'>
// // // //                     <h4 className='font-bold text-lg md:text-xl lg:text-2xl'>{t('title')}</h4>
// // // //                     {searchParams.get('ids') && categoryName && (
// // // //                         <div className='flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full'>
// // // //                             <span className='text-sm text-primary'>
// // // //                                 {t('filteredBy')}: {decodeURIComponent(categoryName)}
// // // //                             </span>
// // // //                             <button
// // // //                                 onClick={() => router.push(`/${locale}/brands`)}
// // // //                                 className='text-primary hover:text-primary/70'
// // // //                                 aria-label={t('clear_filter')}
// // // //                             >
// // // //                                 <TrashIcon className='w-5 h-5' />
// // // //                             </button>
// // // //                         </div>
// // // //                     )}
// // // //                 </div>
// // // //                 {/* <button
// // // //                     onClick={() => setIsAddBrandOpen(true)}
// // // //                     className='px-5 py-2  rounded-md text-white font-medium'
// // // //                 >
// // // //                     <div className='flex gap-3  border-2 border-[#02161e] rounded-md px-2 py-1 bg-[#02161e] text-white'>
// // // //                         <PluseCircelIcon className='size-6 text-teal-500' />
// // // //                         <div className='flex-1'>{t('brandaddButton')}</div>
// // // //                     </div>
// // // //                 </button> */}

// // // // <button
// // // //           onClick={() => {
// // // //             setIsAddBrandOpen(true);
// // // //           }}    
// // // //           className="px-5 py-2 bg-primary rounded-md text-white font-medium"
// // // //         >

// // // //           <div className="flex gap-3">
// // // //             <PluseCircelIcon className="size-6" />
// // // //             <div className="flex-1">{t("brandaddButton")}</div>
// // // //           </div>
// // // //         </button>
// // // //             </div>

// // // //             <Table
// // // //                 data={brands}
// // // //                 headers={tableHeaders}
// // // //                 count={count}
// // // //                 loading={loading}
// // // //                 showDateFilter={false}
// // // //                 currentPage={currentPage}
// // // //                 pageSize={pageSize}
// // // //                 onPageChange={(page) => setCurrentPage(page)}
// // // //                 onPageSizeChange={(size) => {
// // // //                     setPageSize(size)
// // // //                     setCurrentPage(1)
// // // //                 }}
// // // //                 showExport={true}
// // // //                 bgColor="#02161e"
// // // //             >
// // // //                 {renderTableRows()}
// // // //             </Table>

// // // //             {/* Delete Confirmation Dialog */}
// // // //             <Dialog open={!!openDelete} onOpenChange={() => setOpenDelete(null)}>
// // // //                 <DialogContent>
// // // //                     <DialogHeader>
// // // //                         <DialogTitle>{t('branddeleteButton')}</DialogTitle>
// // // //                         <DialogDescription>{t('deleteMessage')}</DialogDescription>
// // // //                     </DialogHeader>
// // // //                     <div className='flex gap-2'>
// // // //                         <button 
// // // //                             onClick={() => setOpenDelete(null)} 
// // // //                             className='px-3 py-2 rounded-md border'
// // // //                         >
// // // //                             {t('cancel_delete_brand')}
// // // //                         </button>
// // // //                         <button 
// // // //                             onClick={() => openDelete && handleDeleteBrand(openDelete)} 
// // // //                             className='px-3 py-2 rounded-md bg-red-500 text-white'
// // // //                         >
// // // //                             {loading ? <LoadingIcon className='size-5 animate-spin' /> : t('deleteBrand')}
// // // //                         </button>
// // // //                     </div>
// // // //                 </DialogContent>
// // // //             </Dialog>

// // // //             {/* Add the AddBrand dialog with editing support */}
// // // //             <AddBrand 
// // // //                 isOpen={isAddBrandOpen || !!editingBrand} 
// // // //                 onClose={() => {
// // // //                     setIsAddBrandOpen(false)
// // // //                     setEditingBrand(null)
// // // //                 }}
// // // //                 brandToEdit={editingBrand}
// // // //             />

// // // //             {/* Brand Categories Dialog */}
// // // //             <Dialog open={showCategoriesDialog} onOpenChange={setShowCategoriesDialog}>
// // // //                 <DialogContent>
// // // //                     <DialogHeader>
// // // //                         <DialogTitle>{t('brandCategories')}</DialogTitle>
// // // //                         <DialogDescription>
// // // //                             {brandCategories.length > 0 
// // // //                                 ? t('brandCategoriesDescription')
// // // //                                 : t('noCategoriesFound')}
// // // //                         </DialogDescription>
// // // //                     </DialogHeader>
// // // //                     {brandCategories.length > 0 ? (
// // // //                         <div className="grid grid-cols-2 gap-4">
// // // //                             {brandCategories.map((category) => (
// // // //                                 <div 
// // // //                                     key={category.id}
// // // //                                     className="p-4 border rounded-lg flex items-center gap-3"
// // // //                                 >
// // // //                                     <div className="w-10 h-10 flex-shrink-0">
// // // //                                         <ImageApi
// // // //                                             src={category.imageUrl}
// // // //                                             alt={mlang(category.name, locale)}
// // // //                                             loader={() => category.imageUrl}
// // // //                                             loading='lazy'
// // // //                                             height={40}
// // // //                                             width={40}
// // // //                                             className='object-cover rounded w-full h-full'
// // // //                                         />
// // // //                                     </div>
// // // //                                     <span className="flex-1 truncate">
// // // //                                         {mlang(category.name, locale)}
// // // //                                     </span>
// // // //                                 </div>
// // // //                             ))}
// // // //                         </div>
// // // //                     ) : (
// // // //                         <div className="text-center py-4 text-gray-500">
// // // //                             {t('noCategoriesFound')}
// // // //                         </div>
// // // //                     )}
// // // //                 </DialogContent>
// // // //             </Dialog>

// // // //             {/* <LanguageSwitcher onChange={handleLanguageChange} /> */}
// // // //         </div>
// // // //     )
// // // // }

// // // // export type { Brand, BrandsProps };
// // // // export default Brands

// // // 'use client'
// // // import React, { useEffect, useState } from 'react'
// // // import { CategoryIconn,CategoryIconn_green, DeleteIcon, LoadingIcon, PluseCircelIcon } from '../icons'
// // // import { PencilSquareIcon, TrashIcon,ArrowTopRightOnSquareIcon, ArrowPathIcon,PencilIcon } from '@heroicons/react/24/outline'
// // // import { BrandEyeIcon, Restore_brand,ArrowTopRightOnSquareIconn,TrashIconn,PencilIconn,EyeIcon,EyeIcon2 } from '../icons'

// // // import { useLocale, useTranslations } from 'next-intl'
// // // import { 
// // //     Dialog, 
// // //     DialogContent, 
// // //     DialogDescription, 
// // //     DialogHeader, 
// // //     DialogTitle,
// // //     DialogFooter 
// // // } from '@/components/ui/dialog'
// // // import toast from 'react-hot-toast'
// // // import { useAppContext } from '@/context/appContext'
// // // import mlang from '@/lib/mLang'
// // // import ImageApi from '@/components/ImageApi'
// // // import Table from '@/components/ui/Table'
// // // import { useRouter, useSearchParams, useParams } from 'next/navigation'
// // // import AddBrand from './AddBrand'
// // // // import LanguageSwitcher from '@/components/LanguageSwitcher'

// // // type SupportedLocale = 'ar' | 'en';

// // // interface Brand {
// // //     id: number;
// // //     name: string;
// // //     phone: string;
// // //     logo: string;
// // //     validFrom: string;
// // //     validTo: string;
// // //     purchaseCount: number;
// // //     isActive: boolean;
// // //     ratio?: number;
// // //     url?: string;
// // //     isDeleted: boolean;
// // //     status: 'ACTIVE' | 'INACTIVE' | 'DELETED' | 'ADMINACTIVE';
// // // }

// // // interface BrandsProps {
// // //     initialBrands?: Brand[];
// // //     initialCount?: number;
// // //     validTo: string;
// // //     purchaseCount: number;
// // //     isActive: boolean;
// // //     ratio?: number;
// // //     url?: string;

// // // }

// // // interface Offer {
// // //     category: {
// // //         id: number;
// // //     };
// // //     validTo?: string;
// // // }

// // // const Brands: React.FC<BrandsProps> = ({ initialBrands, initialCount }) => {
// // //     const [brands, setBrands] = useState<Brand[]>(initialBrands || []);
// // //     const [count, setCount] = useState(initialCount || 0);
// // //     const [openDelete, setOpenDelete] = useState<number | null>(null);
// // //     const [loading, setLoading] = useState(false);
// // //     const { token } = useAppContext();
// // //     const [isAddBrandOpen, setIsAddBrandOpen] = useState(false)
// // //     const [currentPage, setCurrentPage] = useState(1);
// // //     const [pageSize, setPageSize] = useState(10);
// // //     const searchParams = useSearchParams()
// // //     const categoryId = searchParams.get('categoryId')
// // //     const categoryName = searchParams.get('categoryName')
    
// // //     // Add state for filtered brands if needed
// // //     const [filteredBrands, setFilteredBrands] = useState<Brand[]>([])

// // //     // Add new state for brand categories
// // //     const [brandCategories, setBrandCategories] = useState<any[]>([])

// // //     const t = useTranslations('brand')
// // //     const locale = useLocale() as SupportedLocale;
// // //     const router = useRouter()

// // //     // Add state for categories dialog
// // //     const [showCategoriesDialog, setShowCategoriesDialog] = useState(false)

// // //     // Add categoryName state
// // //     const [categoryNameState, setCategoryNameState] = useState<string>('');

// // //     // Inside the Brands component, add state for editing
// // //     const [editingBrand, setEditingBrand] = useState<Brand | null>(null)

// // //     // Add categoryId from route params
// // //     const params = useParams()
// // //     const categoryIdFromRoute = params?.categoryId as string
    
// // //     // Update handleViewBrand to fetch brand categories
// // //     const handleViewBrand = async (id: number) => {
// // //         try {
// // //             const response = await fetch(
// // //                 `${process.env.NEXT_PUBLIC_BASE_URL}/api/offers?brandId=${id}`,
// // //                 {
// // //                     headers: {
// // //                         'Authorization': `Bearer ${token}`
// // //                     }
// // //                 }
// // //             )
            
// // //             if (!response.ok) throw new Error('Failed to fetch brand offers')
            
// // //             const data = await response.json()
// // //             // Extract unique categories and check for expired offers
// // //             const uniqueCategories = data.offers.reduce((acc: any[], offer: any) => {
// // //                 const categoryExists = acc.some(cat => cat.id === offer.category.id)
// // //                 if (!categoryExists && offer.category) {
// // //                     // Check if any offers for this category are expired
// // //                     const categoryOffers = data.offers.filter((o: Offer) => o.category.id === offer.category.id)
// // //                     const hasExpiredOffers = categoryOffers.some((o: Offer) => 
// // //                         o.validTo && new Date(o.validTo) < new Date()
// // //                     )
                    
// // //                     acc.push({
// // //                         id: offer.category.id,
// // //                         name: offer.category.name,
// // //                         imageUrl: offer.category.imageUrl || '/imgs/notfound.png',
// // //                         isExpired: hasExpiredOffers
// // //                     })
// // //                 }
// // //                 return acc
// // //             }, [])
            
// // //             setBrandCategories(uniqueCategories)
// // //             setShowCategoriesDialog(true)
// // //         } catch (error) {
// // //             console.error('Error fetching brand offers:', error)
// // //             toast.error('Failed to fetch brand categories')
// // //         }
// // //     }

// // //     // Update fetchBrands function to use offers endpoint
// // //     const fetchBrands = async (page: number, limit: number) => {
// // //         try {
// // //             setLoading(true)
// // //             const skip = (page - 1) * limit
            
// // //             // Get brandIds from URL if they exist
// // //             const brandIds = searchParams.get('ids')
            
// // //             // Construct URL with proper parameters
// // //             const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brand`)
// // //             url.searchParams.set('limit', limit.toString())
// // //             url.searchParams.set('skip', skip.toString())
            
// // //             if (brandIds) {
// // //                 url.searchParams.set('ids', brandIds)
// // //             }
            
// // //             const response = await fetch(url, {
// // //                 headers: {
// // //                     'Authorization': `Bearer ${token}`,
// // //                     'Content-Type': 'application/json'
// // //                 }
// // //             })

// // //             if (!response.ok) throw new Error('Failed to fetch brands')

// // //             const data = await response.json()
// // //             setBrands(data.brands || [])
// // //             setCount(data.totalCount || 0)
// // //         } catch (error) {
// // //             console.error('Error fetching brands:', error)
// // //             toast.error('Failed to fetch brands')
// // //         } finally {
// // //             setLoading(false)
// // //         }
// // //     }

// // //     // Update useEffect to react to URL parameter changes
// // //     useEffect(() => {
// // //         fetchBrands(currentPage, pageSize)
// // //     }, [searchParams, currentPage, pageSize])

// // //     const fetchCategoryName = async (id: string) => {
// // //         try {
// // //             const response = await fetch(
// // //                 `${process.env.NEXT_PUBLIC_BASE_URL}/api/category/${id}?lang=${locale}`,
// // //                 {
// // //                     headers: {
// // //                         'Authorization': `Bearer ${token}`
// // //                     }
// // //                 }
// // //             )
// // //             if (!response.ok) throw new Error('Failed to fetch category')
// // //             const data = await response.json()
// // //             setCategoryNameState(data.category.name)
// // //         } catch (error) {
// // //             console.error('Error fetching category:', error)
// // //         }
// // //     }

// // //     // Add pagination calculations
// // //     const paginatedBrands = brands.slice(
// // //         (currentPage - 1) * pageSize,
// // //         currentPage * pageSize
// // //     );

    
// // //     const handleDeleteBrand = async (id: number) => {
// // //         try {
// // //             setLoading(true)
            
// // //             const response = await fetch(
// // //                 `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/${id}/delete`, 
// // //                 {
// // //                     method: 'PATCH',
// // //                     headers: {
// // //                         'Authorization': `Bearer ${token}`,
// // //                         'Content-Type': 'application/json'
// // //                     }
// // //                 }
// // //             )

// // //             const data = await response.json()

// // //             if (!response.ok) {
// // //                 throw new Error(data.message || t('deleteFailed'))
// // //             }

// // //             // Update both isDeleted and status in the local state
// // //             setBrands(prevBrands => 
// // //                 prevBrands.map(brand => 
// // //                     brand.id === id 
// // //                         ? { ...brand, isDeleted: true, status: 'DELETED' }
// // //                         : brand
// // //                 )
// // //             )
            
// // //             setOpenDelete(null)
// // //             toast.success(data.message || t('successDelete'))
// // //         } catch (error: any) {
// // //             console.error('Delete brand error:', error)
// // //             toast.error(error.message || t('deleteFailed'))
// // //         } finally {
// // //             setLoading(false)
// // //         }
// // //     }

// // //     const handleRestoreBrand = async (id: number) => {
// // //         try {
// // //             setLoading(true)
            
// // //             const response = await fetch(
// // //                 `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/${id}/restore`,
// // //                 {
// // //                     method: 'PATCH',
// // //                     headers: {
// // //                         'Authorization': `Bearer ${token}`,
// // //                         'Content-Type': 'application/json'
// // //                     }
// // //                 }
// // //             )

// // //             const data = await response.json()

// // //             if (!response.ok) {
// // //                 throw new Error(data.message || t('restoreFailed'))
// // //             }

// // //             // Update the brand in the local state with the returned data
// // //             setBrands(prevBrands => 
// // //                 prevBrands.map(brand => 
// // //                     brand.id === id 
// // //                         ? { 
// // //                             ...brand, 
// // //                             isDeleted: false,
// // //                             status: data.brand.status // Use the status from the server response
// // //                         }
// // //                         : brand
// // //                 )
// // //             )

// // //             toast.success(data.message || t('successRestore'))
// // //         } catch (error: any) {
// // //             console.error('Restore brand error:', error)
// // //             toast.error(error.message || t('restoreFailed'))
// // //         } finally {
// // //             setLoading(false)
// // //         }
// // //     }

// // //     // Table headers configuration
// // //     const tableHeaders = [
// // //         { name: 'image', className: 'w-[100px]' },
// // //         { name: 'brandName', className: 'w-[200px]' },
// // //         { name: 'BrandContactNumber', className: 'w-[200px]' },
// // //         { name: 'BrandValidFrom', className: 'w-[150px]' },
// // //         { name: 'BrandValidTo', className: 'w-[150px]' },
// // //         { name: 'BrandStatus', className: 'w-[100px]' },
// // //         { name: 'brandAction', className: 'w-[100px] text-right' }
// // //     ];

// // //     // Table row render function
// // //     const renderTableRows = () => {
// // //         if (!brands?.length) return [];

// // //         return brands.map((brand: Brand) => {
// // //             // Determine the display status and background color
// // //             const displayStatus = brand.status === 'ADMINACTIVE' ? 'ACTIVE' : brand.status;
// // //             const statusColor = brand.status === 'DELETED' ? 'bg-red-100 text-red-800' : 
// // //                                 displayStatus === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
// // //                                 'bg-yellow-100 text-yellow-800';
            
// // //             // Check if brand has passed its valid-to date
// // //             const isExpired = brand.validTo ? new Date(brand.validTo) < new Date() : false;
            
// // //             // Determine row background color based on deletion status and expiration
// // //             const rowBackground = brand.status === 'DELETED' ? 'bg-red-100/60' : 
// // //                                 isExpired ? 'bg-red-50' :
// // //                                 'odd:bg-white even:bg-primary/5';

// // //             return (
// // //                 <tr 
// // //                     key={brand.id} 
// // //                     className={`border-b ${rowBackground} ${isExpired ? 'text-red-700' : ''}`}
// // //                 >
// // //                     <td className="px-6 py-4">
// // //                         <div className="size-12">
// // //                             <ImageApi
// // //                                 src={brand.logo || '/imgs/notfound.png'}
// // //                                 alt={mlang(brand.name, locale)}
// // //                                 loader={() => brand.logo}
// // //                                 loading='lazy'
// // //                                 height={48}
// // //                                 width={48}
// // //                                 className='object-cover rounded-full w-full h-full'
// // //                             />
// // //                         </div>
// // //                     </td>
// // //                     <td className="px-6 py-4 font-medium">
// // //                         {mlang(brand.name, locale)}
// // //                     </td>
// // //                     <td className="px-6 py-4">
// // //                         {brand.phone || t('noPhone')}
// // //                     </td>
// // //                     <td className="px-6 py-4">
// // //                         {brand.validFrom ? new Date(brand.validFrom).toLocaleDateString(locale) : '-'}
// // //                     </td>
// // //                     <td className="px-6 py-4">
// // //                         {brand.validTo ? new Date(brand.validTo).toLocaleDateString(locale) : '-'}
// // //                     </td>
// // //                     <td className="px-6 py-4">
// // //                         <span className={`px-2 py-1 rounded-full text-xs ${statusColor}`}>
// // //                             {displayStatus === 'DELETED' 
// // //                                 ? t('deleted')
// // //                                 : displayStatus === 'ACTIVE'
// // //                                     ? t('active')
// // //                                     : t('notActive')
// // //                             }
// // //                         </span>
// // //                     </td>
// // //                     <td className="px-6 py-4 text-right">
// // //                         <div className="flex justify-end gap-3">
// // //                             {brand.status !== 'DELETED' ? (
// // //                                 <>
// // //                                     {/* View Categories button */}
// // //                                     <button
// // //                                         onClick={() => handleViewBrand(brand.id)}
// // //                                         className='text-green-500 hover:text-green-700 text-[#24ae9f]'
// // //                                         aria-label={t('viewCategories')}
// // //                                     >
// // //                                         <CategoryIconn_green className='w-5 h-5 text-[#24ae9f]/80 hover:text-gray-700' />
// // //                                     </button>
                                    

// // //                                     {/* View Details button */}
// // //                                     <button
// // //                                         onClick={() => router.push(`/${locale}/brands/${brand.id}`)}
// // //                                         className='text-blue-500 hover:text-blue-700'
// // //                                         aria-label={t('viewBrandDetails')}
// // //                                     >
// // //                                         <ArrowTopRightOnSquareIconn className='w-5 h-5 text-[#00a18f] hover:text-gray-700' />
// // //                                     </button>



// // //                                     {/* Edit button */}
// // //                                     {/* <button
// // //                                         onClick={() => setEditingBrand(brand)}
// // //                                         className='text-blue-500 hover:text-blue-700'
// // //                                         aria-label={t('editBrand')}
// // //                                     >
// // //                                         <PencilIconn className='w-5 h-5 text-[#00a18f] hover:text-gray-700' />
// // //                                     </button> */}


// // //                                     {/* Delete button */}
// // //                                     <button
// // //                                         onClick={() => setOpenDelete(brand.id)}
// // //                                         className='text-red-500 hover:text-red-700'
// // //                                         aria-label={t('deleteBrand')}
// // //                                     >
// // //                                         <TrashIconn className='w-5 h-5 text-[#00a18f] hover:text-gray-700' />
// // //                                     </button>
// // //                                 </>
// // //                             ) : (
// // //                                 // Restore button for deleted brands
// // //                                 <button
// // //                                     onClick={() => handleRestoreBrand(brand.id)}
// // //                                     className='flex items-center gap-2 text-primary hover:text-primary/70'
// // //                                     aria-label={t('restoreBrand')}
// // //                                 >
// // //                                     <Restore_brand   className='w-5 h-5' />
// // //                                     <span>{t('restore')}</span>
// // //                                 </button>
// // //                             )}
// // //                         </div>
// // //                     </td>
// // //                 </tr>
// // //             );
// // //         });
// // //     }

// // //     // Add this function to handle language change
// // //     const handleLanguageChange = (newLocale: string) => {
// // //         // Preserve the current URL parameters when changing language
// // //         const params = new URLSearchParams(searchParams.toString())
// // //         router.push(`/${newLocale}/brands?${params.toString()}`)
// // //     }

// // //     // Add event listener for offer changes
// // //     useEffect(() => {
// // //         const handleOffersChange = () => {
// // //             // Refresh the brands list when offers change
// // //             fetchBrands(currentPage, pageSize)
// // //         }

// // //         window.addEventListener('brandOffersChanged', handleOffersChange)

// // //         return () => {
// // //             window.removeEventListener('brandOffersChanged', handleOffersChange)
// // //         }
// // //     }, [currentPage, pageSize])

// // //     return (
// // //         <div className='p-container space-y-6'>
// // //             <div className='flex justify-between items-center'>
// // //                 <div className='flex items-center gap-4'>
// // //                     <h4 className='font-bold text-lg md:text-xl lg:text-2xl'>{t('title')}</h4>
// // //                     {searchParams.get('ids') && categoryName && (
// // //                         <div className='flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full'>
// // //                             <span className='text-sm text-primary'>
// // //                                 {t('filteredBy')}: {decodeURIComponent(categoryName)}
// // //                             </span>
// // //                             <button
// // //                                 onClick={() => router.push(`/${locale}/brands`)}
// // //                                 className='text-primary hover:text-primary/70'
// // //                                 aria-label={t('clear_filter')}
// // //                             >
// // //                                 <TrashIcon className='w-5 h-5' />
// // //                             </button>
// // //                         </div>
// // //                     )}
// // //                 </div>
// // //                 {/* <button
// // //                     onClick={() => setIsAddBrandOpen(true)}
// // //                     className='px-5 py-2  rounded-md text-white font-medium'
// // //                 >
// // //                     <div className='flex gap-3  border-2 border-[#02161e] rounded-md px-2 py-1 bg-[#02161e] text-white'>
// // //                         <PluseCircelIcon className='size-6 text-teal-500' />
// // //                         <div className='flex-1'>{t('brandaddButton')}</div>
// // //                     </div>
// // //                 </button> */}

// // // <button
// // //           onClick={() => {
// // //             setIsAddBrandOpen(true);
// // //           }}    
// // //           className="px-5 py-2 bg-primary rounded-md text-white font-medium"
// // //         >

// // //           <div className="flex gap-3">
// // //             <PluseCircelIcon className="size-6" />
// // //             <div className="flex-1">{t("brandaddButton")}</div>
// // //           </div>
// // //         </button>
// // //             </div>

// // //             <Table
// // //                 data={brands}
// // //                 headers={tableHeaders}
// // //                 count={count}
// // //                 loading={loading}
// // //                 showDateFilter={false}
// // //                 currentPage={currentPage}
// // //                 pageSize={pageSize}
// // //                 onPageChange={(page) => setCurrentPage(page)}
// // //                 onPageSizeChange={(size) => {
// // //                     setPageSize(size)
// // //                     setCurrentPage(1)
// // //                 }}
// // //                 showExport={true}
// // //                 bgColor="#02161e"
// // //             >
// // //                 {renderTableRows()}
// // //             </Table>

// // //             {/* Delete Confirmation Dialog */}
// // //             <Dialog open={!!openDelete} onOpenChange={() => setOpenDelete(null)}>
// // //                 <DialogContent>
// // //                     <DialogHeader>
// // //                         <DialogTitle>{t('branddeleteButton')}</DialogTitle>
// // //                         <DialogDescription>{t('deleteMessage')}</DialogDescription>
// // //                     </DialogHeader>
// // //                     <div className='flex gap-2'>
// // //                         <button 
// // //                             onClick={() => setOpenDelete(null)} 
// // //                             className='px-3 py-2 rounded-md border'
// // //                         >
// // //                             {t('cancel_delete_brand')}
// // //                         </button>
// // //                         <button 
// // //                             onClick={() => openDelete && handleDeleteBrand(openDelete)} 
// // //                             className='px-3 py-2 rounded-md bg-red-500 text-white'
// // //                         >
// // //                             {loading ? <LoadingIcon className='size-5 animate-spin' /> : t('deleteBrand')}
// // //                         </button>
// // //                     </div>
// // //                 </DialogContent>
// // //             </Dialog>

// // //             {/* Add the AddBrand dialog with editing support */}
// // //             <AddBrand 
// // //                 isOpen={isAddBrandOpen || !!editingBrand} 
// // //                 onClose={() => {
// // //                     setIsAddBrandOpen(false)
// // //                     setEditingBrand(null)
// // //                 }}
// // //                 brandToEdit={editingBrand}
// // //             />

// // //             {/* Brand Categories Dialog */}
// // //             <Dialog open={showCategoriesDialog} onOpenChange={setShowCategoriesDialog}>
// // //                 <DialogContent>
// // //                     <DialogHeader>
// // //                         <DialogTitle>{t('brandCategories')}</DialogTitle>
// // //                         <DialogDescription>
// // //                             {brandCategories.length > 0 
// // //                                 ? t('brandCategoriesDescription')
// // //                                 : t('noCategoriesFound')}
// // //                         </DialogDescription>
// // //                     </DialogHeader>
// // //                     {brandCategories.length > 0 ? (
// // //                         <div className="grid grid-cols-2 gap-4">
// // //                             {brandCategories.map((category) => (
// // //                                 <div 
// // //                                     key={category.id}
// // //                                     className={`p-4 border rounded-lg flex items-center gap-3 
// // //                                         ${category.isExpired ? 'bg-red-50 text-red-700 border-red-200' : 'bg-white'}`}
// // //                                 >
// // //                                     <div className="w-10 h-10 flex-shrink-0">
// // //                                         <ImageApi
// // //                                             src={category.imageUrl}
// // //                                             alt={mlang(category.name, locale)}
// // //                                             loader={() => category.imageUrl}
// // //                                             loading='lazy'
// // //                                             height={40}
// // //                                             width={40}
// // //                                             className='object-cover rounded w-full h-full'
// // //                                         />
// // //                                     </div>
// // //                                     <span className="flex-1 truncate">
// // //                                         {mlang(category.name, locale)}
// // //                                     </span>
// // //                                 </div>
// // //                             ))}
// // //                         </div>
// // //                     ) : (
// // //                         <div className="text-center py-4 text-gray-500">
// // //                             {t('noCategoriesFound')}
// // //                         </div>
// // //                     )}
// // //                 </DialogContent>
// // //             </Dialog>

// // //             {/* <LanguageSwitcher onChange={handleLanguageChange} /> */}
// // //         </div>
// // //     )
// // // }

// // // export type { Brand, BrandsProps };
// // // export default Brands


// // 'use client'
// // import React, { useEffect, useState } from 'react'
// // import { CategoryIconn,CategoryIconn_green, DeleteIcon, LoadingIcon, PluseCircelIcon } from '../icons'
// // import { PencilSquareIcon, TrashIcon,ArrowTopRightOnSquareIcon, ArrowPathIcon,PencilIcon } from '@heroicons/react/24/outline'
// // import { BrandEyeIcon, Restore_brand,ArrowTopRightOnSquareIconn,TrashIconn,PencilIconn,EyeIcon,EyeIcon2 } from '../icons'

// // import { useLocale, useTranslations } from 'next-intl'
// // import { 
// //     Dialog, 
// //     DialogContent, 
// //     DialogDescription, 
// //     DialogHeader, 
// //     DialogTitle,
// //     DialogFooter 
// // } from '@/components/ui/dialog'
// // import toast from 'react-hot-toast'
// // import { useAppContext } from '@/context/appContext'
// // import mlang from '@/lib/mLang'
// // import ImageApi from '@/components/ImageApi'
// // import Table from '@/components/ui/Table'
// // import { useRouter, useSearchParams, useParams } from 'next/navigation'
// // import AddBrand from './AddBrand'
// // // import LanguageSwitcher from '@/components/LanguageSwitcher'

// // type SupportedLocale = 'ar' | 'en';

// // interface Brand {
// //     id: number;
// //     name: string;
// //     phone: string;
// //     logo: string;
// //     validFrom: string;
// //     validTo: string;
// //     purchaseCount: number;
// //     isActive: boolean;
// //     ratio?: number;
// //     url?: string;
// //     isDeleted: boolean;
// //     status: 'ACTIVE' | 'INACTIVE' | 'DELETED' | 'ADMINACTIVE';
// // }

// // interface BrandsProps {
// //     initialBrands?: Brand[];
// //     initialCount?: number;
// //     validTo: string;
// //     purchaseCount: number;
// //     isActive: boolean;
// //     ratio?: number;
// //     url?: string;

// // }

// // interface Offer {
// //     category: {
// //         id: number;
// //     };
// //     validTo?: string;
// // }

// // const Brands: React.FC<BrandsProps> = ({ initialBrands, initialCount }) => {
// //     const [brands, setBrands] = useState<Brand[]>(initialBrands || []);
// //     const [count, setCount] = useState(initialCount || 0);
// //     const [openDelete, setOpenDelete] = useState<number | null>(null);
// //     const [loading, setLoading] = useState(false);
// //     const { token } = useAppContext();
// //     const [isAddBrandOpen, setIsAddBrandOpen] = useState(false)
// //     const [currentPage, setCurrentPage] = useState(1);
// //     const [pageSize, setPageSize] = useState(10);
// //     const searchParams = useSearchParams()
// //     const categoryId = searchParams.get('categoryId')
// //     const categoryName = searchParams.get('categoryName')
    
// //     // Add state for filtered brands if needed
// //     const [filteredBrands, setFilteredBrands] = useState<Brand[]>([])

// //     // Add new state for brand categories
// //     const [brandCategories, setBrandCategories] = useState<any[]>([])

// //     const t = useTranslations('brand')
// //     const locale = useLocale() as SupportedLocale;
// //     const router = useRouter()

// //     // Add state for categories dialog
// //     const [showCategoriesDialog, setShowCategoriesDialog] = useState(false)

// //     // Add categoryName state
// //     const [categoryNameState, setCategoryNameState] = useState<string>('');

// //     // Inside the Brands component, add state for editing
// //     const [editingBrand, setEditingBrand] = useState<Brand | null>(null)

// //     // Add categoryId from route params
// //     const params = useParams()
// //     const categoryIdFromRoute = params?.categoryId as string
    
// //     // Update handleViewBrand to fetch brand categories
// //     const handleViewBrand = async (id: number) => {
// //         try {
// //             const response = await fetch(
// //                 `${process.env.NEXT_PUBLIC_BASE_URL}/api/offers?brandId=${id}`,
// //                 {
// //                     headers: {
// //                         'Authorization': `Bearer ${token}`
// //                     }
// //                 }
// //             )
            
// //             if (!response.ok) throw new Error('Failed to fetch brand offers')
            
// //             const data = await response.json()
// //             // Extract unique categories and check for expired offers
// //             const uniqueCategories = data.offers.reduce((acc: any[], offer: any) => {
// //                 const categoryExists = acc.some(cat => cat.id === offer.category.id)
// //                 if (!categoryExists && offer.category) {
// //                     // Check if any offers for this category are expired
// //                     const categoryOffers = data.offers.filter((o: Offer) => o.category.id === offer.category.id)
// //                     const hasExpiredOffers = categoryOffers.some((o: Offer) => 
// //                         o.validTo && new Date(o.validTo) < new Date()
// //                     )
                    
// //                     acc.push({
// //                         id: offer.category.id,
// //                         name: offer.category.name,
// //                         imageUrl: offer.category.imageUrl || '/imgs/notfound.png',
// //                         isExpired: hasExpiredOffers
// //                     })
// //                 }
// //                 return acc
// //             }, [])
            
// //             setBrandCategories(uniqueCategories)
// //             setShowCategoriesDialog(true)
// //         } catch (error) {
// //             console.error('Error fetching brand offers:', error)
// //             toast.error('Failed to fetch brand categories')
// //         }
// //     }

// //     // Update fetchBrands function to use offers endpoint
// //     const fetchBrands = async (page: number, limit: number) => {
// //         try {
// //             setLoading(true)
// //             const skip = (page - 1) * limit
            
// //             // Get brandIds from URL if they exist
// //             const brandIds = searchParams.get('ids')
            
// //             // Construct URL with proper parameters
// //             const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brand`)
// //             url.searchParams.set('limit', limit.toString())
// //             url.searchParams.set('skip', skip.toString())
            
// //             if (brandIds) {
// //                 url.searchParams.set('ids', brandIds)
// //             }
            
// //             const response = await fetch(url, {
// //                 headers: {
// //                     'Authorization': `Bearer ${token}`,
// //                     'Content-Type': 'application/json'
// //                 }
// //             })

// //             if (!response.ok) throw new Error('Failed to fetch brands')

// //             const data = await response.json()
// //             setBrands(data.brands || [])
// //             setCount(data.totalCount || 0)
// //         } catch (error) {
// //             console.error('Error fetching brands:', error)
// //             toast.error('Failed to fetch brands')
// //         } finally {
// //             setLoading(false)
// //         }
// //     }

// //     // Update useEffect to react to URL parameter changes
// //     useEffect(() => {
// //         fetchBrands(currentPage, pageSize)
// //     }, [searchParams, currentPage, pageSize])

// //     const fetchCategoryName = async (id: string) => {
// //         try {
// //             const response = await fetch(
// //                 `${process.env.NEXT_PUBLIC_BASE_URL}/api/category/${id}?lang=${locale}`,
// //                 {
// //                     headers: {
// //                         'Authorization': `Bearer ${token}`
// //                     }
// //                 }
// //             )
// //             if (!response.ok) throw new Error('Failed to fetch category')
// //             const data = await response.json()
// //             setCategoryNameState(data.category.name)
// //         } catch (error) {
// //             console.error('Error fetching category:', error)
// //         }
// //     }

// //     // Add pagination calculations
// //     const paginatedBrands = brands.slice(
// //         (currentPage - 1) * pageSize,
// //         currentPage * pageSize
// //     );

    
// //     const handleDeleteBrand = async (id: number) => {
// //         try {
// //             setLoading(true)
            
// //             const response = await fetch(
// //                 `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/${id}/delete`, 
// //                 {
// //                     method: 'PATCH',
// //                     headers: {
// //                         'Authorization': `Bearer ${token}`,
// //                         'Content-Type': 'application/json'
// //                     }
// //                 }
// //             )

// //             const data = await response.json()

// //             if (!response.ok) {
// //                 throw new Error(data.message || t('deleteFailed'))
// //             }

// //             // Update both isDeleted and status in the local state
// //             setBrands(prevBrands => 
// //                 prevBrands.map(brand => 
// //                     brand.id === id 
// //                         ? { ...brand, isDeleted: true, status: 'DELETED' }
// //                         : brand
// //                 )
// //             )
            
// //             setOpenDelete(null)
// //             toast.success(data.message || t('successDelete'))
// //         } catch (error: any) {
// //             console.error('Delete brand error:', error)
// //             toast.error(error.message || t('deleteFailed'))
// //         } finally {
// //             setLoading(false)
// //         }
// //     }

// //     const handleRestoreBrand = async (id: number) => {
// //         try {
// //             setLoading(true)
            
// //             const response = await fetch(
// //                 `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/${id}/restore`,
// //                 {
// //                     method: 'PATCH',
// //                     headers: {
// //                         'Authorization': `Bearer ${token}`,
// //                         'Content-Type': 'application/json'
// //                     }
// //                 }
// //             )

// //             const data = await response.json()

// //             if (!response.ok) {
// //                 throw new Error(data.message || t('restoreFailed'))
// //             }

// //             // Update the brand in the local state with the returned data
// //             setBrands(prevBrands => 
// //                 prevBrands.map(brand => 
// //                     brand.id === id 
// //                         ? { 
// //                             ...brand, 
// //                             isDeleted: false,
// //                             status: data.brand.status // Use the status from the server response
// //                         }
// //                         : brand
// //                 )
// //             )

// //             toast.success(data.message || t('successRestore'))
// //         } catch (error: any) {
// //             console.error('Restore brand error:', error)
// //             toast.error(error.message || t('restoreFailed'))
// //         } finally {
// //             setLoading(false)
// //         }
// //     }

// //     // Table headers configuration
// //     const tableHeaders = [
// //         { name: 'image', className: 'w-[100px]' },
// //         { name: 'brandName', className: 'w-[200px]' },
// //         { name: 'BrandContactNumber', className: 'w-[200px]' },
// //         { name: 'BrandValidFrom', className: 'w-[150px]' },
// //         { name: 'BrandValidTo', className: 'w-[150px]' },
// //         { name: 'BrandStatus', className: 'w-[100px]' },
// //         { name: 'brandAction', className: 'w-[100px] text-right' }
// //     ];

// //     // Table row render function
// //     const renderTableRows = () => {
// //         if (!brands?.length) return [];

// //         return brands.map((brand: Brand) => {
// //             // Determine the display status and background color
// //             const displayStatus = brand.status === 'ADMINACTIVE' ? 'ACTIVE' : brand.status;
// //             const statusColor = brand.status === 'DELETED' ? 'bg-red-100 text-red-800' : 
// //                                 displayStatus === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
// //                                 'bg-yellow-100 text-yellow-800';
            
// //             // Check if brand has passed its valid-to date
// //             const isExpired = brand.validTo ? new Date(brand.validTo) < new Date() : false;
            
// //             // Determine row background color based on deletion status and expiration
// //             const rowBackground = brand.status === 'DELETED' ? 'bg-red-100/60' : 
// //                                 isExpired ? 'bg-red-50' :
// //                                 'odd:bg-white even:bg-primary/5';

// //             return (
// //                 <tr 
// //                     key={brand.id} 
// //                     className={`border-b ${rowBackground} ${isExpired ? 'text-red-700' : ''}`}
// //                 >
// //                     <td className="px-6 py-4">
// //                         <div className="size-12">
// //                             <ImageApi
// //                                 src={brand.logo || '/imgs/notfound.png'}
// //                                 alt={mlang(brand.name, locale)}
// //                                 loader={() => brand.logo}
// //                                 loading='lazy'
// //                                 height={48}
// //                                 width={48}
// //                                 className='object-cover rounded-full w-full h-full'
// //                             />
// //                         </div>
// //                     </td>
// //                     <td className="px-6 py-4 font-medium">
// //                         {mlang(brand.name, locale)}
// //                     </td>
// //                     <td className="px-6 py-4">
// //                         {brand.phone || t('noPhone')}
// //                     </td>
// //                     <td className="px-6 py-4">
// //                         {brand.validFrom ? new Date(brand.validFrom).toLocaleDateString(locale) : '-'}
// //                     </td>
// //                     <td className="px-6 py-4">
// //                         {brand.validTo ? new Date(brand.validTo).toLocaleDateString(locale) : '-'}
// //                     </td>
// //                     <td className="px-6 py-4">
// //                         <span className={`px-2 py-1 rounded-full text-xs ${statusColor}`}>
// //                             {displayStatus === 'DELETED' 
// //                                 ? t('deleted')
// //                                 : displayStatus === 'ACTIVE'
// //                                     ? t('active')
// //                                     : t('notActive')
// //                             }
// //                         </span>
// //                     </td>
// //                     <td className="px-6 py-4 text-right">
// //                         <div className="flex justify-end gap-3">
// //                             {brand.status !== 'DELETED' ? (
// //                                 <>
// //                                     {/* View Categories button */}
// //                                     <button
// //                                         onClick={() => handleViewBrand(brand.id)}
// //                                         className='text-green-500 hover:text-green-700 text-[#24ae9f]'
// //                                         aria-label={t('viewCategories')}
// //                                     >
// //                                         <CategoryIconn_green className='w-5 h-5 text-[#24ae9f]/80 hover:text-gray-700' />
// //                                     </button>
                                    

// //                                     {/* View Details button */}
// //                                     <button
// //                                         onClick={() => router.push(`/${locale}/brands/${brand.id}`)}
// //                                         className='text-blue-500 hover:text-blue-700'
// //                                         aria-label={t('viewBrandDetails')}
// //                                     >
// //                                         <ArrowTopRightOnSquareIconn className='w-5 h-5 text-[#00a18f] hover:text-gray-700' />
// //                                     </button>



// //                                     {/* Edit button */}
// //                                     {/* <button
// //                                         onClick={() => setEditingBrand(brand)}
// //                                         className='text-blue-500 hover:text-blue-700'
// //                                         aria-label={t('editBrand')}
// //                                     >
// //                                         <PencilIconn className='w-5 h-5 text-[#00a18f] hover:text-gray-700' />
// //                                     </button> */}


// //                                     {/* Delete button */}
// //                                     <button
// //                                         onClick={() => setOpenDelete(brand.id)}
// //                                         className='text-red-500 hover:text-red-700'
// //                                         aria-label={t('deleteBrand')}
// //                                     >
// //                                         <TrashIconn className='w-5 h-5 text-[#00a18f] hover:text-gray-700' />
// //                                     </button>
// //                                 </>
// //                             ) : (
// //                                 // Restore button for deleted brands
// //                                 <button
// //                                     onClick={() => handleRestoreBrand(brand.id)}
// //                                     className='flex items-center gap-2 text-primary hover:text-primary/70'
// //                                     aria-label={t('restoreBrand')}
// //                                 >
// //                                     <Restore_brand   className='w-5 h-5' />
// //                                     <span>{t('restore')}</span>
// //                                 </button>
// //                             )}
// //                         </div>
// //                     </td>
// //                 </tr>
// //             );
// //         });
// //     }

// //     // Add this function to handle language change
// //     const handleLanguageChange = (newLocale: string) => {
// //         // Preserve the current URL parameters when changing language
// //         const params = new URLSearchParams(searchParams.toString())
// //         router.push(`/${newLocale}/brands?${params.toString()}`)
// //     }

// //     // Add event listener for offer changes
// //     useEffect(() => {
// //         const handleOffersChange = () => {
// //             // Refresh the brands list when offers change
// //             fetchBrands(currentPage, pageSize)
// //         }

// //         window.addEventListener('brandOffersChanged', handleOffersChange)

// //         return () => {
// //             window.removeEventListener('brandOffersChanged', handleOffersChange)
// //         }
// //     }, [currentPage, pageSize])

// //     return (
// //         <div className='p-container space-y-6'>
// //             <div className='flex justify-between items-center'>
// //                 <div className='flex items-center gap-4'>
// //                     <h4 className='font-bold text-lg md:text-xl lg:text-2xl'>{t('title')}</h4>
// //                     {searchParams.get('ids') && categoryName && (
// //                         <div className='flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full'>
// //                             <span className='text-sm text-primary'>
// //                                 {t('filteredBy')}: {decodeURIComponent(categoryName)}
// //                             </span>
// //                             <button
// //                                 onClick={() => router.push(`/${locale}/brands`)}
// //                                 className='text-primary hover:text-primary/70'
// //                                 aria-label={t('clear_filter')}
// //                             >
// //                                 <TrashIcon className='w-5 h-5' />
// //                             </button>
// //                         </div>
// //                     )}
// //                 </div>
// //                 {/* <button
// //                     onClick={() => setIsAddBrandOpen(true)}
// //                     className='px-5 py-2  rounded-md text-white font-medium'
// //                 >
// //                     <div className='flex gap-3  border-2 border-[#02161e] rounded-md px-2 py-1 bg-[#02161e] text-white'>
// //                         <PluseCircelIcon className='size-6 text-teal-500' />
// //                         <div className='flex-1'>{t('brandaddButton')}</div>
// //                     </div>
// //                 </button> */}

// // <button
// //           onClick={() => {
// //             setIsAddBrandOpen(true);
// //           }}    
// //           className="px-5 py-2 bg-primary rounded-md text-white font-medium"
// //         >

// //           <div className="flex gap-3">
// //             <PluseCircelIcon className="size-6" />
// //             <div className="flex-1">{t("brandaddButton")}</div>
// //           </div>
// //         </button>
// //             </div>

// //             <Table
// //                 data={brands}
// //                 headers={tableHeaders}
// //                 count={count}
// //                 loading={loading}
// //                 showDateFilter={false}
// //                 currentPage={currentPage}
// //                 pageSize={pageSize}
// //                 onPageChange={(page) => setCurrentPage(page)}
// //                 onPageSizeChange={(size) => {
// //                     setPageSize(size)
// //                     setCurrentPage(1)
// //                 }}
// //                 showExport={true}
// //                 bgColor="#02161e"
// //             >
// //                 {renderTableRows()}
// //             </Table>

// //             {/* Delete Confirmation Dialog */}
// //             <Dialog open={!!openDelete} onOpenChange={() => setOpenDelete(null)}>
// //                 <DialogContent>
// //                     <DialogHeader>
// //                         <DialogTitle>{t('branddeleteButton')}</DialogTitle>
// //                         <DialogDescription>{t('deleteMessage')}</DialogDescription>
// //                     </DialogHeader>
// //                     <div className='flex gap-2'>
// //                         <button 
// //                             onClick={() => setOpenDelete(null)} 
// //                             className='px-3 py-2 rounded-md border'
// //                         >
// //                             {t('cancel_delete_brand')}
// //                         </button>
// //                         <button 
// //                             onClick={() => openDelete && handleDeleteBrand(openDelete)} 
// //                             className='px-3 py-2 rounded-md bg-red-500 text-white'
// //                         >
// //                             {loading ? <LoadingIcon className='size-5 animate-spin' /> : t('deleteBrand')}
// //                         </button>
// //                     </div>
// //                 </DialogContent>
// //             </Dialog>

// //             {/* Add the AddBrand dialog with editing support */}
// //             <AddBrand 
// //                 isOpen={isAddBrandOpen || !!editingBrand} 
// //                 onClose={() => {
// //                     setIsAddBrandOpen(false)
// //                     setEditingBrand(null)
// //                 }}
// //                 brandToEdit={editingBrand}
// //             />

// //             {/* Brand Categories Dialog */}
// //             <Dialog open={showCategoriesDialog} onOpenChange={setShowCategoriesDialog}>
// //                 <DialogContent>
// //                     <DialogHeader>
// //                         <DialogTitle>{t('brandCategories')}</DialogTitle>
// //                         <DialogDescription>
// //                             {brandCategories.length > 0 
// //                                 ? t('brandCategoriesDescription')
// //                                 : t('noCategoriesFound')}
// //                         </DialogDescription>
// //                     </DialogHeader>
// //                     {brandCategories.length > 0 ? (
// //                         <div className="grid grid-cols-2 gap-4">
// //                             {brandCategories.map((category) => (
// //                                 <div 
// //                                     key={category.id}
// //                                     className={`p-4 border rounded-lg flex items-center gap-3 
// //                                         ${category.isExpired ? 'bg-red-50 text-red-700 border-red-200' : 'bg-white'}`}
// //                                 >
// //                                     <div className="w-10 h-10 flex-shrink-0">
// //                                         <ImageApi
// //                                             src={category.imageUrl}
// //                                             alt={mlang(category.name, locale)}
// //                                             loader={() => category.imageUrl}
// //                                             loading='lazy'
// //                                             height={40}
// //                                             width={40}
// //                                             className='object-cover rounded w-full h-full'
// //                                         />
// //                                     </div>
// //                                     <span className="flex-1 truncate">
// //                                         {mlang(category.name, locale)}
// //                                     </span>
// //                                 </div>
// //                             ))}
// //                         </div>
// //                     ) : (
// //                         <div className="text-center py-4 text-gray-500">
// //                             {t('noCategoriesFound')}
// //                         </div>
// //                     )}
// //                 </DialogContent>
// //             </Dialog>

// //             {/* <LanguageSwitcher onChange={handleLanguageChange} /> */}
// //         </div>
// //     )
// // }

// // export type { Brand, BrandsProps };
// // export default Brands


// 'use client'
// import React, { useEffect, useRef, useState } from 'react'
// import { useLocale, useTranslations } from 'next-intl'
// import { useAppContext } from '@/context/appContext'
// import ImageApi from '../ImageApi'
// import toast from 'react-hot-toast'
// import { ArrowTopRightOnSquareIconn, EditIcon, LoadingIcon, PhotoIcon, ShoppingCart } from '../icons'
// import { Textarea } from '../ui/textarea'
// import BrandNotFound from './BrandNotFound'
// import { Switch } from '../ui/switch'
// import { Input } from '../ui/input'
// import BrandDetailsSkeleton from './BrandDetailsSkeleton'
// import axios from 'axios'

// import {
//     FaFacebook,
//     FaTwitter,
//     FaInstagram,
//     FaLinkedin,
//     FaTiktok,
//     FaYoutube,
//     FaPinterest,
//     FaSnapchat,
//     FaWhatsapp,
//     FaTelegram,
//     FaReddit
// } from 'react-icons/fa';
// import ExclusiveOffers from './offers/ExclusiveOffers'
// import BrandOffers from './offers/BrandOffers'
// import SpecialOffers from './offers/SpecialOffers'
// import DigitalSeals from './offers/DigitalSeals'
// import CustomOffers from './offers/CustomOffers'
// import HotDeals from './offers/HotDeals'
// import BrandRepresentative from './offers/BrandRepresentative'

// interface Brand {
//     id: number
//     name: string
//     phone: string
//     email: string
//     url: string
//     logo: string
//     cover: string
//     about: string
//     pointBackTerms: string
//     address: string
//     validFrom: string
//     validTo: string
//     ratio: number
//     pointBackRatio: number
//     status: string
//     purchaseCount?: number
//     validityPeriod?: number
//     upto?: number
// }
// type SocialMediaPlatform = 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'tiktok' | 
//     'youtube' | 'pinterest' | 'snapchat' | 'whatsapp' | 'telegram' | 'reddit';

    
// interface SocialMedia {
//     id: number;
//     brandId: number;
//     facebook: string | null;
//     twitter: string | null;
//     instagram: string | null;
//     linkedin: string | null;
//     tiktok: string | null;
//     youtube: string | null;
//     pinterest: string | null;
//     snapchat: string | null;
//     whatsapp: string | null;
//     telegram: string | null;
//     reddit: string | null;
// }

// // Add type definition for admin statuses
// type BrandStatus = 'ACTIVE' | 'INACTIVE' | 'DELETED' | 'ADMINACTIVE' | 'ADMININACTIVE';

// interface Brand {
//     id: number
//     name: string
//     phone: string
//     email: string
//     url: string
//     logo: string
//     cover: string
//     about: string
//     pointBackTerms: string
//     address: string
//     validFrom: string
//     validTo: string
//     ratio: number
//     pointBackRatio: number
//     status: BrandStatus | string
//     purchaseCount?: number
//     validityPeriod?: number
//     upto?: number
// }

// const BrandDetails = ({ brandId }: { brandId: string }) => {
//     const [brand, setBrand] = useState<Brand | null>(null)
//     const [loading, setLoading] = useState(true)
//     const [savingAbout, setSavingAbout] = useState(false)
//     const [savingTerms, setSavingTerms] = useState(false)
//     const [savingLogo, setSavingLogo] = useState(false)
//     const [savingCover, setSavingCover] = useState(false)
//     const [isAboutEdited, setIsAboutEdited] = useState(false)
//     const [isTermsEdited, setIsTermsEdited] = useState(false)
//     const [about, setAbout] = useState('')
//     const [pointBackTerms, setPointBackTerms] = useState('')
//     const logoInputRef = useRef<HTMLInputElement>(null)
//     const coverInputRef = useRef<HTMLInputElement>(null)
//     const { token } = useAppContext()
//     const t = useTranslations('brand')
//     const [activeTab, setActiveTab] = useState('brand')
//     const [socialMedia, setSocialMedia] = useState<SocialMedia | null>(null);
//     const [editedFields, setEditedFields] = useState<Set<string>>(new Set());
//     const [editedBrandFields, setEditedBrandFields] = useState<Set<string>>(new Set());
//     const [brandForm, setBrandForm] = useState({
//         url: '',
//         phone: '',
//         email: '',
//         address: ''
//     });
//     const [isActive, setIsActive] = useState<boolean>(true);
//     const [editedRatio, setEditedRatio] = useState<number | null>(null);
//     const [editedPointBackRatio, setEditedPointBackRatio] = useState<number | null>(null);
//     const [editedValidityPeriod, setEditedValidityPeriod] = useState<number | null>(null);
//     const [editedUpTo, setEditedUpTo] = useState<number | null>(null);
//     const [hasChanges, setHasChanges] = useState(false);
//     const [statusChanged, setStatusChanged] = useState(false);
//     const [selectedStatus, setSelectedStatus] = useState(brand?.status);
//     const [editedValidFrom, setEditedValidFrom] = useState<string | null>(null)
//     const [editedValidTo, setEditedValidTo] = useState<string | null>(null)

//     const tabs = [
//         { id: 'brand', label: 'Brand Offers' },
//         { id: 'special', label: 'Special Offers' },
//         { id: 'exclusive', label: 'Exclusive Offers' },
//         { id: 'digital', label: 'Digital Seals' },
//         { id: 'custom', label: 'Custom Offers' },
//         { id: 'hot', label: 'Hot Deals' },
//         { id: 'representative', label: 'Brand Representative' }
//     ]

//     const [editingName, setEditingName] = useState(false)
//     const [editedName, setEditedName] = useState('')
//     const [savingName, setSavingName] = useState(false)
    
// const locale = useLocale()


//     // Add this effect with the other useEffect hooks
//     useEffect(() => {
//         if (brand) {
//             setEditedName(brand.name)
//         }
//     }, [brand])

//     const socialIcons = {
//         facebook: FaFacebook,
//         twitter: FaTwitter,
//         instagram: FaInstagram,
//         linkedin: FaLinkedin,
//         tiktok: FaTiktok,
//         youtube: FaYoutube,
//         pinterest: FaPinterest,
//         snapchat: FaSnapchat,
//         whatsapp: FaWhatsapp,
//         telegram: FaTelegram,
//         reddit: FaReddit
//     };

//     useEffect(() => {
//         fetchBrandDetails()
//     }, [brandId])

//     useEffect(() => {
//         if (brand) {
//             setAbout(brand.about)
//             setPointBackTerms(brand.pointBackTerms)
//             setSelectedStatus(brand.status)
//             setIsActive(brand.status === 'ADMINACTIVE')
//         }
//     }, [brand])

//     useEffect(() => {
//         fetchSocialMedia();
//     }, [brandId]);

//     useEffect(() => {
//         if (brand) {
//             setBrandForm({
//                 url: brand.url || '',
//                 phone: brand.phone || '',
//                 email: brand.email || '',
//                 address: brand.address || ''
//             });
//         }
//     }, [brand]);

//     const fetchBrandDetails = async () => {
//         try {
//             setLoading(true)
//             const headers = new Headers()
//             headers.append('Authorization', `Bearer ${token}`)

//             const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/${brandId}`, {
//                 method: 'GET',
//                 headers,
//             })

//             if (!response.ok) throw new Error('Failed to fetch brand details')

//             const data = await response.json()
//             setBrand(data.brand)
//             setIsActive(data.brand.status === 'ADMINACTIVE')
//         } catch (error) {
//             console.error('Error:', error)
//             toast.error('Failed to load brand details')
//         } finally {
//             setLoading(false)
//         }
//     }

//     const handleImageUpdate = async (type: 'logo' | 'cover', file: File) => {
//         const setSaving = type === 'logo' ? setSavingLogo : setSavingCover
//         try {
//             setSaving(true)
//             const formData = new FormData()

//             const fileWithProxy = new File([file], '[PROXY]', {
//                 type: file.type
//             })
//             formData.append(type, fileWithProxy)

//             const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/${brandId}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Authorization': `Bearer ${token}`
//                 },
//                 body: formData
//             })

//             if (!response.ok) throw new Error('Failed to update image')

//             toast.success(t('successUpdate'))
//             fetchBrandDetails()
//         } catch (error) {
//             console.error('Error:', error)
//             toast.error('Failed to update image')
//         } finally {
//             setSaving(false)
//         }
//     }
    

//     const handleAboutUpdate = async () => {
//         try {
//             setSavingAbout(true);
//             const formData = new FormData();
//             formData.append('about', about);

//             const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/${brandId}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Authorization': `Bearer ${token}`
//                 },
//                 body: formData
//             });

//             if (!response.ok) throw new Error('Failed to update about section');

//             // Update local state instead of fetching
//             setBrand(prevBrand => prevBrand ? {
//                 ...prevBrand,
//                 about: about
//             } : null);

//             setIsAboutEdited(false);
//             toast.success(t('successUpdate'));
//         } catch (error) {
//             console.error('Error:', error);
//             toast.error('Failed to update about section');
//             // Revert changes on error
//             setAbout(brand?.about || '');
//         } finally {
//             setSavingAbout(false);
//         }
//     };

//     const handleTermsUpdate = async () => {
//         try {
//             setSavingTerms(true);
//             const formData = new FormData();
//             formData.append('pointBackTerms', pointBackTerms);

//             const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/${brandId}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Authorization': `Bearer ${token}`
//                 },
//                 body: formData
//             });

//             if (!response.ok) throw new Error(t('failedToUpdateTerms'));

//             // Update local state instead of fetching
//             setBrand(prevBrand => prevBrand ? {
//                 ...prevBrand,
//                 pointBackTerms: pointBackTerms
//             } : null);

//             setIsTermsEdited(false);
//             toast.success(t('successUpdate'));
//         } catch (error) {
//             console.error('Error:', error);
//             toast.error(t('failedToUpdateTerms'));
//             // Revert changes on error
//             setPointBackTerms(brand?.pointBackTerms || '');
//         } finally {
//             setSavingTerms(false);
//         }
//     };

//     const fetchSocialMedia = async () => {
//         try {
//             const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/social-media/${brandId}`, {
//                 method: 'GET',
//                 headers: {
//                     'Authorization': `Bearer ${token}`
//                 },
//                 redirect: 'follow'
//             });

//             if (!response.ok) throw new Error(t('failedToFetchSocialMedia'));
//             const data = await response.json();
//             setSocialMedia(data.socialMedia);
//         } catch (error) {
//             console.error('Error:', error);
//             toast.error(t('failedToLoadSocialMediaData'));
//         }
//     };

//     const handleSocialMediaChange = (platform: keyof SocialMedia, value: string) => {
//         if (!socialMedia) return;

//         setSocialMedia(prev => prev ? { ...prev, [platform]: value } : null);
//         setEditedFields(prev => new Set(prev).add(platform));
//     };

//     const updateSocialMedia = async (platform: string) => {
//         try {
//             const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/social-media/${brandId}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     [platform]: socialMedia?.[platform as keyof SocialMedia] || null
//                 })
//             });

//             if (!response.ok) throw new Error(t('failedToUpdateSocialMedia'));

//             toast.success(`${t('updated')} ${platform} ${t('successfully')}`);
//             setEditedFields(prev => {
//                 const newSet = new Set(prev);
//                 newSet.delete(platform);
//                 return newSet;
//             });
//         } catch (error) {
//             console.error('Error:', error);
//             toast.error(`${t('failedToUpdate')} ${platform}: ${t('makeSureItIsAValidUrl')}`);
//         }
//     };

//     const updateAllSocialMedia = async () => {
//         try {
//             const updates = Array.from(editedFields).map(platform => ({
//                 [platform]: socialMedia?.[platform as keyof SocialMedia] || null
//             }));

//             const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/social-media/${brandId}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(Object.assign({}, ...updates))
//             });

//             if (!response.ok) throw new Error('Failed to update social media');

//             toast.success('All social media updated successfully');
//             setEditedFields(new Set());
//         } catch (error) {
//             console.error('Error:', error);
//             toast.error('Failed to update social media');
//         }
//     };

//     const handleBrandFieldChange = (field: string, value: string) => {
//         setBrandForm(prev => ({ ...prev, [field]: value }));
//         setEditedBrandFields(prev => new Set(prev).add(field));
//     };

//     const updateBrandField = async () => {
//         try {
//             const formData = new FormData();
    
//             // Only append fields that have been edited
//             if (editedBrandFields.has('address')) {
//                 formData.append('address', brandForm.address);
//             }
//             if (editedBrandFields.has('url')) {
//                 formData.append('url', brandForm.url);
//             }
//             if (editedBrandFields.has('phone')) {
//                 formData.append('phone', brandForm.phone);
//             }
//             if (editedBrandFields.has('email')) {
//                 formData.append('email', brandForm.email);
//             }
//             // Include ratio and pointBackRatio if they exist in the current brand
//             if (brand?.ratio) {
//                 formData.append('ratio', brand.ratio.toString());
//             }
//             if (brand?.pointBackRatio) {
//                 formData.append('pointBackRatio', brand.pointBackRatio.toString());
//             }
    
//             const headers = new Headers();
//             headers.append('Authorization', `Bearer ${token}`);
//             // Note: Don't set Content-Type header when using FormData
    
//             const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/${brandId}`, {
//                 method: 'PUT',
//                 headers,
//                 body: formData,
//                 redirect: 'follow'
//             });
    
//             if (!response.ok) {
//                 const errorData = await response.json(); // Capture the error response
//                 throw new Error(errorData.error || 'Failed to update brand information'); // Use the error message from the response
//             }
    
//             const data = await response.json();
//             setBrand(prev => prev ? { ...prev, ...data.brand } : null);
//             setEditedBrandFields(new Set());
//             toast.success(t('successUpdate'));
//         } catch (error: unknown) {
//             console.error('Error:', error)
//             if (error instanceof Error) {
//                 toast.error(`Failed to update brand information: ${error.message}`)
//             } else {
//                 toast.error('Failed to update brand information')
//             }
//         }
//     }
//     const handleSaveChanges = async () => {
//         try {
//             setIsSaving(true);
//             const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/${brandId}/status`, {
//                 method: 'PATCH',
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({ 
//                     status: isActive ? 'ACTIVE' : 'INACTIVE',
//                     ...(editedRatio !== null && { ratio: editedRatio })
//                 })
//             });

//             if (!response.ok) throw new Error('Failed to update brand');
            
//             const data = await response.json();
            
//             // Update local state with the returned status from the API
//             setBrand(prev => prev ? { 
//                 ...prev, 
//                 status: data.brand.status,
//                 ...(editedRatio !== null && { ratio: editedRatio })
//             } : null);
            
//             setEditedRatio(null);
//             toast.success(t('successUpdate'));
//         } catch (error) {
//             console.error('Error:', error);
//             toast.error(t('failedToUpdateBrand'));
//         } finally {
//             setIsSaving(false);
//         }
//     };

//     const handleStatusToggle = () => {
//         setIsActive(prev => !prev);
//         setStatusChanged(true);
//     };

//     const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         setSelectedStatus(event.target.value);
//         setStatusChanged(true);
//     };

//     const handleSaveStatus = async () => {
//         try {
//             // Prepare the data object with only the changed values
//             const data: any = {};
            
//             // Check if dates are being changed
//             const newValidTo = editedValidTo ? new Date(editedValidTo) : (brand?.validTo ? new Date(brand?.validTo) : null);
//             const currentDate = new Date();
            
//             // Determine status based on dates and admin action
//             if (statusChanged) {
//                 // If admin explicitly sets status, use ADMIN prefix
//                 data.status = selectedStatus;
//             } else if (editedValidTo && newValidTo) {
//                 // If only date is changed, determine status automatically
//                 if (newValidTo < currentDate) {
//                     data.status = 'INACTIVE'
//                 } else {
//                     data.status = 'ACTIVE'
//                 }
//             }
            
//             // Add other changed fields
//             if (editedRatio !== null) {
//                 data.ratio = editedRatio;
//             }
            
//             if (editedValidFrom !== null) {
//                 data.validFrom = editedValidFrom;
//             }
            
//             if (editedValidTo !== null) {
//                 data.validTo = editedValidTo;
//             }

//             // Only make the request if there are changes
//             if (Object.keys(data).length > 0) {
//                 const response = await axios.patch(
//                     `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/${brandId}/status`,
//                     data,
//                     {
//                         headers: {
//                             'Authorization': `Bearer ${token}`,
//                             'Content-Type': 'application/json'
//                         }
//                     }
//                 );

//                 // Update local state with the response data
//                 setBrand(prev => prev ? {
//                     ...prev,
//                     ...response.data.brand
//                 } : null);
                
//                 // Update selected status to match the new status
//                 setSelectedStatus(response.data.brand.status);
                
//                 // Reset all edit states
//                 setStatusChanged(false);
//                 setEditedRatio(null);
//                 setEditedValidFrom(null);
//                 setEditedValidTo(null);
                
//                 toast.success('Brand settings updated successfully');
//             }
//         } catch (error) {
//             console.error('Error updating brand settings:', error);
//             toast.error('Failed to update brand settings');
//         }
//     };

//     // Add this helper function at the top of your component
//     const getCurrentStatus = (status: string | undefined, validTo: string | undefined) => {
//         if (!status) return 'INACTIVE';
        
//         // If it's admin controlled, return that status
//         if (status === 'ADMINACTIVE' || status === 'ADMININACTIVE') {
//             return status;
//         }
        
//         // Check date-based status
//         if (validTo) {
//             const validToDate = new Date(validTo);
//             const currentDate = new Date();
//             return validToDate > currentDate ? 'ACTIVE' : 'INACTIVE';
//         }
        
//         return status;
//     };

//     const handleNameUpdate = async () => {
//         try {
//             setSavingName(true)
//             const formData = new FormData()
//             formData.append('name', editedName)

//             const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/${brandId}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Authorization': `Bearer ${token}`
//                 },
//                 body: formData
//             })

//             if (!response.ok) throw new Error('Failed to update brand name')

//             // Update local state
//             setBrand(prevBrand => prevBrand ? {
//                 ...prevBrand,
//                 name: editedName
//             } : null)

//             setEditingName(false)
//             toast.success(t('successUpdate'))
//         } catch (error) {
//             console.error('Error:', error)
//             toast.error('Failed to update brand name')
//             // Revert changes on error
//             setEditedName(brand?.name || '')
//         } finally {
//             setSavingName(false)
//         }
//     }
//     if (loading) {
//         return <BrandDetailsSkeleton />
//     }
//     if (!brand) return <BrandNotFound />

//     return (
//         <div className="p-4 md:p-6">
//             <div className="mb-6">
//             <div className="flex items-center gap-2">
//                     {editingName ? (
//                         <div className="flex items-center gap-2">
//                             <input
//                                 type="text"
//                                 value={editedName}
//                                 onChange={(e) => setEditedName(e.target.value)}
//                                 className="text-2xl font-bold text-teal-500 hover:text-gray-600 bg-transparent border-b-2 border-primary focus:outline-none"
//                                 autoFocus
//                             />
//                             <div className="flex gap-2">
//                                 <button
//                                     onClick={() => {
//                                         setEditedName(brand?.name || '')
//                                         setEditingName(false)
//                                     }}
//                                     className="px-2 py-1 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded"
//                                 >
//                                     {t('cancel')}
//                                 </button>
//                                 <button
//                                     onClick={handleNameUpdate}
//                                     disabled={savingName || !editedName.trim()}
//                                     className="px-2 py-1 text-sm bg-teal-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
//                                 >
//                                     {savingName ? (
//                                         <LoadingIcon className="w-5 h-5 animate-spin" />
//                                     ) : t('save')}
//                                 </button>
//                             </div>
//                         </div>
//                     ) : (
//                         <h1 
//                             className="text-2xl font-bold text-teal-500 cursor-pointer hover:text-gray-600 flex items-center gap-2"
//                             onClick={() => setEditingName(true)}
//                         >
//                             {brand?.name}
//                             <EditIcon className="w-5 h-5" />
//                         </h1>
//                     )}
//                     {/* <a 
//                         href={brand?.url} 
//                         target="_blank" 
//                         rel="noopener noreferrer"
//                         className="inline-flex items-center"
//                     >
//                         <ArrowTopRightOnSquareIconn className='w-5 h-5 text-[#00a18f] hover:text-gray-700' />
//                     </a> */}
//                 </div>
//                 </div>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
//                 <div className="space-y-4 md:space-y-6">
//                     <div className="bg-white rounded-xl p-4 shadow-xl">
//                         <div className="relative mb-8">
                            
//                             <ImageApi
//                                 src={brand?.cover}
//                                 alt={brand?.name}
//                                 className="w-full h-[160px] object-cover rounded-lg"
//                                 width={600}
//                                 height={160}
//                             />
//                             <button
//                                 onClick={() => coverInputRef.current?.click()}
//                                 className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity"
//                             >
//                                 {savingCover ? (
//                                     <LoadingIcon className="w-8 h-8 text-white animate-spin" />
//                                 ) : (
//                                     <PhotoIcon className="w-8 h-8 text-white" />
//                                 )}
//                             </button>
//                             <input
//                                 type="file"
//                                 ref={coverInputRef}
//                                 className="hidden"
//                                 accept="image/*"
//                                 onChange={(e) => {
//                                     const file = e.target.files?.[0]
//                                     if (file) handleImageUpdate('cover', file)
//                                 }}
//                             />

//                             <div className="absolute -bottom-6 left-4">
//                                 <div className="w-[80px] h-[80px] bg-white p-1 rounded-lg relative">
//                                     <ImageApi
//                                         src={brand?.logo}
//                                         alt={brand?.name}
//                                         className="w-full h-full object-cover rounded-lg o"
//                                         width={80}
//                                         height={80}
//                                     />
//                                     <button
//                                         onClick={() => logoInputRef.current?.click()}
//                                         className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg"
//                                     >
//                                         {savingLogo ? (
//                                             <LoadingIcon className="w-6 h-6 text-white animate-spin" />
//                                         ) : (
//                                             <PhotoIcon className="w-6 h-6 text-white" />
//                                         )}
//                                     </button>
//                                     <input
//                                         type="file"
//                                         ref={logoInputRef}
//                                         className="hidden"
//                                         accept="image/*"
//                                         onChange={(e) => {
//                                             const file = e.target.files?.[0]
//                                             if (file) handleImageUpdate('logo', file)
//                                         }}
//                                     />
//                                 </div>
//                                 {/* Add purchase count display */}

//                             </div>
//                         </div>
//                     </div>

//                     {/* Add Ratios and Validity Period Section */}
//                     <div className="bg-white rounded-xl p-4 shadow-xl mt-8">
//                         <div className="grid grid-cols-2 gap-4">
//                             {/* Point Back Ratio */}
//                             <div className="space-y-2">
//                                 <label className="font-bold text-slate-950 text-sm">
//                                     {t('pointBack')} {t('ratio')}
//                                 </label>
//                                 <div className="flex items-center gap-2">
//                                     <input
//                                         type="number"
//                                         min="0"
//                                         max="100"
//                                         value={editedPointBackRatio !== null ? editedPointBackRatio : brand?.pointBackRatio || 0}
//                                         onChange={(e) => {
//                                             const newValue = Number(e.target.value);
//                                             setEditedPointBackRatio(newValue);
//                                             setHasChanges(true);
//                                         }}
//                                         className="w-24 px-3 py-2 border rounded-lg text-sm"
//                                     />
//                                     <span className="text-sm text-gray-500">%</span>
//                                 </div>
//                             </div>

                            

//                             {/* Main Ratio */}
//                             <div className="space-y-2">
//                                 <label className="font-bold text-slate-950 text-sm">
//                                     {t('ratio')}
//                                 </label>
//                                 <div className="flex items-center gap-2">
//                                     <input
//                                         type="number"
//                                         min="0"
//                                         max="100"
//                                         value={editedRatio !== null ? editedRatio : brand?.ratio || ''}
//                                         onChange={(e) => {
//                                             const newValue = Number(e.target.value);
//                                             setEditedRatio(newValue);
//                                             setHasChanges(true);
//                                         }}
//                                         className="w-24 px-3 py-2 border rounded-lg text-sm"
//                                     />
//                                     <span className="text-sm text-gray-500">%</span>
//                                 </div>
//                             </div>

//                             {/* Validity Period */}
//                             <div className="space-y-2">
//                                 <label className="font-bold text-slate-950 text-sm">
//                                     {t('validityPeriod')}
//                                 </label>
//                                 <div className="flex items-center gap-2">
//                                     <input
//                                         type="number"
//                                         min="1"
//                                         value={editedValidityPeriod !== null ? editedValidityPeriod : brand?.validityPeriod || 6}
//                                         onChange={(e) => {
//                                             const newValue = Number(e.target.value);
//                                             setEditedValidityPeriod(newValue);
//                                             setHasChanges(true);
//                                         }}
//                                         className="w-24 px-3 py-2 border rounded-lg text-sm"
//                                     />
//                                     <span className="text-sm text-gray-500">{t('months')}</span>
//                                 </div>
//                             </div>


//                             {/* Up to Percentage */}
//                             <div className="space-y-2">
//                                 <label className="font-bold text-slate-950 text-sm">
//                                     {t('upTo')}
//                                 </label>
//                                 <div className="flex items-center gap-2">
//                                     <input
//                                         type="number"
//                                         min="0"
//                                         max="100"
//                                         value={editedUpTo !== null ? editedUpTo : brand?.upto || 0}
//                                         onChange={(e) => {
//                                             const newValue = Number(e.target.value);
//                                             setEditedUpTo(newValue);
//                                             setHasChanges(true);
//                                         }}
//                                         className="w-24 px-3 py-2 border rounded-lg text-sm"
//                                     />
//                                     <span className="text-sm text-gray-500">%</span>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Save Button */}
//                         {hasChanges && (
//                             <div className="mt-4 flex justify-end gap-2">
//                                 <button
//                                     onClick={() => {
//                                         // Reset all edited values
//                                         setEditedPointBackRatio(null);
//                                         setEditedRatio(null);
//                                         setEditedValidityPeriod(null);
//                                         setEditedUpTo(null);
//                                         setHasChanges(false);
//                                     }}
//                                     className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
//                                 >
//                                     {t('cancel')}
//                                 </button>
//                                 <button
//                                     onClick={async () => {
//                                         try {
//                                             const updatedData = {
//                                                 ...(editedPointBackRatio !== null && { pointBackRatio: editedPointBackRatio }),
//                                                 ...(editedRatio !== null && { ratio: editedRatio }),
//                                                 ...(editedValidityPeriod !== null && { validityPeriod: editedValidityPeriod }),
//                                                 ...(editedUpTo !== null && { upto: editedUpTo })
//                                             };

//                                             const response = await fetch(
//                                                 `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/${brandId}`,
//                                                 {
//                                                     method: 'PUT',
//                                                     headers: {
//                                                         'Authorization': `Bearer ${token}`,
//                                                         'Content-Type': 'application/json'
//                                                     },
//                                                     body: JSON.stringify(updatedData)
//                                                 }
//                                             );

//                                             if (!response.ok) {
//                                                 throw new Error('Failed to update brand settings');
//                                             }

//                                             const data = await response.json();
//                                             setBrand(prev => prev ? { ...prev, ...data.brand } : null);
                                            
//                                             // Reset all edited values
//                                             setEditedPointBackRatio(null);
//                                             setEditedRatio(null);
//                                             setEditedValidityPeriod(null);
//                                             setEditedUpTo(null);
//                                             setHasChanges(false);
                                            
//                                             toast.success(t('successUpdate'));
//                                         } catch (error) {
//                                             console.error('Error updating brand settings:', error);
//                                             toast.error(t('failedUpdate'));
//                                         }
//                                     }}
//                                     className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors text-sm"
//                                 >
//                                     {t('saveChanges')}
//                                 </button>
//                             </div>
//                         )}
//                     </div>

//                     <div className="bg-white rounded-xl p-4 shadow-xl">
//                         <div className="flex justify-between items-center mb-2">
//                             <h2 className="font-medium ">{t('about')}</h2>
//                             <div className="flex gap-2">
//                                 {isAboutEdited && (
//                                     <button
//                                         onClick={() => {
//                                             setAbout(brand?.about || '');
//                                             setIsAboutEdited(false);
//                                         }}
//                                         className="px-4 py-1 rounded-md text-sm bg-gray-200 hover:bg-gray-300 text-black-700"
//                                     >
//                                         {(t('cancel_delete_brand'))}
//                                     </button>
//                                 )}
//                                 <button
//                                     onClick={handleAboutUpdate}
//                                     disabled={!isAboutEdited || savingAbout}
//                                     className={`px-4 py-1 rounded-md text-sm transition-colors ${isAboutEdited
//                                             ? 'bg-teal-500 text-white hover:bg-teal-600'
//                                             : 'bg-gray-200 text-black-500'
//                                         }`}
//                                 >
//                                     {savingAbout ? (
//                                         <LoadingIcon className="w-5 h-5 animate-spin" />
//                                     ) : (t('saveBrandData'))}
//                                 </button>
//                             </div>
//                         </div>
                        
//                         <Textarea
//                             value={about}
//                             onChange={(e) => {
//                                 setAbout(e.target.value)
//                                 setIsAboutEdited(true)
//                             }}
//                             className={`min-h-[100px] resize-none border rounded-md ${
//                                 locale === 'ar' ? 'text-left dir-rtl' : 'text-left dir-ltr'
//                             }`}
//                             dir={locale === 'ar' ? 'ltr' : 'ltr'}
//                         />
//                     </div>
                    

//                     <div className="bg-white rounded-xl p-4 shadow-xl">
//                         <div className="flex justify-between items-center mb-2">
//                             <h2 className="font-medium">{(t('pointsBackTerms'))}</h2>
//                             <div className="flex gap-2">
//                                 {isTermsEdited && (
//                                     <button
//                                         onClick={() => {
//                                             setPointBackTerms(brand?.pointBackTerms || '');
//                                             setIsTermsEdited(false);
//                                         }}
//                                         className="px-4 py-1 rounded-md text-sm bg-gray-200 hover:bg-gray-300 text-black-700"
//                                     >
//                                         {(t('cancel_delete_brand'))}
//                                     </button>
//                                 )}
//                                 <button
//                                     onClick={handleTermsUpdate}
//                                     disabled={!isTermsEdited || savingTerms}
//                                     className={`px-4 py-1 rounded-md text-sm transition-colors ${isTermsEdited
//                                             ? 'bg-teal-500 text-white hover:bg-teal-600'
//                                             : 'bg-gray-200 text-black-500'
//                                         }`}
//                                 >
//                                     {savingTerms ? (
//                                         <LoadingIcon className="w-5 h-5 animate-spin" />
//                                     ) : (t('saveBrandData'))}
//                                 </button>
//                             </div>
//                         </div>
//                         <Textarea
//                             value={pointBackTerms}
//                             onChange={(e) => {
//                                 setPointBackTerms(e.target.value)
//                                 setIsTermsEdited(true)
//                             }}
//                             className="min-h-[100px] resize-none border rounded-md"
//                         />
//                     </div>
//                 </div>
                
//                 <div className="space-y-4 md:space-y-6">
//                     <div className="bg-white rounded-xl p-6 shadow-xl">
//                         <div className="grid grid-cols-2 gap-6">
//                             <div className="space-y-4">
//                                 <div className="space-y-2">
//                                     <label className="font-bold text-slate-950 text-sm">{t('validFrom')}</label>
//                                     <div className="flex items-center gap-2">
//                                         <input
//                                             type="date"
//                                             value={editedValidFrom || brand?.validFrom?.split('T')[0] || ''}
//                                             onChange={(e) => setEditedValidFrom(e.target.value)}
//                                             className="px-3 py-2 border rounded-lg text-sm w-full"
//                                         />
//                                         {editedValidFrom && (
//                                             <button
//                                                 onClick={() => setEditedValidFrom(null)}
//                                                 className="text-xs text-gray-500 hover:text-gray-700"
//                                             >
//                                                 {t('cancel')}
//                                             </button>
//                                         )}
//                                     </div>
//                                     <div className="text-xs text-gray-500">
//                                         {t('current')}: {new Date(brand?.validFrom || '').toLocaleDateString()}
//                                     </div>
//                                 </div>
//                                 <div className="space-y-2">
//                                     <label className="font-bold text-slate-950 text-sm">{t('validTo')}</label>
//                                     <div className="flex items-center gap-2">
//                                         <input
//                                             type="date"
//                                             value={editedValidTo || brand?.validTo?.split('T')[0] || ''}
//                                             onChange={(e) => setEditedValidTo(e.target.value)}
//                                             className="px-3 py-2 border rounded-lg text-sm w-full"
//                                         />
//                                         {editedValidTo && (
//                                             <button
//                                                 onClick={() => setEditedValidTo(null)}
//                                                 className="text-xs text-gray-500 hover:text-gray-700"
//                                             >
//                                                 {t('cancel')}
//                                             </button>
//                                         )}
//                                     </div>
//                                     <div className="text-xs text-gray-500">
//                                         {t('current')}: {new Date(brand?.validTo || '').toLocaleDateString()}
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="space-y-4">
//                                 <div className="space-y-2">
//                                     <label className="font-bold text-slate-950 text-sm flex items-center gap-2">
//                                             {t('status')}
//                                         <div className="flex items-center gap-2 ml-2">
//                                             <div className={`w-2 h-2 rounded-full ${
//                                                 getCurrentStatus(selectedStatus, brand?.validTo) === 'ADMINACTIVE' || 
//                                                 getCurrentStatus(selectedStatus, brand?.validTo) === 'ACTIVE'
//                                                     ? 'bg-green-500' 
//                                                     : 'bg-red-500'
//                                             }`} />
//                                             <span className={`text-sm ${
//                                                 getCurrentStatus(selectedStatus, brand?.validTo) === 'ADMINACTIVE' || 
//                                                 getCurrentStatus(selectedStatus, brand?.validTo) === 'ACTIVE'
//                                                     ? 'text-green-500' 
//                                                     : 'text-red-500'
//                                             }`}>
//                                                 {t('currently')} {
//                                                     getCurrentStatus(selectedStatus, brand?.validTo) === 'ADMINACTIVE' 
//                                                         ? t('adminActive')
//                                                         : getCurrentStatus(selectedStatus, brand?.validTo) === 'ADMININACTIVE'
//                                                             ? t('adminInactive')
//                                                             : getCurrentStatus(selectedStatus, brand?.validTo) === 'ACTIVE'
//                                                                 ? t('active')
//                                                                 : t('inactive')
//                                                 }
//                                             </span>
//                                         </div>
//                                     </label>
//                                     <div className="flex items-center gap-4">
//                                         <div className="flex gap-2">
//                                             <button
//                                                 onClick={() => {
//                                                     setSelectedStatus('ADMINACTIVE')
//                                                     setStatusChanged(true)
//                                                 }}
//                                                 className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
//                                                     selectedStatus === 'ADMINACTIVE'
//                                                         ? 'bg-green-500 text-white'
//                                                         : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                                                 }`}
//                                             >
//                                                 {t('adminActive')}
//                                             </button>
//                                             <button
//                                                 onClick={() => {
//                                                     setSelectedStatus('ADMININACTIVE')
//                                                     setStatusChanged(true)
//                                                 }}
//                                                 className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
//                                                     selectedStatus === 'ADMININACTIVE'
//                                                         ? 'bg-red-500 text-white'
//                                                         : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                                                 }`}
//                                             >
//                                                 {t('adminInactive')}
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </div>
// {/* 
//                                 <div className="space-y-2">
//                                     <label className="font-bold text-slate-950 ">
//                                         {t('pointBack')}
//                                     </label>
//                                     <label className="font-bold text-slate-950 ">
//                                         {t('Ratio')}
//                                     </label>
//                                     <div className="flex items-center gap-2">
//                                         <input
//                                             type="number"
//                                             min="0"
//                                             max="100"
//                                             value={editedRatio !== null ? editedRatio : brand?.ratio || ''}
//                                             onChange={(e) => setEditedRatio(Number(e.target.value))}
//                                             className="w-24 px-3 py-2 border rounded-lg text-sm"
//                                         />
//                                         <span className="text-sm text-gray-500">%</span>
//                                     </div>
//                                 </div> */}

// <div className=" -bottom-12 left-0 right-0 text-center">{t('totalPurchases')}
                               
//                                 </div>
//                                 <div className="flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm">
//       <div className="flex items-center space-x-2">
//         <ShoppingCart className="w-5 h-5 text-indigo-600" />
//         {/* <span className="text-sm font-medium text-gray-700">Total Purchases</span> */}
//       </div>
//       {t('purchaseCount')}: {brand?.purchaseCount || 0}
//     </div>

//                             </div>
//                         </div>

//                         {(statusChanged || editedRatio !== null || editedValidFrom !== null || editedValidTo !== null) && (
//                             <div className="mt-6 flex justify-end">
//                                 <button
//                                     onClick={handleSaveStatus}
//                                     className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
//                                 >
//                                     {t('saveChanges')}
//                                 </button>
//                             </div>
//                         )}
//                     </div>

//                     <div className="bg-white rounded-[32px] shadow-2xl p-4 md:p-7">
//                         <form className="mt-5 space-y-2">
//                             <div className="text-lg font-bold text-slate-950 translate-y-[-50%]">{(t('brandInfo'))}</div>
//                             <div className="flex gap-4 items-center">
//                                 <label className="w-24 text-xs text-slate-950 text-left">{(t('brandUrl'))} :</label>
//                                 <input
//                                     type="url"
//                                     value={brandForm.url}
//                                     onChange={(e) => handleBrandFieldChange('url', e.target.value)}
//                                     className="flex-1 px-3.5 py-1 text-xs bg-white rounded-xl border border-zinc-300 text-black-400 text-left"
//                                 />
//                             </div>

//                             <div className="flex gap-4 items-center">
//                                 <label className="w-24 text-xs text-slate-950">{(t('phone'))} :</label>
//                                 <input
//                                     type="tel"
//                                     value={brandForm.phone}
//                                     onChange={(e) => handleBrandFieldChange('phone', e.target.value)}
//                                     className="flex-1 px-3.5 py-1 text-xs bg-white rounded-xl border border-zinc-300 text-black-400"
//                                 />
//                             </div>

//                             <div className="flex gap-4 items-center">
//                                 <label className="w-24 text-xs text-slate-950">{(t('email'))} :</label>
//                                 <input
//                                     type="email"
//                                     value={brandForm.email}
//                                     onChange={(e) => handleBrandFieldChange('email', e.target.value)}
//                                     className="flex-1 px-3.5 py-1 text-xs bg-white rounded-xl border border-zinc-300 text-black-400 text-left"
//                                 />
//                             </div>

//                             <div className="flex gap-4 items-center">
//                                 <label className="w-24 text-xs text-black-200">{(t('location'))} :</label>
//                                 <input
//                                     type="text"
//                                     value={brandForm.address}
//                                     onChange={(e) => handleBrandFieldChange('address', e.target.value)}
//                                     className="flex-1 px-3.5 py-1 text-xs bg-white rounded-xl border border-zinc-300 text-black-400 text-left"
//                                 />
//                             </div>

//                             {editedBrandFields.size > 0 && (
//                                 <div className="flex justify-end gap-2 mt-2">
//                                     <button
//                                         type="button"
//                                         onClick={() => {
//                                             setBrandForm({
//                                                 url: brand?.url || '',
//                                                 phone: brand?.phone || '',
//                                                 email: brand?.email || '',
//                                                 address: brand?.address || ''
//                                             });
//                                             setEditedBrandFields(new Set());
//                                         }}
//                                         className="px-4 py-1 text-xs bg-red-200 hover:bg-gray-300 text-red-700 rounded-lg"
//                                     >
//                                         {t('cancel')}
//                                     </button>
//                                     <button
//                                         type="button"
//                                         onClick={updateBrandField}
//                                         className="px-4 py-1 text-xs bg-teal-500 text-white rounded-lg hover:bg-teal-600"
//                                     >
//                                         {(t('saveAllChanges'))}
//                                     </button>
//                                 </div>
//                             )}
//                         </form>

//                         <div className="mt-4">
//                             <div className="flex justify-between items-center mb-2">
//                                 <h3 className="text-lg font-bold text-slate-950">
//                                     {(t('socialMediaAccount'))}
//                                 </h3>
//                                 {editedFields.size > 0 && (
//                                     <div className="flex gap-2">
//                                         <button
//                                             onClick={() => {
//                                                 fetchSocialMedia();
//                                                 setEditedFields(new Set());
//                                             }}
//                                             className="px-4 py-1 text-xs bg-gray-200 hover:bg-gray-300 text-black-700 rounded-lg"
//                                         >
//                                             {(t('cancel_delete_brand'))}
//                                         </button>
//                                         <button
//                                             onClick={updateAllSocialMedia}
//                                             className="px-4 py-1 text-xs bg-teal-500 text-white rounded-lg hover:bg-teal-600"
//                                         >
//                                             {(t('saveAllChanges'))}
//                                         </button>
//                                     </div>
//                                 )}
//                             </div>
//                             <div className="space-y-2">
//                                 {socialMedia && (Object.entries(socialIcons) as [SocialMediaPlatform, React.ComponentType<{ className?: string }>][]).map(([platform, Icon]) => (
//                                     <div key={platform} className="flex items-center gap-2">
//                                         <Icon className="w-5 h-5 min-w-[20px] text-black-500" />
//                                         <div className="flex-1 min-w-0">
//                                         <input
//     type="url"
//     placeholder={`${t('enter')} ${platform} ${t('url')}`}
//     value={socialMedia[platform] || ''}
//     onChange={(e) => handleSocialMediaChange(platform, e.target.value)}
//     className={`w-full px-3 py-1 text-xs bg-white rounded-xl border border-zinc-300 text-black-400 ${
//         locale === 'ar' ? 'text-left dir-ltr' : 'text-left dir-ltr'
//     }`}
//     dir={locale === 'ar' ? 'ltr' : 'ltr'}
// />
//                                         </div>
//                                         {editedFields.has(platform) && (
//                                             <div className="flex gap-1 ml-1">
//                                                 <button
//                                                     onClick={() => {
//                                                         handleSocialMediaChange(platform, socialMedia[platform] || '');
//                                                         setEditedFields(prev => {
//                                                             const newSet = new Set(prev);
//                                                             newSet.delete(platform);
//                                                             return newSet;
//                                                         });
//                                                     }}
//                                                     className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 text-black-700 rounded-lg"
//                                                 >
//                                                     {t('cancel')}
//                                                 </button>
//                                                 <button
//                                                     onClick={() => updateSocialMedia(platform)}
//                                                     className="px-2 py-1 text-xs bg-teal-500 text-white rounded-lg hover:bg-teal-600"
//                                                 >
//                                                     {t('save')}
//                                                 </button>
//                                             </div>
//                                         )}
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <div className="mt-8">
//                 <div className="bg-white text-[#59be8f] rounded-xl shadow-2xl">
//                     <div className="flex flex-wrap gap-2 py-2 px-4">
//                         {tabs.map(tab => (
//                             <button
//                                 key={tab.id}
//                                 onClick={() => setActiveTab(tab.id)}
//                                 className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
//                                     activeTab === tab.id
//                                         ? 'bg-[#02161e] text-white'
//                                         : 'text-[#2ab09c] hover:bg-slate-100'
//                                 }`}
//                             >
//                                 {tab.label}
//                             </button>
//                         ))}
//                     </div>
//                 </div>

//                 <div className="mt-4">
//                     {activeTab === 'brand' && <BrandOffers brandId={brandId} />}
//                     {activeTab === 'special' && <SpecialOffers brandId={brandId} />}
//                     {activeTab === 'exclusive' && <ExclusiveOffers brandId={brandId} />}
//                     {activeTab === 'digital' && <DigitalSeals brandId={brandId} />}
//                     {activeTab === 'custom' && <CustomOffers brandId={brandId} />}
//                     {activeTab === 'hot' && <HotDeals brandId={brandId} />}
//                     {activeTab === 'representative' && <BrandRepresentative brandId={brandId} />}
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default BrandDetails

// function setIsSaving(arg0: boolean) {
//     throw new Error('Function not implemented.')
// }


'use client'
import React, { useEffect, useState } from 'react'
import { CategoryIconn,CategoryIconn_green, DeleteIcon, LoadingIcon, PluseCircelIcon } from '../icons'
import { PencilSquareIcon, TrashIcon,ArrowTopRightOnSquareIcon, ArrowPathIcon,PencilIcon } from '@heroicons/react/24/outline'
import { BrandEyeIcon, Restore_brand,ArrowTopRightOnSquareIconn,TrashIconn,PencilIconn,EyeIcon,EyeIcon2 } from '../icons'

import { useLocale, useTranslations } from 'next-intl'
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogHeader, 
    DialogTitle,
    DialogFooter 
} from '@/components/ui/dialog'
import toast from 'react-hot-toast'
import { useAppContext } from '@/context/appContext'
import mlang from '@/lib/mLang'
import ImageApi from '@/components/ImageApi'
import Table from '@/components/ui/Table'
import { useRouter, useSearchParams, useParams } from 'next/navigation'
import AddBrand from './AddBrand'
// import LanguageSwitcher from '@/components/LanguageSwitcher'

type SupportedLocale = 'ar' | 'en';

interface Brand {
    id: number;
    name: string;
    phone: string;
    email: string;
    logo: string;
    validFrom: string;
    validTo: string;
    purchaseCount: number;
    isActive: boolean;
    ratio?: number;
    url?: string;
    isDeleted: boolean;
    status: 'ACTIVE' | 'INACTIVE' | 'DELETED' | 'ADMINACTIVE';
}

interface BrandsProps {
    initialBrands?: Brand[];
    initialCount?: number;
    validTo: string;
    purchaseCount: number;
    isActive: boolean;
    ratio?: number;
    url?: string;

}

interface Offer {
    category: {
        id: number;
    };
    validTo?: string;
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
    const searchParams = useSearchParams()
    const categoryId = searchParams.get('categoryId')
    const categoryName = searchParams.get('categoryName')
    
    // Add state for filtered brands if needed
    const [filteredBrands, setFilteredBrands] = useState<Brand[]>([])

    // Add new state for brand categories
    const [brandCategories, setBrandCategories] = useState<any[]>([])

    const t = useTranslations('brand')
    const locale = useLocale() as SupportedLocale;
    const router = useRouter()

    // Add state for categories dialog
    const [showCategoriesDialog, setShowCategoriesDialog] = useState(false)

    // Add categoryName state
    const [categoryNameState, setCategoryNameState] = useState<string>('');

    // Inside the Brands component, add state for editing
    const [editingBrand, setEditingBrand] = useState<Brand | null>(null)

    // Add categoryId from route params
    const params = useParams()
    const categoryIdFromRoute = params?.categoryId as string
    
    // Update handleViewBrand to fetch brand categories
    const handleViewBrand = async (id: number) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/offers?brandId=${id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            )
            
            if (!response.ok) throw new Error('Failed to fetch brand offers')
            
            const data = await response.json()
            // Extract unique categories and check for expired offers
            const uniqueCategories = data.offers.reduce((acc: any[], offer: any) => {
                const categoryExists = acc.some(cat => cat.id === offer.category.id)
                if (!categoryExists && offer.category) {
                    // Check if any offers for this category are expired
                    const categoryOffers = data.offers.filter((o: Offer) => o.category.id === offer.category.id)
                    const hasExpiredOffers = categoryOffers.some((o: Offer) => 
                        o.validTo && new Date(o.validTo) < new Date()
                    )
                    
                    acc.push({
                        id: offer.category.id,
                        name: offer.category.name,
                        imageUrl: offer.category.imageUrl || '/imgs/notfound.png',
                        isExpired: hasExpiredOffers
                    })
                }
                return acc
            }, [])
            
            setBrandCategories(uniqueCategories)
            setShowCategoriesDialog(true)
        } catch (error) {
            console.error('Error fetching brand offers:', error)
            toast.error('Failed to fetch brand categories')
        }
    }

    // Update fetchBrands function to use offers endpoint
    const fetchBrands = async (page: number, limit: number) => {
        try {
            setLoading(true)
            const skip = (page - 1) * limit
            
            // Get brandIds from URL if they exist
            const brandIds = searchParams.get('ids')
            
            // Construct URL with proper parameters
            const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brand`)
            url.searchParams.set('limit', limit.toString())
            url.searchParams.set('skip', skip.toString())
            
            if (brandIds) {
                url.searchParams.set('ids', brandIds)
            }
            
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) throw new Error('Failed to fetch brands')

            const data = await response.json()
            setBrands(data.brands || [])
            setCount(data.totalCount || 0)
        } catch (error) {
            console.error('Error fetching brands:', error)
            toast.error('Failed to fetch brands')
        } finally {
            setLoading(false)
        }
    }

    // Update useEffect to react to URL parameter changes
    useEffect(() => {
        fetchBrands(currentPage, pageSize)
    }, [searchParams, currentPage, pageSize])

    const fetchCategoryName = async (id: string) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/category/${id}?lang=${locale}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            )
            if (!response.ok) throw new Error('Failed to fetch category')
            const data = await response.json()
            setCategoryNameState(data.category.name)
        } catch (error) {
            console.error('Error fetching category:', error)
        }
    }

    // Add pagination calculations
    const paginatedBrands = brands.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    
    const handleDeleteBrand = async (id: number) => {
        try {
            setLoading(true)
            
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/${id}/delete`, 
                {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            )

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || t('deleteFailed'))
            }

            // Update both isDeleted and status in the local state
            setBrands(prevBrands => 
                prevBrands.map(brand => 
                    brand.id === id 
                        ? { ...brand, isDeleted: true, status: 'DELETED' }
                        : brand
                )
            )
            
            setOpenDelete(null)
            toast.success(data.message || t('successDelete'))
        } catch (error: any) {
            console.error('Delete brand error:', error)
            toast.error(error.message || t('deleteFailed'))
        } finally {
            setLoading(false)
        }
    }

    const handleRestoreBrand = async (id: number) => {
        try {
            setLoading(true)
            
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/${id}/restore`,
                {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            )

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || t('restoreFailed'))
            }

            // Update the brand in the local state with the returned data
            setBrands(prevBrands => 
                prevBrands.map(brand => 
                    brand.id === id 
                        ? { 
                            ...brand, 
                            isDeleted: false,
                            status: data.brand.status // Use the status from the server response
                        }
                        : brand
                )
            )

            toast.success(data.message || t('successRestore'))
        } catch (error: any) {
            console.error('Restore brand error:', error)
            toast.error(error.message || t('restoreFailed'))
        } finally {
            setLoading(false)
        }
    }

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
        if (!brands?.length) return [];

        return brands.map((brand: Brand) => {
            // Determine the display status and background color
            const displayStatus = brand.status === 'ADMINACTIVE' ? 'ACTIVE' : brand.status;
            const statusColor = brand.status === 'DELETED' ? 'bg-red-100 text-red-800' : 
                                displayStatus === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
                                'bg-yellow-100 text-yellow-800';
            
            // Check if brand has passed its valid-to date
            const isExpired = brand.validTo ? new Date(brand.validTo) < new Date() : false;
            
            // Determine row background color based on deletion status and expiration
            const rowBackground = brand.status === 'DELETED' ? 'bg-red-100/60' : 
                                isExpired ? 'bg-red-50' :
                                'odd:bg-white even:bg-primary/5';

            return (
                <tr 
                    key={brand.id} 
                    className={`border-b ${rowBackground} ${isExpired ? 'text-red-700' : ''}`}
                >
                    <td className="px-6 py-4">
                        <div className="size-12">
                            <ImageApi
                                src={brand.logo || '/imgs/notfound.png'}
                                alt={mlang(brand.name, locale)}
                                loader={() => brand.logo}
                                loading='lazy'
                                height={48}
                                width={48}
                                className='object-cover rounded-full w-full h-full'
                            />
                        </div>
                    </td>
                    <td className="px-6 py-4 font-medium">
                        {mlang(brand.name, locale)}
                    </td>
                    <td className="px-6 py-4">
                        {brand.phone || t('noPhone')}
                    </td>
                    <td className="px-6 py-4">
                        {brand.validFrom ? new Date(brand.validFrom).toLocaleDateString(locale) : '-'}
                    </td>
                    <td className="px-6 py-4">
                        {brand.validTo ? new Date(brand.validTo).toLocaleDateString(locale) : '-'}
                    </td>
                    <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${statusColor}`}>
                            {displayStatus === 'DELETED' 
                                ? t('deleted')
                                : displayStatus === 'ACTIVE'
                                    ? t('active')
                                    : t('notActive')
                            }
                        </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-3">
                            {brand.status !== 'DELETED' ? (
                                <>
                                    {/* View Categories button */}
                                    <button
                                        onClick={() => handleViewBrand(brand.id)}
                                        className='text-green-500 hover:text-green-700 text-[#24ae9f]'
                                        aria-label={t('viewCategories')}
                                    >
                                        <CategoryIconn_green className='w-5 h-5 text-[#24ae9f]/80 hover:text-gray-700' />
                                    </button>
                                    

                                    {/* View Details button */}
                                    <button
                                        onClick={() => router.push(`/${locale}/brands/${brand.id}`)}
                                        className='text-blue-500 hover:text-blue-700'
                                        aria-label={t('viewBrandDetails')}
                                    >
                                        <ArrowTopRightOnSquareIconn className='w-5 h-5 text-[#00a18f] hover:text-gray-700' />
                                    </button>



                                    {/* Edit button */}
                                    {/* <button
                                        onClick={() => setEditingBrand(brand)}
                                        className='text-blue-500 hover:text-blue-700'
                                        aria-label={t('editBrand')}
                                    >
                                        <PencilIconn className='w-5 h-5 text-[#00a18f] hover:text-gray-700' />
                                    </button> */}


                                    {/* Delete button */}
                                    <button
                                        onClick={() => setOpenDelete(brand.id)}
                                        className='text-red-500 hover:text-red-700'
                                        aria-label={t('deleteBrand')}
                                    >
                                        <TrashIconn className='w-5 h-5 text-[#00a18f] hover:text-gray-700' />
                                    </button>
                                </>
                            ) : (
                                // Restore button for deleted brands
                                <button
                                    onClick={() => handleRestoreBrand(brand.id)}
                                    className='flex items-center gap-2 text-primary hover:text-primary/70'
                                    aria-label={t('restoreBrand')}
                                >
                                    <Restore_brand   className='w-5 h-5' />
                                    <span>{t('restore')}</span>
                                </button>
                            )}
                        </div>
                    </td>
                </tr>
            );
        });
    }

    // Add this function to handle language change
    const handleLanguageChange = (newLocale: string) => {
        // Preserve the current URL parameters when changing language
        const params = new URLSearchParams(searchParams.toString())
        router.push(`/${newLocale}/brands?${params.toString()}`)
    }

    // Add event listener for offer changes
    useEffect(() => {
        const handleOffersChange = () => {
            // Refresh the brands list when offers change
            fetchBrands(currentPage, pageSize)
        }

        window.addEventListener('brandOffersChanged', handleOffersChange)

        return () => {
            window.removeEventListener('brandOffersChanged', handleOffersChange)
        }
    }, [currentPage, pageSize])

    return (
        <div className='p-container space-y-6'>
            <div className='flex justify-between items-center'>
                <div className='flex items-center gap-4'>
                    <h4 className='font-bold text-lg md:text-xl lg:text-2xl'>{t('title')}</h4>
                    {searchParams.get('ids') && categoryName && (
                        <div className='flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full'>
                            <span className='text-sm text-primary'>
                                {t('filteredBy')}: {decodeURIComponent(categoryName)}
                            </span>
                            <button
                                onClick={() => router.push(`/${locale}/brands`)}
                                className='text-primary hover:text-primary/70'
                                aria-label={t('clear_filter')}
                            >
                                <TrashIcon className='w-5 h-5' />
                            </button>
                        </div>
                    )}
                </div>
                {/* <button
                    onClick={() => setIsAddBrandOpen(true)}
                    className='px-5 py-2  rounded-md text-white font-medium'
                >
                    <div className='flex gap-3  border-2 border-[#02161e] rounded-md px-2 py-1 bg-[#02161e] text-white'>
                        <PluseCircelIcon className='size-6 text-teal-500' />
                        <div className='flex-1'>{t('brandaddButton')}</div>
                    </div>
                </button> */}

<button
          onClick={() => {
            setIsAddBrandOpen(true);
          }}    
          className="px-5 py-2 bg-primary rounded-md text-white font-medium"
        >

          <div className="flex gap-3">
            <PluseCircelIcon className="size-6" />
            <div className="flex-1">{t("brandaddButton")}</div>
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
                onPageSizeChange={(size) => {
                    setPageSize(size)
                    setCurrentPage(1)
                }}
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

            {/* Add the AddBrand dialog with editing support */}
            <AddBrand 
                isOpen={isAddBrandOpen || !!editingBrand} 
                onClose={() => {
                    setIsAddBrandOpen(false)
                    setEditingBrand(null)
                }}
                brandToEdit={editingBrand}
            />

            {/* Brand Categories Dialog */}
            <Dialog open={showCategoriesDialog} onOpenChange={setShowCategoriesDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('brandCategories')}</DialogTitle>
                        <DialogDescription>
                            {brandCategories.length > 0 
                                ? t('brandCategoriesDescription')
                                : t('noCategoriesFound')}
                        </DialogDescription>
                    </DialogHeader>
                    {brandCategories.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4">
                            {brandCategories.map((category) => (
                                <div 
                                    key={category.id}
                                    className={`p-4 border rounded-lg flex items-center gap-3 
                                        ${category.isExpired ? 'bg-red-50 text-red-700 border-red-200' : 'bg-white'}`}
                                >
                                    <div className="w-10 h-10 flex-shrink-0">
                                        <ImageApi
                                            src={category.imageUrl}
                                            alt={mlang(category.name, locale)}
                                            loader={() => category.imageUrl}
                                            loading='lazy'
                                            height={40}
                                            width={40}
                                            className='object-cover rounded w-full h-full'
                                        />
                                    </div>
                                    <span className="flex-1 truncate">
                                        {mlang(category.name, locale)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-4 text-gray-500">
                            {t('noCategoriesFound')}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* <LanguageSwitcher onChange={handleLanguageChange} /> */}
        </div>
    )
}

export type { Brand, BrandsProps }
export default Brands