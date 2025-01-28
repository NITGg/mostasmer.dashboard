'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { LoadingIcon, SearchIcon } from './icons';
import { useLocale, useTranslations } from 'next-intl';
import clsx from 'clsx';

const Search = ({ placeholder, }: { placeholder?: string, }) => {
    const search = useSearchParams();

    const [keyword, setKeyword] = useState(search.get('keyword') || "");
    const [loading, setloading] = useState(false)

    const pathname = usePathname()
    const router = useRouter();

    const locale = useLocale();
    const t = useTranslations('user')

    useEffect(() => {
        const handleSearch = () => {
            if (keyword) {
                setloading(false)
                router.push(`${pathname}?keyword=${keyword}`)
            }
        }
        if (keyword) {
            const interval = setInterval(handleSearch, 800)
            return () => clearInterval(interval)
        } else {
            setloading(false)
            router.push(`${pathname}`)
        }
    }, [keyword]);

    return (
        <div className='w-full flex justify-end'>
            <div className='relative flex items-center border-2 rounded-full overflow-hidden'>
                <input
                    type="text"
                    value={keyword}
                    onChange={(e) => {
                        setloading(true)
                        setKeyword(e.target.value)
                    }}
                    className={clsx('w-full lg:w-96 bg-transparent p-2 rounded-full peer outline-none',
                        { 'pl-10': locale !== 'ar' },
                        { 'pr-10': locale == 'ar' },
                    )}
                    placeholder={placeholder ? placeholder : t('search')}
                />

                <div className={clsx(
                    'absolute',
                    { "pl-3": locale != 'ar' },
                    { "right-3": locale == 'ar' },
                )}>
                    <SearchIcon className='fill-black peer-focus:fill-primary' />
                </div>
                <div className={clsx(
                    'absolute',
                    { "pr-3 right-0": locale != 'ar' },
                    { "left-3": locale == 'ar' },
                )}>
                    {loading && <LoadingIcon className='peer-focus:fill-primary animate-spin' />}
                </div>
            </div>
        </div>
    )
}

export default Search