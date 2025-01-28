'use client';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import ErrorMsg from '../ErrorMsg';
import { CouponIcon, LoadingIcon, PhotoIcon } from '../icons';
import axios from 'axios';
import { useAppContext } from '@/context/appContext';
import { useAppDispatch } from '@/hooks/redux';
import SpeciesSelect from './SpeciesSelect';
import { addPet, updatePet } from '@/redux/reducers/petsReducer';
import mlang from '@/lib/mLang';
import DatePicker from 'react-datepicker';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import "react-datepicker/dist/react-datepicker.css";
import { useTranslations } from 'next-intl';
import ImageApi from '../ImageApi';

const AddPet = ({ handleClose, pet }: { handleClose: () => void, pet?: any }) => {

    const { register, handleSubmit, formState: { errors }, setValue, control, trigger } = useForm();
    const dispatch = useAppDispatch();
    const [image, setImage] = useState('');
    const [loading, setLoading] = useState(false);
    const btnRef = useRef<any>();
    const { token } = useAppContext();
    const t = useTranslations('product');


    const [startDate, setStartDate] = React.useState(pet?.discounts[0]?.startDate ?? new Date(Date.now()) as any);
    const [endDate, setEndDate] = React.useState(pet?.discounts[0]?.endDate ?? new Date(Date.now()) as any);

    const [isOffer, setIsOffer] = useState(pet?.discounts[0] ? true : false);


    useEffect(() => {
        const input = document.getElementById('pet-id-input-file');
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



    const onSubmit = handleSubmit(
        async (fData) => {
            try {
                setLoading(true);
                const formData = new FormData();
                formData.append('price', fData.price);
                formData.append('speciesId', fData.speciesId || 1);
                formData.append('name', fData.name);
                formData.append('namear', fData.namear);
                formData.append('description', fData.description);
                formData.append('descriptionar', fData.descriptionar);
                formData.append('age', fData.age);
                formData.append('offer', `${isOffer}`)
                Object.values(fData.imageFile).forEach((file: any) => {
                    formData.append('images', file);
                })

                if (isOffer) {
                    formData.append('discountPercentage', fData.discountPercentage);
                    formData.append('startDate', fData.startDate)
                    formData.append('endDate', fData.endDate)
                }
                const { data } = await axios.post('/api/pets', formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                dispatch(addPet(data.pet))
                toast.success("Successfully created!!");
                URL.revokeObjectURL(image);
                handleClose()
                // window.location.reload()
                setLoading(false);
            } catch (error: any) {
                setLoading(false);
                console.error('Submit Error:', error);
                toast.error(error.message);
            }
        }
    );


    const handleUpdateImage = handleSubmit(
        async (fData) => {
            try {
                setLoading(true);

                const formData = new FormData();
                formData.append('name', fData.name);
                formData.append('namear', fData.namear);
                formData.append('price', fData.price);
                formData.append('age', fData.age);
                if (fData.speciesId) {
                    formData.append('speciesId', fData.speciesId);
                }
                if (fData.description) { formData.append('description', fData.description); }
                if (fData.descriptionar) { formData.append('descriptionar', fData.descriptionar); }
                if (fData.imageFile[0]) {
                    Object.values(fData.imageFile).forEach((file: any) => {
                        formData.append('images', file);
                    })
                }
                formData.append('offer', `${isOffer}`)
                if (isOffer) {
                    formData.append('discountPercentage', fData.discountPercentage);
                    formData.append('startDate', fData.startDate)
                    formData.append('endDate', fData.endDate)
                }
                const { data } = await axios.put(`/api/pets/${pet.id}`, formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                dispatch(updatePet(data.pet))
                toast.success("Successfully updated pet!!");
                URL.revokeObjectURL(image);

                setLoading(false);
                handleClose()
            } catch (error: any) {
                setLoading(false);
                console.error('Submit Error:', error);
                toast.error(error.message);
            }
        }
    );


    return (
        <form className='block' onSubmit={pet ? handleUpdateImage : onSubmit}>
            <div className='space-y-5'>
                <div className=''>
                    <input
                        type="file"
                        multiple // Allow selecting multiple files
                        {...register('imageFile', {
                            onChange: (e) => {
                                if (e.target.files) {
                                    const filesArray = Array.from(e.target.files);
                                    const images = filesArray.map(file => URL.createObjectURL(file as any));
                                    setImage(images as any);
                                }
                            }
                        })}
                        id="pet-id-input-file"
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
                                        pet ?
                                            <div className='group relative w-full h-full flex justify-center items-center'>
                                                <ImageApi
                                                    src={pet?.images[0]?.url}
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
                            value: mlang(pet?.name, 'en')
                        })}
                        type="text"
                        className="border py-3 px-2 w-full outline-none"
                        placeholder={"Name"}
                    />
                    <ErrorMsg message={errors?.name?.message as string} />
                </div>
                <div>
                    <input
                        {...register('namear', {
                            value: mlang(pet?.name, 'ar')
                        })}
                        type="text"
                        className="border py-3 px-2 w-full outline-none"
                        placeholder={"Name"}
                    />
                    <ErrorMsg message={errors?.name?.message as string} />
                </div>
                <div>
                    <input
                        {...register('price', {
                            required: "Price is required",
                            value: pet?.price
                        })}
                        type="number"
                        className="border py-3 px-2 w-full outline-none"
                        placeholder={"Price"}
                    />
                    <ErrorMsg message={errors?.price?.message as string} />
                </div>
                <div>
                    <input
                        {...register('age', {
                            required: "Please Enter the age!!",
                            value: pet?.age
                        })}
                        type="number"
                        className="border py-3 px-2 w-full outline-none"
                        placeholder={'age'}
                    />
                    <ErrorMsg message={errors?.age?.message as string} />
                </div>
                <div>
                    <SpeciesSelect
                        setValue={setValue}
                        speciesId={pet?.speciesId}
                    />
                </div>
                <div>
                    <textarea
                        {...register('description', {
                            value: mlang(pet?.description, 'en')
                        })}
                        className="border py-3 px-2 w-full outline-none h-20"
                        placeholder={"Description"}
                    />
                    <ErrorMsg message={errors?.description?.message as string} />
                </div>
                <div>
                    <textarea
                        {...register('descriptionar', {
                            value: mlang(pet?.description, 'ar')
                        })}
                        className="border py-3 px-2 w-full outline-none h-20"
                        placeholder={"Description"}
                    />
                    <ErrorMsg message={errors?.description?.message as string} />
                </div>
                <label className='flex justify-between items-center'>
                    <input
                        checked={isOffer}
                        onChange={() => {
                            setIsOffer(!isOffer)
                        }}
                        className='size-4'
                        type="checkbox"
                    />
                    <span>
                        {t('isOffer')}
                    </span>
                </label>

                {isOffer &&
                    <div className={cn('space-y-5')}>
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
                            <div className='relative flex items-center'>
                                <input
                                    defaultValue={pet?.discounts[0]?.discountPercentage}
                                    {...register('discountPercentage', {
                                        required: 'please enter the Percentage',
                                        validate: (v) => {
                                            if (v < 0)
                                                return 'Please enter a number between 0 and 99'
                                            else if (v > 99)
                                                return 'Please enter a number between 0 and 99'
                                        },
                                        value: pet?.discounts[0]?.discountPercentage ?? ''
                                    })}
                                    type="number"
                                    className="border py-2 rounded-md px-2 w-full outline-none"
                                    placeholder={t('discount')}
                                />
                                <CouponIcon className='absolute size-5 right-2' />
                            </div>
                            <ErrorMsg message={errors?.discountPercentage?.message as string} />
                        </div>
                    </div>
                }
                <div className=" w-full ">
                    <button disabled={loading} className='w-full py-2 rounded-md border-2 border-primary hover:bg-primary hover:text-white duration-200 flex justify-center'>
                        {loading ? <LoadingIcon className='w-6 h-6 animate-spin hover:stroke-white' /> : "Submit"}
                    </button>
                </div>
            </div>
        </form>
    );
}

export default AddPet;