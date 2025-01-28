'use client'
import { usePathname } from 'next/navigation'
import React from 'react'
import { useLocale, useTranslations } from 'next-intl'
import clsx from 'clsx'
import Image from 'next/image'
import { AdsIcon, AnimateIcon, AppIcon, CategoryIcon, CouponIcon, FaqsIcon, GroupUsersIcon, HomeIcon, OnBoardingIcon, PetsIcon, ProductIcon, TruckIcon } from './icons'
import { Link } from '@/i18n/routing'
import useClickOutside from '@/hooks/useClickOutSide'
import { useAppContext } from '@/context/appContext'
import { ShoppingBasket } from 'lucide-react'

const Sidebar = ({
    open,
    setOpen
}
    : {
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
            icon: <HomeIcon className='size-6' />,
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
            label: t('managesupplier'),
            icon: <TruckIcon className='size-6' />,
            href: '/suppliers',
            role: 'admin'
        },
        {
            label: t('category'),
            icon: <CategoryIcon className='size-6' />,
            href: '/category',
            role: 'admin'
        },
        {
            label: t('species'),
            icon: <AnimateIcon className='size-6' />,
            href: '/species',
            role: 'admin'
        },
        {
            label: t('products'),
            icon: <ProductIcon className='size-6' />,
            href: '/products',
            role: 'normal'
        },
        {
            label: t('pets'),
            icon: <PetsIcon className={clsx('size-6',
                { 'fill-white': pathname.includes('pets') },
                { 'stroke-black': !pathname.includes('pets') },
            )} />,
            href: '/pets',
            role: 'normal'
        },
        {
            label: t('ads'),
            icon: <AdsIcon className={clsx('size-6 fill-black', { 'fill-white': pathname.includes('ads') })} />,
            href: '/ads',
            role: 'admin'
        },
        {
            label: t('onBoarding'),
            icon: <OnBoardingIcon className={clsx('size-6 fill-black', { 'fill-white s': pathname.includes('on-boarding') })} />,
            href: '/on-boarding',
            role: 'admin'
        },
        {
            label: t('coupons'),
            icon: <CouponIcon className='size-6' />,
            href: '/coupons',
            role: 'admin'
        },
        {
            label: t('faqs'),
            icon: <FaqsIcon className='size-6' />,
            href: '/faqs',
            role: 'admin'
        },
        {
            label: t('aboutapp'),
            icon: <AppIcon className='size-6' />,
            href: '/about-app',
            role: 'admin'
        },
        {
            label: t('orders'),
            icon: <ShoppingBasket className='size-6' />,
            href: '/orders',
            role: 'supplier'
        },
    ]

    const eleRef = useClickOutside(() => { setOpen(false) }, open)

    return (
        <div className='lg:w-72'>
            <div ref={eleRef} className={`w-64 lg:w-72 bg-white border-r-2  h-lvh max-h-lvh  fixed top-0 max-md:z-50 ${open ? locale == 'en' ? 'rtl' : "ar-ltr" : locale == 'en' ? "ltr" : "ar-rtl"}`}>
                <div className='h-60'>
                    <div className=''>
                        <div>
                            <div className='flex justify-center pt-5 pb-5' >
                                <Link href={`/`}>
                                    <Image
                                        src={'/imgs/logo.png'}
                                        className='size-44 object-contain'
                                        alt='Muntj logo dashboard'
                                        width={300}
                                        height={300}
                                        priority
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className='relative flex items-center' >
                        <div className='bg-white ml-3 z-10 px-1 text-black/40 text-sm'>{t('adminInteraction')}</div>
                        <div className='absolute w-full h-[1px] bg-black/10' />
                    </div>
                </div>
                <div className='pt-2 h-[calc(100vh-16rem)] overflow-auto sidebar-scrolling transition-all duration-500'>
                    {items
                        .filter(item => item.role === 'normal' || (item.role === 'admin' && user.role === 'admin') || (item.role == 'supplier' && user.role == 'supplier'))
                        .map((item, index) => {
                            return (
                                <div
                                    className={clsx(
                                        { 'pr-2': locale == 'en' },
                                        { 'pl-2': locale == 'ar' },
                                    )}
                                    key={index}
                                >
                                    <Link
                                        onClick={() => setOpen(false)}
                                        href={item.href}
                                        className={clsx('flex justify-between items-center text-sm w-full py-2 duration-200',
                                            { 'bg-primary text-white': item.href == '/' ? pathname == `/${locale}` : pathname.includes(item.href) },
                                            { 'pl-5 pr-2  rounded-r-full': locale == 'en' },
                                            { 'pr-5 pl-2  rounded-l-full': locale == 'ar' },
                                        )}
                                    >
                                        <div className='flex items-center gap-3'>
                                            <div>{item.icon}</div>
                                            <span className='text-lg'>{item.label}</span>
                                        </div>
                                    </Link>
                                </div>
                            )
                        })}
                </div>
            </div>
        </div>
    )
}

export default Sidebar