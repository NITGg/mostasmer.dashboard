import type { Metadata } from 'next';
import { ReactNode } from 'react';


export const metadata: Metadata = {
    title: "Users",
    description: "This is a page for users",
}
import React from 'react'

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <div>
            {children}
        </div>
    )
}

export default Layout