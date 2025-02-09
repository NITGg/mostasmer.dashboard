import type { Metadata } from "next";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Toaster } from "react-hot-toast";
import axios from 'axios';
import ProvdierApp from "@/context/appContext";
import { cookies } from "next/headers";
import ReduxProvider from "@/redux/ReduxProvider";
import Login from "@/components/Login/Login";

axios.defaults.baseURL = process.env.BASE_URL as string;
axios.defaults.withCredentials = true;

export const metadata: Metadata = {
  title: "Mostasmer App",
  description: "investment payback app",
};

export default async function RootLayout({
  children,
  params: { locale }
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const messages = await getMessages();
  const token = cookies().get('token')?.value;
  const fetchUser = async () => {
    try {
      console.log('Checking token:', token)
      if (!token) {
        console.log('No token found')
        return { data: null, error: 'token is required' }
      }
      
      // Log the full request details
      console.log('Making verification request to:', `${process.env.BASE_URL}/api/verify-me`)
      console.log('With headers:', {
        Authorization: `Bearer ${token}`,
        credentials: "include"
      })

      const res = await fetch(`${process.env.BASE_URL}/api/verify-me`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"  // Add content type header
        },
        cache: 'no-store'
      })
      
      console.log('Verification Response Status:', res.status)
      
      if (!res.ok) {
        const errorText = await res.text()
        console.log('Verification Error:', errorText)
        return { data: null, error: errorText }
      }
      
      const data = await res.json();
      console.log('Verification Success Data:', data)
      
      // Add explicit check for user data
      if (!data.user) {
        console.log('No user data in response')
        return { data: null, error: 'No user data' }
      }
      
      return { data: data, error: null }
    } catch (error: any) {
      console.error('Verification Error:', error)
      return { data: null, error: error?.message }
    }
  }
  const { data, error } = await fetchUser() as { data: any, error: any };
  
  // Log the final result
  console.log('Final auth state:', { hasUser: !!data?.user, error })

  return (
    <html lang="en" dir={locale == 'ar' ? 'rtl' : "ltr"}>
      <body
        className={`antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <ReduxProvider>
            {
              data?.user ?
                <ProvdierApp user={data?.user} token={token as string}>
                  {children}
                </ProvdierApp>
                :
                <Login />
            }
          </ReduxProvider>
          <Toaster toastOptions={{ duration: 4000, position: "bottom-right", }} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

