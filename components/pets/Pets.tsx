'use client';
import { Link, } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react'
import { DeleteIcon, EditIcon, LoadingIcon, PluseCircelIcon } from '../icons';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import AddPet from './AddPet';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAppContext } from '@/context/appContext';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { deletePet, setPets, updatePet } from '@/redux/reducers/petsReducer';
import mlang from '@/lib/mLang';
import ImageApi from '../ImageApi';

const Pets = ({ pets, count }: { pets: any, count: any }) => {
    const t = useTranslations('product');
    const locale = useLocale();

    const [open, setOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [petUpdate, setPetUpdate] = useState(null as any)

    const [loading, setLoading] = useState(false)
    const { token } = useAppContext();

    const petss = useAppSelector(s => s.pets.pets)
    const dispatch = useAppDispatch()

    const handleDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/pets/${`${openDelete}`.trim()}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            dispatch(deletePet(openDelete))
            setOpenDelete(false)
            toast.success(t('successDelete'))
            setLoading(false)
        } catch (error: any) {
            setLoading(false);
            console.error(error);
            toast.error(error?.response?.data?.message || 'There is an Error')
        }
    }
    useEffect(() => {
        dispatch(setPets(pets))
    }, [])

    const handleClose = () => {
        setOpen(false)
        setPetUpdate(null)
    }

    return (
        <div className='p-container space-y-10 pb-5'>
            <div className='flex justify-between items-center'>
                <h4 className='font-bold text-lg md:text-xl lg:text-2xl'>
                    {t('pets')}
                </h4>
                <button
                    onClick={() => { setOpen(!open) }}
                    className='px-5 py-2 bg-primary rounded-md text-white font-medium'>
                    <div className='flex gap-3'>
                        <PluseCircelIcon className='size-6' />
                        <div className='flex-1'>
                            {t('addPet')}
                        </div>
                    </div>
                </button>
            </div>
            <div className='grid grid-cols-12 space-y-10 sm:space-y-0 sm:gap-10'>
                {(petss)?.map((pet: any) => (
                    <div
                        key={pet.id}
                        className='block col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3 whitespace-nowrap'
                    >
                        <div className='bg-white size-full rounded-md overflow-hidden shadow-md'>
                            <div className='h-64 '>
                                <ImageApi
                                    src={pet.images[0]?.url ?? '/imgs/notfound.png'}
                                    alt={''}
                                    height={500}
                                    width={500}
                                    className='size-full'
                                />
                            </div>
                            <div className='px-3 py-5 space-y-3'>
                                <Link
                                    href={`/pets/${pet.id}`}
                                    className='text-xl lg:text-2xl font-bold text-gray-700 whitespace-nowrap'>
                                    {mlang(pet?.name, locale as 'en' | 'ar')}
                                </Link>
                                <div className='flex gap-2 items-center'>
                                    {t("Price")}: <p className="text-gray-600">{pet.price} EG</p>
                                </div>
                            </div>
                            <div className='space-x-3 flex gap-1 px-2 py-1'>
                                <button
                                    onClick={() => {
                                        setOpen(true)
                                        setPetUpdate(pet)
                                    }}
                                    className='block' >
                                    <EditIcon className='size-6 hover:stroke-blue-500 duration-200' />
                                </button>
                                <button
                                    onClick={() => {
                                        setOpenDelete(pet.id)
                                    }}
                                >
                                    <DeleteIcon className='size-6 hover:stroke-red-500 duration-200' />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <Dialog open={open} onOpenChange={handleClose}>
                <DialogContent className='max-h-[80vh] overflow-auto' >
                    <DialogHeader>
                        <DialogTitle>{t('pets')}</DialogTitle>
                        <DialogDescription></DialogDescription>
                        <AddPet handleClose={handleClose} pet={petUpdate} />
                    </DialogHeader>
                </DialogContent>
            </Dialog>
            <Dialog open={openDelete} onOpenChange={setOpenDelete}>
                <DialogContent >
                    <DialogHeader>
                        <DialogTitle>
                            {t('deleteCategory')}
                        </DialogTitle>
                        <DialogDescription>
                            {t('deleteMessage')}
                        </DialogDescription>
                    </DialogHeader>
                    <div className='flex gap-2'>
                        <button className='px-3 py-2 rounded-md border'>
                            {t('cancel')}
                        </button>
                        <button onClick={handleDelete} className='px-3 py-2 rounded-md bg-red-500 text-white'>
                            {loading ? <LoadingIcon className='size-5 animate-spin' /> : t('delete')}
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Pets