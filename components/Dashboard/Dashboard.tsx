'use client'
import React, { useState } from 'react'
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
import { Line, Bar } from 'react-chartjs-2'

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
    const [stats, setStats] = useState<DashboardCardStats>({
        totalUsers: data.user?.length || 0,
        totalBrands: data.supplier?.length || 0,
        totalOffers: data.pro?.length || 0,
        totalCoupons: data.coupon?.length || 0,
        totalCategories: data.cate?.length || 0
    })
    const [loading, setLoading] = useState(false)
    const t = useTranslations('dashboard')

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
        },
        {
            title: t('totalBrands'),
            value: stats.totalBrands,
            icon: BuildingStorefrontIcon,
            color: 'border-green-500',
            trend: -5,
        },
        {
            title: t('totalOffers'),
            value: stats.totalOffers,
            icon: TagIcon,
            color: 'border-purple-500',
            trend: 8,
        },
        {
            title: t('totalCoupons'),
            value: stats.totalCoupons,
            icon: GiftIcon,
            color: 'border-yellow-500',
            trend: 15,
        },
        {
            title: t('totalCategories'),
            value: stats.totalCategories,
            icon: ShoppingBagIcon,
            color: 'border-red-500',
            trend: 3,
        }
    ]

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-2xl font-bold mb-6">{t('dashboardTitle')}</h2>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {statCards.map((card, index) => (
                    <StatCard key={index} {...card} />
                ))}
            </div>
        </div>
    )
}

interface StatCardProps {
    title: string;
    value: number;
    icon: React.ElementType;
    color: string;
    trend: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, trend }) => {
    return (
        <div className={`p-6 rounded-lg shadow-md bg-white border-l-4 ${color}`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500 font-medium">{title}</p>
                    <h3 className="text-2xl font-bold mt-2">{value}</h3>
                    <div className={`flex items-center mt-2 ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {trend >= 0 ? (
                            <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                        ) : (
                            <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />
                        )}
                        <span className="text-sm font-medium">{Math.abs(trend)}%</span>
                    </div>
                </div>
                <div className={`p-3 rounded-full ${color.replace('border-', 'bg-').replace('/', '/20')}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </div>
    )
}

export default Dashboard
