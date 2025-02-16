// // 'use client'

// // import { useEffect, useState } from 'react'
// // import { useTranslations, useLocale } from 'next-intl'
// // import { useAppContext } from '@/context/appContext'
// // import Table from '@/components/ui/Table'
// // import { LoadingIcon } from '@/components/icons'
// // import toast from 'react-hot-toast'
// // import ImageApi from '@/components/ImageApi'
// // import { Coupon } from '@/types/coupon'
// // import CouponCard from './CouponCard'
// // import { TableCellsIcon, Squares2X2Icon } from '@heroicons/react/24/outline'
// // import { useSearchParams, usePathname, useRouter } from 'next/navigation'

// // type ViewMode = 'table' | 'cards'

// // const Coupons = () => {
// //   const [coupons, setCoupons] = useState<Coupon[]>([])
// //   const [loading, setLoading] = useState(true)
// //   const [totalCount, setTotalCount] = useState(0)
// //   const [currentItems, setCurrentItems] = useState(0)
// //   const [viewMode, setViewMode] = useState<ViewMode>('table')
// //   const { token } = useAppContext()
// //   const t = useTranslations('Coupons')
// //   const locale = useLocale()
  
// //   const searchParams = useSearchParams()
// //   const pathname = usePathname()
// //   const router = useRouter()

// //   // Get current pagination state from URL or defaults
// //   const currentPage = Number(searchParams.get('page')) || 1
// //   const pageSize = Number(searchParams.get('limit')) || 10

// //   // Function to update URL and fetch data
// //   const updatePaginationAndFetch = async (page: number, limit: number) => {
// //     const params = new URLSearchParams(searchParams)
// //     params.set('page', page.toString())
// //     params.set('limit', limit.toString())
// //     router.push(`${pathname}?${params.toString()}`)
    
// //     await fetchCoupons(page, limit)
// //   }

// //   // Add function to fetch total count
// //   const fetchTotalCount = async () => {
// //     try {
// //       const response = await fetch(
// //         `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/coupons`,
// //         {
// //           headers: {
// //             'Authorization': `Bearer ${token}`
// //           }
// //         }
// //       )

// //       if (!response.ok) throw new Error('Failed to fetch total count')

// //       const data = await response.json()
// //       setTotalCount(data.coupons?.length || 0)
// //     } catch (error) {
// //       console.error('Error fetching total count:', error)
// //     }
// //   }

// //   // Update fetchCoupons to handle pagination
// //   const fetchCoupons = async (page: number, limit: number) => {
// //     try {
// //       setLoading(true)
// //       const skip = (page - 1) * limit
      
// //       // Construct URL with pagination parameters
// //       const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/coupons`)
// //       url.searchParams.set('limit', limit.toString())
// //       url.searchParams.set('skip', skip.toString())

// //       const response = await fetch(url, {
// //         headers: {
// //           'Authorization': `Bearer ${token}`
// //         }
// //       })

// //       if (!response.ok) throw new Error('Failed to fetch coupons')

// //       const data = await response.json()
      
// //       // Update states
// //       setCoupons(data.coupons)
// //       setCurrentItems(data.coupons.length)
      
// //       // Fetch total count if needed
// //       if (page === 1) {
// //         await fetchTotalCount()
// //       }
// //     } catch (error) {
// //       console.error('Error fetching coupons:', error)
// //       toast.error(t('fetchError'))
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   // Initialize data on component mount
// //   useEffect(() => {
// //     const initializeData = async () => {
// //       try {
// //         // Fetch total count first
// //         await fetchTotalCount()

// //         // Then fetch paginated data
// //         if (!searchParams.has('page') || !searchParams.has('limit')) {
// //           await updatePaginationAndFetch(1, 10)
// //         } else {
// //           await fetchCoupons(currentPage, pageSize)
// //         }
// //       } catch (error) {
// //         console.error('Error initializing data:', error)
// //       }
// //     }

// //     initializeData()
// //   }, [])

// //   // Handle page change
// //   const handlePageChange = (newPage: number) => {
// //     updatePaginationAndFetch(newPage, pageSize)
// //   }

// //   // Handle page size change
// //   const handlePageSizeChange = (newSize: number) => {
// //     updatePaginationAndFetch(1, newSize) // Reset to first page when changing page size
// //   }

// //   // Table headers configuration
// //   const tableHeaders = [
// //     { name: 'brands', className: 'w-[150px]', key: 'brand.name', sortable: true },
// //     { name: 'code', className: 'w-[100px]', key: 'code', sortable: true },
// //     { name: 'ratio', className: 'w-[100px]', key: 'ratio', sortable: true },
// //     { name: 'validFrom', className: 'w-[150px]', key: 'validFrom', sortable: true },
// //     { name: 'validTo', className: 'w-[150px]', key: 'validTo', sortable: true },
// //     { name: 'Description', className: 'w-[200px]', key: 'description', sortable: true }
// //   ]

// //   // Table row render function
// //   const renderTableRows = () => {
// //     if (!coupons?.length) return []

// //     return coupons.map((coupon: Coupon) => (
// //       <tr key={coupon.id} className="border-b odd:bg-white even:bg-primary/5">
// //         <td className="px-6 py-4">
// //           <div className="flex items-center gap-2">
// //             <div className="size-10">
// //               <ImageApi
// //                 src={coupon.brand.logo || '/imgs/notfound.png'}
// //                 alt={coupon.brand.name}
// //                 loader={() => coupon.brand.logo}
// //                 loading='lazy'
// //                 height={40}
// //                 width={40}
// //                 className='object-cover rounded-full w-full h-full'
// //               />
// //             </div>
// //             <span>{coupon.brand.name}</span>
// //           </div>
// //         </td>
// //         <td className="px-6 py-4 font-medium">{coupon.code}</td>
// //         <td className="px-6 py-4">{coupon.ratio}%</td>
// //         <td className="px-6 py-4">
// //           {new Date(coupon.validFrom).toLocaleDateString(locale)}
// //         </td>
// //         <td className="px-6 py-4">
// //           {new Date(coupon.validTo).toLocaleDateString(locale)}
// //         </td>
// //         <td className="px-6 py-4">{coupon.description}</td>
// //       </tr>
// //     ))
// //   }

// //   const ViewToggle = () => (
// //     <div className="flex items-center gap-2 bg-white rounded-lg shadow p-1">
// //       <button
// //         onClick={() => setViewMode('table')}
// //         className={`p-2 rounded ${
// //           viewMode === 'table' 
// //             ? 'bg-primary text-white' 
// //             : 'hover:bg-gray-100'
// //         }`}
// //         aria-label={t('tableView')}
// //       >
// //         <TableCellsIcon className="size-5" />
// //       </button>
// //       <button
// //         onClick={() => setViewMode('cards')}
// //         className={`p-2 rounded ${
// //           viewMode === 'cards' 
// //             ? 'bg-primary text-white' 
// //             : 'hover:bg-gray-100'
// //         }`}
// //         aria-label={t('cardView')}
// //       >
// //         <Squares2X2Icon className="size-5" />
// //       </button>
// //     </div>
// //   )

// //   const CardView = () => (
// //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
// //       {loading ? (
// //         <div className="col-span-full flex justify-center py-10">
// //           <LoadingIcon className="animate-spin size-6" />
// //         </div>
// //       ) : !coupons?.length ? (
// //         <div className="col-span-full text-center py-10 text-gray-500">
// //           {t('noCoupons')}
// //         </div>
// //       ) : (
// //         coupons.map(coupon => (
// //           <CouponCard key={coupon.id} coupon={coupon} />
// //         ))
// //       )}
// //     </div>
// //   )

// //   return (
// //     <div className='p-container space-y-6'>
// //       <div className='flex justify-between items-center'>
// //         <h4 className='font-bold text-lg md:text-xl lg:text-2xl'>
// //           {t('title')}
// //         </h4>
// //         <ViewToggle />
// //       </div>

// //       {viewMode === 'table' ? (
// //         <Table
// //           data={coupons}
// //           headers={tableHeaders}
// //           count={totalCount}
// //           loading={loading}
// //           showDateFilter={false}
// //           currentPage={currentPage}
// //           pageSize={pageSize}
// //           onPageChange={handlePageChange}
// //           onPageSizeChange={handlePageSizeChange}
// //           showExport={true}
// //           bgColor="#02161e"
// //           currentItems={currentItems}
// //         >
// //           {renderTableRows()}
// //         </Table>
// //       ) : (
// //         <CardView />
// //       )}
// //     </div>
// //   )
// // }

// // export default Coupons 

// 'use client'

// import { useEffect, useState } from 'react'
// import { useTranslations, useLocale } from 'next-intl'
// import { useAppContext } from '@/context/appContext'
// import Table from '@/components/ui/Table'
// import { LoadingIcon } from '@/components/icons'
// import toast from 'react-hot-toast'
// import ImageApi from '@/components/ImageApi'
// import { Coupon } from '@/types/coupon'
// import CouponCard from './CouponCard'
// import { TableCellsIcon, Squares2X2Icon, PlusIcon } from '@heroicons/react/24/outline'
// import { useSearchParams, usePathname, useRouter } from 'next/navigation'
// import { Dialog, DialogContent } from '@/components/ui/dialog'
// import CustomSelect from '@/components/users/CustomSelect'
// import { useForm } from 'react-hook-form'

// type ViewMode = 'table' | 'cards'

// const Coupons = () => {
//   const [coupons, setCoupons] = useState<Coupon[]>([])
//   const [loading, setLoading] = useState(true)
//   const [totalCount, setTotalCount] = useState(0)
//   const [currentItems, setCurrentItems] = useState(0)
//   const [viewMode, setViewMode] = useState<ViewMode>('table')
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false)
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false)
//   const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null)
//   const [brands, setBrands] = useState<any[]>([])
//   const [selectedBrandFilter, setSelectedBrandFilter] = useState<string>('')
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const { token } = useAppContext()
//   const t = useTranslations('Coupons')
//   const locale = useLocale()
  
//   const { register, handleSubmit, formState: { errors }, reset } = useForm()

//   const searchParams = useSearchParams()
//   const pathname = usePathname()
//   const router = useRouter()

//   // Get current pagination state from URL or defaults
//   const currentPage = Number(searchParams.get('page')) || 1
//   const pageSize = Number(searchParams.get('limit')) || 10

//   // Function to update URL and fetch data
//   const updatePaginationAndFetch = async (page: number, limit: number) => {
//     const params = new URLSearchParams(searchParams)
//     params.set('page', page.toString())
//     params.set('limit', limit.toString())
//     router.push(`${pathname}?${params.toString()}`)
    
//     await fetchCoupons(page, limit)
//   }

//   // Add function to fetch total count
//   const fetchTotalCount = async () => {
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/coupons`,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         }
//       )

//       if (!response.ok) throw new Error('Failed to fetch total count')

//       const data = await response.json()
//       setTotalCount(data.coupons?.length || 0)
//     } catch (error) {
//       console.error('Error fetching total count:', error)
//     }
//   }

//   // Update fetchCoupons to handle pagination
//   const fetchCoupons = async (page: number, limit: number) => {
//     try {
//       setLoading(true)
//       const skip = (page - 1) * limit
      
//       // Construct URL with pagination parameters
//       const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/coupons`)
//       url.searchParams.set('limit', limit.toString())
//       url.searchParams.set('skip', skip.toString())

//       const response = await fetch(url, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       })

//       if (!response.ok) throw new Error('Failed to fetch coupons')

//       const data = await response.json()
      
//       // Update states
//       setCoupons(data.coupons)
//       setCurrentItems(data.coupons.length)
      
//       // Fetch total count if needed
//       if (page === 1) {
//         await fetchTotalCount()
//       }
//     } catch (error) {
//       console.error('Error fetching coupons:', error)
//       toast.error(t('fetchError'))
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Add function to fetch brands
//   const fetchBrands = async () => {
//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brand`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       })
//       if (!response.ok) throw new Error('Failed to fetch brands')
//       const data = await response.json()
//       setBrands(data.brands || [])
//     } catch (error) {
//       console.error('Error fetching brands:', error)
//       toast.error(t('error.fetchBrands'))
//     }
//   }

//   const onSubmit = async (formData: any) => {
//     if (!formData.brandId) {
//       toast.error(t('selectBrandError'))
//       return
//     }

//     try {
//       setIsSubmitting(true)
//       const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/coupons/${formData.brandId}`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           code: formData.code,
//           ratio: formData.ratio,
//           description: formData.description,
//           validFrom: formData.validFrom,
//           validTo: formData.validTo
//         })
//       })

//       if (!response.ok) throw new Error('Failed to create coupon')

//       const data = await response.json()
//       toast.success(t('addSuccess'))
//       setIsAddModalOpen(false)
//       fetchCoupons(currentPage, pageSize)
//     } catch (error) {
//       console.error('Error creating coupon:', error)
//       toast.error(t('error.addFailed'))
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const handleEdit = async (formData: any) => {
//     if (!selectedCoupon) return

//     try {
//       setIsSubmitting(true)
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/coupons/${selectedCoupon.brandId}/${selectedCoupon.id}`,
//         {
//           method: 'PUT',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({
//             ratio: formData.ratio,
//             description: formData.description,
//             validFrom: formData.validFrom,
//             validTo: formData.validTo
//           })
//         }
//       )

//       if (!response.ok) throw new Error('Failed to update coupon')

//       const data = await response.json()
//       toast.success(t('editSuccess'))
//       setIsEditModalOpen(false)
//       fetchCoupons(currentPage, pageSize)
//     } catch (error) {
//       console.error('Error updating coupon:', error)
//       toast.error(t('error.editFailed'))
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const openEditModal = (coupon: Coupon) => {
//     setSelectedCoupon(coupon)
//     reset({
//       ratio: coupon.ratio,
//       description: coupon.description,
//       validFrom: new Date(coupon.validFrom).toISOString().split('T')[0],
//       validTo: new Date(coupon.validTo).toISOString().split('T')[0]
//     })
//     setIsEditModalOpen(true)
//   }

//   // Initialize data on component mount
//   useEffect(() => {
//     const initializeData = async () => {
//       try {
//         // Fetch total count first
//         await fetchTotalCount()

//         // Then fetch paginated data
//         if (!searchParams.has('page') || !searchParams.has('limit')) {
//           await updatePaginationAndFetch(1, 10)
//         } else {
//           await fetchCoupons(currentPage, pageSize)
//         }
//       } catch (error) {
//         console.error('Error initializing data:', error)
//       }
//     }

//     initializeData()
//   }, [])

//   // Fetch brands when component mounts
//   useEffect(() => {
//     fetchBrands()
//   }, [])

//   // Handle page change
//   const handlePageChange = (newPage: number) => {
//     updatePaginationAndFetch(newPage, pageSize)
//   }

//   // Handle page size change
//   const handlePageSizeChange = (newSize: number) => {
//     updatePaginationAndFetch(1, newSize) // Reset to first page when changing page size
//   }

//   // Table headers configuration
//   const tableHeaders = [
//     { name: 'brands', className: 'w-[150px]', key: 'brand.name', sortable: true },
//     { name: 'code', className: 'w-[100px]', key: 'code', sortable: true },
//     { name: 'ratio', className: 'w-[100px]', key: 'ratio', sortable: true },
//     { name: 'validFrom', className: 'w-[150px]', key: 'validFrom', sortable: true },
//     { name: 'validTo', className: 'w-[150px]', key: 'validTo', sortable: true },
//     { name: 'Description', className: 'w-[200px]', key: 'description', sortable: true }
//   ]

//   // Table row render function
//   const renderTableRows = () => {
//     if (!coupons?.length) return []

//     return coupons.map((coupon: Coupon) => (
//       <tr key={coupon.id} className="border-b odd:bg-white even:bg-primary/5">
//         <td className="px-6 py-4">
//           <div className="flex items-center gap-2">
//             <div className="size-10">
//               <ImageApi
//                 src={coupon.brand.logo || '/imgs/notfound.png'}
//                 alt={coupon.brand.name}
//                 loader={() => coupon.brand.logo}
//                 loading='lazy'
//                 height={40}
//                 width={40}
//                 className='object-cover rounded-full w-full h-full'
//               />
//             </div>
//             <span>{coupon.brand.name}</span>
//           </div>
//         </td>
//         <td className="px-6 py-4 font-medium">{coupon.code}</td>
//         <td className="px-6 py-4">{coupon.ratio}%</td>
//         <td className="px-6 py-4">
//           {new Date(coupon.validFrom).toLocaleDateString(locale)}
//         </td>
//         <td className="px-6 py-4">
//           {new Date(coupon.validTo).toLocaleDateString(locale)}
//         </td>
//         <td className="px-6 py-4">{coupon.description}</td>
//       </tr>
//     ))
//   }

//   const ViewToggle = () => (
//     <div className="flex items-center gap-2 bg-white rounded-lg shadow p-1">
//       <button
//         onClick={() => setViewMode('table')}
//         className={`p-2 rounded ${
//           viewMode === 'table' 
//             ? 'bg-primary text-white' 
//             : 'hover:bg-gray-100'
//         }`}
//         aria-label={t('tableView')}
//       >
//         <TableCellsIcon className="size-5" />
//       </button>
//       <button
//         onClick={() => setViewMode('cards')}
//         className={`p-2 rounded ${
//           viewMode === 'cards' 
//             ? 'bg-primary text-white' 
//             : 'hover:bg-gray-100'
//         }`}
//         aria-label={t('cardView')}
//       >
//         <Squares2X2Icon className="size-5" />
//       </button>
//     </div>
//   )

//   const filteredCoupons = selectedBrandFilter
//     ? coupons.filter(coupon => coupon.brandId.toString() === selectedBrandFilter)
//     : coupons

//   const CardView = () => (
//     <>
//       <div className="mb-4">
//         <CustomSelect
//           fieldForm="brandFilter"
//           label={t('filterByBrand')}
//           options={[
//             { value: '', label: t('allBrands') },
//             ...brands.map(brand => ({
//               value: brand.id.toString(),
//               label: brand.name
//             }))
//           ]}
//           register={register}
//           errors={errors}
//           roles={{
//             onChange: (e: any) => setSelectedBrandFilter(e.target.value)
//           }}
//         />
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//         {loading ? (
//           <div className="col-span-full flex justify-center py-10">
//             <LoadingIcon className="animate-spin size-6" />
//           </div>
//         ) : !filteredCoupons?.length ? (
//           <div className="col-span-full text-center py-10 text-gray-500">
//             {t('noCoupons')}
//           </div>
//         ) : (
//           filteredCoupons.map(coupon => (
//             <CouponCard 
//               key={coupon.id} 
//               coupon={coupon}
//               onEdit={() => openEditModal(coupon)}
//               onRefresh={() => fetchCoupons(currentPage, pageSize)}
//             />
//           ))
//         )}
//       </div>

//       {/* Edit Coupon Modal */}
//       <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
//         <DialogContent className="sm:max-w-[425px]">
//           <form onSubmit={handleSubmit(handleEdit)} className="space-y-4">
//             <h3 className="text-lg font-semibold">{t('editCoupon')}</h3>

//             <div className="space-y-2">
//               <label className="text-sm font-medium">{t('ratio')}</label>
//               <input
//                 {...register('ratio', { 
//                   required: t('error.ratio'),
//                   min: { value: 0, message: t('error.ratio') }
//                 })}
//                 type="number"
//                 step="0.1"
//                 className="w-full px-3 py-2 border rounded-md"
//                 placeholder={t('ratioPlaceholder')}
//               />
//             </div>

//             <div className="space-y-2">
//               <label className="text-sm font-medium">{t('description')}</label>
//               <textarea
//                 {...register('description', { required: t('error.description') })}
//                 className="w-full px-3 py-2 border rounded-md"
//                 placeholder={t('descriptionPlaceholder')}
//               />
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <label className="text-sm font-medium">{t('validFrom')}</label>
//                 <input
//                   {...register('validFrom', { required: t('error.validFrom') })}
//                   type="date"
//                   className="w-full px-3 py-2 border rounded-md"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <label className="text-sm font-medium">{t('validTo')}</label>
//                 <input
//                   {...register('validTo', { required: t('error.validTo') })}
//                   type="date"
//                   className="w-full px-3 py-2 border rounded-md"
//                 />
//               </div>
//             </div>

//             <div className="flex justify-end gap-4 pt-4">
//               <button
//                 type="button"
//                 onClick={() => setIsEditModalOpen(false)}
//                 className="px-4 py-2 border rounded-md hover:bg-gray-100"
//               >
//                 {t('cancel')}
//               </button>
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
//               >
//                 {isSubmitting ? t('updating') : t('update')}
//               </button>
//             </div>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </>
//   )

//   return (
//     <div className='p-container space-y-6'>
//       <div className='flex justify-between items-center'>
//         <h4 className='font-bold text-lg md:text-xl lg:text-2xl'>
//           {t('title')}
//         </h4>
//         <div className="flex items-center gap-4">
//           <ViewToggle />
//           <button
//             onClick={() => setIsAddModalOpen(true)}
//             className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
//           >
//             <PlusIcon className="size-5" />
//             {t('addCoupon')}
//           </button>
//         </div>
//       </div>

//       {/* Add Coupon Modal */}
//       <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
//         <DialogContent className="sm:max-w-[425px]">
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//             <h3 className="text-lg font-semibold">{t('addCoupon')}</h3>
            
//             <CustomSelect
//               fieldForm="brandId"
//               label={t('selectBrand')}
//               options={brands.map(brand => ({
//                 value: brand.id.toString(),
//                 label: brand.name
//               }))}
//               register={register}
//               errors={errors}
//               roles={{ required: t('selectBrandError') }}
//             />

//             <div className="space-y-2">
//               <label className="text-sm font-medium">{t('code')}</label>
//               <input
//                 {...register('code', { 
//                   required: t('error.code'),
//                   minLength: { value: 4, message: t('error.code') },
//                   maxLength: { value: 4, message: t('error.code') }
//                 })}
//                 type="text"
//                 className="w-full px-3 py-2 border rounded-md"
//                 placeholder={t('codePlaceholder')}
//               />
//             </div>

//             <div className="space-y-2">
//               <label className="text-sm font-medium">{t('ratio')}</label>
//               <input
//                 {...register('ratio', { 
//                   required: t('error.ratio'),
//                   min: { value: 0, message: t('error.ratio') }
//                 })}
//                 type="number"
//                 step="0.1"
//                 className="w-full px-3 py-2 border rounded-md"
//                 placeholder={t('ratioPlaceholder')}
//               />
//             </div>

//             <div className="space-y-2">
//               <label className="text-sm font-medium">{t('description')}</label>
//               <textarea
//                 {...register('description', { required: t('error.description') })}
//                 className="w-full px-3 py-2 border rounded-md"
//                 placeholder={t('descriptionPlaceholder')}
//               />
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <label className="text-sm font-medium">{t('validFrom')}</label>
//                 <input
//                   {...register('validFrom', { required: t('error.validFrom') })}
//                   type="date"
//                   className="w-full px-3 py-2 border rounded-md"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <label className="text-sm font-medium">{t('validTo')}</label>
//                 <input
//                   {...register('validTo', { required: t('error.validTo') })}
//                   type="date"
//                   className="w-full px-3 py-2 border rounded-md"
//                 />
//               </div>
//             </div>

//             <div className="flex justify-end gap-4 pt-4">
//               <button
//                 type="button"
//                 onClick={() => setIsAddModalOpen(false)}
//                 className="px-4 py-2 border rounded-md hover:bg-gray-100"
//               >
//                 {t('cancel')}
//               </button>
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
//               >
//                 {isSubmitting ? t('adding') : t('add')}
//               </button>
//             </div>
//           </form>
//         </DialogContent>
//       </Dialog>

//       {viewMode === 'table' ? (
//         <Table
//           data={coupons}
//           headers={tableHeaders}
//           count={totalCount}
//           loading={loading}
//           showDateFilter={false}
//           currentPage={currentPage}
//           pageSize={pageSize}
//           onPageChange={handlePageChange}
//           onPageSizeChange={handlePageSizeChange}
//           showExport={true}
//           bgColor="#02161e"
//           currentItems={currentItems}
//         >
//           {renderTableRows()}
//         </Table>
//       ) : (
//         <CardView />
//       )}
//     </div>
//   )
// }

// export default Coupons 

'use client'

import { useEffect, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useAppContext } from '@/context/appContext'
import Table from '@/components/ui/Table'
import { LoadingIcon } from '@/components/icons'
import toast from 'react-hot-toast'
import ImageApi from '@/components/ImageApi'
import { Coupon } from '@/types/coupon'
import CouponCard from './CouponCard'
import { TableCellsIcon, Squares2X2Icon, PlusIcon } from '@heroicons/react/24/outline'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import CustomSelect from '@/components/users/CustomSelect'
import { useForm } from 'react-hook-form'

type ViewMode = 'table' | 'cards'

const Coupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [currentItems, setCurrentItems] = useState(0)
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null)
  const [brands, setBrands] = useState<any[]>([])
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { token } = useAppContext()
  const t = useTranslations('Coupons')
  const locale = useLocale()
  
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm()

  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  // Get current pagination state from URL or defaults
  const currentPage = Number(searchParams.get('page')) || 1
  const pageSize = Number(searchParams.get('limit')) || 10

  // Function to update URL and fetch data
  const updatePaginationAndFetch = async (page: number, limit: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', page.toString())
    params.set('limit', limit.toString())
    router.push(`${pathname}?${params.toString()}`)
    
    await fetchCoupons(page, limit)
  }

  // Add function to fetch total count
  const fetchTotalCount = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/coupons`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )

      if (!response.ok) throw new Error('Failed to fetch total count')

      const data = await response.json()
      setTotalCount(data.coupons?.length || 0)
    } catch (error) {
      console.error('Error fetching total count:', error)
    }
  }

  // Update fetchCoupons to handle pagination
  const fetchCoupons = async (page: number, limit: number) => {
    try {
      setLoading(true)
      const skip = (page - 1) * limit
      
      // Construct URL with pagination parameters
      const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/coupons`)
      url.searchParams.set('limit', limit.toString())
      url.searchParams.set('skip', skip.toString())

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) throw new Error('Failed to fetch coupons')

      const data = await response.json()
      
      // Update states
      setCoupons(data.coupons)
      setCurrentItems(data.coupons.length)
      
      // Fetch total count if needed
      if (page === 1) {
        await fetchTotalCount()
      }
    } catch (error) {
      console.error('Error fetching coupons:', error)
      toast.error(t('fetchError'))
    } finally {
      setLoading(false)
    }
  }

  // Add function to fetch brands
  const fetchBrands = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brand`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) throw new Error('Failed to fetch brands')
      const data = await response.json()
      setBrands(data.brands || [])
    } catch (error) {
      console.error('Error fetching brands:', error)
      toast.error(t('error.fetchBrands'))
    }
  }

  const onSubmit = async (formData: any) => {
    if (!formData.brandId) {
      toast.error(t('selectBrandError'))
      return
    }

    try {
      setIsSubmitting(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/coupons/${formData.brandId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: formData.code,
          ratio: formData.ratio,
          description: formData.description,
          validFrom: formData.validFrom,
          validTo: formData.validTo
        })
      })

      if (!response.ok) throw new Error('Failed to create coupon')

      const data = await response.json()
      toast.success(t('addSuccess'))
      setIsAddModalOpen(false)
      fetchCoupons(currentPage, pageSize)
    } catch (error) {
      console.error('Error creating coupon:', error)
      toast.error(t('error.addFailed'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = async (formData: any) => {
    if (!selectedCoupon) return

    try {
      setIsSubmitting(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/coupons/${selectedCoupon.brandId}/${selectedCoupon.id}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ratio: formData.ratio,
            description: formData.description,
            validFrom: formData.validFrom,
            validTo: formData.validTo
          })
        }
      )

      if (!response.ok) throw new Error('Failed to update coupon')

      const data = await response.json()
      toast.success(t('editSuccess'))
      setIsEditModalOpen(false)
      fetchCoupons(currentPage, pageSize)
    } catch (error) {
      console.error('Error updating coupon:', error)
      toast.error(t('error.editFailed'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const openEditModal = (coupon: Coupon) => {
    setSelectedCoupon(coupon)
    reset({
      ratio: coupon.ratio,
      description: coupon.description,
      validFrom: new Date(coupon.validFrom).toISOString().split('T')[0],
      validTo: new Date(coupon.validTo).toISOString().split('T')[0]
    })
    setIsEditModalOpen(true)
  }

  const generateCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < 4; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    setValue('code', code)
  }

  // Initialize data on component mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Fetch total count first
        await fetchTotalCount()

        // Then fetch paginated data
        if (!searchParams.has('page') || !searchParams.has('limit')) {
          await updatePaginationAndFetch(1, 10)
        } else {
          await fetchCoupons(currentPage, pageSize)
        }
      } catch (error) {
        console.error('Error initializing data:', error)
      }
    }

    initializeData()
  }, [])

  // Fetch brands when component mounts
  useEffect(() => {
    fetchBrands()
  }, [])

  // Handle page change
  const handlePageChange = (newPage: number) => {
    updatePaginationAndFetch(newPage, pageSize)
  }

  // Handle page size change
  const handlePageSizeChange = (newSize: number) => {
    updatePaginationAndFetch(1, newSize) // Reset to first page when changing page size
  }

  // Table headers configuration
  const tableHeaders = [
    { name: 'brands', className: 'w-[150px]', key: 'brand.name', sortable: true },
    { name: 'code', className: 'w-[100px]', key: 'code', sortable: true },
    { name: 'ratio', className: 'w-[100px]', key: 'ratio', sortable: true },
    { name: 'validFrom', className: 'w-[150px]', key: 'validFrom', sortable: true },
    { name: 'validTo', className: 'w-[150px]', key: 'validTo', sortable: true },
    { name: 'Description', className: 'w-[200px]', key: 'description', sortable: true }
  ]

  // Table row render function
  const renderTableRows = () => {
    if (!coupons?.length) return []

    return coupons.map((coupon: Coupon) => (
      <tr key={coupon.id} className="border-b odd:bg-white even:bg-primary/5">
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="size-10">
              <ImageApi
                src={coupon.brand.logo || '/imgs/notfound.png'}
                alt={coupon.brand.name}
                loader={() => coupon.brand.logo}
                loading='lazy'
                height={40}
                width={40}
                className='object-cover rounded-full w-full h-full'
              />
            </div>
            <span>{coupon.brand.name}</span>
          </div>
        </td>
        <td className="px-6 py-4 font-medium">{coupon.code}</td>
        <td className="px-6 py-4">{coupon.ratio}%</td>
        <td className="px-6 py-4">
          {new Date(coupon.validFrom).toLocaleDateString(locale)}
        </td>
        <td className="px-6 py-4">
          {new Date(coupon.validTo).toLocaleDateString(locale)}
        </td>
        <td className="px-6 py-4">{coupon.description}</td>
      </tr>
    ))
  }

  const ViewToggle = () => (
    <div className="flex items-center gap-2 bg-white rounded-lg shadow p-1">
      <button
        onClick={() => setViewMode('table')}
        className={`p-2 rounded ${
          viewMode === 'table' 
            ? 'bg-primary text-white' 
            : 'hover:bg-gray-100'
        }`}
        aria-label={t('tableView')}
      >
        <TableCellsIcon className="size-5" />
      </button>
      <button
        onClick={() => setViewMode('cards')}
        className={`p-2 rounded ${
          viewMode === 'cards' 
            ? 'bg-primary text-white' 
            : 'hover:bg-gray-100'
        }`}
        aria-label={t('cardView')}
      >
        <Squares2X2Icon className="size-5" />
      </button>
    </div>
  )

  const filteredCoupons = selectedBrandFilter
    ? coupons.filter(coupon => coupon.brandId.toString() === selectedBrandFilter)
    : coupons

  const CardView = () => (
    <>
      <div className="mb-4">
        <CustomSelect
          fieldForm="brandFilter"
          label={t('filterByBrand')}
          options={[
            { value: '', label: t('allBrands') },
            ...brands.map(brand => ({
              value: brand.id.toString(),
              label: brand.name
            }))
          ]}
          register={register}
          errors={errors}
          roles={{
            onChange: (e: any) => setSelectedBrandFilter(e.target.value)
          }}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading ? (
          <div className="col-span-full flex justify-center py-10">
            <LoadingIcon className="animate-spin size-6" />
          </div>
        ) : !filteredCoupons?.length ? (
          <div className="col-span-full text-center py-10 text-gray-500">
            {t('noCoupons')}
          </div>
        ) : (
          filteredCoupons.map(coupon => (
            <CouponCard 
              key={coupon.id} 
              coupon={coupon}
              onEdit={() => openEditModal(coupon)}
              onRefresh={() => fetchCoupons(currentPage, pageSize)}
            />
          ))
        )}
      </div>

      {/* Edit Coupon Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit(handleEdit)} className="space-y-4">
            <h3 className="text-lg font-semibold">{t('editCoupon')}</h3>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('ratio')}</label>
              <input
                {...register('ratio', { 
                  required: t('error.ratio'),
                  min: { value: 0, message: t('error.ratio') }
                })}
                type="number"
                step="0.1"
                className="w-full px-3 py-2 border rounded-md"
                placeholder={t('ratioPlaceholder')}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('description')}</label>
              <textarea
                {...register('description', { required: t('error.description') })}
                className="w-full px-3 py-2 border rounded-md"
                placeholder={t('descriptionPlaceholder')}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('validFrom')}</label>
                <input
                  {...register('validFrom', { required: t('error.validFrom') })}
                  type="date"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('validTo')}</label>
                <input
                  {...register('validTo', { required: t('error.validTo') })}
                  type="date"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
              >
                {isSubmitting ? t('updating') : t('update')}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )

  return (
    <div className='p-container space-y-6'>
      <div className='flex justify-between items-center'>
        <h4 className='font-bold text-lg md:text-xl lg:text-2xl'>
          {t('title')}
        </h4>
        <div className="flex items-center gap-4">
          <ViewToggle />
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <PlusIcon className="size-5" />
            {t('addCoupon')}
          </button>
        </div>
      </div>

      {/* Add Coupon Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <h3 className="text-lg font-semibold">{t('addCoupon')}</h3>
            
            <CustomSelect
              fieldForm="brandId"
              label={t('selectBrand')}
              options={brands.map(brand => ({
                value: brand.id.toString(),
                label: brand.name
              }))}
              register={register}
              errors={errors}
              roles={{ required: t('selectBrandError') }}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('code')}</label>
              <div className="flex gap-2">
                <input
                  {...register('code', { 
                    required: t('error.code'),
                    minLength: { value: 4, message: t('error.code') },
                    maxLength: { value: 4, message: t('error.code') }
                  })}
                  type="text"
                  className="flex-1 px-3 py-2 border rounded-md"
                  placeholder={t('codePlaceholder')}
                />
                <button
                  type="button"
                  onClick={generateCode}
                  className="px-3 py-2 text-primary hover:text-primary/90 transition-colors"
                >
                  {t('autoGenerate')}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('ratio')}</label>
              <input
                {...register('ratio', { 
                  required: t('error.ratio'),
                  min: { value: 0, message: t('error.ratio') }
                })}
                type="number"
                step="0.1"
                className="w-full px-3 py-2 border rounded-md"
                placeholder={t('ratioPlaceholder')}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('description')}</label>
              <textarea
                {...register('description', { required: t('error.description') })}
                className="w-full px-3 py-2 border rounded-md"
                placeholder={t('descriptionPlaceholder')}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('validFrom')}</label>
                <input
                  {...register('validFrom', { required: t('error.validFrom') })}
                  type="date"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('validTo')}</label>
                <input
                  {...register('validTo', { required: t('error.validTo') })}
                  type="date"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
              >
                {isSubmitting ? t('adding') : t('add')}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {viewMode === 'table' ? (
        <Table
          data={coupons}
          headers={tableHeaders}
          count={totalCount}
          loading={loading}
          showDateFilter={false}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          showExport={true}
          bgColor="#02161e"
          currentItems={currentItems}
        >
          {renderTableRows()}
        </Table>
      ) : (
        <CardView />
      )}
    </div>
  )
}

export default Coupons 