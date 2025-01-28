'use client'
import React, { useEffect } from 'react'
import FaqCard from './FaqCard'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { setFaqs } from '@/redux/reducers/faqsReducer'

const FAQsDetails = ({ faqs }: { faqs: { id: number, question: string, answer: string }[] }) => {
    const faqsData = useAppSelector(state => state.faqs.faqs) || faqs;
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(setFaqs(faqs));
    }, [])

    return (
        <div className='space-y-5'>
            {
                faqsData.map((aq: { id: number, question: string, answer: string }) => {
                    return (
                        <FaqCard
                            key={aq.id}
                            id={aq.id}
                            que={aq.question}
                            ans={aq.answer}
                        />
                    )
                })
            }
        </div>
    )
}

export default FAQsDetails