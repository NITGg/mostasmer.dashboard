'use client'
import React, { useEffect, useState } from 'react'
import { LoadingIcon, PluseCircelIcon } from '../icons'
import { useTranslations } from 'next-intl'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { EditIcon, LucideDelete } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAppContext } from '@/context/appContext';
import AddCoupon from './AddCoupon';
import { deleteCoupons, setCoupons } from '@/redux/reducers/couponReducer';
import { DateToText } from '@/lib/DateToText';

const CouponHeader = ({ data }: { data: any }) => {

    const t = useTranslations('coupons');
    const [open, setOpen] = useState(false);
    const [edit, setEdit] = useState(null as any);
    const [deleteBoard, setDeleteBoard] = useState(null as any);
    const [loading, setLoading] = useState(false)
    const { token } = useAppContext()

    const coupons = useAppSelector(s => s.coupons.coupons)
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setCoupons(data.coupons))
    }, [])
    const handleDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/coupons/${deleteBoard}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            dispatch(deleteCoupons(deleteBoard))
            setDeleteBoard(false)
            toast.success(t('successDelete'))
            setLoading(false)
        } catch (error: any) {
            setLoading(false);
            console.error(error);
            toast.error(error?.response?.data?.message || 'There is an Error')
        }
    }

    return (
        <div className='space-y-10'>
            <div className='flex justify-between items-center'>
                <h4 className='font-bold text-lg md:text-xl lg:text-2xl'>
                    {t('title')}
                </h4>
                <button
                    onClick={() => { setOpen(!open) }}
                    className='px-5 py-2 bg-primary rounded-md text-white font-medium'>
                    <div className='flex gap-3'>
                        <PluseCircelIcon className='size-6' />
                        <div className='flex-1'>
                            {t('add')}
                        </div>
                    </div>
                </button>
                <Dialog open={open} onOpenChange={() => {
                    setOpen(false);
                    setEdit(null)
                }}>
                    <DialogContent className='max-h-[80vh] overflow-auto' >
                        <DialogHeader>
                            <DialogTitle>{t('title')}</DialogTitle>
                            <DialogDescription></DialogDescription>
                            {!edit ?
                                <AddCoupon
                                    handleClose={() => {
                                        setOpen(false);
                                        setEdit(null)
                                    }} />
                                :
                                <AddCoupon
                                    handleClose={() => {
                                        setOpen(false);
                                        setEdit(null)
                                    }}
                                    coupon={edit}
                                />
                            }
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
                <Dialog open={deleteBoard} onOpenChange={setDeleteBoard}>
                    <DialogContent >
                        <DialogHeader>
                            <DialogTitle>
                                {t('delete')}
                            </DialogTitle>
                            <DialogDescription>
                                {t('deleteMessage')}
                            </DialogDescription>
                        </DialogHeader>
                        <div className='flex gap-2'>
                            <button onClick={() => setDeleteBoard(false)} className='px-3 py-2 rounded-md border'>
                                {t('cancel')}
                            </button>
                            <button onClick={handleDelete} className='px-3 py-2 rounded-md bg-red-500 text-white'>
                                {loading ? <LoadingIcon className='size-5 animate-spin' /> : t('delete')}
                            </button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
            <div className='grid grid-cols-12 gap-5'>
                {
                    coupons.map((coupon: any) => {
                        return (
                            <div
                                className='col-span-12 md:col-span-6 lg:col-span-4 border bg-white rounded-md flex flex-col justify-between'
                                key={coupon.id}>
                                <div className='px-3 py-2'>
                                    <div className='flex gap-2 items-center'>
                                        <span>{t('name')} : </span>
                                        <h2 className='text-lg font-bold'>{coupon.code}</h2>
                                    </div>
                                    <div className='flex gap-2 items-center'>
                                        <span>{t('start')} : </span>
                                        <h2 className='text-lg font-bold'>{DateToText(coupon.startDate)}</h2>
                                    </div>
                                    <div className='flex gap-2 items-center'>
                                        <span>{t('end')} : </span>
                                        <h2 className='text-lg font-bold'>{DateToText(coupon.endDate)}</h2>
                                    </div>
                                </div>
                                <div className='flex justify-end px-5 py-2 gap-2'>
                                    <button
                                        onClick={() => {
                                            setDeleteBoard(coupon.id);
                                        }}
                                    >
                                        <LucideDelete className='' />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEdit(coupon);
                                            setOpen(true);
                                        }}
                                    >
                                        <EditIcon className='' />
                                    </button>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default CouponHeader