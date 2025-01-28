'use client'
import clsx from 'clsx'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { useAppContext } from '@/context/appContext'
import { LoadingIcon } from '../icons'
import { PenLine } from 'lucide-react'
import { updatespecies } from '@/redux/reducers/speciesReducer'
import ImageApi from '../ImageApi'
import mlang from '@/lib/mLang'

const HeaderSpecies = ({ species, locale }: { species: any, locale: string }) => {

    const [image, setImage] = useState('');
    const [isEditable, setIsEditable] = useState(false);
    const [loading, setLoading] = useState(false)
    const { register, handleSubmit } = useForm({ mode: "onChange", });

    const { token } = useAppContext()
    const btnRef = useRef<any>();
    const dispatch = useDispatch()

    useEffect(() => {
        const input = document.getElementById('species-id-input-inside');
        const btn = btnRef.current;
        const handleClickInput = (e: any) => {
            e.preventDefault();
            setIsEditable(true)
            input?.click();
        };
        btn?.addEventListener('click', handleClickInput);
        return () => {
            btn?.removeEventListener('click', handleClickInput);
        };
    }, []);

    const handleUpdateImage = handleSubmit(
        async (fData) => {
            try {
                setLoading(true)
                const formData = new FormData();
                formData.append('name', `{mlang ar}${fData.namear ? fData.namear : fData.name}{mlang}{mlang en}${fData.name ? fData.name : fData.namear}{mlang}`);
                if (fData?.imageFile) formData.append('imageUrl', fData.imageFile[0]);
                const { data } = await axios.put(`/api/species/${species?.id}`, formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setIsEditable(false)
                dispatch(updatespecies(data.species))
                toast.success(data.message || 'Successfully update species!!');
            } catch (error: any) {
                console.error('Submit Error:', error);
                toast.error(error.message);
            }
            finally {
                setLoading(false)
            }
        }
    );
    const handleFieldClick = () => {
        setIsEditable(true)
    };
    return (
        <div className='p-container'>
            <form onSubmit={handleUpdateImage} className='grid grid-cols-12 space-y-5 sm:space-y-0 sm:space-x-5 md:space-x-0 md:gap-5 lg:gap-10'>
                <div className='col-span-12 sm:col-span-6 md:col-span-4'>
                    <div className='w-full sm:h-60 md:h-64 relative flex items-end justify-end'>
                        <ImageApi
                            src={image ? image : species.imageUrl}
                            alt={species.name}
                            className='size-full object-cover rounded-md'
                            width={500}
                            height={500}
                        />
                        <div className='absolute p-2'>
                            <div ref={btnRef} className='bg-white rounded-md p-1 cursor-pointer'>
                                <PenLine />
                            </div>
                        </div>
                    </div>
                </div>
                <input
                    type="file"
                    {...register(
                        'imageFile', {
                        onChange: (e) => {
                            if (e.target.files) {
                                setImage(URL.createObjectURL(e.target.files[0]));
                            }
                        }
                    })}
                    id="species-id-input-inside"
                    className='hidden'
                />
                <div className='col-span-12 sm:col-span-6 md:col-span-8'>
                    <div className='flex flex-col justify-between h-full items-start'>
                        <div className='space-y-5'>
                            <label className='flex z-10 items-center'>
                                <p className={clsx('font-medium text-left')}>Name :&nbsp;</p>
                                <div className='relative flex-1'>
                                    {!isEditable && <div onClick={handleFieldClick} className="size-full absolute z-10" />}
                                    <input
                                        defaultValue={mlang(species.name, 'en')}
                                        {...register('name', {
                                            value: mlang(species.name, 'en')
                                        })}
                                        disabled={!isEditable}
                                        className='w-full md:w-fit border-2 border-primary disabled:border-primary/50 px-2 py-1 rounded-md'
                                        type="text"
                                    />
                                </div>
                            </label>
                            <label className='flex z-10 items-center'>
                                <p className={clsx('font-medium text-left')}>Name ar :&nbsp;</p>
                                <div className='relative flex-1'>
                                    {!isEditable && <div onClick={handleFieldClick} className="size-full absolute z-10" />}
                                    <input
                                        defaultValue={mlang(species.name, 'ar')}
                                        {...register('namear', {
                                            value: mlang(species.name, 'ar')
                                        })}
                                        disabled={!isEditable}
                                        className='w-full md:w-fit border-2 border-primary disabled:border-primary/50 px-2 py-1 rounded-md'
                                        type="text"
                                    />
                                </div>
                            </label>
                        </div>
                        {
                            isEditable &&
                            <button className='bg-blue-500 text-white px-5 py-2 rounded-md w-44 h-11 flex justify-center items-center'>
                                {loading ? <LoadingIcon className='size-6 animate-spin' /> : 'Update species'}
                            </button>
                        }
                    </div>
                </div>
            </form>
        </div>
    )
}

export default HeaderSpecies