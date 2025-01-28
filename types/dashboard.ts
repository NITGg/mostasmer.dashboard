export interface DashboardStats {
    user: any[];
    supplier: any[];
    cate: any[];
    pro: any[];
    pet: any[];
    faq: any[];
    coupon: any[];
    ads: any[];
    onboarding: any[];
    orders: any[];
  }
  
  export interface DashboardCardStats {
    totalUsers: number;
    totalBrands: number;
    totalOffers: number;
    totalCoupons: number;
    totalCategories: number;
    recentActivity?: {
      users: number[];
      offers: number[];
      dates: string[];
    };
    topCategories?: {
      names: string[];
      counts: number[];
    };
  }
  
  export interface DashboardProps {
    data: DashboardStats;
  } 