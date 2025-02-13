'use client'
import React, { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useAppContext } from '@/context/appContext'
import {  TrashIcon, PlusIcon } from '@heroicons/react/24/outline'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Select } from '@/components/ui/select'
import Table from '@/components/ui/Table'

interface SpecialOffer {
    id: number
    brandId: number
    type: 'Basic' | 'Standard' | 'VIP'
    validFrom: string
    validTo: string
    ratio: number
    createdAt: string
    updatedAt: string
    brand?: {
        id: number
        name: string
        logo: string
    }
    userType?: {
        id: number
        userType: string
        ratio: number
        color: string
        buyAmount: number
    }
}

interface OfferFormData {
    type: 'Basic' | 'Standard' | 'VIP'
    ratio: number
    validFrom: string
    validTo: string
}

interface Badge {
    id: number
    name: string
    userType: {
        userType: string
    } | null
}

const SpecialOffers = ({ brandId }: { brandId: string }) => {
    const [offers, setOffers] = useState<SpecialOffer[]>([])
    const [badges, setBadges] = useState<Badge[]>([])
    const [loading, setLoading] = useState(false)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const { token } = useAppContext()
    const t = useTranslations('brand')

    const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<OfferFormData>({
        defaultValues: {
            type: undefined,
            ratio: undefined,
            validFrom: undefined,
            validTo: undefined
        }
    })
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    useEffect(() => {
        fetchSpecialOffers()
        fetchBadges()
    }, [brandId])

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handlePageSizeChange = (newPageSize: number) => {
        setPageSize(newPageSize)
        setCurrentPage(1)
    }

    const fetchSpecialOffers = async () => {
        try {
            setLoading(true)
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/special-offer/${brandId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (!response.ok) throw new Error('Failed to fetch offers')
            const data = await response.json()
            setOffers(data.offers || [])
        } catch (error) {
            console.error('Error:', error)
            toast.error('Failed to load offers')
        } finally {
            setLoading(false)
        }
    }

    const fetchBadges = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/badges`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (!response.ok) throw new Error('Failed to fetch badges')
            const data = await response.json()
            setBadges(data.badges || [])
        } catch (error) {
            console.error('Error fetching badges:', error)
            toast.error('Failed to load badges')
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString()
    }

    const onSubmit = async (data: OfferFormData) => {
        try {
            setLoading(true)

            // Format dates to match the required format YYYY/MM/DD
            const formatDate = (dateStr: string) => {
                const date = new Date(dateStr)
                return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
            }

            const body = JSON.stringify({
                type: data.type,
                ratio: Number(data.ratio),
                validFrom: formatDate(data.validFrom),
                validTo: formatDate(data.validTo)
            })

            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/special-offer/${brandId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || t('failed_to_save_offer'))
            }

            const result = await response.json()
            console.log('Offer created:', result)

            toast.success(t('offer_added_successfully'))
            await fetchSpecialOffers()
            handleCloseDialog()
        } catch (error: unknown) {
            const err = error as Error
            console.error('Error:', err)
            toast.error(err.message || t('failed_to_save_offer'))
        } finally {
            setLoading(false)
        }
    }

    const handleCloseDialog = () => {
        setIsAddDialogOpen(false)
        reset({
            type: undefined,
            ratio: undefined,
            validFrom: undefined,
            validTo: undefined
        })
    }

    const handleDelete = async (offerId: number) => {
        if (!window.confirm('Are you sure you want to delete this offer?')) return

        try {
            setLoading(true)
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/special-offer/${brandId}/${offerId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                }
            )

            if (!response.ok) throw new Error('Failed to delete offer')

            toast.success('Offer deleted successfully')
            fetchSpecialOffers()
        } catch (error) {
            console.error('Error:', error)
            toast.error('Failed to delete offer')
        } finally {
            setLoading(false)
        }
    }

    // Update the Select component in the form
    const renderUserTypeSelect = () => {
        // Filter out badges without userType and create options
        const badgeOptions = badges
            .filter(badge => badge.userType)
            .map(badge => ({
                value: badge.userType?.userType || '',
                label: badge.userType?.userType || ''
            }))

        return (
            <div>
                <label className="block text-sm mb-1">{t('Tablecomponent.special_offers_table_Type')}</label>
                <Select
                    value={watch('type') || ''}
                    onValueChange={(value) => {
                        if (value) {
                            setValue('type', value as 'Basic' | 'Standard' | 'VIP')
                        }
                    }}
                    options={badgeOptions}
                    placeholder={t('selectType')}
                />
                {errors.type && (
                    <p className="text-sm text-red-500 mt-1">{t('Enter vaild user type name')}</p>
                )}
            </div>
        )
    }

    // Update the form to use single ratio input
    const renderRatioInput = () => (
        <div>
            <label className="block text-sm mb-1">{t('Tablecomponent.special_offers_table_point_back')}</label>
            <input
                type="number"
                step="0.1"
                {...register('ratio', { 
                    required: t('pointbackratio_required'),
                    min: { value: 0, message: t('GreaterThanZero') }
                })}
                className="w-full px-3 py-2 border rounded-lg"
            />
        </div>
    )

    const headers = [
        { name: 'special_offers_table_id' },
        { name: 'special_offers_table_Type' },
        { name: 'special_offers_table_point_back' },
        { name: 'special_offers_table_valid_from' },
        { name: 'special_offers_table_valid_to' },
        { name: 'special_offers_table_actions' }
    ]

    const renderTableRows = () => {
        return offers.map((offer) => (
            <tr key={offer.id} className="odd:bg-white even:bg-primary/5 border-b">
                <td className="px-6 py-4">
                    {offer.id.toString().padStart(3, '0')}
                </td>
                <td className="px-6 py-4 font-medium">
                    {offer.type}
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
                            onClick={() => handleDelete(offer.id)}
                            className="p-1 hover:bg-slate-100 rounded"
                            disabled={loading}
                            title={t('delete')}
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
            <Table
                data={offers}
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
                initialData={offers}
            >
                {renderTableRows()}
            </Table>

            {/* Add Button */}
            <div className="flex justify-center mt-4">
                <button
                    onClick={() => setIsAddDialogOpen(true)}
                    className="p-2 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-colors"
                    title={t('add_special_offer')}
                >
                    <PlusIcon className="w-5 h-5" />
                </button>
            </div>

            {/* Add Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={handleCloseDialog}>
                <DialogContent>
                    <h2 className="text-lg font-semibold mb-4">{t('add_special_offer')}</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {renderUserTypeSelect()}
                        {watch('type') && renderRatioInput()}
                        <div>
                            <label className="block text-sm mb-1">{t('Tablecomponent.special_offers_table_valid_from')}</label>
                            <input
                                type="date"
                                {...register('validFrom', { required: t('validFrom_required') })}
                                className="w-full px-3 py-2 border rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">{t('Tablecomponent.special_offers_table_valid_to')}</label>
                            <input
                                type="date"
                                {...register('validTo', { required: t('validTo_required') })}
                                className="w-full px-3 py-2 border rounded-lg"
                            />
                        </div>
                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={handleCloseDialog}
                                className="px-4 py-2 border rounded-lg"
                            >
                                {t('cancel')}
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !watch('type')}
                                className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50"
                            >
                                {loading ? t('saving') : t('add')}
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default SpecialOffers