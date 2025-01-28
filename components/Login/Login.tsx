import Image from 'next/image'
import React from 'react'
import LoginForm from './LoginForm'
import Link from 'next/link'
const Login = () => {
    return (
        <div className='w-full min-h-screen bg-[#001F2D] flex justify-center items-center'>
            <div className='bg-white w-full max-w-[447px] rounded-[24px] p-8'>
                <div className='space-y-5'>
                    <div className='flex justify-center' >

                    </div>
                    <div>
                        <LoginForm />
                    </div>
                </div>
                <div className='pb-5 flex justify-between'>
                    <Link className='underline' href={'/en'}>
                        English
                    </Link>
                    <Link className='underline' href={'/ar'}>
                        العربي
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Login