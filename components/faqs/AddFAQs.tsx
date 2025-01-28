import React, { useState } from 'react'
import ErrorMsg from '../ErrorMsg';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { CloseIcon, LoadingIcon } from '../icons';
import useClickOutside from '@/hooks/useClickOutSide';
import axios from 'axios';
import { useAppDispatch } from '@/hooks/redux';
import { addFaqs, updateFaqs } from '@/redux/reducers/faqsReducer';
import { useAppContext } from '@/context/appContext';

const AddFAQs = ({ setOpen, faqs }: { setOpen: React.Dispatch<React.SetStateAction<boolean>>, faqs?: any }) => {
    const { register, handleSubmit, formState: { errors }, } = useForm();
    const [loading, setLoading] = useState(false);
    const t = useTranslations('faqs.form');
    const dispatch = useAppDispatch();
    const { token } = useAppContext();

    const handleClose = () => {
        setOpen(false)
        document.body.style.overflowY = 'auto';
    };


    const onSubmit = handleSubmit(async (fData) => {
        try {
            setLoading(true);
            const { data } = await axios.post(`/api/faqs`, {
                question: fData.que,
                answer: fData.ans
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            dispatch(addFaqs(data.faq))
            toast.success(t('success'));
            document.body.style.overflowY = 'auto';
            setLoading(false);
            handleClose();
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
                const { data } = await axios.put(`/api/faqs/${faqs.id}`, {
                    question: fData.que,
                    answer: fData.ans
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })
                dispatch(updateFaqs(data.faq))
                toast.success(t('successUpdate'));
                document.body.style.overflowY = 'auto';
                setLoading(false);
                handleClose();
            } catch (error: any) {
                setLoading(false);
                console.error('Submit Error:', error);
                toast.error(error.message);
            }
        }
    )

    const eleRef = useClickOutside(handleClose);
    return (
        <div className='w-full h-full fixed top-0 left-0 bg-black/50 flex justify-center items-center z-[9999] px-5'>
            <div ref={eleRef} className='w-full md:w-[420px] lg:w-[500px] bg-white  overflow-auto rounded-md max-h-[95svh]'>
                <div className='w-full flex justify-between py-3 border-b-2 px-3'>
                    <h6>
                        {faqs ? t('updateBtn') : t('btn')}
                    </h6>
                    <button onClick={() => { handleClose() }}>
                        <CloseIcon className='w-5 h-5' />
                    </button>
                </div>
                <form className='px-5  py-5' onSubmit={faqs ? handleUpdateImage : onSubmit}>
                    <div className='space-y-5'>
                        <div>
                            <input
                                {...register('que', {
                                    required: t('que.error'),
                                    value: faqs?.que
                                })}
                                type="text"
                                className="border py-3 px-2 w-full rounded-md outline-none"
                                placeholder={t('que.placeholder')}
                            />
                            <ErrorMsg message={errors?.que?.message as string} />
                        </div>
                        <div>
                            <textarea
                                {...register('ans', {
                                    required: t('ans.error'),
                                    value: faqs?.ans
                                })}
                                className="border py-3 px-2 w-full rounded-md outline-none resize-none h-32"
                                placeholder={t('ans.placeholder')}
                            />
                            <ErrorMsg message={errors?.ans?.message as string} />
                        </div>
                        <div className=" w-full ">
                            <button disabled={loading} className='w-full py-2 rounded-md border-2 border-primary hover:bg-primary hover:text-white duration-200 flex justify-center'>
                                {loading ? <LoadingIcon className='w-6 h-6 animate-spin hover:stroke-white' /> : faqs ? t('updateBtn') : t('btn')}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddFAQs