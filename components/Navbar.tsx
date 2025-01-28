import React, { useState } from 'react'
import { LogoutIcon, MenuIcon } from './icons';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import clsx from 'clsx';
import useClickOutside from '../hooks/useClickOutSide';
import { deleteCookie } from '@/lib/deleteCookie';
import { useAppContext } from '@/context/appContext';

const Navbar = ({ setOpen }: {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const { user } = useAppContext()
    const [openAvatar, setOpenAvater] = useState(false)
    const pathname = usePathname();
    const locale = useLocale();
    const { push } = useRouter()

    const getNewPathname = (newLocale: string) => {
        let newPathname = pathname.replace(/^\/(en|ar)/, '');
        return `/${newLocale}${newPathname}`;
    };
    const eleRef = useClickOutside(() => setOpenAvater(false), openAvatar)
    const logout = async () => {
        deleteCookie('token')
        push('/')
        setTimeout(() => window.location.reload(), 500)
    }

    const t = useTranslations('navbar')

    return (
        <nav className='p-container flex justify-between lg:justify-end py-5 items-center'>
            {/* <button onClick={() => { setOpen(o => !o) }} className='lg:hidden'>
                <MenuIcon className='size-8' />
            </button> */}
            <div ref={eleRef} className='relative'>
                <button onClick={() => { setOpenAvater(!openAvatar) }}>
                    <Image
                        src={'/imgs/avatar.png'}
                        alt="Avatar"
                        height={50}
                        width={50}
                        className='size-11 rounded-full'
                    />
                </button>
                {
                    openAvatar &&
                    <div className={clsx(
                        'absolute w-72 bg-white shadow-lg z-50 rounded-lg',
                        { 'right-0': locale == 'en' },
                        { 'left-0': locale == 'ar' },
                    )}>
                        <div className='flex items-center gap-2 p-4 border-b'>
                            <div>
                                <Image
                                    src={'/imgs/avatar.png'}
                                    alt="Avatar"
                                    height={50}
                                    width={50}
                                    className='size-11 rounded-full'
                                />
                            </div>
                            <h4 className='font-semibold'>{user.role == 'admin' ? t('admin') : t('supplier')}</h4>
                        </div>
                        <div className='border-b'>
                            <ul className='w-full bg-white shadow overflow-hidden'>
                                <li className={`${locale === 'ar' ? 'bg-primary text-white font-medium' : 'hover:bg-gray-100'}`}>
                                    <Link href={getNewPathname('ar')} className='block w-full px-4 py-3 text-sm'>
                                        {t('ar')}
                                    </Link>
                                </li>
                                <li className={`${locale === 'en' ? 'bg-primary text-white font-medium' : 'hover:bg-gray-100'}`}>
                                    <Link href={getNewPathname('en')} className='block w-full px-4 py-3 text-sm'>
                                        {t('en')}
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className=' py-1'>
                            <button onClick={logout} className='px-4 py-3 hover:bg-gray-100 w-full flex gap-1 duration-100'>
                                <LogoutIcon className='size-6' />
                                {t('logout')}
                            </button>
                        </div>
                    </div>
                }
            </div>
        </nav>
    )
}

export default Navbar