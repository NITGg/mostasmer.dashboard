import axios from 'axios';
import { SettingsDetails } from "@/components/settings/SettingsDetails";
import { cookies } from "next/headers";

export default async function SettingsPage() {
  const token = cookies().get("token")?.value;

  // Fetch settings data
  const settingsData = await fetchSettings(token);
  const classificationPolicy = await fetchClassificationPolicy(token);

  // Transform API data to match component structure
  const formattedData = {
    numberOfBrandsOnHomepage1: settingsData.numberOfBrandsOnHomepage1,
    numberOfCategoriesOnHomepage1: settingsData.numberOfCategoriesOnHomepage1,
    loginAttemptDurationMinutes: settingsData.loginAttemptDurationMinutes,
    loginAttempts1: settingsData.loginAttempts1,
    latestOffers: settingsData.numberOfLatestOffersOnHomepage1,
    bestSellingBrands: settingsData.numberOfSellingBrandsOnHomepage,
    newArrivals: settingsData.numberOfNewArrivalsOnHomepage1,
    basicInfo: {
      vatPercentage: `${settingsData.vat1}%`,
      applicationPoints: {
        current: settingsData.pointBackRatio1.toString(),
        total: settingsData.srRatio1.toString()
      }
    },
    displaySettings: {
      latestOffers: settingsData.numberOfLatestOffersOnHomepage1,
      bestSellingBrands: settingsData.numberOfSellingBrandsOnHomepage,
      newArrivals: settingsData.numberOfNewArrivalsOnHomepage1
    },
    classificationPolicy: classificationPolicy
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SettingsDetails settings={formattedData} />
      </div>
    </main>
  );
}

async function fetchSettings(token: string | undefined) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/app-settings`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.settings;
  } catch (error) {
    console.error('Error fetching settings:', error);
    return {
      vat1: 0,
      pointBackRatio1: 0,
      srRatio1: 0,
      numberOfLatestOffersOnHomepage1: 0,
      numberOfSellingBrandsOnHomepage: 0,
      numberOfNewArrivalsOnHomepage1: 0
    };
  }
}

async function fetchClassificationPolicy(token: string | undefined) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/user-classes`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching classification policy:', error);
    return [];
  }
}