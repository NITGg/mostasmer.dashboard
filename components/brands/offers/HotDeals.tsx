'use client'
import React, { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useAppContext } from '@/context/appContext'
import { PencilSquareIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Table from '@/components/ui/Table'

interface Coupon {
    id: number
    code: string
    ratio: number
    description: string
    validFrom: string
    validTo: string
}

interface CouponFormData {
    code: string
    ratio: number
    description: string
    validFrom: string
    validTo: string
}

const HotDeals = ({ brandId }: { brandId: string }) => {
    const [coupons, setCoupons] = useState<Coupon[]>([])
    const [loading, setLoading] = useState(false)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const { token } = useAppContext()
    const t = useTranslations('brand')

    // Add at the top of each component
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [currentItems, setCurrentItems] = useState<any[]>([]);

    // Add these handlers
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (newPageSize: number) => {
        setPageSize(newPageSize);
        setCurrentPage(1);
    };


    const { register, handleSubmit, setValue, reset } = useForm<CouponFormData>()

    const headers = [
        { name: 'hot_deals_table_code' },
        { name: 'hot_deals_table_percentage' },
        { name: 'hot_deals_table_description' },
        { name: 'hot_deals_table_valid_from' },
        { name: 'hot_deals_table_valid_to' },
        { name: 'hot_deals_table_actions' }
    ]

    useEffect(() => {
        fetchCoupons()
    }, [brandId])

    const fetchCoupons = async () => {
        try {
            setLoading(true)
            const headers = new Headers()
            headers.append('Authorization', `Bearer ${token}`)

            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/coupons/${brandId}`, {
                method: 'GET',
                headers,
            })

            if (!response.ok) throw new Error('Failed to fetch coupons')

            const data = await response.json()
            setCoupons(data.coupons)
        } catch (error) {
            console.error('Error:', error)
            toast.error('Failed to load coupons')
        } finally {
            setLoading(false)
        }
    }

    const generateCode = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        let code = ''
        for (let i = 0; i < 4; i++) {
            code += characters.charAt(Math.floor(Math.random() * characters.length))
        }
        setValue('code', code)
    }

    const onSubmit = async (data: CouponFormData) => {
        try {
            setLoading(true)
            const headers = new Headers()
            headers.append('Authorization', `Bearer ${token}`)
            headers.append('Content-Type', 'application/json')

            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/coupons/${brandId}`, {
                method: 'POST',
                headers,
                body: JSON.stringify(data)
            })

            if (!response.ok) throw new Error('Failed to add coupon')

            toast.success('Coupon added successfully')
            setIsAddDialogOpen(false)
            reset()
            fetchCoupons()
        } catch (error) {
            console.error('Error:', error)
            toast.error('Failed to add coupon')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (couponId: number) => {
        // Implement delete functionality
    }

    const renderTableRows = () => {
        return coupons.map((coupon) => (
            <tr key={coupon.id} className="odd:bg-white even:bg-primary/5 border-b">
                <td className="px-6 py-4">{coupon.code}</td>
                <td className="px-6 py-4">{coupon.ratio}%</td>
                <td className="px-6 py-4">{coupon.description}</td>
                <td className="px-6 py-4">{new Date(coupon.validFrom).toLocaleDateString()}</td>
                <td className="px-6 py-4">{new Date(coupon.validTo).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleDelete(coupon.id)}
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
    data={coupons}  // offers, coupons, etc.
    headers={headers}
    count={coupons.length}
    loading={loading}
    showDateFilter={false}
    pageSize={pageSize}
    currentPage={currentPage}
    onPageChange={handlePageChange}
    onPageSizeChange={handlePageSizeChange}
    showExport={true}
    bgColor="#dfe2e8"
    // currentItems={currentItems}
    initialData={coupons}
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
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent>
                    <h2 className="text-lg font-semibold mb-4">Add new coupon</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="flex-1">
                                <label className="block text-sm mb-1">Code:</label>
                                <input
                                    type="text"
                                    {...register('code', { required: true })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    maxLength={4}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={generateCode}
                                className="mt-6 px-3 py-2 text-teal-500 hover:text-teal-600"
                            >
                                Auto-Generate
                            </button>
                        </div>

                        <div>
                            <label className="block text-sm mb-1">Percentage:</label>
                            <input
                                type="number"
                                step="0.1"
                                {...register('ratio', { required: true })}
                                className="w-full px-3 py-2 border rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-1">Description:</label>
                            <textarea
                                {...register('description', { required: true })}
                                className="w-full px-3 py-2 border rounded-lg"
                                rows={3}
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-1">Valid From:</label>
                            <input
                                type="date"
                                {...register('validFrom', { required: true })}
                                className="w-full px-3 py-2 border rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-1">Valid To:</label>
                            <input
                                type="date"
                                {...register('validTo', { required: true })}
                                className="w-full px-3 py-2 border rounded-lg"
                            />
                        </div>

                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => setIsAddDialogOpen(false)}
                                className="px-4 py-2 border rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
                            >
                                Add
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default HotDeals 