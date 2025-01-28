'use client';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import ErrorMsg from '../ErrorMsg';
import { LoadingIcon, PhotoIcon } from '../icons';
import axios from 'axios';
import { useAppContext } from '@/context/appContext';
import { useAppDispatch } from '@/hooks/redux';
import { addspecies, updatespecies } from '@/redux/reducers/speciesReducer';
import mlang from '@/lib/mLang';
import { useTranslations } from 'next-intl';
import ImageApi from '../ImageApi';

const AddSpecies = ({ setOpen, species }: { setOpen: React.Dispatch<React.SetStateAction<boolean>>, species?: any }) => {

    const { register, handleSubmit, formState: { errors }, } = useForm();
    const [image, setImage] = useState('');
    const [loading, setLoading] = useState(false);
    const btnRef = useRef<any>();
    const { token } = useAppContext();
    const t = useTranslations('species');

    useEffect(() => {
        const input = document.getElementById('species-id-input-file');
        const btn = btnRef.current;
        const handleClickInput = (e: any) => {
            e.preventDefault();
            input?.click();
        };
        btn.addEventListener('click', handleClickInput);
        return () => {
            btn.removeEventListener('click', handleClickInput);
        };
    }, []);

    const dispatch = useAppDispatch();


    const onSubmit = handleSubmit(
        async (fData) => {
            try {
                setLoading(true);
                const formData = new FormData();
                formData.append('name', `{mlang ar}${fData.namear ? fData.namear : fData.name}{mlang}{mlang en}${fData.name ? fData.name : fData.namear}{mlang}`);
                formData.append('imageUrl', fData.imageFile[0])
                const { data } = await axios.post('/api/species', formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                dispatch(addspecies(data.species))

                toast.success('success');
                URL.revokeObjectURL(image);
                setLoading(false);
                setOpen(false)
            } catch (error: any) {
                setLoading(false);
                console.error('Submit Error:', error);
                toast.error(error.message);
            }
        }
    );

    const handleUpdateSpecies = handleSubmit(
        async (fData) => {
            try {
                setLoading(true);
                const formData = new FormData();
                formData.append('name', `{mlang ar}${fData.namear ? fData.namear : fData.name}{mlang}{mlang en}${fData.name ? fData.name : fData.namear}{mlang}`);
                if (fData.imageFile[0]) {
                    formData.append('imageUrl', fData.imageFile[0])
                }
                const { data } = await axios.put(`/api/species/${species.id}`, formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log(data.species);

                dispatch(updatespecies({
                    ...data.species,
                }))
                toast.success('successfully');
                URL.revokeObjectURL(image);
                setLoading(false);
                setOpen(false);

            } catch (error: any) {
                setLoading(false);
                console.error('Submit Error:', error);
                toast.error(error.message);
            }
        }
    );

    return (
        <form onSubmit={species ? handleUpdateSpecies : onSubmit}>
            <div className='space-y-5'>
                <div className=''>
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
                        id='species-id-input-file'
                        className='hidden'
                    />
                    <>
                        {image ?
                            <div className='h-72 sm:h-52 md:h-64 lg:h-72 xl:h-80'>
                                {
                                    image ?
                                        <ImageApi
                                            src={image || '/imgs/notfound.png'}
                                            alt='image'
                                            height={1000}
                                            width={1000}
                                            className='h-full w-full object-cover'
                                        /> :
                                        <ImageApi
                                            src={species?.imageUrl || '/imgs/notfound.png'}
                                            alt='image'
                                            height={1000}
                                            width={1000}
                                            className='h-full w-full object-cover'
                                        />
                                }
                            </div>
                            :
                            <div>
                                <div ref={btnRef} className='cursor-pointer w-full h-72 sm:h-52 md:h-64 lg:h-72 xl:h-80 relative flex justify-center items-center group  bg-slate-200'>
                                    {
                                        species ?
                                            <div className='group relative w-full h-full flex justify-center items-center'>
                                                <ImageApi
                                                    src={species?.imageUrl ?? '/imgs/notfound.png'}
                                                    alt='image'
                                                    height={1000}
                                                    width={1000}
                                                    className='h-full w-full object-cover'
                                                />
                                                <div className='absolute w-full h-full bg-slate-100/20 hidden group-hover:flex justify-center items-center duration-100'>
                                                    <PhotoIcon className='size-10' />
                                                </div>
                                            </div>
                                            :
                                            <div className='absolute w-full h-full bg-slate-100/20 flex justify-center items-center duration-100'>
                                                <PhotoIcon className='size-10' />
                                            </div>
                                    }
                                </div>
                            </div>
                        }
                    </>
                </div>
                <div>
                    <input
                        {...register('name', {
                            required: "This name is required",
                            value: mlang(species?.name, 'en')
                        })}
                        type="text"
                        className="border py-3 px-2 w-full outline-none"
                        placeholder={'name'}
                    />
                    <ErrorMsg message={errors?.name?.message as string} />
                </div>
                <div>
                    <input
                        {...register('namear', {
                            required: "This name is required",
                            value: mlang(species?.name, 'ar')
                        })}
                        type="text"
                        className="border py-3 px-2 w-full outline-none"
                        placeholder={'name ar'}
                    />
                    <ErrorMsg message={errors?.name?.message as string} />
                </div>

                <div className=" w-full ">
                    <button disabled={loading} className='w-full py-2 rounded-md border-2 border-primary hover:bg-primary hover:text-white duration-200 flex justify-center'>
                        {loading ? <LoadingIcon className='w-6 h-6 animate-spin hover:stroke-white' /> : t('btn')}
                    </button>
                </div>
            </div>
        </form>
    );
}

export default AddSpecies;