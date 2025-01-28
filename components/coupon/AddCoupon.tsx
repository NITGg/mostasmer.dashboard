import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import ErrorMsg from '../ErrorMsg'
import { useTranslations } from 'next-intl'
import { CalendarIcon, CouponIcon, LoadingIcon } from '../icons'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from 'react-hot-toast'
import generateCode from '@/lib/generateCode'
import axios from 'axios'
import { useAppDispatch } from '@/hooks/redux'
import { addCoupons, updateCoupons } from '@/redux/reducers/couponReducer'
import { useAppContext } from '@/context/appContext'

const CouponForm = ({ handleClose, coupon }: { handleClose: () => void, coupon?: any }) => {
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = React.useState(new Date(Date.now()) as any);
    const [endDate, setEndDate] = React.useState(new Date(Date.now()) as any);
    const { token } = useAppContext()

    const { register, handleSubmit, formState: { errors }, control, setValue, trigger, setError } = useForm()
    const t = useTranslations('coupons')
    const dispatch = useAppDispatch()
    const onSubmit = handleSubmit(async (fData) => {
        try {
            setLoading(true)
            const { data } = await axios.post('/api/coupons', {
                ...fData
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            handleClose()
            dispatch(addCoupons(data.coupon))
            setLoading(false)
        } catch (err: any) {
            setLoading(false);
            console.error('Submit Error:', err);
            toast.error(err.message);
        }
    })
    const handleUpdate = handleSubmit(async (fData) => {
        try {
            setLoading(true)
            const { data } = await axios.put(`/api/coupons/${coupon.id}`, {
                ...fData
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            handleClose()
            dispatch(updateCoupons(data.coupon))
            setLoading(false)
        } catch (err: any) {
            setLoading(false);
            console.error('Submit Error:', err);
            toast.error(err.message);
        }
    })

    return (
        <form onSubmit={coupon ? handleUpdate : onSubmit}>
            <div className='space-y-3 pb-5'>
                <div>
                    <div className='relative flex items-center group'>
                        <input
                            {...register('code', {
                                required: t('error.name'),
                                value: coupon?.code
                            })}
                            type="text"
                            className="border py-2 rounded-md px-2 w-full outline-none"
                            placeholder={t('name')}
                        />
                        <div
                            onClick={() => {
                                setValue('code', generateCode(4))
                                trigger('code')
                            }}
                            className='absolute size-5 right-[68px] font-bold cursor-pointer whitespace-nowrap select-none text-xs text-blue-500 hidden group-hover:block'>
                            {t('auto')}
                        </div>
                    </div>
                    <ErrorMsg message={errors?.name?.message as string} />
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
                    <div className='relative flex items-center'>
                        <input
                            {...register('ratio', {
                                required: t('error.discount'),
                                value: coupon?.ratio
                            })}
                            type="number"
                            className="border py-2 rounded-md px-2 w-full outline-none"
                            placeholder={t('discount')}
                        />
                        <CouponIcon className='absolute size-5 right-2' />
                    </div>
                    <ErrorMsg message={errors?.discount?.message as string} />
                </div>
                <div>
                    <textarea
                        {...register('description', {
                            value: coupon?.description
                        })}
                        className="border py-3 px-2 w-full outline-none h-20"
                        placeholder={t('description')}
                    />
                    <ErrorMsg message={errors?.description?.message as string} />
                </div>
                <div className=" w-full ">
                    <button disabled={loading} className='w-full py-2 rounded-md border-2 border-primary hover:bg-primary hover:text-white duration-200 flex justify-center'>
                        {loading ? <LoadingIcon className='w-6 h-6 animate-spin hover:stroke-white' /> : t('btn')}
                    </button>
                </div>
            </div>
        </form >
    )
}

export default CouponForm