'use client'
import { usePathname } from 'next/navigation'
import React from 'react'
import { useLocale, useTranslations } from 'next-intl'
import clsx from 'clsx'
import Image from 'next/image'
import { AdsIcon, AnimateIcon, AppIcon, CategoryIcon, CouponIcon, FaqIcon, ContactIcon, DashboardIcon, GroupUsersIcon, HomeIcon, OnBoardingIcon, PetsIcon, ProductIcon, TruckIcon, BadgesIcon, GiftCardsIcon } from './icons'
import { Link } from '@/i18n/routing'
import useClickOutside from '@/hooks/useClickOutSide'
import { useAppContext } from '@/context/appContext'
import { ShoppingBasket, Users } from 'lucide-react'

const Sidebar = ({
    open,
    setOpen
}: {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const pathname = usePathname();
    const locale = useLocale()
    const t = useTranslations("nav");
    const { user } = useAppContext();
    const items = [
        {
            label: t('dashboard'),
            icon: <DashboardIcon className='size-6' />,
            href: '/',
            role: 'normal'
        },
        {
            label: t('manage_user'),
            icon: <GroupUsersIcon className='size-6' />,
            href: '/users',
            role: 'admin'
        },

        {
            label: t('brands'),
            icon: <PetsIcon className={clsx('size-6',
                { 'fill-white': pathname.includes('brands') },
                { 'stroke-white': !pathname.includes('brands') },
            )} />,
            href: '/brands',
            role: 'normal'
        },

        {
            label: t('category'),
            icon: <CategoryIcon className='size-6' />,
            href: '/category',
            role: 'admin'
        },
        {
            label: t('orders'),
            icon: <ShoppingBasket className='size-6' />,
            href: '/orders',
            role: 'supplier'
        },
        {
            label: t('userTypes'),
            icon: <Users className='size-6' />,
            href: '/user-types',
            role: 'admin'
        },
        {
            label: t('badges'),
            icon: <BadgesIcon className='size-6' />,
            href: '/badges',
            role: 'admin'
        },
        {
            label: t('ads'),
            icon: <AdsIcon className="size-6" />,
            href: '/ads',
            role: 'admin'
        },
        {
            label: t('giftCards'),
            icon: <GiftCardsIcon className='size-6' />,
            href: '/gift-cards',
            role: 'normal'
        },
        {
            label: t('aboutapp'),
            icon: <AppIcon className='size-6' />,
            href: '/about-app',
            role: 'admin'
        },

        {
            label: t('onBoarding'),
            // icon: <OnBoardingIcon className='size-6' />,
            icon: <OnBoardingIcon className={clsx('size-6 stroke-white')} />,
            href: '/on-boarding',
            role: 'admin'
        },
        {
            label: t('faqs'),
            // icon: <FaqIcon className='size-6' />,
            icon: <FaqIcon className={clsx('size-6 stroke-white')} />,

            // icon: <FaqIcon className='size-6' />,

            href: '/faqs',
            role: 'admin'
        },
        {
            label: t('coupons'),
            icon: <CouponIcon className='size-6' />,
            href: '/coupons',
            role: 'admin'
        },
        {
            label: t('contact'),

            icon: <ContactIcon className='size-6' />,
            href: '/contact',
            role: 'admin'
        },
    ]

    const eleRef = useClickOutside(() => { setOpen(false) }, open)

    return (
        <div className='lg:w-72 flex-shrink-0'>
            <div ref={eleRef} className={`w-64 lg:w-72 bg-[#001529] h-lvh max-h-lvh fixed top-0 z-[9999] flex flex-col ${open ? locale == 'en' ? 'rtl' : "ar-ltr" : locale == 'en' ? "ltr" : "ar-rtl"
                }`}>
                {/* Logo Section */}
                <div className='p-4'>
                    <Link href={`/`}>
                        <Image
                            src={'/imgs/dash_ico.svg'}
                            className='h-16 w-auto object-contain mx-auto'
                            alt='Muntj logo dashboard'
                            width={300}
                            height={300}
                            priority
                        />
                    </Link>
                </div>

                {/* Admin Label */}
                <div className='relative flex items-center px-4 py-2' >
                    <div className='text-white/60 text-sm'>{t('adminInteraction')}</div>
                </div>

                {/* Navigation Items */}
                <div
                    className={`
                        flex-1 overflow-y-auto px-2
                        custom-scrollbar sidebar-scrolling
                        [&::-webkit-scrollbar]:w-1
                        [&::-webkit-scrollbar-track]:bg-[#003e35]
                        [&::-webkit-scrollbar-track]:rounded-[2000px]
                        [&::-webkit-scrollbar-track]:border-l
                        [&::-webkit-scrollbar-track]:border-dotted
                        [&::-webkit-scrollbar-thumb]:bg-[#3dbba8f0]
                        [&::-webkit-scrollbar-thumb]:rounded-[2000px]
                        hover:[&::-webkit-scrollbar-thumb]:bg-[#59be8f]
                    `}
                >
                    {items
                        .filter(item => item.role === 'normal' || (item.role === 'admin' && user.role === 'admin') || (item.role == 'supplier' && user.role == 'supplier'))
                        .map((item, index) => (
                            <div key={index}>
                                <Link
                                    onClick={() => setOpen(false)}
                                    href={item.href}
                                    className={clsx(
                                        'flex items-center gap-3 px-4 py-3 my-1 rounded-lg transition-colors duration-200',
                                        {
                                            'bg-white text-black border-teal-400 border-2 rounded-2xl ': item.href == '/' ? pathname == `/${locale}` : pathname.includes(item.href),
                                            'text-white/80 hover:bg-white/10': !(item.href == '/' ? pathname == `/${locale}` : pathname.includes(item.href))
                                        }
                                    )}
                                >
                                    {item.icon}
                                    <span className='text-sm font-medium '>{item.label}</span>
                                </Link>
                            </div>
                        ))}
                </div>

                {/* Bottom Logo */}
                <div className='mt-auto  border-t border-white/10'>
                    <Image
                        src={'/imgs/12.svg'}
                        alt='NITG logo'
                        width={90}
                        height={90}
                        className='mx-auto opacity-50 w-full object-contain mt-auto bottom-full '
                    />
                </div>
            </div>
        </div>
    )
}

export default Sidebar