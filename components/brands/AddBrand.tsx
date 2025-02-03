'use client';
import React, { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { useAppContext } from '@/context/appContext'
import toast from 'react-hot-toast'
import { LoadingIcon, PhotoIcon } from '../icons'
import ImageApi from '../ImageApi'
import { Dialog, DialogContent } from '../ui/dialog'

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

const AddBrand = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const [loading, setLoading] = useState(false)
    const [logoPreview, setLogoPreview] = useState('')
    const [coverPreview, setCoverPreview] = useState('')
    const logoInputRef = useRef<HTMLInputElement>(null)
    const coverInputRef = useRef<HTMLInputElement>(null)
    const { token } = useAppContext()
    const t = useTranslations('brand')

    const { register, handleSubmit, formState: { errors } } = useForm<BrandFormData>()

    const onSubmit = async (data: BrandFormData) => {
        try {
            setLoading(true)
            const formData = new FormData()

            // Append all text fields
            formData.append('name', data.name)
            formData.append('url', data.url)
            formData.append('phone', data.phone)
            formData.append('email', data.email)
            formData.append('about', data.about)
            formData.append('pointBackTerms', data.pointBackTerms)
            formData.append('address', data.address)
            formData.append('lat', data.lat)
            formData.append('lang', data.lang)
            formData.append('validFrom', data.validFrom)
            formData.append('validTo', data.validTo)

            // Handle image files
            const logoFile = logoInputRef.current?.files?.[0]
            const coverFile = coverInputRef.current?.files?.[0]

            if (logoFile) {
                // Create a new File with [PROXY] name
                const logoFileWithProxy = new File([logoFile], '[PROXY]', {
                    type: logoFile.type
                })
                formData.append('logo', logoFileWithProxy)
            }

            if (coverFile) {
                // Create a new File with [PROXY] name
                const coverFileWithProxy = new File([coverFile], '[PROXY]', {
                    type: coverFile.type
                })
                formData.append('cover', coverFileWithProxy)
            }

            // First create the brand
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brand`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || 'Failed to create brand')
            }

            // Get the created brand data
            const brandData = await response.json()
            const brandId = brandData.brand.id

            // Initialize social media record for the new brand
            const socialMediaResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/social-media/${brandId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    facebook: null,
                    twitter: null,
                    instagram: null,
                    linkedin: null,
                    tiktok: null,
                    youtube: null,
                    pinterest: null,
                    snapchat: null,
                    whatsapp: null,
                    telegram: null,
                    reddit: null
                })
            })

            if (!socialMediaResponse.ok) {
                console.error('Failed to initialize social media record')
            }

            toast.success(t('successAdd'))
            // Cleanup preview URLs
            if (logoPreview) URL.revokeObjectURL(logoPreview)
            if (coverPreview) URL.revokeObjectURL(coverPreview)
            onClose()
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <div className="bg-white rounded-3xl p-6 sidebar-scrolling custom-scrollbar">
                    <h2 className="text-xl font-semibold mb-6">Add Info</h2>
                    
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
{/* 
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
                            </div> */}

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
                                Add Brand
                            </button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default AddBrand