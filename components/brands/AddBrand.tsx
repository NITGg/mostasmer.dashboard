'use client';
import React, { useRef, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { useAppContext } from '@/context/appContext'
import toast from 'react-hot-toast'
import { LoadingIcon, PhotoIcon } from '../icons'
import ImageApi from '../ImageApi'
import { Dialog, DialogContent } from '../ui/dialog'

interface Brand {
    id: number
    name: string
    url?: string
    phone?: string
    email?: string
    about?: string
    pointBackTerms?: string
    address?: string
    lat?: string
    lang?: string
    validFrom?: string
    validTo?: string
    logo?: string
    cover?: string
    pointBackRatio?: number
}

interface BrandFormData {
    name: string
    url: string
    phone: string
    email: string
    about: string
    pointBackTerms: string
    address: string
    lat: string
    lang: string
    validFrom: string
    validTo: string
    imageFile: FileList
    coverFile: FileList
    pointBackRatio: number
}

// Add a new interface for form errors
interface BrandFormErrors {
    [key: string]: string
}

interface AddBrandProps {
    isOpen: boolean
    onClose: () => void
    brandToEdit?: Brand | null
}

const AddBrand = ({ isOpen, onClose, brandToEdit }: AddBrandProps) => {
    const [loading, setLoading] = useState(false)
    const [logoPreview, setLogoPreview] = useState('')
    const [coverPreview, setCoverPreview] = useState('')
    const logoInputRef = useRef<HTMLInputElement>(null)
    const coverInputRef = useRef<HTMLInputElement>(null)
    const { token } = useAppContext()
    const t = useTranslations('brand')

    const { register, handleSubmit, formState: { errors }, reset } = useForm<BrandFormData>()

    // Pre-fill form when editing
    useEffect(() => {
        if (brandToEdit) {
            reset({
                name: brandToEdit.name,
                url: brandToEdit.url || '',
                phone: brandToEdit.phone || '',
                email: brandToEdit.email || '',
                about: brandToEdit.about || '',
                pointBackTerms: brandToEdit.pointBackTerms || '',
                address: brandToEdit.address || '',
                lat: brandToEdit.lat || '',
                lang: brandToEdit.lang || '',
                validFrom: brandToEdit.validFrom ? new Date(brandToEdit.validFrom).toISOString().split('T')[0] : '',
                validTo: brandToEdit.validTo ? new Date(brandToEdit.validTo).toISOString().split('T')[0] : '',
                pointBackRatio: brandToEdit.pointBackRatio || 0
            })
            
            // Set image previews if available
            if (brandToEdit.logo) setLogoPreview(brandToEdit.logo)
            if (brandToEdit.cover) setCoverPreview(brandToEdit.cover)
        }
    }, [brandToEdit, reset])

    const onSubmit = async (data: BrandFormData) => {
        try {
            setLoading(true)
            const formData = new FormData()

            // Format dates properly
            const validFrom = new Date(data.validFrom).toISOString()
            const validTo = new Date(data.validTo).toISOString()

            // Append all form fields
            formData.append('name', data.name.trim())
            formData.append('url', data.url.trim())
            formData.append('phone', data.phone.trim())
            formData.append('email', data.email.trim().toLowerCase())
            formData.append('about', data.about.trim())
            formData.append('pointBackTerms', data.pointBackTerms.trim())
            formData.append('address', data.address.trim())
            formData.append('validFrom', validFrom)
            formData.append('validTo', validTo)

            // Optional fields
            if (data.lat) formData.append('lat', data.lat)
            if (data.lang) formData.append('lang', data.lang)
            if (data.pointBackRatio) formData.append('pointBackRatio', data.pointBackRatio.toString())

            // Handle image files
            const logoFile = logoInputRef.current?.files?.[0]
            const coverFile = coverInputRef.current?.files?.[0]

            // Only require logo for new brands
            if (!brandToEdit && !logoFile) {
                throw new Error('Logo image is required')
            }

            if (logoFile) {
                formData.append('logo', logoFile)
            }
            if (coverFile) {
                formData.append('cover', coverFile)
            }

            const url = brandToEdit 
                ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/${brandToEdit.id}`
                : `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand`

            const response = await fetch(url, {
                method: brandToEdit ? 'PUT' : 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Failed to save brand')
            }

            const responseData = await response.json()

            toast.success(brandToEdit ? t('successEdit') : t('successAdd'))
            
            // Cleanup
            if (logoPreview) URL.revokeObjectURL(logoPreview)
            if (coverPreview) URL.revokeObjectURL(coverPreview)
            
            reset()
            setLogoPreview('')
            setCoverPreview('')
            
            onClose()
        } catch (error: any) {
            toast.error(error.message || 'Failed to save brand')
            console.error('Error saving brand:', error)
        } finally {
            setLoading(false)
        }
    }

    // Add form validation
    const validateForm = (data: BrandFormData) => {
        const errors: BrandFormErrors = {}

        if (!data.name) errors.name = 'Name is required'
        if (!data.url) errors.url = 'URL is required'
        if (!data.phone) errors.phone = 'Phone is required'
        if (!data.email) errors.email = 'Email is required'
        if (!data.about) errors.about = 'About is required'
        if (!data.pointBackTerms) errors.pointBackTerms = 'Point back terms are required'
        if (!data.address) errors.address = 'Address is required'
        if (!data.validFrom) errors.validFrom = 'Valid from date is required'
        if (!data.validTo) errors.validTo = 'Valid to date is required'
        if (!logoInputRef.current?.files?.length) errors.imageFile = 'Logo is required'

        return errors
    }

    // Update dialog title based on mode
    const dialogTitle = brandToEdit ? t('editBrand') : t('addBrand')
    const submitButtonText = brandToEdit ? t('updateBrand') : t('addBrand')

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <div className="bg-white rounded-3xl p-6 sidebar-scrolling custom-scrollbar">
                    <h2 className="text-xl font-semibold mb-6">{dialogTitle}</h2>
                    
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Basic Info */}
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <label className="w-24 text-sm">Name :</label>
                                <input
                                    {...register('name', { required: 'Name is required' })}
                                    className="flex-1 px-3 py-2 border rounded-lg text-sm"
                                />
                            </div>

                            <div className="flex items-center">
                                <label className="w-24 text-sm">URL :</label>
                                <input
                                    {...register('url', { required: 'URL is required' })}
                                    className="flex-1 px-3 py-2 border rounded-lg text-sm"
                                />
                            </div>

                            <div className="flex items-center">
                                <label className="w-24 text-sm">Phone :</label>
                                <input
                                    {...register('phone', { required: 'Phone is required' })}
                                    className="flex-1 px-3 py-2 border rounded-lg text-sm"
                                />
                            </div>

                            <div className="flex items-center">
                                <label className="w-24 text-sm">Email :</label>
                                <input
                                    type="email"
                                    {...register('email', { required: 'Email is required' })}
                                    className="flex-1 px-3 py-2 border rounded-lg text-sm"
                                />
                            </div>

                            <div className="flex items-center">
                                <label className="w-24 text-sm">Location :</label>
                                <input
                                    {...register('address', { required: 'Location is required' })}
                                    className="flex-1 px-3 py-2 border rounded-lg text-sm"
                                />
                            </div>
 
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center">
                                    <label className="w-24 text-sm">Latitude :</label>
                                    <input
                                        type="number"
                                        step="any"
                                        {...register('lat', { required: 'Latitude is required' })}
                                        className="flex-1 px-3 py-2 border rounded-lg text-sm"
                                    />
                                </div>
                                <div className="flex items-center">
                                    <label className="w-24 text-sm">Longitude :</label>
                                    <input
                                        type="number"
                                        step="any"
                                        {...register('lang', { required: 'Longitude is required' })}
                                        className="flex-1 px-3 py-2 border rounded-lg text-sm"
                                    />
                                </div>
                            </div> 

                            <div className="flex flex-col">
                                <label className="text-sm mb-2">About :</label>
                                <textarea
                                    {...register('about', { required: 'About is required' })}
                                    rows={3}
                                    className="w-full px-3 py-2 border rounded-lg text-sm"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-sm mb-2">Point Back Terms :</label>
                                <textarea
                                    {...register('pointBackTerms', { required: 'Terms are required' })}
                                    rows={3}
                                    className="w-full px-3 py-2 border rounded-lg text-sm"
                                />
                            </div>
                        </div>

                        {/* Image Uploads */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <input
                                    type="file"
                                    id="logo-input"
                                    className="hidden"
                                    accept="image/*"
                                    ref={logoInputRef}
                                    onChange={(e) => {
                                        if (e.target.files?.[0]) {
                                            setLogoPreview(URL.createObjectURL(e.target.files[0]))
                                        }
                                    }}
                                />
                                <div 
                                    onClick={() => logoInputRef.current?.click()}
                                    className="cursor-pointer w-full h-40 relative flex justify-center items-center bg-slate-100 rounded-xl group"
                                >
                                    {logoPreview ? (
                                        <div className="relative w-full h-full">
                                            <ImageApi
                                                src={logoPreview}
                                                alt="Brand logo"
                                                width={160}
                                                height={160}
                                                className="h-full w-full object-cover rounded-xl"
                                            />
                                            <div className="absolute inset-0 bg-black/20 hidden group-hover:flex items-center justify-center">
                                                <PhotoIcon className="w-8 h-8 text-white" />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <PhotoIcon className="w-8 h-8 text-teal-500" />
                                            <span className="text-sm mt-2">Brand Logo</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <input
                                    type="file"
                                    id="cover-input"
                                    className="hidden"
                                    accept="image/*"
                                    ref={coverInputRef}
                                    onChange={(e) => {
                                        if (e.target.files?.[0]) {
                                            setCoverPreview(URL.createObjectURL(e.target.files[0]))
                                        }
                                    }}
                                />
                                <div 
                                    onClick={() => coverInputRef.current?.click()}
                                    className="cursor-pointer w-full h-40 relative flex justify-center items-center bg-slate-100 rounded-xl group"
                                >
                                    {coverPreview ? (
                                        <div className="relative w-full h-full">
                                            <ImageApi
                                                src={coverPreview}
                                                alt="Brand cover"
                                                width={160}
                                                height={160}
                                                className="h-full w-full object-cover rounded-xl"
                                            />
                                            <div className="absolute inset-0 bg-black/20 hidden group-hover:flex items-center justify-center">
                                                <PhotoIcon className="w-8 h-8 text-white" />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <PhotoIcon className="w-8 h-8 text-teal-500" />
                                            <span className="text-sm mt-2">Brand Cover</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Date Range */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center flex-1">
                                <label className="w-24 text-sm">Valid From :</label>
                                <input
                                    type="date"
                                    {...register('validFrom', { required: 'Start date is required' })}
                                    className="flex-1 px-3 py-2 border rounded-lg text-sm"
                                />
                            </div>
                            <div className="flex items-center flex-1">
                                <label className="w-24 text-sm">Valid To :</label>
                                <input
                                    type="date"
                                    {...register('validTo', { required: 'End date is required' })}
                                    className="flex-1 px-3 py-2 border rounded-lg text-sm"
                                />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-4 mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 border rounded-xl hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 bg-teal-500 text-white rounded-xl hover:bg-teal-600 flex items-center gap-2"
                            >
                                {loading && <LoadingIcon className="w-5 h-5 animate-spin" />}
                                {submitButtonText}
                            </button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default AddBrand