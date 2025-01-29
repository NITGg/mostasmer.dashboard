'use client'
import React, { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useAppContext } from '@/context/appContext'
import { TrashIcon, PencilSquareIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import Table from '@/components/ui/Table'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useForm } from 'react-hook-form'
import { PlusIcon } from '@heroicons/react/24/outline'

interface Representative {
    id: number
    status: string
    brandId: number
    userId: string
    createdAt: string
    updatedAt: string
}

interface RepresentativeFormData {
    userId: string
    validFrom: string
    validTo: string
    status: 'ACTIVE' | 'DEACTIVE'
}

interface EditRepresentativeFormData {
    status: 'ACTIVE' | 'DEACTIVE'
}

const BrandRepresentative = ({ brandId }: { brandId: string }) => {
    console.debug('BrandRepresentative component initialized with brandId:', brandId)
    
    const [representatives, setRepresentatives] = useState<Representative[]>([])
    const [loading, setLoading] = useState(false)
    const { token } = useAppContext()
    const t = useTranslations('Tablecomponent')
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const { register, handleSubmit, reset } = useForm<RepresentativeFormData>()
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [selectedRepresentative, setSelectedRepresentative] = useState<Representative | null>(null)
    const { register: editRegister, handleSubmit: handleEditSubmit, reset: resetEdit } = useForm<EditRepresentativeFormData>()
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [currentItems, setCurrentItems] = useState<Representative[]>([])

    const headers = [
        { name: 'brand_representatives_table_id' },
        { name: 'brand_representatives_table_status' },
        { name: 'brand_representatives_table_brand_id' },
        { name: 'brand_representatives_table_user_id' },
        { name: 'brand_representatives_table_actions' }
    ]

    useEffect(() => {
        console.debug('Initiating fetch of brand representatives')
        fetchRepresentatives()
    }, [brandId])

    const fetchRepresentatives = async () => {
        console.debug('Fetching representatives for brandId:', brandId)
        try {
            setLoading(true)
            const headers = new Headers()
            headers.append('Authorization', `Bearer ${token}`)

            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/representative/${brandId}`, {
                method: 'GET',
                headers,
            })

            console.debug('Representative API response status:', response.status)

            if (!response.ok) throw new Error('Failed to fetch representatives')

            const data = await response.json()
            console.debug('Received representatives data:', data)
            setRepresentatives(data.brandRepresentatives)
        } catch (error) {
            console.error('Error fetching representatives:', error)
            toast.error('Failed to load representatives')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (representativeId: number) => {
        try {
            if (!window.confirm('Are you sure you want to delete this representative?')) {
                return;
            }

            setLoading(true);
            const headers = new Headers();
            headers.append('Authorization', `Bearer ${token}`);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/representative/${brandId}/${representativeId}?lang=en`, 
                {
                    method: 'DELETE',
                    headers,
                    redirect: 'follow'
                }
            );

            if (!response.ok) {
                throw new Error('Failed to delete representative');
            }

            toast.success('Representative deleted successfully');
            // Refresh the representatives list
            fetchRepresentatives();
        } catch (error) {
            console.error('Error deleting representative:', error);
            toast.error('Failed to delete representative');
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: RepresentativeFormData) => {
        console.debug('Submitting new representative data:', data)
        try {
            setLoading(true)
            const headers = new Headers()
            headers.append('Authorization', `Bearer ${token}`)
            headers.append('Content-Type', 'application/json')

            const requestBody = {
                userId: data.userId,
                brandId: Number(brandId),
                status: data.status || 'ACTIVE',
                validFrom: data.validFrom,
                validTo: data.validTo
            }

            console.debug('Request body:', requestBody)

            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/representative/${brandId}`, {
                method: 'POST',
                headers,
                body: JSON.stringify(requestBody)
            })

            console.debug('Add representative API response status:', response.status)

            if (!response.ok) throw new Error('Failed to add representative')

            const result = await response.json()
            console.debug('Add representative API response:', result)

            toast.success('Representative added successfully')
            setIsAddDialogOpen(false)
            reset()
            fetchRepresentatives()
        } catch (error) {
            console.error('Error adding representative:', error)
            toast.error('Failed to add representative')
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = async (data: EditRepresentativeFormData) => {
        if (!selectedRepresentative) return

        try {
            setLoading(true)
            const headers = new Headers()
            headers.append('Authorization', `Bearer ${token}`)
            headers.append('Content-Type', 'application/json')

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/representative/${brandId}/${selectedRepresentative.id}`,
                {
                    method: 'PUT',
                    headers,
                    body: JSON.stringify({
                        userId: selectedRepresentative.userId,
                        status: data.status
                    }),
                    redirect: 'follow'
                }
            )

            if (!response.ok) throw new Error('Failed to update representative')

            toast.success('Representative updated successfully')
            setIsEditDialogOpen(false)
            resetEdit()
            fetchRepresentatives()
        } catch (error) {
            console.error('Error:', error)
            toast.error('Failed to update representative')
        } finally {
            setLoading(false)
        }
    }

    const renderTableRows = () => {
        console.debug('Rendering table rows with representatives:', representatives)
        return representatives.map((representative) => (
            <tr key={representative.id} className="odd:bg-white even:bg-primary/5 border-b">
                <td className="px-6 py-4">{representative.id}</td>
                <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                        representative.status === 'ACTIVE' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                    }`}>
                        {representative.status}
                    </span>
                </td>
                <td className="px-6 py-4">{representative.brandId}</td>
                <td className="px-6 py-4">
                    <span className="font-mono text-sm">{representative.userId}</span>
                </td>
                <td className="px-6 py-4">
                    <div className="flex gap-2">
                        <button 
                            onClick={() => {
                                setSelectedRepresentative(representative)
                                setIsEditDialogOpen(true)
                            }}
                            className="p-1 hover:bg-slate-100 rounded"
                            disabled={loading}
                        >
                            <PencilSquareIcon className="w-4 h-4 text-blue-500" />
                        </button>
                        <button 
                            onClick={() => handleDelete(representative.id)}
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

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handlePageSizeChange = (newPageSize: number) => {
        setPageSize(newPageSize)
        setCurrentPage(1)
    }

    return (
        <div className="mt-8">
            <Table
                data={representatives}
                headers={headers}
                count={representatives.length}
                loading={loading}
                showDateFilter={false}
                pageSize={pageSize}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                showExport={true}
                bgColor="#02161e"
                // currentItems={currentItems}
                initialData={representatives}
            >
                {renderTableRows()}
            </Table>

            <div className="flex justify-center mt-4">
                <button
                    onClick={() => setIsAddDialogOpen(true)}
                    className="p-2 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-colors"
                >
                    <PlusIcon className="w-5 h-5" />
                </button>
            </div>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent>
                    <h2 className="text-lg font-semibold mb-4">Add new representative</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-sm mb-1">User ID:</label>
                            <input
                                type="text"
                                {...register('userId', { required: true })}
                                className="w-full px-3 py-2 border rounded-lg"
                                placeholder="Enter user ID"
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

                        <div>
                            <label className="block text-sm mb-1">Status:</label>
                            <select
                                {...register('status')}
                                defaultValue="ACTIVE"
                                className="w-full px-3 py-2 border rounded-lg"
                            >
                                <option value="ACTIVE">Active</option>
                                <option value="DEACTIVE">Deactive</option>
                            </select>
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

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <h2 className="text-lg font-semibold mb-4">{(t('editRepresentative'))}</h2>
                    <form onSubmit={handleEditSubmit(handleEdit)} className="space-y-4">
                        <div>
                            <label className="block text-sm mb-1">{(t('status'))}:</label>
                            <select
                                {...editRegister('status')}
                                defaultValue={selectedRepresentative?.status}
                                className="w-full px-3 py-2 border rounded-lg"
                            >
                                <option value="ACTIVE">{(t('active'))}</option>
                                <option value="DEACTIVE">{(t('deactive'))}</option>
                            </select>
                        </div>

                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditDialogOpen(false)
                                    setSelectedRepresentative(null)
                                }}
                                className="px-4 py-2 border rounded-lg"
                            >
                                {(t('cancel_delete_brand'))}
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                {(t('update'))}
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default BrandRepresentative