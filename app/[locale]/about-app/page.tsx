'use client'
import AppInfoDetails from "@/components/app-info/AppInfoDetails";
import ContactDetails from "@/components/app-info/ContactDetails";
import React, { useEffect, useState } from 'react'

const AboutAppPage = () => {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    const fetchData = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/app-data`)
            const result = await response.json()
            setData(result)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    if (loading || !data) return <div>Loading...</div>

    const appInfo = {
        about: data.about,
        aboutar: data.aboutar,
        missionEn: data.missionEn,
        missionAr: data.missionAr,
        visionEn: data.visionEn,
        visionAr: data.visionAr,
        privacy_policy: data.privacy_policy,
        privacyPolicyAr: data.privacyPolicyAr,
        terms: data.terms,
        termsar: data.termsar,
        digitalcard: data.digitalcard,
        digitalcardar: data.digitalcardar,
    };

    const contactInfo = {
        email: data.email || '',
        phone: data.phone || '',
        brandUrl: data.url || '',
        location: data.address || '',
        facebook: data.facebook,
        socialMedia: {
            facebook1: data.facebook,
            twitter: data.twitter,
            instagram: data.instagram,
            linkedin: data.linkedin,
            youtube: data.youtube,
            tiktok: data.tiktok,
            whatsapp: data.whatsapp,
            telegram: data.telegram,
            snapchat: data.snapchat,
            pinterest: data.pinterest,
            reddit: data.reddit,
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 py-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
                <AppInfoDetails data={appInfo} />
                <ContactDetails contactData={contactInfo} onUpdate={fetchData} />
            </div>
        </main>
    );
}

export default AboutAppPage