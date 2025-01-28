import React, { useState } from 'react'
import clsx from 'clsx'
import { useLocale, useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { CloseIcon, LoadingIcon } from '../icons'
import ErrorMsg from '../ErrorMsg'
import useClickOutside from '@/hooks/useClickOutSide'
import axios from 'axios'
import { useAppContext } from '@/context/appContext'
import { useAppDispatch } from '@/hooks/redux'
import { updateAboutData } from '@/redux/reducers/aboutAppReducer'

interface UpdateKeyAndValueInterface {
    label: string,
    type?: string,
    keyData: string,
    value: any,
    setOpen: React.Dispatch<React.SetStateAction<string>>,
    DOC_ID: string,
    inputType: string
}

const UpdateKeyAndValue: React.FC<UpdateKeyAndValueInterface> = ({
    label,
    type,
    keyData,
    value,
    setOpen,
    DOC_ID,
    inputType
}) => {
    const [loading, setLoading] = useState(false)
    const { register, formState: { errors }, handleSubmit } = useForm()
    const { token } = useAppContext();

    const t = useTranslations('popup');
    const locale = useLocale();
    const dispatch = useAppDispatch();

    const handleClose = () => {
        setOpen("")
        document.body.style.overflowY = 'auto'
    }
    const handleOnSubmit = async (fData: any) => {
        setLoading(true)
        const { data } = await axios.put('/api/about-app', {
            [keyData]: inputType == 'number' ? +fData.value : fData.value
        }, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        dispatch(updateAboutData(data.aboutApp))
        handleClose()
        setLoading(false)
    }

    const eleRef = useClickOutside(handleClose);
    return (
        <div className='w-full h-full fixed top-0 left-0 bg-black/50 flex justify-center items-center z-[99999] p-container'>
            <div ref={eleRef} className='w-full md:w-[420px] lg:w-[600px] bg-white overflow-auto rounded-md max-h-[95svh] hide-'>
                <form onSubmit={handleSubmit(handleOnSubmit)} className='space-y-3'>
                    <div className='w-full flex justify-between py-3 border-b-2 px-2'>
                        <h6>
                            {label}
                        </h6>
                        <div className='cursor-pointer' onClick={handleClose}     >
                            <CloseIcon className='w-5 h-5' />
                        </div>
                    </div>
                    <div className=' px-3'>
                        {
                            type == 'input' ?
                                <input
                                    type={inputType}
                                    className='w-full px-2 rounded-md border resize-none py-3'
                                    {...register('value', {
                                        required: t('error'),
                                        value: value
                                    })}
                                />
                                : <textarea
                                    className='w-full h-32 rounded-md border resize-none py-3 px-2'
                                    {...register('value', {
                                        required: t('error'),
                                        value: value
                                    })}
                                />
                        }
                        <ErrorMsg message={errors?.value?.message as string} />
                    </div>
                    <div className={clsx(
                        'flex px-3 py-2 gap-3 bg-gray-100',
                        { 'justify-end': locale == 'ar' },
                        { 'flex-row-reverse': locale !== 'ar' },
                    )}>
                        <div
                            className='px-3 py-2 rounded-md bg-gray-300 cursor-pointer'
                            onClick={handleClose}
                        >
                            {t('disagree')}
                        </div>
                        <button
                            disabled={loading}
                            className='px-3 py-2 rounded-md text-white disabled:bg-black/20 disabled:px-10 d bg-primary'
                        >
                            {loading ?
                                <LoadingIcon className='w-6 h-6 animate-spin' /> :
                                t('agree')
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UpdateKeyAndValue