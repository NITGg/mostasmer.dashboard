'use client'
import React, { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useAppContext } from '@/context/appContext'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import Pill from '@/components/ui/Pill'

interface UserClass {
  id: number
  name: string
  color: string
  purchaseCount: number
  monthsPeriod: number
  description: string
}

interface FormData {
  name: string
  color: string
  purchaseCount: number
  monthsPeriod: number
  description: string
}

const initialFormData: FormData = {
  name: '',
  color: '#00a18f',
  purchaseCount: 1,
  monthsPeriod: 1,
  description: ''
}

export default function UserClassList() {
  const t = useTranslations('userClass')
  const { token } = useAppContext()
  const [userClasses, setUserClasses] = useState<UserClass[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [openDelete, setOpenDelete] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>(initialFormData)

  useEffect(() => {
    fetchUserClasses()
  }, [])

  const fetchUserClasses = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user-class`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) throw new Error('Failed to fetch user classes')
      const data = await response.json()
      setUserClasses(data.userClasses)
    } catch (error) {
      console.error('Error:', error)
      toast.error(t('failed_to_fetch'))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user-class`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error('Failed to create user class')

      const data = await response.json()
      setUserClasses([...userClasses, data.userClass])
      setIsModalOpen(false)
      setFormData(initialFormData)
      toast.success(t('created_successfully'))
    } catch (error) {
      console.error('Error:', error)
      toast.error(t('failed_to_create'))
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!openDelete) return

    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user-class/${openDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) throw new Error('Failed to delete user class')

      setUserClasses(userClasses.filter(c => c.id !== openDelete))
      setOpenDelete(null)
      toast.success(t('deleted_successfully'))
    } catch (error) {
      console.error('Error:', error)
      toast.error(t('failed_to_delete'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          {t('add_new')}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">{t('name')}</th>
              <th className="text-left py-3 px-4">{t('purchase_count')}</th>
              <th className="text-left py-3 px-4">{t('months_period')}</th>
              <th className="text-left py-3 px-4">{t('description')}</th>
              <th className="text-left py-3 px-4">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {userClasses.map((userClass) => (
              <tr key={userClass.id} className="border-b last:border-b-0">
                <td className="py-3 px-4">
                  <Pill 
                    text={userClass.name} 
                    color={userClass.color}
                  />
                </td>
                <td className="py-3 px-4">
                  <Pill text={userClass.purchaseCount.toString()} />
                </td>
                <td className="py-3 px-4">
                  <Pill text={`${userClass.monthsPeriod} ${t('months', { count: userClass.monthsPeriod })}`} />
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-gray-600">{userClass.description}</span>
                </td>
                <td className="py-3 px-4">
                  <button 
                    onClick={() => setOpenDelete(userClass.id)}
                    className="text-teal-600 hover:text-red-600 transition-colors"
                    title={t('delete')}
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Class Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">{t('add_new')}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('name')}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('months_period')}
                </label>
                <input
                  type="number"
                  value={formData.monthsPeriod}
                  onChange={(e) => setFormData({ ...formData, monthsPeriod: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-md"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('purchase_count')}
                </label>
                <input
                  type="number"
                  value={formData.purchaseCount}
                  onChange={(e) => setFormData({ ...formData, purchaseCount: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-md"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('color')}
                </label>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full h-10 px-3 py-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('description')}
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false)
                    setFormData(initialFormData)
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors disabled:opacity-50"
                >
                  {loading ? t('creating') : t('create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {openDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">{t('confirm_delete')}</h3>
            <p className="mb-6">{t('confirm_delete_message')}</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setOpenDelete(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                disabled={loading}
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                disabled={loading}
              >
                {loading ? t('deleting') : t('delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 