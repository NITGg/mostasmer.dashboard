'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Input } from '../ui/input'
import { useAppContext } from '@/context/appContext'

interface BankAccount {
  id: number
  bankName: string
  accountNumber: string
  iban: string
}

interface BankAccountsProps {
  brandId: number
}

export default function BankAccounts({ brandId }: BankAccountsProps) {
  const t = useTranslations('brand')
  const { token } = useAppContext()
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null)
  const [formData, setFormData] = useState({
    bankName: '',
    accountNumber: '',
    iban: ''
  })

  const fetchBankAccounts = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/bank-accounts/${brandId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setBankAccounts(response.data.data ? [response.data.data] : [])
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setBankAccounts([])
      } else {
        console.error('Error fetching bank accounts:', error)
        toast.error(t('failedToLoadBankingInfo'))
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      fetchBankAccounts()
    }
  }, [brandId, token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (selectedAccount) {
        // Update existing account using PUT request
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/bank-accounts/${brandId}`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        )
        toast.success(t('successfullyUpdated'))
      } else {
        // Create new account using POST request
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/bank-accounts/${brandId}`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        )
        toast.success(t('success'))
      }
      fetchBankAccounts()
      setIsAddDialogOpen(false)
      setIsEditDialogOpen(false)
      setSelectedAccount(null)
      setFormData({ bankName: '', accountNumber: '', iban: '' })
    } catch (error) {
      console.error('Error saving bank account:', error)
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message)
        // If we have existing data, show it in the edit form
        if (error.response.data.data) {
          setSelectedAccount(error.response.data.data)
          setFormData({
            bankName: error.response.data.data.bankName,
            accountNumber: error.response.data.data.accountNumber,
            iban: error.response.data.data.iban
          })
          setIsAddDialogOpen(false)
          setIsEditDialogOpen(true)
        }
      } else {
        toast.error(t('failedToUpdateBankingInfo'))
      }
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm(t('deleteMessage'))) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/bank-accounts/${brandId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        toast.success(t('successDelete'))
        fetchBankAccounts()
      } catch (error) {
        console.error('Error deleting bank account:', error)
        toast.error(t('failedToUpdateBankingInfo'))
      }
    }
  }

  const handleEdit = (account: BankAccount) => {
    setSelectedAccount(account)
    setFormData({
      bankName: account.bankName,
      accountNumber: account.accountNumber,
      iban: account.iban
    })
    setIsEditDialogOpen(true)
  }

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <div className="flex gap-4 items-center">
          <label className="w-24 text-xs text-slate-950">{t('bankName')} :</label>
          <Input
            id="bankName"
            value={formData.bankName}
            onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
            required
            className="flex-1 px-3.5 py-1 text-xs bg-white rounded-xl border border-zinc-300 text-black-400"
          />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex gap-4 items-center">
          <label className="w-24 text-xs text-slate-950">{t('accountNumber')} :</label>
          <Input
            id="accountNumber"
            value={formData.accountNumber}
            onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
            required
            className="flex-1 px-3.5 py-1 text-xs bg-white rounded-xl border border-zinc-300 text-black-400"
          />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex gap-4 items-center">
          <label className="w-24 text-xs text-slate-950">{t('iban')} :</label>
          <Input
            id="iban"
            value={formData.iban}
            onChange={(e) => setFormData({ ...formData, iban: e.target.value })}
            required
            className="flex-1 px-3.5 py-1 text-xs bg-white rounded-xl border border-zinc-300 text-black-400"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => {
            setIsAddDialogOpen(false)
            setIsEditDialogOpen(false)
            setSelectedAccount(null)
            setFormData({ bankName: '', accountNumber: '', iban: '' })
          }}
          className="px-4 py-1 text-xs bg-red-200 hover:bg-gray-300 text-red-700 rounded-lg"
        >
          {t('cancel')}
        </button>
        <button
          type="submit"
          className="px-4 py-1 text-xs bg-teal-500 text-white rounded-lg hover:bg-teal-600"
        >
          {selectedAccount ? t('update') : t('save')}
        </button>
      </div>
    </form>
  )

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <button
              className={`px-4 py-1 text-xs rounded-lg transition-colors ${
                bankAccounts.length > 0
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-teal-500 text-white hover:bg-teal-600'
              }`}
              disabled={bankAccounts.length > 0}
            >
              {t('add')}
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('addBankAccount')}</DialogTitle>
            </DialogHeader>
            {renderForm()}
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-4 text-sm text-gray-500">{t('loading')}</div>
      ) : bankAccounts.length === 0 ? (
        <div className="text-center py-4 text-sm text-gray-500">{t('noBankAccountsFound')}</div>
      ) : (
        <div className="bg-white rounded-lg border">
          {bankAccounts.map((account) => (
            <div key={account.id} className="p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex gap-4 items-center">
                    <label className="w-24 text-xs text-slate-950">{t('bankName')} :</label>
                    <span className="text-sm text-gray-600">{account.bankName}</span>
                  </div>
                  <div className="flex gap-4 items-center">
                    <label className="w-24 text-xs text-slate-950">{t('accountNumber')} :</label>
                    <span className="text-sm text-gray-600">{account.accountNumber}</span>
                  </div>
                  <div className="flex gap-4 items-center">
                    <label className="w-24 text-xs text-slate-950">{t('iban')} :</label>
                    <span className="text-sm text-gray-600">{account.iban}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(account)}
                    className="p-1 text-gray-500 hover:text-teal-500 transition-colors"
                  >
                    <PencilSquareIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(account.id)}
                    className="p-1 text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('editBankAccount')}</DialogTitle>
          </DialogHeader>
          {renderForm()}
        </DialogContent>
      </Dialog>
    </div>
  )
} 