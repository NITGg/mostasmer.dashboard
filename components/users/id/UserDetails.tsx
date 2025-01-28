'use client';
import clsx from 'clsx';
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useAppContext } from '@/context/appContext';
import { DateToText } from '@/lib/DateToText';
import Link from 'next/link';
import { sliceText } from '@/lib/sliceText';
import toast from 'react-hot-toast';
import { EyeOpenIcon } from '@radix-ui/react-icons';
import { EyeOffIcon } from 'lucide-react';
import ImageApi from '@/components/ImageApi';

const UserDetails = ({ user, roles, searchParams }: { user: any, roles: any, searchParams?: any }) => {
    const t = useTranslations("user");
    const { register, handleSubmit, resetField } = useForm({ mode: "onChange", });
    const [isEditable, setIsEditable] = useState(false);
    const { token } = useAppContext();
    const [showPass, setShowPass] = useState(false);

    const onSubmit = handleSubmit(async (formData) => {
        try {
            let userData = { ...formData }
            delete userData.role;
            delete userData.password;
            userData.isConfirmed = Boolean(formData.isConfirmed)
            if (user.userRoles[0].role.name != formData.role) {
                await axios.put(`/api/update-user-role`, {
                    userId: user.id,
                    role: formData.role,
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })
            }
            if (formData.password) {
                await axios.put(`/api/rest-password/${user.id}`, {
                    password: formData.password
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })
                resetField('password')
            }
            await axios.put(`/api/user/${user.id}`, { ...userData }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            setIsEditable(false)
            toast.success("Successfully Updated!!!")
        } catch (error: any) {
            console.error(error);
            toast.error(error?.response?.data?.message || 'There is an Error')
        }
    });

    const handleFieldClick = () => {
        setIsEditable(true)
    };

    return (
        <div className='p-container'>
            <div className='space-y-10 bg-white p-3 md:p-5 rounded-lg'>
                <h4 className='text-center text-lg md:text-xl lg:text-2xl xl:text-4xl'>
                    {t('userDetails')}
                </h4>
                <div className='space-y-5 lg:space-y-10'>
                    <div className='flex flex-col md:flex-row gap-5 md:gap-14'>
                        <div className='size-44 rounded-full overflow-hidden border-2'>
                            <ImageApi
                                src={user?.imageUrl ?? '/imgs/notfound.png'}
                                alt=""
                                height={500}
                                width={500}
                                priority
                                className='size-full object-cover'
                            />
                        </div>
                        <div className='flex-1 flex  w-full'>
                            <form onSubmit={onSubmit} className='w-full'>
                                <div className='flex flex-col gap-5 lg:gap-0 lg:flex-row justify-between'>
                                    <div >
                                        <div className='space-y-5'>
                                            <label className='flex z-10 items-center'>
                                                <p className={clsx('font-medium w-28 text-left')}>Full Name :&nbsp;</p>
                                                <div className='relative flex-1'>
                                                    {!isEditable && <div onClick={handleFieldClick} className="size-full absolute z-10" />}
                                                    <input
                                                        defaultValue={user.fullname}
                                                        {...register("fullname", {
                                                            value: user.fullname
                                                        })}
                                                        disabled={!isEditable}
                                                        className='w-full border-2 border-primary disabled:border-primary/50 px-2 py-1 rounded-md'
                                                        type="text"
                                                    />
                                                </div>
                                            </label>
                                            <label className='flex z-10 items-center'>
                                                <p className={clsx('font-medium w-28 text-left')}>Email :&nbsp;</p>
                                                <div className='relative flex-1'>
                                                    {!isEditable && <div onClick={handleFieldClick} className="size-full absolute z-10" />}
                                                    <input
                                                        {...register("email", {
                                                            value: user.email
                                                        })}
                                                        defaultValue={user.email}
                                                        disabled={true}
                                                        className='w-full border-2 border-primary disabled:border-primary/50 px-2 py-1 rounded-md'
                                                        type="text"
                                                    />
                                                </div>
                                            </label>
                                            <label className='flex z-10 items-center'>
                                                <p className={clsx('font-medium w-28 text-left')}>Phone :&nbsp;</p>
                                                <div className='relative flex-1'>
                                                    {!isEditable && <div onClick={handleFieldClick} className="size-full absolute z-10" />}
                                                    <input
                                                        {...register("phone", {
                                                            value: user.phone
                                                        })}
                                                        defaultValue={user.phone}
                                                        disabled={true}
                                                        className='w-full border-2 border-primary disabled:border-primary/50 px-2 py-1 rounded-md'
                                                        type="text"
                                                    />
                                                </div>
                                            </label>
                                            <div className='relative flex items-center justify-end'>
                                                <label className='flex z-10 items-center w-full'>
                                                    <p className={clsx('font-medium w-28 text-left')}>Password :&nbsp;</p>
                                                    <div className='relative flex-1'>
                                                        {!isEditable && <div onClick={handleFieldClick} className="size-full absolute z-10" />}
                                                        <input
                                                            {...register("password", {
                                                                value: user.password
                                                            })}
                                                            placeholder='********'
                                                            disabled={!isEditable}
                                                            className='w-full border-2 border-primary disabled:border-primary/50 px-2 py-1 rounded-md'
                                                            type={showPass ? 'text' : 'password'}
                                                        />
                                                    </div>
                                                </label>
                                                <div onClick={() => setShowPass(s => !s)} className='absolute z-10 px-2'>
                                                    {
                                                        showPass ?
                                                            <EyeOpenIcon className='size-5' />
                                                            : <EyeOffIcon className='size-5' />
                                                    }
                                                </div>
                                            </div>
                                            <label className='flex z-10 items-center'>
                                                <p className={clsx('font-medium w-28 text-left')}>Status :&nbsp;</p>
                                                <div className='relative flex-1'>
                                                    {!isEditable && <div onClick={handleFieldClick} className="size-full absolute z-10" />}
                                                    <select
                                                        {...register("status", {
                                                            value: user.status
                                                        })}
                                                        defaultValue={user.status}
                                                        disabled={!isEditable}
                                                        className=' w-full border-2 border-primary disabled:border-primary/50 px-2 py-1 rounded-md'
                                                    >
                                                        <option value="ACTIVE">ACTIVE</option>
                                                        <option value="BLOCKED">BLOCKED</option>
                                                    </select>
                                                    {user.status == "BLOCKED" && <span className='text-xs text-red-500'>{searchParams?.active}</span>}
                                                </div>
                                            </label>
                                            <label className='flex z-10 items-center'>
                                                <p className={clsx('font-medium w-28 text-left')}>Language :&nbsp;</p>
                                                <div className='relative flex-1'>
                                                    {!isEditable && <div onClick={handleFieldClick} className="size-full absolute z-10" />}
                                                    <select
                                                        {...register("lang", {
                                                            value: user.lang
                                                        })}
                                                        defaultValue={user.lang}
                                                        disabled={!isEditable}
                                                        className=' w-full border-2 border-primary disabled:border-primary/50 px-2 py-1 rounded-md'
                                                    >
                                                        <option value="en">en</option>
                                                        <option value="ar">ar</option>
                                                    </select>
                                                </div>
                                            </label>
                                            <label className='flex z-10 items-center'>
                                                <p className={clsx('font-medium w-28 text-left')}>Confirmed :&nbsp;</p>
                                                <div className='relative flex-1'>
                                                    {!isEditable && <div onClick={handleFieldClick} className="size-full absolute z-10" />}
                                                    <select
                                                        {...register("isConfirmed", {
                                                            value: user.isConfirmed ? 1 : 0
                                                        })}
                                                        defaultValue={user.isConfirmed ? 1 : 0}
                                                        disabled={!isEditable}
                                                        className=' w-full border-2 border-primary disabled:border-primary/50 px-2 py-1 rounded-md'
                                                    >
                                                        <option value={1}>True</option>
                                                        <option value={0}>False</option>
                                                    </select>
                                                </div>
                                            </label>
                                            <label className='flex z-10 items-center'>
                                                <p className={clsx('font-medium w-28 text-left')}>Role :&nbsp;</p>
                                                <div className='relative flex-1'>
                                                    {!isEditable && <div onClick={handleFieldClick} className="size-full absolute z-10" />}
                                                    {user.userRoles[0].role.name &&
                                                        <select
                                                            {...register("role", {
                                                                value: user.userRoles[0].role.name
                                                            })}
                                                            defaultValue={user.userRoles[0].role.name}
                                                            disabled={!isEditable}
                                                            className=' w-full border-2 border-primary disabled:border-primary/50 px-2 py-1 rounded-md'
                                                        >
                                                            {
                                                                roles.map((role: any) => {
                                                                    return <option key={role.id} value={role?.name}>{role?.name}</option>
                                                                })
                                                            }
                                                        </select>}
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='space-y-5'>
                                            <div className='flex z-10 items-center'>
                                                <p className={clsx('font-medium w-44 text-left')}>CreatedAt :&nbsp;</p>
                                                <div>
                                                    {DateToText(user.createdAt)}
                                                </div>
                                            </div>
                                            <div className='flex z-10 items-center'>
                                                <p className={clsx('font-medium w-44 text-left')}>UpdatedAt :&nbsp;</p>
                                                <div>
                                                    {DateToText(user.updatedAt)}
                                                </div>
                                            </div>
                                            <div className='flex z-10 items-center'>
                                                <p className={clsx('font-medium w-44 text-left')}>PasswordLastUpdated :&nbsp;</p>
                                                <div>
                                                    {DateToText(user.passwordLastUpdated)}
                                                </div>
                                            </div>
                                            <div className='flex z-10 items-center'>
                                                <p className={clsx('font-medium w-44 text-left')}>LastLoginAt :&nbsp;</p>
                                                <div>
                                                    {DateToText(user.lastLoginAt)}
                                                </div>
                                            </div>
                                            <div className='flex z-10 items-center'>
                                                <p className={clsx('font-medium w-44 text-left')}>uuid :&nbsp;</p>
                                                <div>
                                                    {user.uuid}
                                                </div>
                                            </div>
                                            {!user?.Address?.length ? "" :
                                                <div>
                                                    <h5>Addresses: </h5>
                                                    <ul>
                                                        {user.Address.map((address: any, i: any) =>
                                                            <li
                                                                key={address.id}
                                                            >
                                                                <span>
                                                                    {i + 1} -{" "}
                                                                </span>
                                                                <Link
                                                                    className='hover:text-red-500 duration-500'
                                                                    href={`https://www.google.com/maps?q=${address.lat},${address.long}`}
                                                                    target="_blank" >
                                                                    {sliceText(address.address, 40)}
                                                                </Link>
                                                            </li>
                                                        )}
                                                    </ul>
                                                </div>}
                                        </div>
                                    </div>
                                </div>
                                <div className='flex justify-center w-full mt-5'>
                                    {isEditable &&
                                        <button className='py-2 px-10 rounded-md bg-blue-500 text-white'>
                                            Update Profile
                                        </button>
                                    }
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserDetails;