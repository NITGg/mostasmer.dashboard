'use client'
import React, { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import InfoSection from './InfoSection'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppContext } from '@/context/appContext'
import toast from 'react-hot-toast'

interface AppData {
    about: string
    aboutar: string
    mission: string
    missionar: string
    vission: string
    vissionar: string
    privacy_policy: string
    privacy_policyar: string
    terms: string
    termsar: string
    digitalcard: string
    digitalcardar: string
}

<<<<<<< HEAD
const AppInfoDetails = () => {
=======
interface AppInfoDetailsProps {
    data: {
        about: string;
        aboutar: string;
        missionEn: string;
        missionAr: string;
        visionEn: string;
        visionAr: string;
        privacy_policy: string;
        privacyPolicyAr: string;
        terms: string;
        termsar: string;
        digitalcard: string;
        digitalcardar: string;
    };
}

const AppInfoDetails: React.FC<AppInfoDetailsProps> = ({ data }) => {
>>>>>>> fmainn
    const t = useTranslations('appInfo')
    const { token } = useAppContext()
    const [isAppInfoExpanded, setIsAppInfoExpanded] = useState(true)
    const [isEnglishExpanded, setIsEnglishExpanded] = useState(false)
    const [isArabicExpanded, setIsArabicExpanded] = useState(false)
    const [loading, setLoading] = useState(true)
    const [appData, setAppData] = useState<AppData | null>(null)
    const [editedFields, setEditedFields] = useState<Set<string>>(new Set())

    useEffect(() => {
        fetchAppInfo()
    }, [])

    const fetchAppInfo = async () => {
        try {
            setLoading(true)
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/app-data`, {
                method: 'GET',
                redirect: 'follow'
            })

            if (!response.ok) throw new Error('Failed to fetch app info')
            
            const { appData } = await response.json()
            
            if (appData && appData.length > 0) {
                setAppData({
                    about: appData[0].about || '',
                    aboutar: appData[0].aboutar || '',
                    mission: appData[0].mission || '',
                    missionar: appData[0].missionar || '',
                    vission: appData[0].vission || '',
                    vissionar: appData[0].vissionar || '',
                    privacy_policy: appData[0].privacy_policy || '',
                    privacy_policyar: appData[0].privacy_policyar || '',
                    terms: appData[0].terms || '',
                    termsar: appData[0].termsar || '',
                    digitalcard: appData[0].digitalcard || '',
                    digitalcardar: appData[0].digitalcardar || '',
                })
            }
        } catch (error) {
            console.error('Error:', error)
            toast.error('Failed to load app information')
        } finally {
            setLoading(false)
        }
    }

    const handleContentChange = (field: keyof AppData, value: string) => {
        if (!appData) return
        setAppData(prev => prev ? { ...prev, [field]: value } : null)
        setEditedFields(prev => new Set(prev).add(field))
    }

    const updateField = async (field: keyof AppData) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/app-data`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    [field]: appData?.[field] || ''
                }),
                redirect: 'follow'
            })

            if (!response.ok) throw new Error('Failed to update content')
            
            toast.success(`Updated ${field} successfully`)
            setEditedFields(prev => {
                const newSet = new Set(prev)
                newSet.delete(field)
                return newSet
            })
            fetchAppInfo()
        } catch (error) {
            console.error('Error:', error)
            toast.error(`Failed to update ${field}`)
        }
    }

    if (loading || !appData) return <div>Loading...</div>

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            {/* English Section */}
            <div className="bg-white rounded-[32px] shadow-lg overflow-hidden">
                {/* English Header */}
                <button 
                    onClick={() => setIsAppInfoExpanded(!isAppInfoExpanded)}
                    className={cn(
                        "w-full px-6 py-4 flex items-center justify-between",
                        "bg-[#02161e] transition-colors duration-200",
                    )}
                >
                    <h2 className="text-lg font-semibold text-white">
                        App info, English
                    </h2>
                    <ChevronDown 
                        className={cn(
                            // "h-5 w-5 text-teal-500 transition-transform duration-200",
                            // isAppInfoExpanded && "transform rotate-180"
                            "h-5 w-5 text-teal-500 transition-all duration-200",
                            "hover:drop-shadow-[0_0_8px_rgba(20,184,166,0.5)] hover:text-teal-400",
                            "filter hover:brightness-125",
                            isAppInfoExpanded ? "transform rotate-180" : ""
                        )}
                    />
                </button>

                {/* English Content */}
                <div className={cn(
                    "transition-all duration-200 ease-in-out",
                    isAppInfoExpanded ? "max-h-[5000px] opacity-100 p-6" : "max-h-0 opacity-0"
                )}>
                    <div className="space-y-2">
                        <InfoSection
                            title={t('aboutUsEn')}
                            content={appData?.about || ''}
                            direction="ltr"
                            onEdit={(value) => handleContentChange('about', value)}
                            onSave={() => updateField('about')}
                            isEdited={editedFields.has('about')}
                        />
                        <InfoSection
                            title={t('missionEn')}
                            content={appData?.mission || ''}
                            direction="ltr"
                            onEdit={(value) => handleContentChange('mission', value)}
                            onSave={() => updateField('mission')}
                            isEdited={editedFields.has('mission')}
                        />
                        <InfoSection
                            title={t('visionEn')}
                            content={appData?.vission || ''}
                            direction="ltr"
                            onEdit={(value) => handleContentChange('vission', value)}
                            onSave={() => updateField('vission')}
                            isEdited={editedFields.has('vission')}
                        />
                        <InfoSection
                            title={t('privacyPolicyEn')}
                            content={appData?.privacy_policy || ''}
                            direction="ltr"
                            onEdit={(value) => handleContentChange('privacy_policy', value)}
                            onSave={() => updateField('privacy_policy')}
                            isEdited={editedFields.has('privacy_policy')}
                        />
                        <InfoSection
                            title={t('termsEn')}
                            content={appData?.terms || ''}
                            direction="ltr"
                            onEdit={(value) => handleContentChange('terms', value)}
                            onSave={() => updateField('terms')}
                            isEdited={editedFields.has('terms')}
                        />
                        <InfoSection
                            title={t('digitalCardEn')}
                            content={appData?.digitalcard || ''}
                            direction="ltr"
                            onEdit={(value) => handleContentChange('digitalcard', value)}
                            onSave={() => updateField('digitalcard')}
                            isEdited={editedFields.has('digitalcard')}
                        />
                    </div>
                </div>
            </div>

            {/* Arabic Section */}
            <div className="bg-white rounded-[32px] shadow-lg overflow-hidden mt-6">
                {/* Arabic Header */}
                <button 
                    onClick={() => setIsArabicExpanded(!isArabicExpanded)}
                    className={cn(
                        "w-full px-6 py-4 flex items-center justify-between",
                        "bg-[#02161e] transition-colors duration-200",
                    )}
                >
                    <h2 className="text-lg font-semibold text-white">
                        App info, Arabic
                    </h2>
                    <ChevronDown 
                        className={cn(
                            "h-5 w-5 text-teal-500 transition-all duration-200",
                            "hover:drop-shadow-[0_0_8px_rgba(20,184,166,0.5)] hover:text-teal-400",
                            "filter hover:brightness-125",
                            isArabicExpanded ? "transform rotate-180" : ""
                        )}
                    />
                </button>

                {/* Arabic Content */}
                <div className={cn(
                    "transition-all duration-200 ease-in-out",
                    isArabicExpanded ? "max-h-[5000px] opacity-100 p-6" : "max-h-0 opacity-0"
                )}>
                    <div className="space-y-2">
                        <InfoSection
                            title={t('aboutUsAr')}
                            content={appData.aboutar}
                            direction="rtl"
                            onEdit={(value) => handleContentChange('aboutar', value)}
                            onSave={() => updateField('aboutar')}
                            isEdited={editedFields.has('aboutar')}
                        />
                        <InfoSection
                            title={t('missionAr')}
                            content={appData.missionar}
                            direction="rtl"
                            onEdit={(value) => handleContentChange('missionar', value)}
                            onSave={() => updateField('missionar')}
                            isEdited={editedFields.has('missionar')}
                        />
                        <InfoSection
                            title={t('visionAr')}
                            content={appData.privacy_policyar}
                            direction="rtl"
                            onEdit={(value) => handleContentChange('vissionar', value)}
                            onSave={() => updateField('vissionar')}
                            isEdited={editedFields.has('vissionar')}
                        />
                        {appData.vissionar && (
                            <InfoSection
                                title={t('visionAr')}
                                content={appData.vissionar}
                                direction="rtl"
                                onEdit={(value) => handleContentChange('vissionar', value)}
                                onSave={() => updateField('vissionar')}
                                isEdited={editedFields.has('vissionar')}
                            />
                        )}
                        <InfoSection
                            title={t('privacyPolicyAr')}
                            content={appData.privacy_policyar}
                            direction="rtl"
                            onEdit={(value) => handleContentChange('privacy_policyar', value)}
                            onSave={() => updateField('privacy_policyar')}
                            isEdited={editedFields.has('privacy_policyar')}
                        />
                        <InfoSection
                            title={t('termsAr')}
                            content={appData.termsar}
                            direction="rtl"
                            onEdit={(value) => handleContentChange('termsar', value)}
                            onSave={() => updateField('termsar')}
                            isEdited={editedFields.has('termsar')}
                        />
                        <InfoSection
                            title={t('digitalCardAr')}
                            content={appData.digitalcardar}
                            direction="rtl"
                            onEdit={(value) => handleContentChange('digitalcardar', value)}
                            onSave={() => updateField('digitalcardar')}
                            isEdited={editedFields.has('digitalcardar')}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AppInfoDetails 