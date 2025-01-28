import Dashboard from '@/components/Dashboard/Dashboard'
import { DashboardStats } from '@/types/dashboard'
import { cookies } from 'next/headers'
import React from 'react'


const Home = async () => {
  const token = cookies().get('token')?.value

  const fetchDashboard = async (token: string): Promise<{ 
    data: DashboardStats | null
    error: string | null 
  }> => {
    try {
      const statsRes = await fetch(`${process.env.BASE_URL}/api/dashboard`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        cache: "no-store"
      })

      if (!statsRes.ok) {
        console.error('Failed to fetch dashboard stats:', await statsRes.text())
        return { data: null, error: 'Failed to fetch dashboard stats' }
      }

      const statsData = await statsRes.json()
      
      const dashboardData: DashboardStats = {
        user: statsData.users || [],
        supplier: statsData.suppliers || [],
        cate: statsData.categories || [],
        pro: statsData.products || [],
        pet: statsData.pets || [],
        faq: statsData.faqs || [],
        coupon: statsData.coupons || [],
        ads: statsData.ads || [],
        onboarding: statsData.onboarding || [],
        orders: statsData.orders || []
      }

      return { data: dashboardData, error: null }

    } catch (error: any) {
      console.error('Dashboard fetch error:', error)
      return { data: null, error: error?.message }
    }
  }

  const { data, error } = await fetchDashboard(token as string)

  // Add null check and provide default empty data
  const dashboardData: DashboardStats = data || {
    user: [],
    supplier: [],
    cate: [],
    pro: [],
    pet: [],
    faq: [],
    coupon: [],
    ads: [],
    onboarding: [],
    orders: []
  }

  return <Dashboard data={dashboardData} />
}

export default Home