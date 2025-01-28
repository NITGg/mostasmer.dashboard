'use client'
import React, { useEffect, useState } from 'react'
import { LoadingIcon, PluseCircelIcon } from '../icons'
import { useTranslations } from 'next-intl'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { EditIcon, LucideDelete } from 'lucide-react';
import ImageApi from '../ImageApi';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAppContext } from '@/context/appContext';
import { deleteAds, setAds } from '@/redux/reducers/ads';
import AddAds from './AddAds';

const AdsHeader = ({ data }: { data: any }) => {

    const t = useTranslations('ads');
    const [open, setOpen] = useState(false);
    const [edit, setEdit] = useState(null as any);
    const [deleteBoard, setDeleteBoard] = useState(null as any);
    const [loading, setLoading] = useState(false)
    const { token } = useAppContext()

    const ads = useAppSelector(s => s.ads.ads)
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setAds(data.ads))
    }, [])
    const handleDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/ads/${deleteBoard}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            dispatch(deleteAds(deleteBoard))
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
                                <AddAds
                                    handleClose={() => {
                                        setOpen(false);
                                        setEdit(null)
                                    }} />
                                :
                                <AddAds
                                    handleClose={() => {
                                        setOpen(false);
                                        setEdit(null)
                                    }}
                                    ad={edit}
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
                    ads.map((board: any) => {
                        return (
                            <div
                                className='col-span-12 md:col-span-6 lg:col-span-4 border bg-white rounded-md flex flex-col justify-between'
                                key={board.id}>
                                <div>
                                    <div className='flex justify-center py-5'>
                                        <div className='size-44'>
                                            <ImageApi
                                                src={board.imageUrl}
                                                loader={() => board.imageUrl}
                                                loading='lazy'
                                                alt=''
                                                height={400}
                                                width={400}
                                                className='size-full'
                                            />
                                        </div>
                                    </div>
                                    <div className='px-5 py-3'>
                                        <h2 className='text-lg font-bold'>{board.title}</h2>
                                        <span className='text-sm'>{board.content}</span>
                                    </div>
                                </div>
                                <div className='flex justify-end px-5 py-2 gap-2'>
                                    <button
                                        onClick={() => {
                                            setDeleteBoard(board.id);
                                        }}
                                    >
                                        <LucideDelete className='' />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEdit(board);
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

export default AdsHeader