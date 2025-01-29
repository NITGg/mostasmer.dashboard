'use client'
import React, { useEffect, useRef, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useAppContext } from '@/context/appContext'
import ImageApi from '../ImageApi'
import toast from 'react-hot-toast'
import { EditIcon, LoadingIcon, PhotoIcon } from '../icons'
import { Textarea } from '../ui/textarea'
import BrandNotFound from './BrandNotFound'
import { Switch } from '../ui/switch'
import { Input } from '../ui/input'
import BrandDetailsSkeleton from './BrandDetailsSkeleton'

import {
    FaFacebook,
    FaTwitter,
    FaInstagram,
    FaLinkedin,
    FaTiktok,
    FaYoutube,
    FaPinterest,
    FaSnapchat,
    FaWhatsapp,
    FaTelegram,
    FaReddit
} from 'react-icons/fa';
import ExclusiveOffers from './offers/ExclusiveOffers'
import BrandOffers from './offers/BrandOffers'
import SpecialOffers from './offers/SpecialOffers'
import DigitalSeals from './offers/DigitalSeals'
import CustomOffers from './offers/CustomOffers'
import HotDeals from './offers/HotDeals'
import BrandRepresentative from './offers/BrandRepresentative'

interface Brand {
    id: number
    name: string
    phone: string
    email: string
    url: string
    logo: string
    cover: string
    about: string
    pointBackTerms: string
    address: string
    validFrom: string
    validTo: string
    ratio: number
    pointBackRatio: number
}
type SocialMediaPlatform = 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'tiktok' | 
    'youtube' | 'pinterest' | 'snapchat' | 'whatsapp' | 'telegram' | 'reddit';

    
interface SocialMedia {
    id: number;
    brandId: number;
    facebook: string | null;
    twitter: string | null;
    instagram: string | null;
    linkedin: string | null;
    tiktok: string | null;
    youtube: string | null;
    pinterest: string | null;
    snapchat: string | null;
    whatsapp: string | null;
    telegram: string | null;
    reddit: string | null;
}


const BrandDetails = ({ brandId }: { brandId: string }) => {
    const [brand, setBrand] = useState<Brand | null>(null)
    const [loading, setLoading] = useState(true)
    const [savingAbout, setSavingAbout] = useState(false)
    const [savingTerms, setSavingTerms] = useState(false)
    const [savingLogo, setSavingLogo] = useState(false)
    const [savingCover, setSavingCover] = useState(false)
    const [isAboutEdited, setIsAboutEdited] = useState(false)
    const [isTermsEdited, setIsTermsEdited] = useState(false)
    const [about, setAbout] = useState('')
    const [pointBackTerms, setPointBackTerms] = useState('')
    const logoInputRef = useRef<HTMLInputElement>(null)
    const coverInputRef = useRef<HTMLInputElement>(null)
    const { token } = useAppContext()
    const t = useTranslations('brand')
    const [activeTab, setActiveTab] = useState('brand')
    const [socialMedia, setSocialMedia] = useState<SocialMedia | null>(null);
    const [editedFields, setEditedFields] = useState<Set<string>>(new Set());
    const [editedBrandFields, setEditedBrandFields] = useState<Set<string>>(new Set());
    const [brandForm, setBrandForm] = useState({
        url: '',
        phone: '',
        email: '',
        address: ''
    });

    const tabs = [
        { id: 'brand', label: 'Brand Offers' },
        { id: 'special', label: 'Special Offers' },
        { id: 'exclusive', label: 'Exclusive Offers' },
        { id: 'digital', label: 'Digital Seals' },
        { id: 'custom', label: 'Custom Offers' },
        { id: 'hot', label: 'Hot Deals' },
        { id: 'representative', label: 'Brand Representative' }
    ]

    const socialIcons = {
        facebook: FaFacebook,
        twitter: FaTwitter,
        instagram: FaInstagram,
        linkedin: FaLinkedin,
        tiktok: FaTiktok,
        youtube: FaYoutube,
        pinterest: FaPinterest,
        snapchat: FaSnapchat,
        whatsapp: FaWhatsapp,
        telegram: FaTelegram,
        reddit: FaReddit
    };

    useEffect(() => {
        fetchBrandDetails()
    }, [brandId])

    useEffect(() => {
        if (brand) {
            setAbout(brand.about)
            setPointBackTerms(brand.pointBackTerms)
        }
    }, [brand])

    useEffect(() => {
        fetchSocialMedia();
    }, [brandId]);

    useEffect(() => {
        if (brand) {
            setBrandForm({
                url: brand.url || '',
                phone: brand.phone || '',
                email: brand.email || '',
                address: brand.address || ''
            });
        }
    }, [brand]);

    const fetchBrandDetails = async () => {
        try {
            setLoading(true)
            const headers = new Headers()
            headers.append('Authorization', `Bearer ${token}`)

            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/${brandId}`, {
                method: 'GET',
                headers,
            })

            if (!response.ok) throw new Error('Failed to fetch brand details')

            const data = await response.json()
            setBrand(data.brand)
        } catch (error) {
            console.error('Error:', error)
            toast.error('Failed to load brand details')
        } finally {
            setLoading(false)
        }
    }

    const handleImageUpdate = async (type: 'logo' | 'cover', file: File) => {
        const setSaving = type === 'logo' ? setSavingLogo : setSavingCover
        try {
            setSaving(true)
            const formData = new FormData()

            const fileWithProxy = new File([file], '[PROXY]', {
                type: file.type
            })
            formData.append(type, fileWithProxy)

            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/${brandId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            })

            if (!response.ok) throw new Error('Failed to update image')

            toast.success(t('successUpdate'))
            fetchBrandDetails()
        } catch (error) {
            console.error('Error:', error)
            toast.error('Failed to update image')
        } finally {
            setSaving(false)
        }
    }

    const handleAboutUpdate = async () => {
        try {
            setSavingAbout(true);
            const formData = new FormData();
            formData.append('about', about);

            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/${brandId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) throw new Error('Failed to update about section');

            // Update local state instead of fetching
            setBrand(prevBrand => prevBrand ? {
                ...prevBrand,
                about: about
            } : null);

            setIsAboutEdited(false);
            toast.success(t('successUpdate'));
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to update about section');
            // Revert changes on error
            setAbout(brand?.about || '');
        } finally {
            setSavingAbout(false);
        }
    };

    const handleTermsUpdate = async () => {
        try {
            setSavingTerms(true);
            const formData = new FormData();
            formData.append('pointBackTerms', pointBackTerms);

            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/${brandId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) throw new Error('Failed to update terms');

            // Update local state instead of fetching
            setBrand(prevBrand => prevBrand ? {
                ...prevBrand,
                pointBackTerms: pointBackTerms
            } : null);

            setIsTermsEdited(false);
            toast.success(t('successUpdate'));
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to update terms');
            // Revert changes on error
            setPointBackTerms(brand?.pointBackTerms || '');
        } finally {
            setSavingTerms(false);
        }
    };

    const fetchSocialMedia = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/social-media/${brandId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                redirect: 'follow'
            });

            if (!response.ok) throw new Error('Failed to fetch social media');
            const data = await response.json();
            setSocialMedia(data.socialMedia);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to load social media data');
        }
    };

    const handleSocialMediaChange = (platform: keyof SocialMedia, value: string) => {
        if (!socialMedia) return;

        setSocialMedia(prev => prev ? { ...prev, [platform]: value } : null);
        setEditedFields(prev => new Set(prev).add(platform));
    };

    const updateSocialMedia = async (platform: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/social-media/${brandId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    [platform]: socialMedia?.[platform as keyof SocialMedia] || null
                })
            });

            if (!response.ok) throw new Error('Failed to update social media');

            toast.success(`Updated ${platform} successfully`);
            setEditedFields(prev => {
                const newSet = new Set(prev);
                newSet.delete(platform);
                return newSet;
            });
        } catch (error) {
            console.error('Error:', error);
            toast.error(`Failed to update ${platform}: make sure it is a valid url`);
        }
    };

    const updateAllSocialMedia = async () => {
        try {
            const updates = Array.from(editedFields).map(platform => ({
                [platform]: socialMedia?.[platform as keyof SocialMedia] || null
            }));

            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/social-media/${brandId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(Object.assign({}, ...updates))
            });

            if (!response.ok) throw new Error('Failed to update social media');

            toast.success('All social media updated successfully');
            setEditedFields(new Set());
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to update social media');
        }
    };

    const handleBrandFieldChange = (field: string, value: string) => {
        setBrandForm(prev => ({ ...prev, [field]: value }));
        setEditedBrandFields(prev => new Set(prev).add(field));
    };

    const updateBrandField = async () => {
        try {
            const formData = new FormData();

            // Only append fields that have been edited
            if (editedBrandFields.has('address')) {
                formData.append('address', brandForm.address);
            }
            if (editedBrandFields.has('url')) {
                formData.append('url', brandForm.url);
            }
            if (editedBrandFields.has('phone')) {
                formData.append('phone', brandForm.phone);
            }
            if (editedBrandFields.has('email')) {
                formData.append('email', brandForm.email);
            }
            // Include ratio and pointBackRatio if they exist in the current brand
            if (brand?.ratio) {
                formData.append('ratio', brand.ratio.toString());
            }
            if (brand?.pointBackRatio) {
                formData.append('pointBackRatio', brand.pointBackRatio.toString());
            }

            const headers = new Headers();
            headers.append('Authorization', `Bearer ${token}`);
            // Note: Don't set Content-Type header when using FormData

            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/${brandId}`, {
                method: 'PUT',
                headers,
                body: formData,
                redirect: 'follow'
            });

            if (!response.ok) throw new Error('Failed to update brand information');

            const data = await response.json();
            setBrand(prev => prev ? { ...prev, ...data.brand } : null);
            setEditedBrandFields(new Set());
            toast.success('Brand information updated successfully');
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to update brand information');
        }
    };

    if (loading) {
        return <BrandDetailsSkeleton />
    }
    if (!brand) return <BrandNotFound />

    return (
        <div className="p-4 md:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-4 md:space-y-6">
                    <div className="bg-white rounded-xl p-4 shadow-xl">
                        <div className="relative mb-8">
                            <ImageApi
                                src={brand?.cover}
                                alt={brand?.name}
                                className="w-full h-[160px] object-cover rounded-lg"
                                width={600}
                                height={160}
                            />
                            <button
                                onClick={() => coverInputRef.current?.click()}
                                className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity"
                            >
                                {savingCover ? (
                                    <LoadingIcon className="w-8 h-8 text-white animate-spin" />
                                ) : (
                                    <PhotoIcon className="w-8 h-8 text-white" />
                                )}
                            </button>
                            <input
                                type="file"
                                ref={coverInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) handleImageUpdate('cover', file)
                                }}
                            />

                            <div className="absolute -bottom-6 left-4">
                                <div className="w-[80px] h-[80px] bg-white p-1 rounded-lg relative">
                                    <ImageApi
                                        src={brand?.logo}
                                        alt={brand?.name}
                                        className="w-full h-full object-cover rounded-lg o"
                                        width={80}
                                        height={80}
                                    />
                                    <button
                                        onClick={() => logoInputRef.current?.click()}
                                        className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg"
                                    >
                                        {savingLogo ? (
                                            <LoadingIcon className="w-6 h-6 text-white animate-spin" />
                                        ) : (
                                            <PhotoIcon className="w-6 h-6 text-white" />
                                        )}
                                    </button>
                                    <input
                                        type="file"
                                        ref={logoInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0]
                                            if (file) handleImageUpdate('logo', file)
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-xl">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="font-medium">About</h2>
                            <div className="flex gap-2">
                                {isAboutEdited && (
                                    <button
                                        onClick={() => {
                                            setAbout(brand?.about || '');
                                            setIsAboutEdited(false);
                                        }}
                                        className="px-4 py-1 rounded-md text-sm bg-gray-200 hover:bg-gray-300 text-gray-700"
                                    >
                                        {(t('cancel_delete_brand'))}
                                    </button>
                                )}
                                <button
                                    onClick={handleAboutUpdate}
                                    disabled={!isAboutEdited || savingAbout}
                                    className={`px-4 py-1 rounded-md text-sm transition-colors ${isAboutEdited
                                            ? 'bg-teal-500 text-white hover:bg-teal-600'
                                            : 'bg-gray-200 text-gray-500'
                                        }`}
                                >
                                    {savingAbout ? (
                                        <LoadingIcon className="w-5 h-5 animate-spin" />
                                    ) : (t('saveBrandData'))}
                                </button>
                            </div>
                        </div>
                        <Textarea
                            value={about}
                            onChange={(e) => {
                                setAbout(e.target.value)
                                setIsAboutEdited(true)
                            }}
                            className="min-h-[100px] resize-none border rounded-md"
                        />
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-xl">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="font-medium">{(t('pointsBackTerms'))}</h2>
                            <div className="flex gap-2">
                                {isTermsEdited && (
                                    <button
                                        onClick={() => {
                                            setPointBackTerms(brand?.pointBackTerms || '');
                                            setIsTermsEdited(false);
                                        }}
                                        className="px-4 py-1 rounded-md text-sm bg-gray-200 hover:bg-gray-300 text-gray-700"
                                    >
                                        {(t('cancel_delete_brand'))}
                                    </button>
                                )}
                                <button
                                    onClick={handleTermsUpdate}
                                    disabled={!isTermsEdited || savingTerms}
                                    className={`px-4 py-1 rounded-md text-sm transition-colors ${isTermsEdited
                                            ? 'bg-teal-500 text-white hover:bg-teal-600'
                                            : 'bg-gray-200 text-gray-500'
                                        }`}
                                >
                                    {savingTerms ? (
                                        <LoadingIcon className="w-5 h-5 animate-spin" />
                                    ) : (t('saveBrandData'))}
                                </button>
                            </div>
                        </div>
                        <Textarea
                            value={pointBackTerms}
                            onChange={(e) => {
                                setPointBackTerms(e.target.value)
                                setIsTermsEdited(true)
                            }}
                            className="min-h-[100px] resize-none border rounded-md"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-[32px] shadow-2xl p-4 md:p-7">
                    <div className="flex gap-5 justify-between items-start">
                        <div className="flex flex-col">
                            <div className="flex gap-1 text-lg">
                                <div className="font-bold text-slate-950">Valid from</div>
                                <div className="text-neutral-400">
                                    {new Date(brand?.validFrom || '').toLocaleDateString()}
                                </div>
                            </div>
                            <div className="mt-5 text-sm font-bold text-slate-950">
                                {(t('appPercentage'))}

                            </div>
                        </div>
                        <div className="flex flex-col mt-2.5">
                            <Switch className="w-[34px] h-[18px]" />
                            <div className="px-6 py-1.5 mt-4 text-base font-bold rounded-3xl shadow-3xl bg-slate-200 text-slate-950">
                                {brand?.ratio}%
                            </div>
                        </div>
                    </div>

                    <form className="mt-5 space-y-2">
                        <div className="flex gap-4 items-center">
                            <label className="w-24 text-xs text-slate-950">{(t('brandUrl'))} :</label>
                            <input
                                type="url"
                                value={brandForm.url}
                                onChange={(e) => handleBrandFieldChange('url', e.target.value)}
                                className="flex-1 px-3.5 py-1 text-xs bg-white rounded-xl border border-zinc-300 text-neutral-400"
                            />
                        </div>

                        <div className="flex gap-4 items-center">
                            <label className="w-24 text-xs text-slate-950">{(t('phone'))} :</label>
                            <input
                                type="tel"
                                value={brandForm.phone}
                                onChange={(e) => handleBrandFieldChange('phone', e.target.value)}
                                className="flex-1 px-3.5 py-1 text-xs bg-white rounded-xl border border-zinc-300 text-neutral-400"
                            />
                        </div>

                        <div className="flex gap-4 items-center">
                            <label className="w-24 text-xs text-slate-950">{(t('email'))} :</label>
                            <input
                                type="email"
                                value={brandForm.email}
                                onChange={(e) => handleBrandFieldChange('email', e.target.value)}
                                className="flex-1 px-3.5 py-1 text-xs bg-white rounded-xl border border-zinc-300 text-neutral-400"
                            />
                        </div>

                        <div className="flex gap-4 items-center">
                            <label className="w-24 text-xs text-slate-950">{(t('location'))} :</label>
                            <input
                                type="text"
                                value={brandForm.address}
                                onChange={(e) => handleBrandFieldChange('address', e.target.value)}
                                className="flex-1 px-3.5 py-1 text-xs bg-white rounded-xl border border-zinc-300 text-neutral-400"
                            />
                        </div>

                        {editedBrandFields.size > 0 && (
                            <div className="flex justify-end gap-2 mt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setBrandForm({
                                            url: brand?.url || '',
                                            phone: brand?.phone || '',
                                            email: brand?.email || '',
                                            address: brand?.address || ''
                                        });
                                        setEditedBrandFields(new Set());
                                    }}
                                    className="px-4 py-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={updateBrandField}
                                    className="px-4 py-1 text-xs bg-teal-500 text-white rounded-lg hover:bg-teal-600"
                                >
                                    {(t('saveAllChanges'))}
                                </button>
                            </div>
                        )}
                    </form>

                    <div className="mt-4">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-sm font-bold text-slate-950">
                                {(t('socialMediaAccount'))}
                            </h3>
                            {editedFields.size > 0 && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            fetchSocialMedia();
                                            setEditedFields(new Set());
                                        }}
                                        className="px-4 py-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
                                    >
                                        {(t('cancel_delete_brand'))}
                                    </button>
                                    <button
                                        onClick={updateAllSocialMedia}
                                        className="px-4 py-1 text-xs bg-teal-500 text-white rounded-lg hover:bg-teal-600"
                                    >
                                        {(t('saveAllChanges'))}
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="space-y-2">
                            {socialMedia && (Object.entries(socialIcons) as [SocialMediaPlatform, React.ComponentType<{ className?: string }>][]).map(([platform, Icon]) => (
                                <div key={platform} className="flex items-center gap-2">
                                    <Icon className="w-5 h-5 min-w-[20px] text-gray-500" />
                                    <div className="flex-1 min-w-0">
                                        <input
                                            type="url"
                                            placeholder={`${t('enter')} ${platform} ${t('url')}`}
                                            value={socialMedia[platform] || ''}
                                            onChange={(e) => handleSocialMediaChange(platform, e.target.value)}
                                            className="w-full px-3 py-1 text-xs bg-white rounded-xl border border-zinc-300 text-neutral-400"
                                        />
                                    </div>
                                    {editedFields.has(platform) && (
                                        <div className="flex gap-1 ml-1">
                                            <button
                                                onClick={() => {
                                                    handleSocialMediaChange(platform, socialMedia[platform] || '');
                                                    setEditedFields(prev => {
                                                        const newSet = new Set(prev);
                                                        newSet.delete(platform);
                                                        return newSet;
                                                    });
                                                }}
                                                className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
                                            >
                                                {t('cancel')}
                                            </button>
                                            <button
                                                onClick={() => updateSocialMedia(platform)}
                                                className="px-2 py-1 text-xs bg-teal-500 text-white rounded-lg hover:bg-teal-600"
                                            >
                                                {t('save')}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <div className="bg-white text-[#59be8f] rounded-xl shadow-2xl">
                    <div className="flex flex-wrap gap-2 py-2 px-4">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                                    activeTab === tab.id
                                        ? 'bg-[#02161e] text-white'
                                        : 'text-[#2ab09c] hover:bg-slate-100'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-4">
                    {activeTab === 'brand' && <BrandOffers brandId={brandId} />}
                    {activeTab === 'special' && <SpecialOffers brandId={brandId} />}
                    {activeTab === 'exclusive' && <ExclusiveOffers brandId={brandId} />}
                    {activeTab === 'digital' && <DigitalSeals brandId={brandId} />}
                    {activeTab === 'custom' && <CustomOffers brandId={brandId} />}
                    {activeTab === 'hot' && <HotDeals brandId={brandId} />}
                    {activeTab === 'representative' && <BrandRepresentative brandId={brandId} />}
                </div>
            </div>
        </div>
    )
}

export default BrandDetails