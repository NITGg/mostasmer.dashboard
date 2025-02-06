'use client'
import React, { useEffect, useState, useMemo } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useAppContext } from '@/context/appContext'
import { PencilSquareIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Table from '@/components/ui/Table'
import ImageApi from '../../ImageApi'
import mlang from '@/lib/mLang'
import { Category } from '@/lib/types'
import { url } from 'node:inspector'

interface BrandOffer {
    id: number
    ratio: number
    validFrom: string
    validTo: string
    url: string
    category: {
        id: number
        name: string
        imageUrl: string
    }
}

interface OfferFormData {
    ratio: number
    validFrom: string
    validTo: string
    categoryId: number
    url: string
}

const BrandOffers = ({ brandId }: { brandId: string }) => {
    const [offers, setOffers] = useState<BrandOffer[]>([])
    const [loading, setLoading] = useState(false)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [editingOffer, setEditingOffer] = useState<BrandOffer | null>(null)
    const [categories, setCategories] = useState<Category[]>([])
    const { token } = useAppContext()
    const t = useTranslations('brand')
    // const locale = useLocale()
    const locale: 'en' | 'ar' = 'en';

    const { register, handleSubmit, reset, formState: { errors } } = useForm<OfferFormData>()

    const headers = [
        { name: 'Brand_offers_table_id' },
        { name: 'Brand_offers_table_category' },
        { name: 'Brand_offers_table_url' },
        { name: 'Brand_offers_table_point_back' },
        { name: 'Brand_offers_table_valid_from' },
        { name: 'Brand_offers_table_valid_to' },
        { name: 'Brand_offers_table_actions' }
    ]

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [currentItems, setCurrentItems] = useState<any[]>([]);

    const [deleteConfirmationId, setDeleteConfirmationId] = useState<number | null>(null)

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (newPageSize: number) => {
        setPageSize(newPageSize);
        setCurrentPage(1);
    };

    useEffect(() => {
        fetchCategories()
        fetchBrandOffers()
    }, [brandId])

    const fetchBrandOffers = async () => {
        try {
            setLoading(true)
            const headers = new Headers()
            headers.append('Authorization', `Bearer ${token}`)
            
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/offers?brandId=${brandId}&fields=id,ratio,validFrom,validTo,brandId,category=id-name-imageUrl,url&sort=-ratio`,
                {
                    method: 'GET',
                    headers,
                }
            )

            const data = await response.json()
            console.log('Received data:', data)
            setOffers(data.offers || [])
        } catch (error) {
            console.error('Error:', error)
            toast.error('Failed to load offers')
        } finally {
            setLoading(false)
        }
    }

    const fetchCategories = async () => {
        try {
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                redirect: 'follow' as RequestRedirect
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/category`, requestOptions);
            const data = await response.json();
            
            if (!response.ok) throw new Error('Failed to fetch categories');
            
            console.log('Categories data:', data); // Debug log
            setCategories(data.categories || []);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to load categories');
        }
    };

    const handleEdit = (offer: BrandOffer) => {
        setEditingOffer(offer)
        setIsAddDialogOpen(true)
        
        const formatDateForInput = (dateStr: string) => {
            const date = new Date(dateStr)
            return date.toISOString().split('T')[0]
        }

        reset({
            ratio: offer.ratio,
            validFrom: formatDateForInput(offer.validFrom),
            validTo: formatDateForInput(offer.validTo),
            categoryId: offer.category.id
        })
    }

    const handleDelete = async (offerId: number) => {
        try {
            setLoading(true)
            const headers = new Headers()
            headers.append('Authorization', `Bearer ${token}`)

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/offers/${offerId}`,
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
            await fetchBrandOffers()
            
            // Emit an event to notify parent components about the change
            const event = new CustomEvent('brandOffersChanged')
            window.dispatchEvent(event)
            
        } catch (error: any) {
            console.error('Delete error:', error)
            toast.error(error.message || 'Failed to delete offer')
        } finally {
            setLoading(false)
            setDeleteConfirmationId(null)
        }
    }

    const onSubmit = async (data: OfferFormData) => {
        try {
            setLoading(true)
            const headers = new Headers()
            headers.append('Authorization', `Bearer ${token}`)
            headers.append('Content-Type', 'application/json')

            const body = JSON.stringify({
                ratio: Number(data.ratio),
                brandId: Number(brandId),
                categoryId: Number(data.categoryId),
                validFrom: data.validFrom,
                validTo: data.validTo,
                url: data.url || 'http://www.brand.com'
            })

            const requestOptions = {
                method: editingOffer ? 'PUT' : 'POST',
                headers,
                body,
                redirect: 'follow' as RequestRedirect
            }

            const response = await fetch(
                editingOffer 
                    ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/offers/${editingOffer.id}`
                    : `${process.env.NEXT_PUBLIC_BASE_URL}/api/offers`,
                requestOptions
            )

            if (!response.ok) {
                const errorData = await response.text()
                throw new Error(errorData || 'Failed to save offer')
            }

            toast.success(editingOffer ? t('offer_updated_successfully') : t('offer_added_successfully'))
            
            // Refresh both the offers list and trigger a brands refresh if needed
            await fetchBrandOffers()
            
            // Emit an event to notify parent components about the change
            const event = new CustomEvent('brandOffersChanged', {
                detail: { brandId, categoryId: data.categoryId }
            })
            window.dispatchEvent(event)
            
            handleCloseDialog()

        } catch (error: any) {
            console.error('Error details:', error)
            toast.error(t('validTo_error'))
        } finally {
            setLoading(false)
        }
    }

    const handleCloseDialog = () => {
        setIsAddDialogOpen(false)
        setEditingOffer(null)
        reset()
    }

    const renderTableRows = () => {
        return offers.map((offer, index) => (
<tr key={offer.id} className={`border-b  font-bold odd:bg-gray-50 even:bg-white ${new Date(offer.validTo) < new Date() ? 'font-extrabold line-through text-red-500 ' : (index % 2 === 0 ? '' : '')}`}>
<td className="px-6 py-4 ">
        {offer.id.toString().padStart(3, '0')}


    </td>
                <td className="px-6 py-4 font-bold">
                    <div className="flex items-center gap-2">
                        <ImageApi
                            src={offer.category.imageUrl}
                            alt={offer.category.name}
                            width={30}
                            height={30}
                            className="rounded-full"
                        />
                        <span className="font-bold">
                            {mlang(offer.category.name, locale)}
                        </span>
                    </div>
                </td>
                <td className="px-6 py-4">
                    <a href={offer.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                        {offer.url}
                    </a>
                </td>
                <td className="px-6 py-4">{offer.ratio}%</td>
                <td className="px-6 py-4">{new Date(offer.validFrom).toLocaleDateString()}</td>
                <td className="px-6 py-4">{new Date(offer.validTo).toLocaleDateString()}</td>
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

    const availableCategories = useMemo(() => {
        const usedCategoryIds = new Set(offers.map(offer => offer.category.id))
        
        return categories.filter(category => {
            return !usedCategoryIds.has(Number(category.id)) || 
                   (editingOffer && editingOffer.category.id === Number(category.id))
        })
    }, [categories, offers, editingOffer])

    return (
        <div className="mt-8 ">
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
                // currentItems={currentItems}
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
                            <label className="block text-sm mb-1">{t('category')}</label>
                            <select
                                {...register('categoryId', { required: t('category_required') })}
                                className="w-full px-3 py-2 border rounded-lg"
                                disabled={loading}
                            >
                                <option value="">{t('category_select')}</option>
                                {availableCategories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {mlang(category.name, locale)}
                                    </option>
                                ))}
                            </select>
                            {errors.categoryId && (
                                <span className="text-red-500 text-sm">
                                    {errors.categoryId.message}
                                </span>
                            )}
                            {availableCategories.length === 0 && !editingOffer && (
                                <span className="text-amber-500 text-sm block mt-1">
                                    {t('no_available_categories')}
                                </span>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm mb-1">{(t('brandUrl'))}</label>
                            <input
                                type="url"
                                {...register('url')}
                                placeholder="http://www.brand.com"
                                className="w-full px-3 py-2 border-3 bg-slate-400/23 drop-shadow-2xl rounded-lg border-green-400/23"
                            />
                        </div>


                        {/* Form fields */}
                        <div>
                            <label className="block text-sm mb-1">{(t('pointbackratio'))} (%)</label>
                            <input
                                type="number"
                                {...register('ratio', { required: (t('pointbackratio_required')) })}
                                className="w-full px-3 py-2 border rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">{(t('validFrom'))}</label>
                            <input
                                type="date"
                                {...register('validFrom', { required: (t('validFrom_required')) })}
                                className="w-full px-3 py-2 border rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">{(t('validTo'))}</label>
                            <input
                                type="date"
                                {...register('validTo', { required: (t('validTo_required')) })}
                                className="w-full px-3 py-2 border rounded-lg"
                            />
                        </div>
                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => setIsAddDialogOpen(false)}
                                className="px-4 py-2 border rounded-lg"
                            >
                                {(t('cancel_delete_brand'))}
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
                            >
                                {loading ? 'Saving...' : editingOffer ? (t('brandeditButton')) : (t('brandaddButton'))}
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

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

export default BrandOffers 