import React from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

import { ArrowLeftIcon } from "@heroicons/react/24/solid";

const BrandNotFound = () => {
    const router = useRouter()
    const t = useTranslations('brand')

    return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
            <div className="bg-white rounded-[32px] shadow-sm p-8 max-w-md w-full text-center">
                <div className="mb-6">
                    <svg 
                        className="w-20 h-20 mx-auto text-gray-400"
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                        />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {t('brandNotFound')}
                </h3>
                <p className="text-gray-500 mb-6">
                    {t('brandNotFoundDesc')}
                </p>
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
                >
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                    {t('goBack')}
                </button>
            </div>
        </div>
    )
}

export default BrandNotFound 