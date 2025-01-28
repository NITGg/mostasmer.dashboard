import Dashboard from '@/components/Dashboard/Dashboard';
import { cookies } from 'next/headers';
import React from 'react'

const Home = async () => {
  const token = cookies().get('token')?.value;
  const fetchDashboard = async (token: string) => {
    try {
      // First, get the dashboard stats
      const statsRes = await fetch(`${process.env.BASE_URL}/api/dashboard`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        cache: "no-store"
      });

      if (!statsRes.ok) {
        console.error('Failed to fetch dashboard stats:', await statsRes.text());
        return { data: {}, error: 'Failed to fetch dashboard stats' };
      }

      const statsData = await statsRes.json();
      
      // Return the stats data directly
      return { 
        data: {
          user: statsData.users,
          supplier: statsData.suppliers,
          cate: statsData.categories,
          pro: statsData.products,
          pet: statsData.pets,
          faq: statsData.faqs,
          coupon: statsData.coupons,
          ads: statsData.ads,
          onboarding: statsData.onboarding,
          orders: statsData.orders
        }, 
        error: null 
      };

    } catch (error: any) {
      console.error('Dashboard fetch error:', error);
      return { data: {}, error: error?.message };
    }
  }

  const { data, error } = await fetchDashboard(token as string);

  return (
    
    <Dashboard data={data} />
  );
}

export default Home;