'use client'
import React, { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { 
    UsersIcon, 
    BuildingStorefrontIcon,
    TagIcon, 
    GiftIcon,
    ShoppingBagIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon
} from '@heroicons/react/24/outline'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton'
import { DashboardProps, DashboardCardStats } from '@/types/dashboard'
import axios from 'axios'
import { useAppContext } from '@/context/appContext'
import Link from 'next/link'
import { useLocale } from 'next-intl'

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
    const { token } = useAppContext()
    const [stats, setStats] = useState<DashboardCardStats>({
        totalUsers: 0,
        totalBrands: 0,
        totalOffers: 0,
        totalCoupons: 0,
        totalCategories: 0
    })
    const [loading, setLoading] = useState(true)
    const t = useTranslations('dashboard')
    const locale = useLocale()

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true)
                const baseURL = process.env.NEXT_PUBLIC_BASE_URL

                // Fetch all data in parallel
                const [
                    usersResponse,
                    brandsResponse,
                    offersResponse,
                    couponsResponse,
                    categoriesResponse
                ] = await Promise.all([
                    axios.get(`${baseURL}/api/user/`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`${baseURL}/api/brand/`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`${baseURL}/api/offers`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`${baseURL}/api/brand/coupons`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`${baseURL}/api/category`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ])

                // Update all stats at once
                setStats({
                    totalUsers: usersResponse.data.users?.length || 0,
                    totalBrands: brandsResponse.data.brands?.length || 0,
                    totalOffers: offersResponse.data.offers?.length || 0,
                    totalCoupons: couponsResponse.data.coupons?.length || 0,
                    totalCategories: categoriesResponse.data.categories?.length || 0
                })
            } catch (error) {
                console.error('Error fetching dashboard data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchAllData()
    }, [token])

    if (loading) {
        return <LoadingSkeleton />
    }

    const statCards = [
        {
            title: t('totalUsers'),
            value: stats.totalUsers,
            icon: UsersIcon,
            color: 'border-blue-500',
            trend: 12,
            href: `/${locale}/users`
        },
        {
            title: t('totalBrands'),
            value: stats.totalBrands,
            icon: BuildingStorefrontIcon,
            color: 'border-green-500',
            trend: -5,
            href: `/${locale}/brands`
        },
        {
            title: t('totalOffers'),
            value: stats.totalOffers,
            icon: TagIcon,
            color: 'border-[#2ab09c]',
            trend: 8,
            href: `/${locale}/offers`
        },
        {
            title: t('totalCoupons'),
            value: stats.totalCoupons,
            icon: GiftIcon,
            color: 'border-yellow-100',
            trend: 15,
            href: `/${locale}/coupons`
        },
        {
            title: t('totalCategories'),
            value: stats.totalCategories,
            icon: ShoppingBagIcon,
            color: 'border-red-500',
            trend: 3,
            href: `/${locale}/category`
        }
    ]

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-2xl font-bold mb-6">{t('dashboardTitle')}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {statCards.map((card, index) => (
                    <Link key={index} href={card.href} className={`p-6 rounded-lg shadow-md bg-white border-l-4 ${card.color} hover:bg-gray-50 transition-all hover:animate-bounce`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 font-medium">{card.title}</p>
                                <h3 className="text-2xl font-bold mt-2">{card.value}</h3>
                                <div className={`flex items-center mt-2 ${card.trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {card.trend >= 0 ? (
                                        <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                                    ) : (
                                        <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />
                                    )}
                                    <span className="text-sm font-medium">{Math.abs(card.trend)}%</span>
                                </div>
                            </div>
                            <div className={`p-3 rounded-full ${card.color.replace('border-', 'bg-').replace('/', '/20')}`}>
                                <card.icon className="w-6 h-6" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Dashboard
