'use client'

import React, { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useAppContext } from '@/context/appContext'
import toast from 'react-hot-toast'
import { PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import { useParams } from 'next/navigation'

interface OfferInfo {
    id: number
    name: string
    description: string
    imageUrl: string | null
    offerType: string
    createdAt: string
    updatedAt: string
}

type OfferType = 'BRAND_OFFERS' | 'SPECIAL_OFFERS' | 'EXCLUSIVE_OFFERS' | 'DIGITAL_SEALS' | 'CUSTOM_OFFERS' | 'HOT_DEALS' | 'BRAND_REPRESENTATIVE'

const offerTypes: OfferType[] = [
    'BRAND_OFFERS',
    'SPECIAL_OFFERS',
    'EXCLUSIVE_OFFERS',
    'DIGITAL_SEALS',
    'CUSTOM_OFFERS',
    "BRAND_REPRESENTATIVE",
    'HOT_DEALS'
]

export default function OfferInfoDetails() {
    const t = useTranslations('offerInfo')
    const { token } = useAppContext()
    const params = useParams()
    const [offerInfos, setOfferInfos] = useState<OfferInfo[]>([])
    const [loading, setLoading] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [isExpanded, setIsExpanded] = useState(true)
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
    const [deleteId, setDeleteId] = useState<number | null>(null)
    const [deletingOffer, setDeletingOffer] = useState<OfferInfo | null>(null)
    const [formData, setFormData] = useState({
        name: {
            en: '',
            ar: ''
        },
        description: {
            en: '',
            ar: ''
        },
        offerType: 'BRAND_OFFERS' as OfferType
    })

    useEffect(() => {
        fetchOfferInfos()
    }, [params.locale])

    const fetchOfferInfos = async () => {
        try {
            const myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${token}`);

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow" as RequestRedirect
            };

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/offer-info?lang=${params.locale || 'en'}`,
                requestOptions
            );

            if (!response.ok) throw new Error('Failed to fetch offer info')
            const data = await response.json()
            setOfferInfos(data.offerInfos)
        } catch (error) {
            console.error('Error:', error)
            toast.error(t('failed_to_fetch'))
        }
    }

    const formatName = (nameEn: string, nameAr: string) => {
        let formattedName = '';
        if (nameAr) {
            formattedName += `{mlang ar}${nameAr.trim()}{mlang}`;
        }
        if (nameEn) {
            formattedName += `{mlang en}${nameEn.trim()}{mlang}`;
        }
        return formattedName;
    };

    const formatDescription = (descEn: string, descAr: string) => {
        let formattedDesc = '';
        if (descAr) {
            formattedDesc += `{mlang ar}${descAr.trim()}{mlang}`;
        }
        if (descEn) {
            formattedDesc += `{mlang en}${descEn.trim()}{mlang}`;
        }
        return formattedDesc;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        if (!formData.name.en.trim() && !formData.name.ar.trim()) {
            toast.error(t('error.error_name_required'))
            setLoading(false)
            return
        }

        // If one language is empty, use the other language's value
        const nameEn = formData.name.en.trim() || formData.name.ar.trim()
        const nameAr = formData.name.ar.trim() || formData.name.en.trim()
        const descEn = formData.description.en.trim() || formData.description.ar.trim()
        const descAr = formData.description.ar.trim() || formData.description.en.trim()

        const payload = {
            name: formatName(nameEn, nameAr),
            description: formatDescription(descEn, descAr),
            offerType: formData.offerType
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/offer-info${editingId ? `/${editingId}` : ''}`, {
                method: editingId ? 'PUT' : 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })

            if (!response.ok) throw new Error('Failed to save offer info')

            toast.success(editingId ? t('updated_successfully') : t('created_successfully'))
            setIsModalOpen(false)
            setEditingId(null)
            setFormData({
                name: { en: '', ar: '' },
                description: { en: '', ar: '' },
                offerType: 'BRAND_OFFERS'
            })
            fetchOfferInfos()
        } catch (error) {
            console.error('Error:', error)
            toast.error(t('failed_to_save'))
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteClick = (offerInfo: OfferInfo) => {
        setDeleteId(offerInfo.id)
        setDeletingOffer(offerInfo)
        setDeleteConfirmOpen(true)
    }

    const handleDelete = async () => {
        if (!deleteId) return;
        
        try {
            const myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${token}`);

            const requestOptions = {
                method: "DELETE",
                headers: myHeaders,
                redirect: "follow" as RequestRedirect
            };

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/offer-info/${deleteId}`,
                requestOptions
            );

            if (!response.ok) throw new Error('Failed to delete offer info');

            toast.success(t('deleted_successfully'));
            setDeleteConfirmOpen(false);
            setDeleteId(null);
            setDeletingOffer(null);
            fetchOfferInfos();
        } catch (error) {
            console.error('Error:', error);
            toast.error(t('failed_to_delete'));
        }
    }

    const handleEdit = (offerInfo: OfferInfo) => {
        // Parse name content
        const nameArMatch = offerInfo.name.match(/{mlang ar}(.*?){mlang}/);
        const nameEnMatch = offerInfo.name.match(/{mlang en}(.*?){mlang}/);
        
        // Parse description content
        const descArMatch = offerInfo.description.match(/{mlang ar}(.*?){mlang}/);
        const descEnMatch = offerInfo.description.match(/{mlang en}(.*?){mlang}/);

        // Extract the content or use empty string if no match
        const nameAr = nameArMatch ? nameArMatch[1] : '';
        const nameEn = nameEnMatch ? nameEnMatch[1] : '';
        const descriptionAr = descArMatch ? descArMatch[1] : '';
        const descriptionEn = descEnMatch ? descEnMatch[1] : '';

        // If no multilang tags found, use the entire content as both AR and EN
        const finalNameAr = nameAr || (offerInfo.name.includes('{mlang') ? '' : offerInfo.name);
        const finalNameEn = nameEn || (offerInfo.name.includes('{mlang') ? '' : offerInfo.name);
        const finalDescAr = descriptionAr || (offerInfo.description.includes('{mlang') ? '' : offerInfo.description);
        const finalDescEn = descriptionEn || (offerInfo.description.includes('{mlang') ? '' : offerInfo.description);

        setFormData({
            name: {
                ar: finalNameAr,
                en: finalNameEn
            },
            description: {
                ar: finalDescAr,
                en: finalDescEn
            },
            offerType: offerInfo.offerType as OfferType
        });
        setEditingId(offerInfo.id);
        setIsModalOpen(true);
    };

    return (
        <div className="">
            <div 
                className="flex justify-between items-center mb-6 cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-gray-900">{t('title')}</h2>
                    <ChevronDown className={cn("h-6 w-6 transition-transform", {
                        "transform rotate-180": isExpanded
                    })} />
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        setIsModalOpen(true)
                    }}
                    className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    {t('add_new')}
                </button>
            </div>

            {isExpanded && (
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left font-bold py-3 px-4">{t('name')}</th>
                                <th className="text-left font-bold py-3 px-4">{t('description')}</th>
                                <th className="text-left font-bold py-3 px-4">{t('offer_type')}</th>
                                <th className="text-left font-bold py-3 px-4">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {offerInfos.map((offerInfo) => (
                                <tr key={offerInfo.id} className="border-b last:border-b-0 hover:bg-gray-100">
                                    <td className="py-3 px-4">{offerInfo.name}</td>
                                    <td className="py-3 px-4">{offerInfo.description}</td>
                                    <td className="py-3 px-4">{offerInfo.offerType}</td>
                                    <td className="py-3 px-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(offerInfo)}
                                                className="text-blue-600 hover:text-blue-800 transition-colors"
                                                title={t('edit')}
                                            >
                                                <PencilIcon className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(offerInfo)}
                                                className="text-red-600 hover:text-red-800 transition-colors"
                                                title={t('delete')}
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                        <h3 className="text-lg font-semibold mb-4">
                            {editingId ? t('edit_offer_info') : t('add_new_offer_info')}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('name_en')}
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name.en}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            name: { ...formData.name, en: e.target.value }
                                        })}
                                        className="w-full px-3 py-2 border rounded-md"
                                        placeholder={t('enter_name_en')}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('name_ar')}
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name.ar}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            name: { ...formData.name, ar: e.target.value }
                                        })}
                                        className="w-full px-3 py-2 border rounded-md text-right"
                                        placeholder={t('enter_name_ar')}
                                        dir="rtl"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('description_en')}
                                    </label>
                                    <textarea
                                        value={formData.description.en}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            description: { ...formData.description, en: e.target.value }
                                        })}
                                        className="w-full px-3 py-2 border rounded-md"
                                        rows={3}
                                        placeholder={t('enter_description_en')}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('description_ar')}
                                    </label>
                                    <textarea
                                        value={formData.description.ar}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            description: { ...formData.description, ar: e.target.value }
                                        })}
                                        className="w-full px-3 py-2 border rounded-md text-right"
                                        rows={3}
                                        placeholder={t('enter_description_ar')}
                                        dir="rtl"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('offer_type')}
                                </label>
                                <select
                                    value={formData.offerType}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        offerType: e.target.value as OfferType
                                    })}
                                    className="w-full px-3 py-2 border rounded-md"
                                    required
                                >
                                    {offerTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {t(type.toLowerCase())}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsModalOpen(false)
                                        setEditingId(null)
                                        setFormData({
                                            name: { en: '', ar: '' },
                                            description: { en: '', ar: '' },
                                            offerType: 'BRAND_OFFERS'
                                        })
                                    }}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                                >
                                    {t('cancel')}
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors disabled:opacity-50"
                                >
                                    {loading ? t('saving') : t('save')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirmOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">
                            {t('confirm_delete')}
                        </h3>
                        {deletingOffer && (
                            <div className="mb-6">
                                <p className="text-gray-600 mb-4">
                                    {t('delete_confirmation_message')}
                                </p>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="font-medium text-gray-700">{deletingOffer.name}</p>
                                    <p className="text-sm text-gray-500 mt-1">{deletingOffer.description}</p>
                                    <p className="text-sm text-gray-500 mt-1">{deletingOffer.offerType}</p>
                                </div>
                            </div>
                        )}
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setDeleteConfirmOpen(false);
                                    setDeleteId(null);
                                    setDeletingOffer(null);
                                }}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                {t('cancel')}
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                            >
                                {t('confirm')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
} 
