import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import { LoadingIcon, PhotoIcon } from '../icons';
import ErrorMsg from '../ErrorMsg';
import { useTranslations } from 'next-intl';
import axios from 'axios';
import { useAppContext } from '@/context/appContext';
import toast from 'react-hot-toast';
import ImageApi from '../ImageApi';
import { useAppDispatch } from '@/hooks/redux';
import { addOnBoarding, updateOnBoarding } from '@/redux/reducers/onBoardsReducer';

const AddOnBoarding = ({ handleClose, board }: { handleClose: any, board?: any }) => {
    const t = useTranslations('onBoarding')

    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const btnRef = useRef<any>();
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState('');
    const { token } = useAppContext();
    const dispatch = useAppDispatch();

    useEffect(() => {
        const input = document.getElementById('product-id-input-file');
        const btn = btnRef.current;
        const handleClickInput = (e: any) => {
            e.preventDefault();
            input?.click();
        };
        btn?.addEventListener('click', handleClickInput);
        return () => {
            btn?.removeEventListener('click', handleClickInput);
        };
    }, []);
    const onSubmit = handleSubmit(
        async (fData) => {
            try {
                setLoading(true);
                const formData = new FormData();
                formData.append('title', fData.title);
                formData.append('content', fData.content);
                formData.append('imageUrl', fData.imageFile[0]);
                const { data } = await axios.post('/api/on-boarding', formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log(data);
                dispatch(addOnBoarding(data.onBoarding))
                handleClose();
            }
            catch (err: any) {
                setLoading(false);
                console.error(err);
                toast.error(err?.response?.data?.message || 'There is an Error')
            }
        }
    );
    const handleUpdate = handleSubmit(
        async (fData) => {
            try {
                setLoading(true);
                const formData = new FormData();
                if (fData.title) formData.append('title', fData.title);
                if (fData.content) formData.append('content', fData.content);
                formData.append('imageUrl', fData.imageFile[0]);
                const { data } = await axios.put(`/api/on-boarding/${board.id}`, formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                console.log(data);
                dispatch(updateOnBoarding(data.onBoarding))
                handleClose();
            }
            catch (err: any) {
                setLoading(false);
                console.error('Submit Error:', err);
                toast.error(err.message);
            }
        }
    );
    return (
        <form className='block' onSubmit={board ? handleUpdate : onSubmit}>
            <div className='space-y-5'>
                <div className=''>
                    <input
                        type="file"
                        multiple
                        {...register('imageFile', {
                            onChange: (e) => {
                                if (e.target.files) {
                                    const filesArray = Array.from(e.target.files);
                                    const imageUrls = filesArray.map(file => URL.createObjectURL(file as any));
                                    setImage(imageUrls as any);
                                }
                            }
                        })}
                        id="product-id-input-file"
                        className="hidden"
                    />
                    <>
                        {image ?
                            <div className='flex overflow-x-auto h-72 sm:h-52 md:h-64 lg:h-72 '>
                                {
                                    (image as any).map((image: any) =>
                                        <Image
                                            key={image}
                                            src={image}
                                            alt='image'
                                            height={1000}
                                            width={1000}
                                            className='h-full w-full object-cover'
                                        />)
                                }
                            </div>
                            :
                            <div>
                                <div ref={btnRef} className='cursor-pointer w-full h-72 sm:h-52 md:h-64 lg:h-72 relative flex justify-center items-center group  bg-slate-200'>
                                    {
                                        board ?
                                            <div className='group relative w-full h-full flex justify-center items-center'>
                                                <ImageApi
                                                    src={board?.imageUrl}
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
                        {...register('title', {
                            value: board?.title
                        })}
                        type="text"
                        className="border py-3 px-2 w-full outline-none"
                        placeholder={t('name')}
                    />
                    <ErrorMsg message={errors?.title?.message as string} />
                </div>
                <div>
                    <textarea
                        {...register('content', {
                            value: board?.content
                        })}
                        className="border py-3 px-2 w-full outline-none h-20"
                        placeholder={t('content')}
                    />
                    <ErrorMsg message={errors?.description?.message as string} />
                </div>
                <div className=" w-full ">
                    <button
                        // disabled={loading} 
                        className='w-full py-2 rounded-md border-2 border-primary hover:bg-primary hover:text-white duration-200 flex justify-center'>
                        {loading ? <LoadingIcon className='w-6 h-6 animate-spin hover:stroke-white' /> : t('btn')}
                    </button>
                </div>
            </div>
        </form>
    )
}

export default AddOnBoarding