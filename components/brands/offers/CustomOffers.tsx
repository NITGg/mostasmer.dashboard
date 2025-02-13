'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { useAppContext } from '@/context/appContext'
// import { PencilSquareIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline'
import { TrashIconn, PencilSquareIcon,PluseCircelIcon } from '@/components/icons'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Table from '@/components/ui/Table'

interface CustomOffer {
    id: number
    brandId: number
    ratio: number
    userClassId: number
    userId: string
    createdAt: string
    updatedAt: string
    validFrom: string
    validTo: string
    brand: {
        id: number
        name: string
    }
    userClass: {
        id: number
        name: string
        monthsPeriod: number
        purchaseCount: number
        color: string
    }
    user: {
        id: string
        fullname: string
    }
}

interface UserClass {
    id: number
    name: string
    monthsPeriod: number
    purchaseCount: number
    color: string
    description: string
    createdAt: string
    updatedAt: string
}

interface OfferFormData {
    ratio: number
    validFrom: string
    validTo: string
    userClassIds: number[]
}

const CustomOffers = ({ brandId }: { brandId: string }) => {
    const [offers, setOffers] = useState<CustomOffer[]>([])
    const [userClasses, setUserClasses] = useState<UserClass[]>([])
    const [loading, setLoading] = useState(false)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [editingOffer, setEditingOffer] = useState<CustomOffer | null>(null)
    const { token } = useAppContext()
    const t = useTranslations('CustomOffers')

    const { register, handleSubmit, reset, formState: { errors } } = useForm<OfferFormData>()

    const headers = [
        { name: 'Custom_offers_table_id' },
        { name: 'Custom_offers_table_user_class' },
        { name: 'Custom_offers_table_point_back' },
        { name: 'Custom_offers_table_valid_from' },
        { name: 'Custom_offers_table_valid_to' },
        { name: 'Custom_offers_table_actions' }
    ]

    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [deleteConfirmationId, setDeleteConfirmationId] = useState<number | null>(null)
    const [selectedUserClasses, setSelectedUserClasses] = useState<number[]>([])

    useEffect(() => {
        fetchUserClasses()
        fetchCustomOffers()
    }, [brandId])

    const fetchCustomOffers = async () => {
        try {
            setLoading(true)
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/custom-offers/${brandId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            )
            const data = await response.json()
            setOffers(data.offers || [])
        } catch (error) {
            console.error('Error:', error)
            toast.error('Failed to load custom offers')
        } finally {
            setLoading(false)
        }
    }

    const fetchUserClasses = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/user-classes`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            )
            const responseData = await response.json()
            setUserClasses(responseData.data || [])
        } catch (error) {
            console.error('Error:', error)
            toast.error('Failed to load user classes')
        }
    }

    const handleEdit = (offer: CustomOffer) => {
        setEditingOffer(offer)
        setIsAddDialogOpen(true)
        setSelectedUserClasses([offer.userClass.id])
        
        const formatDateForInput = (dateStr: string) => {
            const date = new Date(dateStr)
            return date.toISOString().split('T')[0]
        }

        reset({
            ratio: offer.ratio,
            validFrom: formatDateForInput(offer.validFrom),
            validTo: formatDateForInput(offer.validTo),
            userClassIds: [offer.userClass.id]
        })
    }

    const handleDelete = async (offerId: number) => {
        try {
            setLoading(true)
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/custom-offers/${offerId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            )

            if (!response.ok) {
                throw new Error(t('custom_offer_table_failed_to_delete_custom_offer'))
            }

            toast.success(t('custom_offer_table_custom_offer_deleted_successfully'))
            await fetchCustomOffers()
        } catch (error) {
            console.error('Delete error:', error)
            toast.error(t('custom_offer_table_failed_to_delete_custom_offer'))
        } finally {
            setLoading(false)
            setDeleteConfirmationId(null)
        }
    }

    const onSubmit = async (data: OfferFormData) => {
        try {
            setLoading(true)
            
            const promises = selectedUserClasses.map(userClassId => {
                const body = {
                    ratio: Number(data.ratio),
                    userClassId: userClassId,
                    validFrom: data.validFrom,
                    validTo: data.validTo
                }

                return fetch(
                    editingOffer 
                        ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/custom-offers/${editingOffer.id}`
                        : `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/custom-offers/${brandId}`,
                    {
                        method: editingOffer ? 'PUT' : 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(body)
                    }
                )
            })

            await Promise.all(promises)

            toast.success(editingOffer 
                ? t('custom_offer_table_custom_offers_updated') 
                : t('custom_offer_table_custom_offers_added')
            )
            await fetchCustomOffers()
            handleCloseDialog()
        } catch (error) {
            console.error('Error:', error)
            toast.error(t('custom_offer_table_failed_to_save_custom_offers'))
        } finally {
            setLoading(false)
        }
    }

    const handleCloseDialog = () => {
        setIsAddDialogOpen(false)
        setEditingOffer(null)
        setSelectedUserClasses([])
        reset()
    }

    const renderTableRows = () => {
        return offers.map((offer) => (
            <tr key={offer.id} className={`border-b font-bold odd:bg-gray-50 even:bg-white ${
                new Date(offer.validTo) < new Date() ? 'font-extrabold line-through text-red-500' : ''
            }`}>
                <td className="px-6 py-4">{offer.id}</td>
                <td className="px-6 py-4">
                    <span 
                        className="px-3 py-1 rounded-full text-sm"
                        style={{
                            backgroundColor: `${offer.userClass.color}20`,
                            color: offer.userClass.color
                        }}
                    >
                        {offer.userClass.name}
                    </span>
                </td>
                <td className="px-6 py-4">{offer.ratio}%</td>
                <td className="px-6 py-4">{new Date(offer.validFrom).toLocaleDateString()}</td>
                <td className="px-6 py-4">{new Date(offer.validTo).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleEdit(offer)}
                            className="text-blue-600 hover:text-blue-800"
                        >
                            <PencilSquareIcon className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setDeleteConfirmationId(offer.id)}
                            className="text-red-600 hover:text-red-800"
                        >
                            <TrashIconn className="w-5 h-5" />
                        </button>
                    </div>
                </td>
            </tr>
        ))
    }

    return (
        <div className="mt-8">
            <Table 
                data={offers}
                headers={headers}
                count={offers.length}
                loading={loading}
                showDateFilter={false}
                pageSize={pageSize}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
                showExport={true}
                bgColor="#dfe2e8"
                initialData={offers}
            >
                {renderTableRows()}
            </Table>

            {/* Add Button */}
            <div className="flex justify-center mt-4">
                <button
                    onClick={() => setIsAddDialogOpen(true)}
                    className="p-2 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-colors"
                >
                    <PluseCircelIcon className="w-5 h-5" />
                </button>
            </div>

            {/* Add/Edit Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={handleCloseDialog}>
                <DialogContent>
                    <h2 className="text-lg font-semibold mb-4">
                            {editingOffer ? t('custom_offer_table_edit_custom_offer') : t('custom_offer_table_add_new_custom_offer')}
                    </h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('custom_offer_table_user_class')}
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                {userClasses.map((userClass) => (
                                    <label
                                        key={userClass.id}
                                        className="flex items-center space-x-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50"
                                    >
                                        <input
                                            type="checkbox"
                                            {...register('userClassIds')}
                                            value={userClass.id}
                                            checked={selectedUserClasses.includes(userClass.id)}
                                            onChange={(e) => {
                                                const id = Number(userClass.id)
                                                if (e.target.checked) {
                                                    setSelectedUserClasses(prev => [...prev, id])
                                                } else {
                                                    setSelectedUserClasses(prev => 
                                                        prev.filter(classId => classId !== id)
                                                    )
                                                }
                                            }}
                                            className="h-4 w-4 text-teal-600 rounded border-gray-300"
                                        />
                                        <div className="flex items-center space-x-2">
                                            <span 
                                                className="w-3 h-3 rounded-full"
                                                style={{ 
                                                    backgroundColor: userClass.color === 'golden' 
                                                        ? '#FFD700' // Convert 'golden' to hex color
                                                        : userClass.color 
                                                }}
                                            />
                                            <span className="text-sm font-medium">{userClass.name}</span>
                                            {userClass.description && (
                                                <span className="text-xs text-gray-500 ml-2">
                                                    ({userClass.description})
                                                </span>
                                            )}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                {t('custom_offer_table_point_back')}
                            </label>
                            <input
                                type="number"
                                {...register('ratio', { required: true, min: 0 })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                {t('custom_offer_table_valid_from')}
                            </label>
                            <input
                                type="date"
                                {...register('validFrom', { required: true })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                {t('custom_offer_table_valid_to')}
                            </label>
                            <input
                                type="date"
                                {...register('validTo', { required: true })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            />
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={handleCloseDialog}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                {t('custom_offer_table_cancel')}
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
                                disabled={loading}
                            >
                                {loading ? t('custom_offer_table_saving') : (editingOffer ? t('custom_offer_table_update') : t('custom_offer_table_add'))}
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            {deleteConfirmationId && (
                <Dialog open={!!deleteConfirmationId} onOpenChange={() => setDeleteConfirmationId(null)}>
                    <DialogContent>
                        <h2 className="text-lg font-semibold mb-4">{t('custom_offer_table_confirm_delete')}</h2>
                        <p className="mb-4">{t('custom_offer_table_confirm_delete_message')}</p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setDeleteConfirmationId(null)}
                                className="px-4 py-2 text-gray-600 bg-slate-200 rounded-md drop-shadow-2xl hover:text-gray-800 transition-colors"
                            >
                                {t('custom_offer_table_cancel')}
                            </button>
                            <button
                                onClick={() => deleteConfirmationId && handleDelete(deleteConfirmationId)}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                disabled={loading}
                            >
                                {loading ? t('custom_offer_table_deleting') : t('custom_offer_table_delete')}
                            </button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}

export default CustomOffers
