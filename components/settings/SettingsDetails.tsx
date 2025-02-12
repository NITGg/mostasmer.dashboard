'use client'

import { TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import { BellIcon, GlobeAltIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useAppContext } from "@/context/appContext";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { deleteClassification } from "@/redux/reducers/classificationReducer";

interface ClassificationPolicy {
  id: number
  name: string
  monthsPeriod: number
  purchaseCount: number
  color: string
  description: string
  createdAt: string
  updatedAt: string
}

interface SettingsData {
  numberOfBrandsOnHomepage1: number;
  numberOfCategoriesOnHomepage1: number;
  loginAttemptDurationMinutes: number;
  loginAttempts1: number;
  latestOffers: number
  bestSellingBrands: number
  newArrivals: number
  basicInfo: {
    vatPercentage: string
    applicationPoints: {
      current: string  // pointBackRatio1
      total: string    // srRatio1
    }
  }
  displaySettings: {
    latestOffers: number      // numberOfLatestOffersOnHomepage1
    bestSellingBrands: number // numberOfSellingBrandsOnHomepage
    newArrivals: number       // numberOfNewArrivalsOnHomepage1
  }
  classificationPolicy: ClassificationPolicy[]
}

interface Props {
  settings: SettingsData;
}

interface AddClassificationForm {
  name: string
  monthsPeriod: number
  purchaseCount: number
  color: string
  description: string
}

export function SettingsDetails({ settings }: Props) {
  const [loading, setLoading] = useState(false);
  const { token } = useAppContext();
  const [openDelete, setOpenDelete] = useState<number | null>(null);
  const t = useTranslations('settings');
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    vatPercentage: settings.basicInfo.vatPercentage,
    pointBackRatio: settings.basicInfo.applicationPoints.current,
    srRatio: settings.basicInfo.applicationPoints.total,
    latestOffers: settings.displaySettings.latestOffers,
    bestSellingBrands: settings.displaySettings.bestSellingBrands,
    newArrivals: settings.displaySettings.newArrivals,
    loginAttemptDurationMinutes: settings.loginAttemptDurationMinutes || 20,
    loginAttempts: settings.loginAttempts1 || 5,
    numberOfBrandsOnHomepage: settings.numberOfBrandsOnHomepage1 || 3,
    numberOfCategoriesOnHomepage: settings.numberOfCategoriesOnHomepage1 || 3
  });

  const [classificationForm, setClassificationForm] = useState<AddClassificationForm>({
    name: '',
    monthsPeriod: 1,
    purchaseCount: 1,
    color: '#000000',
    description: ''
  });

  const handleDeleteCate = async () => {
    if (!openDelete) return
    
    try {
      setLoading(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user-classes/${openDelete}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )
      
      if (!response.ok) throw new Error('Failed to delete classification')

      dispatch(deleteClassification(openDelete))
      setOpenDelete(null)
      toast.success(t('successDelete'))
      router.refresh() // Refresh the page to show updated data
      
    } catch (error: any) {
      toast.error(error?.message || t('error.failedtodeleteclassification'))
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/app-settings`,
        {
          vat1: parseInt(formData.vatPercentage),
          pointBackRatio1: parseFloat(formData.pointBackRatio),
          srRatio1: parseFloat(formData.srRatio),
          numberOfLatestOffersOnHomepage1: parseInt(formData.latestOffers.toString()),
          numberOfSellingBrandsOnHomepage: parseInt(formData.bestSellingBrands.toString()),
          numberOfNewArrivalsOnHomepage1: parseInt(formData.newArrivals.toString()),
          loginAttemptDurationMinutes: parseInt(formData.loginAttemptDurationMinutes.toString()),
          loginAttempts1: parseInt(formData.loginAttempts.toString()),
          numberOfBrandsOnHomepage1: parseInt(formData.numberOfBrandsOnHomepage.toString()),
          numberOfCategoriesOnHomepage1: parseInt(formData.numberOfCategoriesOnHomepage.toString())
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )
      
      toast.success(t('settingsUpdated'))
      setIsEditing(false)
      router.refresh()
    } catch (error: any) {
      toast.error(error?.message || t('error.failedToUpdateSettings'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t('settings')}</h1>
        <div className="flex items-center space-x-4">
          {/* <UserCircleIcon className="h-8 w-8 text-blue-100" /> */}
          {/* <BellIcon className="h-6 w-6 text-gray-500" /> */}
          {/* <GlobeAltIcon className="h-6 w-6 text-gray-500" /> */}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">{t('basicinformation')}</h2>
            {!isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="text-teal-600 hover:text-teal-700"
              >
                {t('edit')}
              </button>
            )}

{isEditing && (
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
              disabled={loading}
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
              disabled={loading}
            >
              {loading ? t('saving') : t('save')}
            </button>
          </div>
        )}
          </div>
          
          
          <div className="space-y-4">
            {isEditing ? (
              <>
                <div className="flex justify-between items-center">
                  <label className="text-gray-700">{t('vatPercentage')}</label>
                  <input
                    type="number"
                    value={formData.vatPercentage}
                    onChange={(e) => setFormData({...formData, vatPercentage: e.target.value})}
                    className="px-3 py-2 border rounded-md w-48"
                  />
                </div>

                <div className="flex justify-between items-center">
                  <label className="text-gray-700">{t('pointBackRatio')}</label>
                  <input
                    type="number"
                    value={formData.pointBackRatio}
                    onChange={(e) => setFormData({...formData, pointBackRatio: e.target.value})}
                    className="px-3 py-2 border rounded-md w-48"
                  />
                </div>

                <div className="flex justify-between items-center">
                  <label className="text-gray-700">{t('srRatio')}</label>
                  <input
                    type="number"
                    value={formData.srRatio}
                    onChange={(e) => setFormData({...formData, srRatio: e.target.value})}
                    className="px-3 py-2 border rounded-md w-48"
                  />
                </div>

                <div className="flex justify-between items-center">
                  <label className="text-gray-700">{t('loginAttemptDuration')}</label>
                  <input
                    type="number"
                    value={formData.loginAttemptDurationMinutes}
                    onChange={(e) => setFormData({...formData, loginAttemptDurationMinutes: Number(e.target.value)})}
                    className="px-3 py-2 border rounded-md w-48"
                  />
                </div>

                <div className="flex justify-between items-center">
                  <label className="text-gray-700">{t('loginAttempts')}</label>
                  <input
                    type="number"
                    value={formData.loginAttempts}
                    onChange={(e) => setFormData({...formData, loginAttempts: Number(e.target.value)})}
                    className="px-3 py-2 border rounded-md w-48"
                  />
                </div>
              </>
            ) : (
              <>
                <InfoRow label={t('vatPercentage')} value={formData.vatPercentage} />
                <InfoRow label={t('pointBackRatio')} value={formData.pointBackRatio} />
                <InfoRow label={t('srRatio')} value={formData.srRatio} />
                <InfoRow label={t('loginAttemptDuration')} value={formData.loginAttemptDurationMinutes.toString()} />
                <InfoRow label={t('loginAttempts')} value={formData.loginAttempts.toString()} />
              </>
            )}
          </div>
        </section>

        {/* Display Settings */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4">{t('displaysettings')}</h2>
          <div className="space-y-4">
            {isEditing ? (
              <>
                <div className="flex justify-between items-center">
                  <label className="text-gray-700">{t('numberOfLatestOffers')}</label>
                  <input
                    type="number"
                    value={formData.latestOffers}
                    onChange={(e) => setFormData({...formData, latestOffers: Number(e.target.value)})}
                    className="px-3 py-2 border rounded-md w-48"
                  />
                </div>

                <div className="flex justify-between items-center">
                  <label className="text-gray-700">{t('numberOfBestSellingBrands')}</label>
                  <input
                    type="number"
                    value={formData.bestSellingBrands}
                    onChange={(e) => setFormData({...formData, bestSellingBrands: Number(e.target.value)})}
                    className="px-3 py-2 border rounded-md w-48"
                  />
                </div>

                <div className="flex justify-between items-center">
                  <label className="text-gray-700">{t('numberOfNewArrivals')}</label>
                  <input
                    type="number"
                    value={formData.newArrivals}
                    onChange={(e) => setFormData({...formData, newArrivals: Number(e.target.value)})}
                    className="px-3 py-2 border rounded-md w-48"
                  />
                </div>

                <div className="flex justify-between items-center">
                  <label className="text-gray-700">{t('numberOfBrandsOnHomepage')}</label>
                  <input
                    type="number"
                    value={formData.numberOfBrandsOnHomepage}
                    onChange={(e) => setFormData({...formData, numberOfBrandsOnHomepage: Number(e.target.value)})}
                    className="px-3 py-2 border rounded-md w-48"
                  />
                </div>

                <div className="flex justify-between items-center">
                  <label className="text-gray-700">{t('numberOfCategoriesOnHomepage')}</label>
                  <input
                    type="number"
                    value={formData.numberOfCategoriesOnHomepage}
                    onChange={(e) => setFormData({...formData, numberOfCategoriesOnHomepage: Number(e.target.value)})}
                    className="px-3 py-2 border rounded-md w-48"
                  />
                </div>
              </>
            ) : (
              <>
                <InfoRow label={t('numberOfLatestOffers')} value={formData.latestOffers.toString()} />
                <InfoRow label={t('numberOfBestSellingBrands')} value={formData.bestSellingBrands.toString()} />
                <InfoRow label={t('numberOfNewArrivals')} value={formData.newArrivals.toString()} />
                <InfoRow label={t('numberOfBrandsOnHomepage')} value={formData.numberOfBrandsOnHomepage.toString()} />
                <InfoRow label={t('numberOfCategoriesOnHomepage')} value={formData.numberOfCategoriesOnHomepage.toString()} />
              </>
            )}
          </div>
        </section>

        {/* Classification Policy */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">{t('classificationpolicy')}</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              {t('addnewclassification')}
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">{t('name')}</th>
                  <th className="text-left py-3 px-4">{t('purchasenumber')}</th>
                  <th className="text-left py-3 px-4">{t('monthlyduration')}</th>
                  <th className="text-left py-3 px-4">{t('description')}</th>
                  <th className="text-left py-3 px-4">{t('action')}</th>
                </tr>
              </thead>
              <tbody>
                {settings.classificationPolicy.map((policy) => (
                  <tr key={policy.id} className="border-b last:border-b-0">
                    <td className="py-3 px-4">
                      <Pill 
                        text={policy.name} 
                        color={policy.color}
                      />
                    </td>
                    <td className="py-3 px-4">
                      <Pill text={policy.purchaseCount.toString()} />
                    </td>
                    <td className="py-3 px-4">
                      <Pill text={`${policy.monthsPeriod} ${t('months')}`} />
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-600">{policy.description}</span>
                    </td>
                    <td className="py-3 px-4">
                      <button 
                        onClick={() => setOpenDelete(policy.id)}
                        className="text-teal-600 hover:text-red-600 transition-colors"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Classification Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">{t('addnewclassification')}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('name')}
                    </label>
                    <input
                      type="text"
                      value={classificationForm.name}
                      onChange={(e) => setClassificationForm({ ...classificationForm, name: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('monthlyduration')}
                    </label>
                    <input
                      type="number"
                      value={classificationForm.monthsPeriod}
                      onChange={(e) => setClassificationForm({ ...classificationForm, monthsPeriod: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-md"
                      min="1"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('purchasecount')}
                    </label>
                    <input
                      type="number"
                      value={classificationForm.purchaseCount}
                      onChange={(e) => setClassificationForm({ ...classificationForm, purchaseCount: parseInt(e.target.value) })}
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
                      type="text"
                      value={classificationForm.color}
                      onChange={(e) => setClassificationForm({ ...classificationForm, color: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('description')}
                    </label>
                    <textarea
                      value={classificationForm.description}
                      onChange={(e) => setClassificationForm({ ...classificationForm, description: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md"
                      rows={3}
                      
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      {t('cancel')}
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
                    >
                      {t('addnewclassification')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Add Delete Confirmation Modal */}
          {openDelete && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">{t('confirmdelete')}</h3>
                <p className="mb-6">{t('confirmdeleteclassification')}</p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setOpenDelete(null)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    disabled={loading}
                  >
                    {t('cancel')}
                  </button>
                  <button
                    onClick={handleDeleteCate}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    disabled={loading}
                  >
                    {loading ? t('deleting') : t('delete')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>


      </form>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-700">{label}</span>
      <Pill text={value} />
    </div>
  );
}

function Pill({ text, color }: { text: string; color?: string }) {
  return (
    <span 
      className={`inline-block px-3 py-1 rounded-full text-sm bg-[#f3f4f6]`}
      style={{
        backgroundColor: color ? `${color}20` : '#f3f4f6',
        color: color || '#374151'
      }}
    >
      {text}
    </span>
  );
}
function fetchCategories(currentPage: any, pageSize: any) {
  throw new Error("Function not implemented.");

}

