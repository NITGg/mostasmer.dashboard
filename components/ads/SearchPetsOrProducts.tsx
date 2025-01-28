import axios from 'axios';
import React, { memo, useEffect, useState } from 'react';
import { LoadingIcon } from '../icons';
import { useLocale } from 'next-intl';
import clsx from 'clsx';


const SearchPetsOrProducts = memo(({
    setValue,
    tableRef,
    placeholder
}: {
    setValue: any,
    tableRef: string,
    placeholder: string,
}) => {

    const locale = useLocale()
    const [pro, setPro] = useState([]);
    const [keyword, setKeyword] = useState(placeholder);
    const [open, setOpen] = useState(false);
    const [typing, setTyping] = useState(null as any);
    const [loading, setloading] = useState(false);

    const handleSearch = async () => {
        if (keyword) {
            setloading(false)
            const { data } = await axios.get(`/api/${tableRef}s?fields=name,id&keyword=${keyword}&items=name&limit=4&lang=${locale}`)
            setPro(() => {
                if (data.products) {
                    return data.products
                } else {
                    return data.pets
                }
            })
        }
    }
    useEffect(() => {
        if (typing) {
            setloading(true)
            const timer = setTimeout(() => { setTyping(false) }, 1000)
            return () => clearTimeout(timer)
        }
    }, [typing])

    useEffect(() => {
        if (!typing && typing != null) {
            handleSearch()
            setloading(false)
        }
    }, [typing])

    return (
        <div>
            <div className='relative'>
                <div className='relative flex items-center w-full'>
                    <input
                        type="text"
                        className="border py-2 px-2 w-full outline-none"
                        onChange={(e) => {
                            setKeyword(e.target.value)
                            setTyping(true)
                            setOpen(e.target.value ? true : false)
                        }}
                        value={keyword}
                        placeholder='search'
                    />
                    <div className={clsx(
                        'absolute',
                        { "pr-3 right-0": locale != 'ar' },
                        { "left-3": locale == 'ar' },
                    )}>
                        {loading && <LoadingIcon className='peer-focus:fill-primary animate-spin' />}
                    </div>
                </div>
                {open &&
                    <div onClick={() => { }} className='absolute bg-white top-9 shadow-md rounded-lg w-full overflow-hidden'>
                        {pro.map((item: any, index) => (
                            <div
                                key={item.id}
                                className='flex items-center justify-between py-2 border-b px-2 cursor-pointer hover:bg-gray-300 duration-300'
                                onClick={() => {
                                    setOpen(false)
                                    setKeyword(item.name)
                                    setValue("link", item.id == null ? 'null' : item.id)
                                    setValue("keyword", item.name)
                                }}
                            >
                                {item.name}
                            </div>
                        ))}
                    </div>
                }
            </div>
        </div>
    );
}
);

SearchPetsOrProducts.displayName = 'SearchPetsOrProducts';
export default SearchPetsOrProducts;
