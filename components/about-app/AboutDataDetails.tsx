'use client';
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import UpdateKeyAndValue from "./UpdateKeyAndValue";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { setAboutData } from "@/redux/reducers/aboutAppReducer";

const AboutDataDetails = ({ aboutApp }: { aboutApp: any }) => {
    const [data, setData] = useState({ key: "", value: "", label: "", type: '', inputType: 'text' } as any)
    const [open, setOpen] = useState('')

    const t = useTranslations('about-app')
    const aboutData: any = useAppSelector(state => state.about.aboutData) || aboutApp
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setAboutData(aboutApp));
    }, [])

    return (
        <div>
            <div className="p-container-dashboard space-y-10">
                <div className="grid grid-cols-12 md:gap-5 lg:gap-10 space-y-5 md:space-y-0">
                    <div
                        onClick={() => {
                            setData({ key: `phone`, value: aboutData?.phone, label: t('phone'), type: "input" })
                            setOpen('phone')
                            document.body.style.overflow = 'hidden'
                        }}
                        className="col-span-12 md:col-span-6 lg:col-span-4 cursor-pointer py-4 px-5 bg-white rounded-lg shadow-md flex items-center gap-3">
                        <span className="font-bold">
                            {t('phone')}
                        </span>
                        <span>
                            {aboutData?.phone}
                        </span>
                    </div>
                    <div
                        onClick={() => {
                            setData({ key: `email`, value: aboutData?.email, label: t('email'), type: "input", inputType: 'email' })
                            setOpen('email')
                            document.body.style.overflow = 'hidden'
                        }}
                        className="col-span-12 md:col-span-6 lg:col-span-4 cursor-pointer py-4 px-5 bg-white rounded-lg shadow-md flex items-center gap-3">
                        <span className="font-bold">
                            {t('email')}
                        </span>
                        <span>
                            {aboutData?.email}
                        </span>
                    </div>
                    <div
                        onClick={() => {
                            setData({ key: `vat`, value: +aboutData?.vat, label: t('vat'), type: "input", inputType: 'number' })
                            setOpen('vat')
                            document.body.style.overflow = 'hidden'
                        }}
                        className="col-span-12 md:col-span-6 lg:col-span-4 cursor-pointer py-4 px-5 bg-white rounded-lg shadow-md flex items-center gap-3">
                        <span className="font-bold">
                            {t('vat')}
                        </span>
                        <span>
                            {aboutData?.vat}
                        </span>
                    </div>
                </div>
                <div
                    onClick={() => {
                        setData({ key: `about`, value: aboutData?.about, label: t('about') })
                        setOpen('about')
                        document.body.style.overflow = 'hidden'
                    }}
                    className="py-4 px-5 bg-white rounded-lg shadow-md flex flex-col gap-3 cursor-pointer">
                    <span className="font-bold">
                        {t('about')}
                    </span>
                    <p>
                        {aboutData?.about}
                    </p>
                </div>
                <div onClick={() => {
                    setData({ key: `aboutar`, value: aboutData?.aboutar, label: t('aboutAr') })
                    setOpen('aboutar')
                    document.body.style.overflow = 'hidden'
                }}
                    className="cursor-pointer py-4 px-5 bg-white rounded-lg shadow-md flex flex-col gap- cursor-pointer3"
                >
                    <span className="font-bold">
                        {t('aboutAr')}
                    </span>
                    <p>
                        {aboutData?.aboutar}
                    </p>
                </div>
                <div
                    onClick={() => {
                        setData({ key: `mission`, value: aboutData?.mission, label: t('missin') })
                        setOpen('Missin')
                        document.body.style.overflow = 'hidden'
                    }}
                    className="py-4 px-5 bg-white rounded-lg shadow-md flex flex-col gap-3 cursor-pointer">
                    <span className="font-bold">
                        {t('missin')}
                    </span>
                    <p>
                        {aboutData?.mission}
                    </p>
                </div>
                <div
                    onClick={() => {
                        setData({ key: `missionar`, value: aboutData?.missionar, label: t('missinAr') })
                        setOpen('missionar')
                        document.body.style.overflow = 'hidden'
                    }}
                    className="py-4 px-5 bg-white rounded-lg shadow-md flex flex-col gap-3 cursor-pointer">
                    <span className="font-bold">
                        {t('missinAr')}
                    </span>
                    <p>
                        {aboutData?.missionar}
                    </p>
                </div>
                <div
                    onClick={() => {
                        setData({ key: `vission`, value: aboutData?.vission, label: t('vission') })
                        setOpen('vission')
                        document.body.style.overflow = 'hidden'
                    }}
                    className="py-4 px-5 bg-white rounded-lg shadow-md flex flex-col gap-3 cursor-pointer">
                    <span className="font-bold">
                        {t('vission')}
                    </span>
                    <p>
                        {aboutData?.vission}
                    </p>
                </div>
                <div
                    onClick={() => {
                        setData({ key: `vissionar`, value: aboutData?.vissionar, label: t('vissionAr') })
                        setOpen('vissionar')
                        document.body.style.overflow = 'hidden'
                    }}
                    className="py-4 px-5 bg-white rounded-lg shadow-md flex flex-col gap-3 cursor-pointer">
                    <span className="font-bold">
                        {t('vissionAr')}
                    </span>
                    <p>
                        {aboutData?.vissionar}
                    </p>
                </div>
                <div
                    onClick={() => {
                        setData({ key: `privacy_policy`, value: aboutData?.privacy_policy, label: t('privacy') })
                        setOpen('privacy_policy')
                        document.body.style.overflow = 'hidden'
                    }}
                    className="py-4 px-5 bg-white rounded-lg shadow-md flex flex-col gap-3 cursor-pointer">
                    <span className="font-bold">
                        {t('privacy')}
                    </span>
                    <p>
                        {aboutData?.privacy_policy}
                    </p>
                </div>
                <div
                    onClick={() => {
                        setData({ key: `privacy_policyar`, value: aboutData?.privacy_policyar, label: t('privacyAr') })
                        setOpen('privacyAr')
                        document.body.style.overflow = 'hidden'
                    }}
                    className="py-4 px-5 bg-white rounded-lg shadow-md flex flex-col gap-3 cursor-pointer">
                    <span className="font-bold">
                        {t('privacyAr')}
                    </span>
                    <p>
                        {aboutData?.privacy_policyar}
                    </p>
                </div>
                <div
                    onClick={() => {
                        setData({ key: `terms`, value: aboutData?.terms, label: t('terms') })
                        setOpen('terms')
                        document.body.style.overflow = 'hidden'
                    }}
                    className="py-4 px-5 bg-white rounded-lg shadow-md flex flex-col gap-3 cursor-pointer">
                    <span className="font-bold">
                        {t('terms')}
                    </span>
                    <p>
                        {aboutData?.terms}
                    </p>
                </div>
                <div
                    onClick={() => {
                        setData({ key: `termsar`, value: aboutData?.termsar, label: t('termsAr') })
                        setOpen('termsAr')
                        document.body.style.overflow = 'hidden'
                    }}
                    className="py-4 px-5 bg-white rounded-lg shadow-md flex flex-col gap-3 cursor-pointer">
                    <span className="font-bold">
                        {t('termsAr')}
                    </span>
                    <p>
                        {aboutData?.termsar}
                    </p>
                </div>
            </div>
            {open &&
                < UpdateKeyAndValue
                    label={data.label}
                    value={data.value}
                    type={data.type}
                    inputType={data.inputType}
                    keyData={data.key}
                    DOC_ID='about-app'
                    setOpen={setOpen}
                />}
        </div>
    )
}

export default AboutDataDetails