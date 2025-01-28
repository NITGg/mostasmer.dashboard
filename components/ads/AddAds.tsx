import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { CalendarIcon, LoadingIcon, PhotoIcon } from '../icons';
import ErrorMsg from '../ErrorMsg';
import { useTranslations } from 'next-intl';
import axios from 'axios';
import { useAppContext } from '@/context/appContext';
import toast from 'react-hot-toast';
import ImageApi from '../ImageApi';
import { useAppDispatch } from '@/hooks/redux';
import { addAds, updateAds } from '@/redux/reducers/ads';
import SearchPetsOrProducts from './SearchPetsOrProducts';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";


function getIdFromPath(path: string) {
    const match = path?.match(/\/\w+\/(\d+)/);
    return match ? match[1] : null;
}
const AddAds = ({ handleClose, ad }: { handleClose: any, ad?: any }) => {
    const t = useTranslations('ads')

    const [type, setType] = useState(ad?.type ? ad?.type : "")
    const { register, handleSubmit, formState: { errors }, setValue, control, trigger } = useForm();
    const btnRef = useRef<any>();
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState('');
    const { token } = useAppContext();
    const dispatch = useAppDispatch();

    const [startDate, setStartDate] = React.useState(new Date(Date.now()) as any);
    const [endDate, setEndDate] = React.useState(new Date(Date.now()) as any);

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
                formData.append('route', `${type == 'http' ? fData.link : `/${type}/${fData.link}`}`);
                formData.append('imageUrl', fData.imageFile[0]);
                formData.append('startDate', fData.startDate)
                formData.append('endDate', fData.endDate)
                formData.append('duration', fData.duration);
                formData.append('pro', fData.keyword)
                const { data } = await axios.post('/api/ads', formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const types = ad?.route?.includes('/pet/') ? 'pet' : ad?.route?.includes('/product/') ? 'product' : 'http'
                dispatch(addAds({
                    id: data.ads.id,
                    title: data.ads.title,
                    imageUrl: data.ads.imageUrl,
                    route: !data.ads.route.includes('http') ? getIdFromPath(data.ads.route) : data.ads.route,
                    type: types,
                    duration: data.ads.duration,
                    startDate: data.ads.startDate,
                    endDate: data.ads.endDate,
                    pro: data.ads.pro
                }))
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
                formData.append('startDate', fData.startDate)
                formData.append('endDate', fData.endDate)
                formData.append('duration', fData.duration);
                if (fData.keyword) formData.append('pro', fData.keyword)
                if (fData.title) formData.append('title', fData.title);
                if (fData.link) formData.append('route', `${type == 'http' ? fData.link : `/${type}/${fData.link}`}`);
                if (fData.imageFile) formData.append('imageUrl', fData.imageFile[0]);
                const { data } = await axios.put(`/api/ads/${ad?.id}`, formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log({ data });

                dispatch(updateAds({
                    id: data.ads.id,
                    title: data.ads.title,
                    imageUrl: data.ads.imageUrl,
                    route: !data.ads.route.includes('http') ? getIdFromPath(data.ads.route) : data.ads.route,
                    type: type,
                    duration: data.ads.duration,
                    startDate: data.ads.startDate,
                    endDate: data.ads.endDate,
                    pro: data.ads.pro
                }))
                handleClose();
            }
            catch (err: any) {
                setLoading(false);
                console.error('Submit Error:', err);
                toast.error(err.message);
            }
        }
    );
    console.log({ ad });

    return (
        <form className='block' onSubmit={ad ? handleUpdate : onSubmit}>
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
                                        ad ?
                                            <div className='group relative w-full h-full flex justify-center items-center'>
                                                <ImageApi
                                                    src={ad?.imageUrl}
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
                            value: ad?.title
                        })}
                        type="text"
                        className="border py-3 px-2 w-full outline-none"
                        placeholder={t('name')}
                    />
                    <ErrorMsg message={errors?.title?.message as string} />
                </div>
                <div>
                    <input
                        {...register('duration', {
                            value: ad?.duration,
                            required: t('error.duration'),
                        })}
                        type="text"
                        className="border py-3 px-2 w-full outline-none"
                        placeholder={t('duration')}
                    />
                    <ErrorMsg message={errors?.duration?.message as string} />
                </div>
                <div>
                    <div className="relative flex items-center">
                        <Controller
                            name="startDate"
                            control={control}
                            defaultValue={startDate}
                            rules={{
                                required: "Start date is required",
                            }}
                            render={() => (
                                <DatePicker
                                    placeholderText="Start Date"
                                    selected={startDate}
                                    className="border py-2 rounded-md px-2 w-full outline-none"
                                    onChange={(dateChange: Date | null) => {
                                        setValue("startDate", dateChange, { shouldDirty: true });
                                        setStartDate(dateChange);
                                        trigger("endDate"); // Re-validate endDate
                                    }}
                                />
                            )}
                        />
                        <CalendarIcon className="absolute w-5 h-5 right-2" />
                    </div>
                    {errors.startDate && <p className="text-red-500">{errors?.startDate?.message as string}</p>}
                </div>

                {/* End Date */}
                <div>
                    <div className="relative flex items-center">
                        <Controller
                            name="endDate"
                            control={control}
                            defaultValue={endDate}
                            rules={{
                                required: "End date is required",
                                validate: () => {
                                    if (startDate && endDate && startDate > endDate) {
                                        return "End date cannot be before start date";
                                    }
                                    return true;
                                }
                            }}
                            render={() => (
                                <DatePicker
                                    placeholderText="End Date"
                                    selected={endDate}
                                    className="border py-2 rounded-md px-2 w-full outline-none"
                                    onChange={(dateChange: Date | null) => {
                                        setValue("endDate", dateChange, { shouldDirty: true });
                                        setEndDate(dateChange);
                                    }}
                                />
                            )}
                        />
                        <CalendarIcon className="absolute w-5 h-5 right-2" />
                    </div>
                    {errors.endDate && <p className="text-red-500">{errors?.endDate?.message as string}</p>}
                </div>
                <div>
                    <select
                        value={type}
                        onChange={(e) => { setType(e.target.value); }}
                        className="border py-3 px-2 w-full outline-none"
                    >
                        <option value="">{t('selectType')}</option>
                        <option value="product">{t('product')}</option>
                        <option value="pet">{t('pet')}</option>
                        <option value="http">{t('http')}</option>
                    </select>
                    <ErrorMsg message={errors?.route?.message as string} />
                </div>
                <div>
                    {
                        type &&
                        <>
                            {type == 'product' || type == 'pet' ?
                                <SearchPetsOrProducts
                                    setValue={setValue}
                                    tableRef={type}
                                    placeholder={ad?.pro}
                                />
                                :
                                <input
                                    {...register('link', {
                                        value: ad?.route
                                    })}
                                    type="text"
                                    className="border py-3 px-2 w-full outline-none"
                                    placeholder={t('link')}
                                />
                            }
                        </>
                    }
                </div>
                <div className=" w-full ">
                    <button
                        className='w-full py-2 rounded-md border-2 border-primary hover:bg-primary hover:text-white duration-200 flex justify-center'>
                        {loading ? <LoadingIcon className='w-6 h-6 animate-spin hover:stroke-white' /> : t('btn')}
                    </button>
                </div>
            </div>
        </form>
    )
}

export default AddAds