// 'use client';

// import { useState, useEffect } from 'react';
// import { useTranslations } from 'next-intl';
// import { LoadingIcon } from '../icons';
// import toast from 'react-hot-toast';
// import { useAppContext } from '@/context/appContext';

// interface BankAccount {
//     bankName: string;
//     accountNumber: string;
//     iban: string;
// }

// interface BankAccountFormProps {
//     brandId: string | number;
// }

// export default function BankAccountForm({ brandId }: BankAccountFormProps) {
//     const [bankAccount, setBankAccount] = useState<BankAccount | null>(null);
//     const [isBankInfoEdited, setIsBankInfoEdited] = useState(false);
//     const [savingBankInfo, setSavingBankInfo] = useState(false);
//     const { token } = useAppContext();
//     const t = useTranslations('brand');

//     useEffect(() => {
//         fetchBankAccount();
//     }, [brandId, token]);

//     const fetchBankAccount = async () => {
//         try {
//             const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/${brandId}/bank-account`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });
//             const data = await response.json();
//             if (data.bankAccount) {
//                 setBankAccount(data.bankAccount);
//             }
//         } catch (error) {
//             console.error('Failed to fetch bank account:', error);
//         }
//     };

//     const handleBankInfoUpdate = async () => {
//         if (!brandId || !bankAccount) return;

//         setSavingBankInfo(true);
//         try {
//             // First check if bank account exists
//             const checkResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/${brandId}/bank-account`, {
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                 },
//             });
//             const checkData = await checkResponse.json();
            
//             // Determine method based on whether bank account exists
//             const method = checkData.bankAccount ? 'PUT' : 'POST';

//             const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/${brandId}/bank-account`, {
//                 method,
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     bankName: bankAccount.bankName,
//                     accountNumber: bankAccount.accountNumber,
//                     iban: bankAccount.iban,
//                 }),
//             });

//             const data = await response.json();
//             if (response.ok) {
//                 toast.success(t('bank_account_updated'));
//                 setBankAccount(data.bankAccount);
//                 setIsBankInfoEdited(false);
//             } else {
//                 toast.error(data.message || t('failed_to_update_bank_info'));
//             }
//         } catch (error) {
//             console.error('Failed to update bank info:', error);
//             toast.error(t('failed_to_update_bank_info'));
//         } finally {
//             setSavingBankInfo(false);
//         }
//     };

//     const handleInputChange = (field: keyof BankAccount, value: string) => {
//         setBankAccount(prev => prev ? {
//             ...prev,
//             [field]: value
//         } : {
//             bankName: field === 'bankName' ? value : '',
//             accountNumber: field === 'accountNumber' ? value : '',
//             iban: field === 'iban' ? value : ''
//         });
//         setIsBankInfoEdited(true);
//     };

//     return (
//         <div className="bg-white drop-shadow-2xl p-6 mt-8 rounded-xl shadow-xl">
//             <div className="flex justify-between items-center mb-4">
//                 <h2 className="font-bold text-lg text-slate-950">{t('BankInformation')}</h2>
//                 <div className="flex gap-2">
//                     {isBankInfoEdited && (
//                         <button
//                             onClick={() => {
//                                 fetchBankAccount();
//                                 setIsBankInfoEdited(false);
//                             }}
//                             className="px-4 py-1 rounded-lg text-sm bg-gray-200 hover:bg-gray-300 text-gray-700"
//                         >
//                             {t('cancel')}
//                         </button>
//                     )}
//                     <button
//                         onClick={handleBankInfoUpdate}
//                         disabled={!isBankInfoEdited || savingBankInfo}
//                         className={`px-4 py-1 rounded-lg text-sm transition-colors ${
//                             isBankInfoEdited
//                                 ? 'bg-teal-500 text-white hover:bg-teal-600'
//                                 : 'bg-gray-200 text-gray-500'
//                         }`}
//                     >
//                         {savingBankInfo ? (
//                             <LoadingIcon className="w-5 h-5 animate-spin" />
//                         ) : t('save')}
//                     </button>
//                 </div>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div className="space-y-2">
//                     <label className="block text-sm font-medium text-gray-700">
//                         {t('bank_name')}
//                     </label>
//                     <input
//                         type="text"
//                         value={bankAccount?.bankName || ''}
//                         onChange={(e) => handleInputChange('bankName', e.target.value)}
//                         className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
//                         placeholder={t('enter_bank_name')}
//                     />
//                 </div>
//                 <div className="space-y-2">
//                     <label className="block text-sm font-medium text-gray-700">
//                         {t('account_number')}
//                     </label>
//                     <input
//                         type="text"
//                         value={bankAccount?.accountNumber || ''}
//                         onChange={(e) => handleInputChange('accountNumber', e.target.value)}
//                         className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
//                         placeholder={t('enter_account_number')}
//                     />
//                 </div>
//                 <div className="space-y-2">
//                     <label className="block text-sm font-medium text-gray-700">
//                         {t('iban')}
//                     </label>
//                     <input
//                         type="text"
//                         value={bankAccount?.iban || ''}
//                         onChange={(e) => handleInputChange('iban', e.target.value)}
//                         className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
//                         placeholder={t('enter_iban')}
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// } 


'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { LoadingIcon } from '../icons';
import toast from 'react-hot-toast';
import { useAppContext } from '@/context/appContext';

interface BankAccount {
    bankName: string;
    accountNumber: string;
    iban: string;
}

interface BankAccountFormProps {
    brandId: string | number;
}

export default function BankAccountForm({ brandId }: BankAccountFormProps) {
    const [bankAccount, setBankAccount] = useState<BankAccount | null>(null);
    const [isBankInfoEdited, setIsBankInfoEdited] = useState(false);
    const [savingBankInfo, setSavingBankInfo] = useState(false);
    const { token } = useAppContext();
    const t = useTranslations('brand');

    useEffect(() => {
        fetchBankAccount();
    }, [brandId, token]);

    const fetchBankAccount = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/${brandId}/bank-account`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.bankAccount) {
                setBankAccount(data.bankAccount);
            }
        } catch (error) {
            console.error('Failed to fetch bank account:', error);
        }
    };

    const handleBankInfoUpdate = async () => {
        if (!brandId || !bankAccount) return;

        setSavingBankInfo(true);
        try {
            // First check if bank account exists
            const checkResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/${brandId}/bank-account`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const checkData = await checkResponse.json();
            
            // Determine method based on whether bank account exists
            const method = checkData.bankAccount ? 'PUT' : 'POST';

            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/${brandId}/bank-account`, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bankName: bankAccount.bankName,
                    accountNumber: bankAccount.accountNumber,
                    iban: bankAccount.iban,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                toast.success(t('bank_account_updated'));
                setBankAccount(data.bankAccount);
                setIsBankInfoEdited(false);
            } else {
                toast.error(data.message || t('failed_to_update_bank_info'));
            }
        } catch (error) {
            console.error('Failed to update bank info:', error);
            toast.error(t('failed_to_update_bank_info'));
        } finally {
            setSavingBankInfo(false);
        }
    };

    const handleInputChange = (field: keyof BankAccount, value: string) => {
        setBankAccount(prev => prev ? {
            ...prev,
            [field]: value
        } : {
            bankName: field === 'bankName' ? value : '',
            accountNumber: field === 'accountNumber' ? value : '',
            iban: field === 'iban' ? value : ''
        });
        setIsBankInfoEdited(true);
    };

    return (
        <div className="bg-white drop-shadow-2xl p-6 mt-8 rounded-xl shadow-xl">
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg text-slate-950">{t('BankInformation')}</h2>
                <div className="flex gap-2">
                    {isBankInfoEdited && (
                        <button
                            onClick={() => {
                                fetchBankAccount();
                                setIsBankInfoEdited(false);
                            }}
                            className="px-4 py-1 rounded-lg text-sm bg-gray-200 hover:bg-gray-300 text-gray-700"
                        >
                            {t('cancel')}
                        </button>
                    )}
                    <button
                        onClick={handleBankInfoUpdate}
                        disabled={!isBankInfoEdited || savingBankInfo}
                        className={`px-4 py-1 rounded-lg text-sm transition-colors ${
                            isBankInfoEdited
                                ? 'bg-teal-500 text-white hover:bg-teal-600'
                                : 'bg-gray-200 text-gray-500'
                        }`}
                    >
                        {savingBankInfo ? (
                            <LoadingIcon className="w-5 h-5 animate-spin" />
                        ) : t('save')}
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        {t('bank_name')}
                    </label>
                    <input
                        type="text"
                        value={bankAccount?.bankName || ''}
                        onChange={(e) => handleInputChange('bankName', e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder={t('enter_bank_name')}
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        {t('account_number')}
                    </label>
                    <input
                        type="text"
                        value={bankAccount?.accountNumber || ''}
                        onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder={t('enter_account_number')}
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        {t('iban')}
                    </label>
                    <input
                        type="text"
                        value={bankAccount?.iban || ''}
                        onChange={(e) => handleInputChange('iban', e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder={t('enter_iban')}
                    />
                </div>
            </div>
        </div>
    );
} 