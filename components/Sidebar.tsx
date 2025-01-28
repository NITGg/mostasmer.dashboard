'use client'
import { usePathname } from 'next/navigation'
import React from 'react'
import { useLocale, useTranslations } from 'next-intl'
import clsx from 'clsx'
import Image from 'next/image'
import { AdsIcon, AnimateIcon, AppIcon, CategoryIcon, CouponIcon, FaqsIcon, GroupUsersIcon, HomeIcon, OnBoardingIcon, PetsIcon, ProductIcon, TruckIcon , FaqIcon, ContactusIcon, ContactIcon , DashboardIcon} from './icons'
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
                { 'stroke-black': !pathname.includes('brands') },
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
            label: t('Badges'),
            icon: <AnimateIcon className='size-6' />,
            href: '/badges',
            role: 'admin'
        },
        {
            label: t('ads'),
            icon: <AdsIcon className={clsx('size-6 fill-black', { 'fill-white': pathname.includes('ads') })} />,
            href: '/ads',
            role: 'admin'
        },
        {
            label: t('Digitalcards'),
            icon: <ProductIcon className='size-6' />,
            href: '/digitalcards',
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
            icon: <OnBoardingIcon className={clsx('size-6 fill-black', { 'fill-white s': pathname.includes('on-boarding') })} />,
            href: '/on-boarding',
            role: 'admin'
        },
        {
            label: t('faqs'),
            icon: <FaqIcon className='size-6' />,
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
        // {
        //     label: t('FAQ'),
        //     icon: <AppIcon className='size-6' />,
        //     href: '/faq',
        //     role: 'admin'
        // },
        // {
        //     label: t('chat'),
        //     icon: <ShoppingBasket className='size-6' />,
        //     href: '/chat',
        //     role: 'admin'
        // },
    ]

    const eleRef = useClickOutside(() => { setOpen(false) }, open)

    return (
        <div className='lg:w-72 flex-shrink-0'>
            <div 
                ref={eleRef} 
                className={`w-64 lg:w-72 bg-[#001529]  fixed top-0 bottom-0 overflow-hidden z-[9999]
                max-md:z-[9999] ${open ? locale == 'en' ? 'rtl' : "ar-ltr" : locale == 'en' ? "ltr" : "ar-rtl"}`}
            >
                <div className='h-auto'>
                    <div className=''>
                        <div>
                            <div className='border-b border-gray-700 flex justify-center items-center h-16' >
                                <Link href={`/`}>
                                    <Image
                                        src={'/imgs/dash_ico.svg'}
                                        className='size-18 object-justify'
                                        alt='Muntj logo dashboard'
                                        width={128}
                                        height={128}
                                        priority
                                        decoding="async" 
                                        data-nimg="1" 
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className='relative flex items-center' >
                        <div className=' ml-3 z-10 px-1  text-sm text-gray-400 mb-4'>{t('adminInteraction')}</div>
                        <div className='absolute w-full h-[1px] bg-black/10' />
                    </div>
                </div>
                <div className='flex flex-col h-72'>
                {/* <div className='flex flex-col h-[calc(100vh-200px)]'> */}
                    <div className='flex-1 overflow-y-auto sidebar-scrolling transition-all duration-500'>
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
                                            className={clsx('flex items-center gap-3 px-4 py-2 text-white hover:bg-teal-500/10 hover:text-teal-400 rounded-lg transition-colors',
                                                { 'bg-teal-500/40  text-teal-400 border-l-4 border-teal-400 rounded-full': item.href == '/' ? pathname == `/${locale}` : pathname.includes(item.href) },
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
                    
                    <div className=' mt-auto bottom-full h-[1px]'>
                        <Image
                            src={'/imgs/12.svg'}
                            className='w-full object-contain '
                            // className='w-full object-contain mt-8'
                            alt='NIT logo dashboard'
                            width={90}
                            height={90}
                            priority
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar