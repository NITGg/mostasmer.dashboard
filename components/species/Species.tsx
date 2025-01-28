'use client'
import { Link } from '@/i18n/routing'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { DeleteIcon, EditIcon, LoadingIcon, PluseCircelIcon } from '../icons'
import { useLocale, useTranslations } from 'next-intl'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import AddSpecies from './AddSpecies'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useAppContext } from '@/context/appContext'
import { deletespecies, setspecies } from '@/redux/reducers/speciesReducer';
import ImageApi from '../ImageApi'
import mlang from '@/lib/mLang'

const Species = ({ species, count }: { species: any, count: any }) => {
    const [open, setOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false as any);
    const [Species, setSpecies] = useState(null as any)
    const [loading, setLoading] = useState(false);
    const { token } = useAppContext();

    const t = useTranslations('species')
    const locale = useLocale();

    const speciesState = useAppSelector(state => state.species.species) || species;
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setspecies(species))
    }, [])

    const handleDeleteCate = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/species/${openDelete}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            dispatch(deletespecies(openDelete))
            setOpenDelete(false)
            toast.success(t('successDelete'))
            setLoading(false)
        } catch (error: any) {
            setLoading(false);
            console.error(error);
            toast.error(error?.response?.data?.message || 'There is an Error')
        }
    }
    return (
        <div className='p-container space-y-10'>
            <div className='flex justify-between items-center'>
                <h4 className='font-bold text-lg md:text-xl lg:text-2xl'>{t('title')}</h4>
                <button
                    onClick={() => { setOpen(!open) }}
                    className='px-5 py-2 bg-primary rounded-md text-white font-medium'>
                    <div className='flex gap-3'>
                        <PluseCircelIcon className='size-6' />
                        <div className='flex-1'>
                            {t('addBtn')}
                        </div>
                    </div>
                </button>
            </div>
            <div className='grid grid-cols-12 space-y-10 sm:space-y-0 sm:gap-10'>
                {speciesState?.map((speciesState: any) => (
                    <div className='col-span-12 sm:col-span-6 lg:col-span-4 border bg-white rounded-lg shadow-md'
                        key={speciesState.id}>
                        <Link href={`/species/${speciesState.id}/`}
                            className='w-full h-56 flex justify-center items-center'>
                            <ImageApi
                                src={speciesState?.imageUrl || '/imgs/notfound.png'}
                                alt={speciesState.name}
                                height={300}
                                width={300}
                                loading='lazy'
                                loader={() => {
                                    return speciesState?.imageUrl
                                }}
                                className='size-full border-b object-cover object-top rounded-t-md'
                            />
                        </Link>
                        <div className='py-5 flex justify-between items-center px-3'>
                            <div>
                                <h4 className='text-lg font-medium'>{mlang(speciesState?.name, locale as 'en' || 'ar')}</h4>
                            </div>
                            <div className='space-x-3 flex gap-1'>
                                <button
                                    onClick={() => {
                                        setOpen(true)
                                        setSpecies(speciesState)
                                    }}
                                    className='block' >
                                    <EditIcon className='size-6 hover:stroke-blue-500 duration-200' />
                                </button>
                                <button
                                    onClick={() => {
                                        setOpenDelete(speciesState.id)
                                    }}
                                >
                                    <DeleteIcon className='size-6 hover:stroke-red-500 duration-200' />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <Dialog open={open} onOpenChange={() => {
                setSpecies(null)
                setOpen(false)
            }}>
                <DialogContent >
                    <DialogHeader>
                        <DialogTitle>{t('title')}</DialogTitle>
                        <DialogDescription></DialogDescription>
                        <AddSpecies setOpen={setOpen} species={Species} />
                    </DialogHeader>
                </DialogContent>
            </Dialog>
            <Dialog open={openDelete} onOpenChange={setOpenDelete}>
                <DialogContent >
                    <DialogHeader>
                        <DialogTitle>
                            {t('delete')}
                        </DialogTitle>
                        <DialogDescription>
                            {t('deleteMsg')}
                        </DialogDescription>
                    </DialogHeader>
                    <div className='flex gap-2'>
                        <button className='px-3 py-2 rounded-md border'>
                            {t('cancel')}
                        </button>
                        <button onClick={handleDeleteCate} className='px-3 py-2 rounded-md bg-red-500 text-white'>
                            {loading ? <LoadingIcon className='size-5 animate-spin' /> : t('delete')}
                        </button>
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    )
}

export default Species