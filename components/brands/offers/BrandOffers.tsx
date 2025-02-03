'use client'
import React, { useEffect, useState } from 'react'
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

interface BrandOffer {
    id: number
    ratio: number
    validFrom: string
    validTo: string
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
    url?: string
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
        { name: 'Brand_offers_table_point_back' },
        { name: 'Brand_offers_table_valid_from' },
        { name: 'Brand_offers_table_valid_to' },
        { name: 'Brand_offers_table_actions' }
    ]

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [currentItems, setCurrentItems] = useState<any[]>([]);

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
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/offers?brandId=${brandId}&fields=id,ratio,validFrom,validTo,brandId,category=id-name-imageUrl&sort=-ratio`,
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
        if (!window.confirm('Are you sure you want to delete this offer?')) return

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
            fetchBrandOffers()
        } catch (error: any) {
            console.error('Delete error:', error)
            toast.error(error.message || 'Failed to delete offer')
        } finally {
            setLoading(false)
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

            toast.success(editingOffer ? 'Offer updated successfully' : 'Offer added successfully')
            fetchBrandOffers()
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

    const renderTableRows = () => {
        return offers.map((offer) => (
            <tr key={offer.id} className="odd:bg-white even:bg-primary/5 border-b">
                <td className="px-6 py-4">
                    {offer.id.toString().padStart(3, '0')}
                </td>
                <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                        <ImageApi
                            src={offer.category.imageUrl}
                            alt={offer.category.name}
                            width={30}
                            height={30}
                            className="rounded-full"
                        />
                        <span className="font-medium">
                            {mlang(offer.category.name, locale)}
                        </span>
                    </div>
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
                            onClick={() => handleDelete(offer.id)}
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
                            <label className="block text-sm mb-1">{(t('category'))}</label>
                            <select
                                {...register('categoryId', { required: t('category_required') })}
                                className="w-full px-3 py-2 border rounded-lg"
                            >
                                <option value="">{(t('category_select'))}</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            {errors.categoryId && (
                                <span className="text-red-500 text-sm">
                                    {errors.categoryId.message}
                                </span>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm mb-1">{(t('brandUrl'))}</label>
                            <input
                                type="url"
                                {...register('url')}
                                placeholder="http://www.brand.com"
                                className="w-full px-3 py-2 border rounded-lg"
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
                            <label className="block text-sm mb-1">{(t('validFrom'))}</label>
                            <input
                                type="date"
                                {...register('validTo', { required: (t('validFrom_required')) })}
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
        </div>
    )
}

export default BrandOffers 