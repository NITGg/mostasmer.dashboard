'use client'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAppContext } from '@/context/appContext';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

const DeleteUser = ({ userId }: { userId: string }) => {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const { token } = useAppContext()
    const handleDeleteAccount = async () => {
        try {
            const { data } = await axios.put(`/api/user/${userId}`, {
                isDelete: true
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            setOpen(false)
            router.push('/users')
            setTimeout(() => window.location.reload(), 500)
            toast.success('You delete account')
        } catch (error: any) {
            console.error(error);
            toast.error(error?.response?.data?.message || 'There is an Error')
        }
    }
    return (
        <div className='p-container'>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <button onClick={() => { setOpen(true) }} className='py-2 px-10 rounded-md bg-red-500 text-white'>
                        Delete Account
                    </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Delete Account</DialogTitle>
                        <DialogDescription>
                            Do you want to delete this account?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <button className='text-red-500' onClick={handleDeleteAccount}>Delete</button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default DeleteUser