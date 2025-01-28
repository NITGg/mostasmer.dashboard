'use client'
import { useAppContext } from '@/context/appContext';
import axios from 'axios';
import clsx from 'clsx';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const StoreData = ({ store }: { store: any }) => {
    const { register, handleSubmit, } = useForm({ mode: "onChange", });
    const [isEditable, setIsEditable] = useState(false);
    const { token } = useAppContext();

    const handleFieldClick = () => {
        setIsEditable(true)
    };
    const onSubmit = handleSubmit(async (formData) => {
        try {
            const { data } = await axios.put(`/api/user-store/${store?.userId}`, { ...formData }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(data);
            setIsEditable(false)
            toast.success("Successfully Updated!!!")
        } catch (error: any) {
            console.error(error);
            toast.error(error?.response?.data?.message || 'There is an Error')
        }
    });
    return (
        <div>
            <form onSubmit={onSubmit} className='space-y-5'>
                <label className='flex z-10 items-center'>
                    <p className={clsx('font-medium w-28 text-left')}>Store Name :&nbsp;</p>
                    <div className='relative flex-1'>
                        {!isEditable && <div onClick={handleFieldClick} className="size-full absolute z-10" />}
                        <input
                            {...register("storeName", {
                                value: store?.storeName
                            })}
                            disabled={!isEditable}
                            defaultValue={store?.storeName}
                            className='w-full border-2 border-primary disabled:border-primary/50 px-2 py-1 rounded-md'
                            type="text"
                        />
                    </div>
                </label>
                <label className='flex z-10 items-center'>
                    <p className={clsx('font-medium w-28 text-left')}>Lat :&nbsp;</p>
                    <div className='relative flex-1'>
                        {!isEditable && <div onClick={handleFieldClick} className="size-full absolute z-10" />}
                        <input
                            {...register("lat", {
                                value: store?.lat
                            })}
                            disabled={!isEditable}
                            defaultValue={store?.lat}
                            className='w-full border-2 border-primary disabled:border-primary/50 px-2 py-1 rounded-md'
                            type="text"
                        />
                    </div>
                </label>
                <label className='flex z-10 items-center'>
                    <p className={clsx('font-medium w-28 text-left')}>Long :&nbsp;</p>
                    <div className='relative flex-1'>
                        {!isEditable && <div onClick={handleFieldClick} className="size-full absolute z-10" />}
                        <input
                            {...register("long", {
                                value: store?.long
                            })}
                            disabled={!isEditable}
                            defaultValue={store?.long}
                            className='w-full border-2 border-primary disabled:border-primary/50 px-2 py-1 rounded-md'
                            type="text"
                        />
                    </div>
                </label>
                <div className='flex justify-center w-full mt-5'>
                    {isEditable &&
                        <button className='py-2 px-10 rounded-md bg-blue-500 text-white'>
                            Update Store
                        </button>
                    }
                </div>
            </form>
        </div>
    )
}

export default StoreData