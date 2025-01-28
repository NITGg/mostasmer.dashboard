'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast';
import { useTranslations } from 'next-intl';
import ErrorMsg from '../ErrorMsg';
import { LoadingIcon } from '../icons';
import axios from 'axios';
import { setCookie } from '@/lib/setCookie';
import { PhoneIcon,  EyeIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';


const LoginForm = () => {
    const { register, formState: { errors }, handleSubmit } = useForm();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const t = useTranslations('login')

    const onSubmit = async (formData: any) => {
        try {
            setLoading(true)
            const { data: loginData } = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/login`, {
                phone: formData.email,
                password: formData.password
            })

            const { data: userData } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/verify-me`, {
                headers: {
                    Authorization: `Bearer ${loginData.token}`
                }
            })

            if (userData.user.role !== 'admin') {
                throw new Error('Only administrators can access this portal')
            }

            setCookie('token', loginData.token, 360)
            toast.success(loginData.message as string)
            window.location.reload()
        } catch (error: any) {
            console.error('Login Error:', error)
            toast.error(error?.response?.data?.message || error.message || 'There is an Error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='space-y-8'>
                            {/* Logo */}
            <div className='flex justify-center'>
                <Image
                    src="/imgs/dash_ico.svg"
                    alt="Mostasmer Logo"
                    width={120}
                    height={40}
                    className='object-contain'
                />
                </div>
{/* Welcome Text */}

            
                <h6 className='text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#59c2df] to-[#25454f] object-center'>{t('ProductName')}</h6  >



            <div className='space-y-1'>
                <h1 className='text-2xl font-bold'>{t('welcome_login_big')}</h1>
                <p className='text-gray-600'>{t('welcome_login_text')}</p>
            </div>

                

                
            </div>
                <div className='relative flex items-center '>
                <span className='absolute left-3'>
                            <PhoneIcon className='h-5 w-5 text-gray-400' />
                        </span>
                    <input
                        className='w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500'
                        {...register('email', { required: t('error.email') })}
                        type="text"
                        placeholder={t('email')}
                    />
                    <ErrorMsg message={errors?.email?.message as string} />
                </div>
                <div>
                    <div className='relative flex items-center'>
                        <span className='absolute left-3'>
                            <PhoneIcon className='h-5 w-5 text-gray-400' />
                        </span>
                        <input
                            {...register('password', { required: t('error.password') })}
                            type={showPassword ? "text" : "password"}
                            placeholder={t('password')}
                            className='w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500'
                        />
                        <button 
                            type="button" 
                            className='absolute right-3 text-gray-400 hover:text-gray-600'
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <EyeIcon className='h-5 w-5' />
                        </button>
                    </div>
                    <ErrorMsg message={errors?.password?.message as string} />
                </div>
                <button className='py-[12px] px-4 rounded-2xl  bg-teal-500 text-sm text-white flex justify-center items-center hover:bg-white/90 hover:text-teal-500 hover:border hover:border-teal-500 transition-colors duration-200  mt-6 mx-auto'>
                    {loading ? <LoadingIcon className='size-5 animate-spin' /> : t('btn')}
                </button>
        </form>
    )
}

export default LoginForm