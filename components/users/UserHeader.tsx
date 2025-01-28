import { useTranslations } from 'next-intl'
import React from 'react'
import Search from '../Search'

const UserHeader = ({ type }: { type: string }) => {
    const t = useTranslations('user')

    return (
        <div className='flex justify-between items-center gap-10'>
            <h4 className='font-bold text-lg md:text-xl lg:text-2xl'>{t(type)}</h4>
            <Search />
        </div>
    )
}

export default UserHeader