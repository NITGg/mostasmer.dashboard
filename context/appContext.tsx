'use client'
import React, { createContext, useContext, useState } from 'react';
import Login from '@/components/Login/Login';
import axios from 'axios';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';

type TypeContext = {
    user: any,
    token: string;
};

const ProviderContext = createContext<TypeContext>({ user: null, token: '' });
axios.defaults.baseURL = process.env.NEXT_PUBLIC_BASE_URL as string;
axios.defaults.withCredentials = true;

const ProvdierApp = ({ children, user, token }: { children: React.ReactNode, user: any, token: string }) => {
    const [open, setOpen] = useState(false)
    return (
        <ProviderContext.Provider value={{ user, token }}>
            <div className='flex'>
                <Sidebar
                    open={open}
                    setOpen={setOpen}
                />
                <div className='flex-1 w-full bg-[#f0f2f5]'>
                    <Navbar setOpen={setOpen} />
                    {children}
                </div>
            </div>
        </ProviderContext.Provider>
    );
};

export const useAppContext = () => {
    return useContext(ProviderContext)
}
export default ProvdierApp;
