'use client'
import React, { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useAppContext } from '@/context/appContext'
import {  TrashIcon, PlusIcon } from '@heroicons/react/24/outline'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Select } from '@/components/ui/select'
import Table from '@/components/ui/Table'

interface SpecialOffer {
    id: number
    brandId: number
    type: 'basic' | 'standard' | 'vip'
    ratio: number
    validFrom: string
    validTo: string
    createdAt: string
    updatedAt: string
}

interface OfferFormData {
    userType: 'basic' | 'standard' | 'vip'
    basicRatio?: number
    standardRatio?: number
    vipRatio?: number
    validFrom: string
    validTo: string
}

// Add new interface for user types
interface UserType {
    id: number;
    buyAmount: number;
    ratio: number;
    userType: string;
    color: string;
    badgeId: number | null;
    updatedAt: string;
    createdAt: string;
}

const SpecialOffers = ({ brandId }: { brandId: string }) => {
    const [offers, setOffers] = useState<SpecialOffer[]>([])
    const [loading, setLoading] = useState(false)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [editingOffer, setEditingOffer] = useState<SpecialOffer | null>(null)
    const { token } = useAppContext()
    const t = useTranslations('brand')

    const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<OfferFormData>()
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [currentItems, setCurrentItems] = useState<any[]>([]);
    
    // Add state for user types
    const [userTypes, setUserTypes] = useState<UserType[]>([]);
    
    // Add these handlers
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };
    
    const handlePageSizeChange = (newPageSize: number) => {
        setPageSize(newPageSize);
        setCurrentPage(1);
    };

    // Remove the hardcoded offerTypes array and add fetchUserTypes function
    const fetchUserTypes = async () => {
        try {
            const headers = new Headers();
            headers.append('Authorization', `Bearer ${token}`);
            headers.append('Content-Type', 'application/json');

            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user-types`, {
                method: 'GET',
                headers,
            });

            if (!response.ok) throw new Error('Failed to fetch user types');

            const { data } = await response.json();
            setUserTypes(data);
        } catch (error) {
            console.error('Error fetching user types:', error);
            toast.error('Failed to load user types');
        }
    };

    // Update useEffect to fetch user types
    useEffect(() => {
        fetchUserTypes();
        fetchSpecialOffers();
    }, [brandId]);

    const fetchSpecialOffers = async () => {
        try {
            setLoading(true)
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/special-offer/${brandId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (!response.ok) throw new Error('Failed to fetch offers')
            const data = await response.json()
            setOffers(data.specialOffers || [])
        } catch (error) {
            console.error('Error:', error)
            toast.error('Failed to load offers')
        } finally {
            setLoading(false)
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString()
    }

    const validateRatios = (data: OfferFormData) => {
        const basic = Number(data.basicRatio)
        const standard = Number(data.standardRatio)
        const vip = Number(data.vipRatio)

        if (data.userType === 'basic') {
            if (basic >= standard) {
                toast.error('Basic ratio must be less than Standard ratio')
                return false
            }
            if (standard >= vip) {
                toast.error('Standard ratio must be less than VIP ratio')
                return false
            }
        } else if (data.userType === 'standard') {
            if (standard >= vip) {
                toast.error('Standard ratio must be less than VIP ratio')
                return false
            }
        }
        return true
    }

    const onSubmit = async (data: OfferFormData) => {
        try {
            if (!validateRatios(data)) return;
            
            setLoading(true)
            const offersToCreate = []

            const formatDate = (dateStr: string) => {
                const date = new Date(dateStr)
                return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
            }

            // Prepare the offers based on selected type
            if (data.userType === 'basic') {
                offersToCreate.push(
                    { type: 'basic', ratio: Number(data.basicRatio), validFrom: data.validFrom, validTo: data.validTo },
                    { type: 'standard', ratio: Number(data.standardRatio), validFrom: data.validFrom, validTo: data.validTo },
                    { type: 'vip', ratio: Number(data.vipRatio), validFrom: data.validFrom, validTo: data.validTo }
                )
            } else if (data.userType === 'standard') {
                offersToCreate.push(
                    { type: 'standard', ratio: Number(data.standardRatio), validFrom: data.validFrom, validTo: data.validTo },
                    { type: 'vip', ratio: Number(data.vipRatio), validFrom: data.validFrom, validTo: data.validTo }
                )
            } else {
                offersToCreate.push(
                    { type: 'vip', ratio: Number(data.vipRatio), validFrom: data.validFrom, validTo: data.validTo }
                )
            }

            // Send requests sequentially to ensure order
            for (const offer of offersToCreate) {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/special-offer/${brandId}`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            userType: offer.type,  // This will now use the correct ratio for each type
                            ratio: offer.ratio,  // This will now use the correct ratio for each type
                            validFrom: formatDate(offer.validFrom),
                            validTo: formatDate(offer.validTo)
                        })
                    })

                    if (!response.ok) {
                        throw new Error(`Failed to create ${offer.type} offer`)
                    }

                    // Wait for each request to complete before sending the next one
                    await response.json()
                } catch (error) {
                    console.error(`Error creating ${offer.type} offer:`, error)
                    throw error
                }
            }

            toast.success('Special offers created successfully')
            await fetchSpecialOffers()
            handleCloseDialog()
        } catch (error: any) {
            console.error('Error:', error)
            toast.error(error.message || 'Failed to create offers')
        } finally {
            setLoading(false)
        }
    }

    const handleCloseDialog = () => {
        setIsAddDialogOpen(false)
        setEditingOffer(null)
        reset({
            userType: undefined,
            basicRatio: undefined,
            standardRatio: undefined,
            vipRatio: undefined,
            validFrom: undefined,
            validTo: undefined
        })
    }

    const handleDelete = async (offerId: number) => {
        if (!window.confirm('Are you sure you want to delete this offer?')) return

        try {
            setLoading(true)
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/special-offer/${brandId}/${offerId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                }
            )

            if (!response.ok) throw new Error('Failed to delete offer')

            toast.success('Offer deleted successfully')
            fetchSpecialOffers()
        } catch (error) {
            console.error('Error:', error)
            toast.error('Failed to delete offer')
        } finally {
            setLoading(false)
        }
    }

    // Update the Select component in the form
    const renderUserTypeSelect = () => (
        <div>
            <label className="block text-sm mb-1">Offer Type</label>
            <Select
                value={watch('userType') || ''}
                onValueChange={(value) => {
                    setValue('userType', value as 'basic' | 'standard' | 'vip');
                    // Reset ratio values when changing type
                    setValue('basicRatio', undefined);
                    setValue('standardRatio', undefined);
                    setValue('vipRatio', undefined);
                }}
                options={userTypes.map(type => ({
                    value: type.userType.toLowerCase(),
                    label: `${type.userType} (Buy Amount: ${type.buyAmount}, Ratio: ${type.ratio}%)`
                }))}
                placeholder="Select a user type"
                className=""
            />
        </div>
    );

    // Update the renderRatioInputs function to use user types data
    const renderRatioInputs = () => {
        const selectedType = watch('userType');
        const selectedUserType = userTypes.find(
            type => type.userType.toLowerCase() === selectedType
        );

        if (!selectedUserType) return null;

        return (
            <div className="space-y-4">
                {selectedType === 'basic' && (
                    <>
                        <div>
                            <label className="block text-sm mb-1">Basic Ratio (%)</label>
                            <input
                                type="number"
                                {...register('basicRatio', { required: 'Basic ratio is required' })}
                                className="w-full px-3 py-2 border rounded-lg"
                                placeholder={`Default: ${selectedUserType.ratio}%`}
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Standard Ratio (%)</label>
                            <input
                                type="number"
                                {...register('standardRatio', { required: 'Standard ratio is required' })}
                                className="w-full px-3 py-2 border rounded-lg"
                                placeholder={`Must be higher than Basic`}
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">VIP Ratio (%)</label>
                            <input
                                type="number"
                                {...register('vipRatio', { required: 'VIP ratio is required' })}
                                className="w-full px-3 py-2 border rounded-lg"
                                placeholder={`Must be higher than Standard`}
                            />
                        </div>
                    </>
                )}
                {selectedType === 'standard' && (
                    <>
                        <div>
                            <label className="block text-sm mb-1">Standard Ratio (%)</label>
                            <input
                                type="number"
                                {...register('standardRatio', { required: 'Standard ratio is required' })}
                                className="w-full px-3 py-2 border rounded-lg"
                                placeholder={`Default: ${selectedUserType.ratio}%`}
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">VIP Ratio (%)</label>
                            <input
                                type="number"
                                {...register('vipRatio', { required: 'VIP ratio is required' })}
                                className="w-full px-3 py-2 border rounded-lg"
                                placeholder={`Must be higher than Standard`}
                            />
                        </div>
                    </>
                )}
                {selectedType === 'vip' && (
                    <div>
                        <label className="block text-sm mb-1">VIP Ratio (%)</label>
                        <input
                            type="number"
                            {...register('vipRatio', { required: 'VIP ratio is required' })}
                            className="w-full px-3 py-2 border rounded-lg"
                            placeholder={`Default: ${selectedUserType.ratio}%`}
                        />
                    </div>
                )}
            </div>
        );
    };

    const testBasicOffer = async () => {
        try {
            setLoading(true)
            
            // Test data
            const testData = {
                userType: "basic",
                ratio: 52,
                validFrom: "2025/1/2",
                validTo: "2025/5/5"
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/special-offer/${brandId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(testData)
            })

            if (!response.ok) {
                throw new Error('Failed to create basic offer')
            }

            const result = await response.text()
            console.log('Basic offer result:', result)
            toast.success('Test basic offer created')
            await fetchSpecialOffers()
        } catch (error) {
            console.error('Error creating test basic offer:', error)
            toast.error('Failed to create test basic offer')
        } finally {
            setLoading(false)
        }
    }

    const headers = [
        { name: 'special_offers_table_id' },
        { name: 'special_offers_table_Type' },
        { name: 'special_offers_table_point_back' },
        { name: 'special_offers_table_valid_from' },
        { name: 'special_offers_table_valid_to' },
        { name: 'special_offers_table_actions' }
    ]

    const renderTableRows = () => {
        return offers.map((offer) => (
            <tr key={offer.id} className="odd:bg-white even:bg-primary/5 border-b">
                <td className="px-6 py-4">
                    {offer.id.toString().padStart(3, '0')}
                </td>
                <td className="px-6 py-4 font-medium capitalize">
                    {offer.type === 'basic' ? 'Basic' :
                     offer.type === 'standard' ? 'Standard' :
                     offer.type === 'vip' ? 'VIP' : 'Unknown'}
                </td>
                <td className="px-6 py-4">
                    {offer.ratio}%
                </td>
                <td className="px-6 py-4">
                    {formatDate(offer.validFrom)}
                </td>
                <td className="px-6 py-4">
                    {formatDate(offer.validTo)}
                </td>
                <td className="px-6 py-4">
                    <div className="flex gap-2">
                        <button 
                            onClick={() => handleDelete(offer.id)}
                            className="p-1 hover:bg-slate-100 rounded"
                            disabled={loading}
                        >
                            <TrashIcon className="w-4 h-4 text-red-500" />
                        </button>
                    </div>
                </td>
            </tr>
        ))
    }

    return (
        <div className="mt-8">
<Table
    data={offers}  // offers, coupons, etc.
    headers={headers}
    count={offers.length}
    loading={loading}
    showDateFilter={false}
    pageSize={pageSize}
    currentPage={currentPage}
    onPageChange={handlePageChange}
    onPageSizeChange={handlePageSizeChange}
    showExport={true}
    bgColor="#dfe2e8"
    // currentItems={currentItems}
    initialData={offers}
>
                {renderTableRows()}
            </Table>

            {/* Add Button */}
            <div className="flex justify-center mt-4">
                <button
                    onClick={() => setIsAddDialogOpen(true)}
                    className="p-2 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-colors"
                >
                    <PlusIcon className="w-5 h-5" />
                </button>
            </div>

            {/* Add Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={handleCloseDialog}>
                <DialogContent>
                    <h2 className="text-lg font-semibold mb-4">Add Special Offer</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {renderUserTypeSelect()}
                        {watch('userType') && renderRatioInputs()}
                        <div >
                            <label className="block text-sm mb-1 ">Valid From</label>
                            <input
                                type="date"
                                {...register('validFrom', { required: 'Start date is required' })}
                                className="w-full px-3 py-2 border rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Valid To</label>
                            <input
                                type="date"
                                {...register('validTo', { required: 'End date is required' })}
                                className="w-full px-3 py-2 border rounded-lg"
                            />
                        </div>
                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={handleCloseDialog}
                                className="px-4 py-2 border rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !watch('userType')}
                                className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : 'Add'}
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default SpecialOffers