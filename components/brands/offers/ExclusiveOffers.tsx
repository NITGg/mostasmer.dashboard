// 'use client'
// import React, { useEffect, useState } from 'react'
// import { useTranslations } from 'next-intl'
// import { useAppContext } from '@/context/appContext'
// import { PencilSquareIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline'
// import { Dialog, DialogContent } from '@/components/ui/dialog'
// import { useForm } from 'react-hook-form'
// import toast from 'react-hot-toast'
// import Table from '@/components/ui/Table'

// interface ExclusiveOffer {
//     id: number
//     brandId: number
//     validFrom: string
//     validTo: string
//     ratio: number
//     createdAt: string
//     updatedAt: string
// }

// interface OfferFormData {
//     ratio: number
//     validFrom: string
//     validTo: string
// }

// const ExclusiveOffers = ({ brandId }: { brandId: string }) => {
//     const [offers, setOffers] = useState<ExclusiveOffer[]>([])
//     const [loading, setLoading] = useState(false)
//     const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
//     const [editingOffer, setEditingOffer] = useState<ExclusiveOffer | null>(null)
//     const { token } = useAppContext()
//     const t = useTranslations('brand')

//     const { register, handleSubmit, reset, formState: { errors } } = useForm<OfferFormData>()

//     const [currentPage, setCurrentPage] = useState(1);
// const [pageSize, setPageSize] = useState(10);
// const [currentItems, setCurrentItems] = useState<any[]>([]);

// // Add these handlers
// const handlePageChange = (page: number) => {
//     setCurrentPage(page);
// };

// const handlePageSizeChange = (newPageSize: number) => {
//     setPageSize(newPageSize);
//     setCurrentPage(1);
// };

//     const headers = [
//         { name: 'exclusive_offer_table_id' },
//         { name: 'exclusive_offer_table_title' },
//         { name: 'exclusive_offer_table_point_back' },
//         { name: 'exclusive_offer_table_valid_from' },
//         { name: 'exclusive_offer_table_valid_to' },
//         { name: 'exclusive_offer_table_actions' }
//     ]

//     useEffect(() => {
//         fetchExclusiveOffers()
//     }, [brandId])

//     const fetchExclusiveOffers = async () => {
//         try {
//             setLoading(true)
//             const headers = new Headers()
//             headers.append('Authorization', `Bearer ${token}`)
//             headers.append('Content-Type', 'application/json')

//             const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/exclusive-offer/${brandId}`, {
//                 method: 'GET',
//                 headers,
//             })

//             if (!response.ok) throw new Error('Failed to fetch offers')

//             const data = await response.json()
//             setOffers(data.exclusiveOffers)
//         } catch (error) {
//             console.error('Error:', error)
//             toast.error('Failed to load offers')
//         } finally {
//             setLoading(false)
//         }
//     }

//     const formatDate = (dateString: string) => {
//         return new Date(dateString).toLocaleDateString()
//     }

//     const onSubmit = async (data: OfferFormData) => {
//         try {
//             setLoading(true)
//             const headers = new Headers()
//             headers.append('Authorization', `Bearer ${token}`)
//             headers.append('Content-Type', 'application/json')

//             // Format dates to match the required format YYYY/MM/DD
//             const formatDate = (dateStr: string) => {
//                 const date = new Date(dateStr)
//                 return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
//             }

//             const body = JSON.stringify({
//                 ratio: Number(data.ratio),
//                 validFrom: formatDate(data.validFrom),
//                 validTo: formatDate(data.validTo)
//             })

//             const url = editingOffer 
//                 ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/exclusive-offer/${brandId}/${editingOffer.id}`
//                 : `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/exclusive-offer/${brandId}`

//             const response = await fetch(url, {
//                 method: editingOffer ? 'PUT' : 'POST',
//                 headers,
//                 body
//             })

//             const responseData = await response.json()

//             if (!response.ok) {
//                 throw new Error(responseData.message || 'Failed to save offer')
//             }

//             toast.success(editingOffer ? 'Offer updated successfully' : 'Offer added successfully')
//             fetchExclusiveOffers()
//             handleCloseDialog()
//         } catch (error: any) {
//             console.error('Error details:', error)
//             toast.error(error.message || 'Failed to save offer')
//         } finally {
//             setLoading(false)
//         }
//     }

//     const handleCloseDialog = () => {
//         setIsAddDialogOpen(false)
//         setEditingOffer(null)
//         reset()
//     }

//     const handleEdit = (offer: ExclusiveOffer) => {
//         setEditingOffer(offer)
//         setIsAddDialogOpen(true)
        
//         // Format dates for the form
//         const formatDateForInput = (dateStr: string) => {
//             const date = new Date(dateStr)
//             return date.toISOString().split('T')[0]
//         }

//         reset({
//             ratio: offer.ratio,
//             validFrom: formatDateForInput(offer.validFrom),
//             validTo: formatDateForInput(offer.validTo)
//         })
//     }

//     const handleDelete = async (offerId: number) => {
//         if (!window.confirm('Are you sure you want to delete this offer?')) return

//         try {
//             setLoading(true)
//             const headers = new Headers()
//             headers.append('Authorization', `Bearer ${token}`)

//             const response = await fetch(
//                 `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/exclusive-offer/${brandId}/${offerId}`,
//                 {
//                     method: 'DELETE',
//                     headers,
//                 }
//             )

//             if (!response.ok) {
//                 const error = await response.json()
//                 throw new Error(error.message || 'Failed to delete offer')
//             }

//             toast.success('Offer deleted successfully')
//             fetchExclusiveOffers()
//         } catch (error: any) {
//             console.error('Delete error:', error)
//             toast.error(error.message || 'Failed to delete offer')
//         } finally {
//             setLoading(false)
//         }
//     }

//     const renderTableRows = () => {
//         return offers.map((offer) => (
//             <tr key={offer.id} className="odd:bg-white even:bg-primary/5 border-b">
//                 <td className="px-6 py-4">
//                     {offer.id.toString().padStart(3, '0')}
//                 </td>
//                 <td className="px-6 py-4 font-medium">
//                     Exclusive offer
//                 </td>
//                 <td className="px-6 py-4">
//                     {offer.ratio}%
//                 </td>
//                 <td className="px-6 py-4">
//                     {formatDate(offer.validFrom)}
//                 </td>
//                 <td className="px-6 py-4">
//                     {formatDate(offer.validTo)}
//                 </td>
//                 <td className="px-6 py-4">
//                     <div className="flex gap-2">
//                         <button 
//                             onClick={() => handleEdit(offer)}
//                             className="p-1 hover:bg-slate-100 rounded"
//                             disabled={loading}
//                         >
//                             <PencilSquareIcon className="w-4 h-4 text-teal-500" />
//                         </button>
//                         <button 
//                             onClick={() => handleDelete(offer.id)}
//                             className="p-1 hover:bg-slate-100 rounded"
//                             disabled={loading}
//                         >
//                             <TrashIcon className="w-4 h-4 text-red-500" />
//                         </button>
//                     </div>
//                 </td>
//             </tr>
//         ))
//     }

//     return (
//         <div className="mt-8">
//             {/* Table Component */}
//             <Table
//     data={offers}  // offers, coupons, etc.
//     headers={headers}
//     count={offers.length}
//     loading={loading}
//     showDateFilter={false}
//     pageSize={pageSize}
//     currentPage={currentPage}
//     onPageChange={handlePageChange}
//     onPageSizeChange={handlePageSizeChange}
//     showExport={true}
//     bgColor="#dfe2e8"
//     // currentItems={currentItems}
//     initialData={offers}
// >
//     {renderTableRows()}
// </Table>

//             {/* Add Button */}
//             <div className="flex justify-center mt-4">
//                 <button
//                     onClick={() => setIsAddDialogOpen(true)}
//                     className={`p-2 text-white rounded-full transition-colors ${
//                         offers.length > 0 
//                         ? 'bg-gray-400 cursor-not-allowed' 
//                         : 'bg-teal-500 hover:bg-teal-600'
//                     }`}
//                     disabled={offers.length > 0}
//                     title={offers.length > 0 ? t('exclusive_offer_already_exists') : t('add_exclusive_offer')}
//                 >
//                     <PlusIcon className="w-5 h-5" />
//                 </button>
//             </div>

//             {/* Add/Edit Dialog */}
//             <Dialog open={isAddDialogOpen} onOpenChange={handleCloseDialog}>
//                 <DialogContent>
//                     <h2 className="text-lg font-semibold mb-4">
//                         {editingOffer ? 'Edit Offer' : 'Add New Offer'}
//                     </h2>
//                     <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//                         <div>
//                             <label className="block text-sm mb-1">Point Back Ratio (%)</label>
//                             <input
//                                 type="number"
//                                 {...register('ratio', { required: 'Ratio is required' })}
//                                 className="w-full px-3 py-2 border rounded-lg"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm mb-1">Valid From</label>
//                             <input
//                                 type="date"
//                                 {...register('validFrom', { required: 'Start date is required' })}
//                                 className="w-full px-3 py-2 border rounded-lg"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm mb-1">Valid To</label>
//                             <input
//                                 type="date"
//                                 {...register('validTo', { required: 'End date is required' })}
//                                 className="w-full px-3 py-2 border rounded-lg"
//                             />
//                         </div>
//                         <div className="flex justify-end gap-4">
//                             <button
//                                 type="button"
//                                 onClick={handleCloseDialog}
//                                 className="px-4 py-2 border rounded-lg"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 type="submit"
//                                 disabled={loading}
//                                 className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
//                             >
//                                 {loading ? 'Saving...' : editingOffer ? 'Update' : 'Add'}
//                             </button>
//                         </div>
//                     </form>
//                 </DialogContent>
//             </Dialog>
//         </div>
//     )
// }

// export default ExclusiveOffers 

'use client'
import React, { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useAppContext } from '@/context/appContext'
import { PencilSquareIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'
import Table from '@/components/ui/Table'
import CustomDatePicker from '@/components/CustomDatePicker'

interface ExclusiveOffer {
    id: number
    brandId: number
    validFrom: string
    validTo: string
    ratio: number
    createdAt: string
    updatedAt: string
}

interface OfferFormData {
    ratio: number
    validFrom: Date
    validTo: Date
}

const ExclusiveOffers = ({ brandId }: { brandId: string }) => {
    const [offers, setOffers] = useState<ExclusiveOffer[]>([])
    const [loading, setLoading] = useState(false)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [editingOffer, setEditingOffer] = useState<ExclusiveOffer | null>(null)
    const [deleteConfirmationId, setDeleteConfirmationId] = useState<number | null>(null)
    const { token } = useAppContext()
    const t = useTranslations('brand')

    const { register, handleSubmit, reset, formState: { errors }, control, setValue } = useForm<OfferFormData>()

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [currentItems, setCurrentItems] = useState<any[]>([]);

    // Add these handlers
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (newPageSize: number) => {
        setPageSize(newPageSize);
        setCurrentPage(1);
    };

    const headers = [
        { name: 'exclusive_offer_table_id' },
        { name: 'exclusive_offer_table_title' },
        { name: 'exclusive_offer_table_point_back' },
        { name: 'exclusive_offer_table_valid_from' },
        { name: 'exclusive_offer_table_valid_to' },
        { name: 'exclusive_offer_table_actions' }
    ]

    useEffect(() => {
        fetchExclusiveOffers()
    }, [brandId])

    const fetchExclusiveOffers = async () => {
        try {
            setLoading(true)
            const headers = new Headers()
            headers.append('Authorization', `Bearer ${token}`)
            headers.append('Content-Type', 'application/json')

            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/exclusive-offer/${brandId}`, {
                method: 'GET',
                headers,
            })

            if (!response.ok) throw new Error('Failed to fetch offers')

            const data = await response.json()
            setOffers(data.exclusiveOffers)
        } catch (error) {
            console.error('Error:', error)
            toast.error('Failed to load offers')
        } finally {
            setLoading(false)
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString()
    }

    const onSubmit = async (data: OfferFormData) => {
        try {
            setLoading(true)
            const headers = new Headers()
            headers.append('Authorization', `Bearer ${token}`)
            headers.append('Content-Type', 'application/json')

            // Format dates to match the required format YYYY/MM/DD
            const formatDate = (date: Date) => {
                return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
            }

            const body = JSON.stringify({
                ratio: Number(data.ratio),
                validFrom: formatDate(data.validFrom),
                validTo: formatDate(data.validTo)
            })

            const url = editingOffer 
                ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/exclusive-offer/${brandId}/${editingOffer.id}`
                : `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/exclusive-offer/${brandId}`

            const response = await fetch(url, {
                method: editingOffer ? 'PUT' : 'POST',
                headers,
                body
            })

            const responseData = await response.json()

            if (!response.ok) {
                throw new Error(responseData.message || 'Failed to save offer')
            }

            toast.success(editingOffer ? 'Offer updated successfully' : 'Offer added successfully')
            fetchExclusiveOffers()
            handleCloseDialog()
        } catch (error: any) {
            console.error('Error details:', error)
            toast.error(error.message || 'Failed to save offer')
        } finally {
            setLoading(false)
        }
    }

    const handleCloseDialog = () => {
        setIsAddDialogOpen(false)
        setEditingOffer(null)
        reset()
    }

    const handleEdit = (offer: ExclusiveOffer) => {
        setEditingOffer(offer)
        setIsAddDialogOpen(true)
        
        reset({
            ratio: offer.ratio,
            validFrom: new Date(offer.validFrom),
            validTo: new Date(offer.validTo)
        })
    }

    const handleDelete = async (offerId: number) => {
        try {
            setLoading(true)
            const headers = new Headers()
            headers.append('Authorization', `Bearer ${token}`)

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/exclusive-offer/${brandId}/${offerId}`,
                {
                    method: 'DELETE',
                    headers,
                }
            )

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || 'Failed to delete offer')
            }

            toast.success('Offer deleted successfully')
            fetchExclusiveOffers()
        } catch (error: any) {
            console.error('Delete error:', error)
            toast.error(error.message || 'Failed to delete offer')
        } finally {
            setLoading(false)
            setDeleteConfirmationId(null)
        }
    }

    const renderTableRows = () => {
        return offers.map((offer) => (
            <tr key={offer.id} className="odd:bg-white even:bg-primary/5 border-b">
                <td className="px-6 py-4">
                    {offer.id.toString().padStart(3, '0')}
                </td>
                <td className="px-6 py-4 font-medium">
                    Exclusive offer
                </td>
                <td className="px-6 py-4">
                    {offer.ratio}%
                </td>
                <td className="px-6 py-4">
                    {formatDate(offer.validFrom)}
                </td>
                <td className="px-6 py-4">
                    {formatDate(offer.validTo)}
                </td>
                <td className="px-6 py-4">
                    <div className="flex gap-2">
                        <button 
                            onClick={() => handleEdit(offer)}
                            className="p-1 hover:bg-slate-100 rounded"
                            disabled={loading}
                        >
                            <PencilSquareIcon className="w-4 h-4 text-teal-500" />
                        </button>
                        <button 
                            onClick={() => setDeleteConfirmationId(offer.id)}
                            className="p-1 hover:bg-slate-100 rounded"
                            disabled={loading}
                        >
                            <TrashIcon className="w-4 h-4 text-red-500" />
                        </button>
                    </div>
                </td>
            </tr>
        ))
    }

    return (
        <div className="mt-8">
            {/* Table Component */}
            <Table
                data={offers}  // offers, coupons, etc.
                headers={headers}
                count={offers.length}
                loading={loading}
                showDateFilter={false}
                pageSize={pageSize}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                showExport={true}
                bgColor="#dfe2e8"
                // currentItems={currentItems}
                initialData={offers}
            >
                {renderTableRows()}
            </Table>

            {/* Add Button */}
            <div className="flex justify-center mt-4">
                <button
                    onClick={() => setIsAddDialogOpen(true)}
                    className={`p-2 text-white rounded-full transition-colors ${
                        offers.length > 0 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-teal-500 hover:bg-teal-600'
                    }`}
                    disabled={offers.length > 0}
                    title={offers.length > 0 ? t('exclusive_offer_already_exists') : t('add_exclusive_offer')}
                >
                    <PlusIcon className="w-5 h-5" />
                </button>
            </div>

            {/* Add/Edit Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={handleCloseDialog}>
                <DialogContent>
                    <h2 className="text-lg font-semibold mb-4">
                        {editingOffer ? 'Edit Offer' : 'Add New Offer'}
                    </h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-sm mb-1">Point Back Ratio (%)</label>
                            <input
                                type="number"
                                {...register('ratio', { required: 'Ratio is required' })}
                                className="w-full px-3 py-2 border rounded-lg"
                            />
                        </div>
                        <div>
                            <CustomDatePicker
                                label={t('Tablecomponent.exclusive_offer_table_valid_from')}
                                fieldForm="validFrom"
                                errors={errors}
                                control={control}
                                setValue={setValue}
                                rules={{ required: t('validFrom_required') }}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <CustomDatePicker
                                label={t('Tablecomponent.exclusive_offer_table_valid_to')}
                                fieldForm="validTo"
                                errors={errors}
                                control={control}
                                setValue={setValue}
                                rules={{ required: t('validTo_required') }}
                                className="w-full"
                            />
                        </div>
                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={handleCloseDialog}
                                className="px-4 py-2 border rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
                            >
                                {loading ? 'Saving...' : editingOffer ? 'Update' : 'Add'}
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteConfirmationId} onOpenChange={() => setDeleteConfirmationId(null)}>
                <DialogContent>
                    <h2 className="text-lg font-semibold mb-4">{t('branddeleteButton')}</h2>
                    <p className="mb-4">{t('deleteMessage')}</p>
                    <div className="flex justify-end gap-4">
                        <button
                            onClick={() => setDeleteConfirmationId(null)}
                            className="px-4 py-2 border rounded-lg"
                        >
                            {t('cancel_delete_brand')}
                        </button>
                        <button
                            onClick={() => deleteConfirmationId && handleDelete(deleteConfirmationId)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            disabled={loading}
                        >
                            {loading ? 'Deleting...' : t('deleteBrand')}
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default ExclusiveOffers 