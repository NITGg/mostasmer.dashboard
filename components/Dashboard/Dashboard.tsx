'use client'
import React, { useEffect, useState } from 'react'
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
import { useAppContext } from '@/context/appContext'
import LoadingSkeleton from '../ui/LoadingSkeleton'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
// import { Line, Bar } from 'react-chartjs-2'

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
)

interface DashboardStats {
    totalUsers: number
    totalBrands: number
    totalOffers: number
    totalCoupons: number
    totalCategories: number
    recentActivity?: {
        users: number[]
        offers: number[]
        dates: string[]
    }
    topCategories?: {
        names: string[]
        counts: number[]
    }
}

const Dashboard = () => {
    const [stats, setStats] = useState<DashboardStats>({
        totalUsers: 0,
        totalBrands: 0,
        totalOffers: 0,
        totalCoupons: 0,
        totalCategories: 0
    })
    const [loading, setLoading] = useState(true)
    const { token } = useAppContext()
    const t = useTranslations('dashboard')

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/dashboard/stats', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                const data = await response.json()
                setStats(data)
            } catch (error) {
                console.error('Error fetching dashboard stats:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
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
            trend: 12, // Example trend percentage
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

    const activityData = {
        labels: stats.recentActivity?.dates || [],
        datasets: [
            {
                label: 'Users',
                data: stats.recentActivity?.users || [],
                borderColor: 'rgb(59, 130, 246)',
                tension: 0.4,
            },
            {
                label: 'Offers',
                data: stats.recentActivity?.offers || [],
                borderColor: 'rgb(147, 51, 234)',
                tension: 0.4,
            }
        ]
    }

    const categoryData = {
        labels: stats.topCategories?.names || [],
        datasets: [{
            label: 'Popular Categories',
            data: stats.topCategories?.counts || [],
            backgroundColor: [
                'rgba(59, 130, 246, 0.5)',
                'rgba(147, 51, 234, 0.5)',
                'rgba(234, 179, 8, 0.5)',
                'rgba(239, 68, 68, 0.5)',
                'rgba(34, 197, 94, 0.5)',
            ],
        }]
    }

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-2xl font-bold mb-6">{t('dashboardTitle')}</h2>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {statCards.map((card, index) => (
                    <StatCard key={index} {...card} />
                ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">{t('recentActivity')}</h3>
                    <Line data={activityData} options={{
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top' as const,
                            }
                        }
                    }} />
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">{t('popularCategories')}</h3>
                    <Bar data={categoryData} options={{
                        responsive: true,
                        plugins: {
                            legend: {
                                display: false
                            }
                        }
                    }} />
                </div>
            </div>
        </div>
    )
}

const StatCard = ({ title, value, icon: Icon, color, trend }: {
    title: string
    value: number
    icon: any
    color: string
    trend: number
}) => {
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
