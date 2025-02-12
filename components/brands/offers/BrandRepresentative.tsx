// 'use client'
// import React, { useEffect, useState } from 'react'
// import { useTranslations } from 'next-intl'
// import { useAppContext } from '@/context/appContext'
// import { TrashIcon, PencilSquareIcon } from '@heroicons/react/24/outline'
// import toast from 'react-hot-toast'
// import Table from '@/components/ui/Table'
// import { Dialog, DialogContent } from '@/components/ui/dialog'
// import { useForm } from 'react-hook-form'
// import { PlusIcon } from '@heroicons/react/24/outline'
// import Select from 'react-select/async'
// import debounce from 'lodash/debounce'
// import { GroupBase } from 'react-select'
// import { OptionsOrGroups } from 'react-select'

// interface Representative {
//     id: number
//     status: string
//     brandId: number
//     userId: string
//     createdAt: string
//     updatedAt: string
// }

// interface UserOption {
//     value: string
//     label: string
//     roles: Array<{id: number, name: string}>
//     imageUrl?: string
// }

// interface RepresentativeFormData {
//     userId: string
//     validFrom: string
//     validTo: string
//     status: 'ACTIVE' | 'DEACTIVE'
// }

// interface EditRepresentativeFormData {
//     status: 'ACTIVE' | 'DEACTIVE'
// }

// const BrandRepresentative = ({ brandId }: { brandId: string }) => {
//     console.debug('BrandRepresentative component initialized with brandId:', brandId)
    
//     const [representatives, setRepresentatives] = useState<Representative[]>([])
//     const [loading, setLoading] = useState(false)
//     const { token } = useAppContext()
//     const t = useTranslations('Tablecomponent')
//     const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
//     const { register, handleSubmit, reset } = useForm<RepresentativeFormData>()
//     const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
//     const [selectedRepresentative, setSelectedRepresentative] = useState<Representative | null>(null)
//     const { register: editRegister, handleSubmit: handleEditSubmit, reset: resetEdit } = useForm<EditRepresentativeFormData>()
//     const [currentPage, setCurrentPage] = useState(1)
//     const [pageSize, setPageSize] = useState(10)
//     const [currentItems, setCurrentItems] = useState<Representative[]>([])
//     const [selectedUser, setSelectedUser] = useState<UserOption | null>(null)

//     const headers = [
//         { name: 'brand_representatives_table_id' },
//         { name: 'brand_representatives_table_status' },
//         { name: 'brand_representatives_table_brand_id' },
//         { name: 'brand_representatives_table_user_id' },
//         { name: 'brand_representatives_table_actions' }
//     ]

//     useEffect(() => {
//         console.debug('Initiating fetch of brand representatives')
//         fetchRepresentatives()
//     }, [brandId])

//     const fetchRepresentatives = async () => {
//         console.debug('Fetching representatives for brandId:', brandId)
//         try {
//             setLoading(true)
//             const headers = new Headers()
//             headers.append('Authorization', `Bearer ${token}`)

//             const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/representative/${brandId}`, {
//                 method: 'GET',
//                 headers,
//             })

//             console.debug('Representative API response status:', response.status)

//             if (!response.ok) throw new Error('Failed to fetch representatives')

//             const data = await response.json()
//             console.debug('Received representatives data:', data)
//             setRepresentatives(data.brandRepresentatives)
//         } catch (error) {
//             console.error('Error fetching representatives:', error)
//             toast.error('Failed to load representatives')
//         } finally {
//             setLoading(false)
//         }
//     }

//     const handleDelete = async (representativeId: number) => {
//         try {
//             if (!window.confirm(t('brand.deleteRepresentativeConfirm'))) {
//                 return;
//             }

//             setLoading(true);
//             const headers = new Headers();
//             headers.append('Authorization', `Bearer ${token}`);

//             const requestOptions = {
//                 method: 'DELETE',
//                 headers,
//                 body: '', // Empty string as body
//                 redirect: 'follow' as RequestRedirect
//             };

//             const response = await fetch(
//                 `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/representative/${brandId}/${representativeId}`,
//                 requestOptions
//             );

//             const result = await response.text();

//             if (!response.ok) {
//                 throw new Error(result || t('brand.representativeDeleteError'));
//             }

//             toast.success(t('brand.representativeDeleteSuccess'));
//             await fetchRepresentatives();
//         } catch (error: any) {
//             console.error('Error deleting representative:', error);
//             toast.error(error.message || t('brand.representativeDeleteError'));
//         } finally {
//             setLoading(false);
//         }
//     };

//     const loadInitialOptions = async () => {
//         try {
//             const headers = new Headers();
//             headers.append('Authorization', `Bearer ${token}`);

//             // First, get the current brand representatives to exclude them
//             const representativesResponse = await fetch(
//                 `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/representative/${brandId}`,
//                 {
//                     method: 'GET',
//                     headers,
//                 }
//             );

//             if (!representativesResponse.ok) {
//                 throw new Error('Failed to fetch current representatives');
//             }

//             const representativesData = await representativesResponse.json();
//             const currentRepresentativeIds = representativesData.brandRepresentatives.map(
//                 (rep: Representative) => rep.userId
//             );

//             // Fetch all users without limit
//             const response = await fetch(
//                 `${process.env.NEXT_PUBLIC_BASE_URL}/api/user`,
//                 {
//                     method: 'GET',
//                     headers,
//                 }
//             );

//             if (!response.ok) throw new Error('Failed to fetch users');

//             const data = await response.json();
            
//             // Filter out users who are already representatives for this brand
//             return data.users
//                 .filter((user: any) => !currentRepresentativeIds.includes(user.id))
//                 .map((user: any) => ({
//                     value: user.id,
//                     label: `${user.fullname} (${user.email})`,
//                     roles: user.roles,
//                     imageUrl: user.imageUrl
//                 }));
//         } catch (error) {
//             console.error('Error loading initial users:', error);
//             return [];
//         }
//     };

//     const loadUsers = debounce(
//         (
//             inputValue: string
//         ): Promise<OptionsOrGroups<UserOption, GroupBase<UserOption>>> => {
//             return new Promise(async (resolve) => {
//                 try {
//                     const headers = new Headers();
//                     headers.append('Authorization', `Bearer ${token}`);

//                     // First, get the current brand representatives to exclude them
//                     const representativesResponse = await fetch(
//                         `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/representative/${brandId}`,
//                         {
//                             method: 'GET',
//                             headers,
//                         }
//                     );

//                     if (!representativesResponse.ok) {
//                         throw new Error('Failed to fetch current representatives');
//                     }

//                     const representativesData = await representativesResponse.json();
//                     const currentRepresentativeIds = representativesData.brandRepresentatives.map(
//                         (rep: Representative) => rep.userId
//                     );

//                     // If searching, use the keyword parameter
//                     const url = inputValue 
//                         ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/user?keyword=${inputValue}`
//                         : `${process.env.NEXT_PUBLIC_BASE_URL}/api/user`;

//                     const response = await fetch(url, {
//                         method: 'GET',
//                         headers,
//                     });

//                     if (!response.ok) throw new Error('Failed to fetch users');

//                     const data = await response.json();
                    
//                     const options = data.users
//                         .filter((user: any) => !currentRepresentativeIds.includes(user.id))
//                         .map((user: any) => ({
//                             value: user.id,
//                             label: `${user.fullname} (${user.email})`,
//                             roles: user.roles,
//                             imageUrl: user.imageUrl
//                         }));

//                     resolve(options);
//                 } catch (error) {
//                     console.error('Error loading users:', error);
//                     resolve([]);
//                 }
//             });
//         },
//         300
//     );

//     const onSubmit = async (data: RepresentativeFormData) => {
//         if (!selectedUser) {
//             toast.error(t('user.selectRepresentative'));
//             return;
//         }

//         try {
//             setLoading(true);
//             const headers = new Headers();
//             headers.append('Authorization', `Bearer ${token}`);
//             headers.append('Content-Type', 'application/json');

//             const requestBody = {
//                 userId: selectedUser.value
//             };

//             const requestOptions = {
//                 method: 'POST',
//                 headers,
//                 body: JSON.stringify(requestBody),
//                 redirect: 'follow' as RequestRedirect
//             };

//             const response = await fetch(
//                 `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/representative/${brandId}`,
//                 requestOptions
//             );

//             const result = await response.text();
//             let errorMessage;

//             try {
//                 const data = JSON.parse(result);
//                 if (!response.ok) {
//                     // Check if the error is about existing representative
//                     if (data.message && data.message.includes('already')) {
//                         errorMessage = data.message;
//                     } else {
//                         errorMessage = t('brand.representativeAddError');
//                     }
//                     throw new Error(errorMessage);
//                 }

//                 toast.success(t('brand.representativeAddSuccess'));
//                 setIsAddDialogOpen(false);
//                 reset();
//                 setSelectedUser(null);
//                 await fetchRepresentatives();
//             } catch (parseError) {
//                 throw new Error(errorMessage || result || t('brand.representativeAddError'));
//             }
//         } catch (error: any) {
//             console.error('Error adding representative:', error);
//             toast.error(error.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleEdit = async (data: EditRepresentativeFormData) => {
//         if (!selectedRepresentative) return

//         try {
//             setLoading(true)
//             const headers = new Headers()
//             headers.append('Authorization', `Bearer ${token}`)
//             headers.append('Content-Type', 'application/json')

//             const response = await fetch(
//                 `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/representative/${brandId}/${selectedRepresentative.id}`,
//                 {
//                     method: 'PUT',
//                     headers,
//                     body: JSON.stringify({
//                         userId: selectedRepresentative.userId,
//                         status: data.status
//                     }),
//                     redirect: 'follow'
//                 }
//             )

//             if (!response.ok) throw new Error('Failed to update representative')

//             toast.success('Representative updated successfully')
//             setIsEditDialogOpen(false)
//             resetEdit()
//             fetchRepresentatives()
//         } catch (error) {
//             console.error('Error:', error)
//             toast.error('Failed to update representative')
//         } finally {
//             setLoading(false)
//         }
//     }

//     const renderTableRows = () => {
//         console.debug('Rendering table rows with representatives:', representatives)
//         return representatives.map((representative) => (
//             <tr key={representative.id} className="odd:bg-white even:bg-primary/5 border-b">
//                 <td className="px-6 py-4">{representative.id}</td>
//                 <td className="px-6 py-4">
//                     <span className={`px-2 py-1 rounded-full text-xs ${
//                         representative.status === 'ACTIVE' 
//                             ? 'bg-green-100 text-green-800' 
//                             : 'bg-red-100 text-red-800'
//                     }`}>
//                         {representative.status}
//                     </span>
//                 </td>
//                 <td className="px-6 py-4">{representative.brandId}</td>
//                 <td className="px-6 py-4">
//                     <span className="font-mono text-sm">{representative.userId}</span>
//                 </td>
//                 <td className="px-6 py-4">
//                     <div className="flex gap-2">
//                         <button 
//                             onClick={() => {
//                                 setSelectedRepresentative(representative)
//                                 setIsEditDialogOpen(true)
//                             }}
//                             className="p-1 hover:bg-slate-100 rounded"
//                             disabled={loading}
//                         >
//                             <PencilSquareIcon className="w-4 h-4 text-blue-500" />
//                         </button>
//                         <button 
//                             onClick={() => handleDelete(representative.id)}
//                             className="p-1 hover:bg-slate-100 rounded"
//                             disabled={loading}
//                         >
//                             <TrashIcon className="w-4 h-4 text-red-500" />
//                         </button>
//                     </div>
//                 </td>
//             </tr>
//         ))
//     }

//     const handlePageChange = (page: number) => {
//         setCurrentPage(page)
//     }

//     const handlePageSizeChange = (newPageSize: number) => {
//         setPageSize(newPageSize)
//         setCurrentPage(1)
//     }

//     return (
//         <div className="mt-8">
//             <Table
//                 data={representatives}
//                 headers={headers}
//                 count={representatives.length}
//                 loading={loading}
//                 showDateFilter={false}
//                 pageSize={pageSize}
//                 currentPage={currentPage}
//                 onPageChange={handlePageChange}
//                 onPageSizeChange={handlePageSizeChange}
//                 showExport={true}
//                 bgColor="#dfe2e8"
//                 // currentItems={currentItems}
//                 initialData={representatives}
//             >
//                 {renderTableRows()}
//             </Table>

//             <div className="flex justify-center mt-4">
//                 <button
//                     onClick={() => setIsAddDialogOpen(true)}
//                     className="p-2 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-colors"
//                 >
//                     <PlusIcon className="w-5 h-5" />
//                 </button>
//             </div>

//             <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
//                 <DialogContent>
//                     <h2 className="text-lg font-semibold mb-4 text-center">{(t('addRepresentative'))}</h2>
//                     <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//                         <div>
//                             <label className="block text-sm mb-1">{(t('user.selectUser'))}:</label>
//                             <Select
//                                 cacheOptions
//                                 defaultOptions={true}
//                                 loadOptions={loadUsers}
//                                 value={selectedUser}
//                                 onChange={(option) => setSelectedUser(option)}
//                                 isSearchable
//                                 className="w-full"
//                                 classNamePrefix="select"
//                                 placeholder={t('user.searchRepresentative')}
//                                 noOptionsMessage={({ inputValue }) => t('user.noRepresentativesFound')}
//                                 formatOptionLabel={(option: UserOption) => (
//                                     <div className="flex items-center gap-2">
//                                         {option.imageUrl && (
//                                             <img 
//                                                 src={option.imageUrl} 
//                                                 alt="" 
//                                                 className="w-8 h-8 rounded-full object-cover"
//                                             />
//                                         )}
//                                         <div>
//                                             <div>{option.label}</div>
//                                             <div className="flex gap-1">
//                                                 {option.roles.map(role => (
//                                                     <span
//                                                         key={role.id}
//                                                         className={`inline-block px-2 py-0.5 text-xs rounded-full ${
//                                                             role.name === 'admin' ? 'bg-red-100 text-red-800' :
//                                                             role.name === 'brand representative' ? 'bg-blue-100 text-blue-800' :
//                                                             role.name === 'customer' ? 'bg-green-100 text-green-800' :
//                                                             'bg-gray-100 text-gray-800'
//                                                         }`}
//                                                     >
//                                                         {role.name}
//                                                     </span>
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 )}
//                             />
//                         </div>

//                         <div>
//                             <label className="block text-sm mb-1">{(t('user.validFrom'))}:</label>
//                             <input
//                                 type="date"
//                                 {...register('validFrom', { required: true })}
//                                 className="w-full px-3 py-2 border rounded-lg"
//                             />
//                         </div>

//                         <div>
//                             <label className="block text-sm mb-1">{(t('user.validTo'))}:</label>
//                             <input
//                                 type="date"
//                                 {...register('validTo', { required: true })}
//                                 className="w-full px-3 py-2 border rounded-lg"
//                             />
//                         </div>

//                         <div>
//                             <label className="block text-sm mb-1">{(t('user.status'))}:</label>
//                             <select
//                                 {...register('status')}
//                                 defaultValue="ACTIVE"
//                                 className="w-full px-3 py-2 border rounded-lg"
//                             >
//                                 <option value="ACTIVE">{(t('active'))}</option>
//                                 <option value="DEACTIVE">{(t('deactive'))}</option>
//                             </select>
//                         </div>

//                         <div className="flex justify-end gap-4">
//                             <button
//                                 type="button"
//                                 onClick={() => setIsAddDialogOpen(false)}
//                                 className="px-4 py-2 border rounded-lg"
//                             >
//                                 {(t('cancel'))}
//                             </button>
//                             <button
//                                 type="submit"
//                                 disabled={loading}
//                                 className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
//                             >
//                                 {(t('add'))}
//                             </button>
//                         </div>
//                     </form>
//                 </DialogContent>
//             </Dialog>

//             <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
//                 <DialogContent>
//                     <h2 className="text-lg font-semibold mb-4">{(t('editRepresentative'))}</h2>
//                     <form onSubmit={handleEditSubmit(handleEdit)} className="space-y-4">
//                         <div>
//                             <label className="block text-sm mb-1">{(t('status'))}:</label>
//                             <select
//                                 {...editRegister('status')}
//                                 defaultValue={selectedRepresentative?.status}
//                                 className="w-full px-3 py-2 border rounded-lg"
//                             >
//                                 <option value="ACTIVE">{(t('active'))}</option>
//                                 <option value="DEACTIVE">{(t('deactive'))}</option>
//                             </select>
//                         </div>

//                         <div className="flex justify-end gap-4">
//                             <button
//                                 type="button"
//                                 onClick={() => {
//                                     setIsEditDialogOpen(false)
//                                     setSelectedRepresentative(null)
//                                 }}
//                                 className="px-4 py-2 border rounded-lg"
//                             >
//                                 {(t('cancel_delete_brand'))}
//                             </button>
//                             <button
//                                 type="submit"
//                                 disabled={loading}
//                                 className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//                             >
//                                 {(t('update'))}
//                             </button>
//                         </div>
//                     </form>
//                 </DialogContent>
//             </Dialog>
//         </div>
//     )
// }

// export default BrandRepresentative

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
import Select from 'react-select/async'
import debounce from 'lodash/debounce'
import { GroupBase } from 'react-select'
import { OptionsOrGroups } from 'react-select'

interface Representative {
    id: number
    status: string
    brandId: number
    userId: string
    createdAt: string
    updatedAt: string
}

interface UserOption {
    value: string
    label: string
    roles: Array<{id: number, name: string}>
    imageUrl?: string
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
    const [selectedUser, setSelectedUser] = useState<UserOption | null>(null)

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
            if (!window.confirm(t('brand.deleteRepresentativeConfirm'))) {
                return;
            }

            setLoading(true);
            const headers = new Headers();
            headers.append('Authorization', `Bearer ${token}`);

            const requestOptions = {
                method: 'DELETE',
                headers,
                body: '', // Empty string as body
                redirect: 'follow' as RequestRedirect
            };

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/representative/${brandId}/${representativeId}`,
                requestOptions
            );

            const result = await response.text();

            if (!response.ok) {
                throw new Error(result || t('brand.representativeDeleteError'));
            }

            toast.success(t('brand.representativeDeleteSuccess'));
            await fetchRepresentatives();
        } catch (error: any) {
            console.error('Error deleting representative:', error);
            toast.error(error.message || t('brand.representativeDeleteError'));
        } finally {
            setLoading(false);
        }
    };

    const loadInitialOptions = async () => {
        try {
            const headers = new Headers();
            headers.append('Authorization', `Bearer ${token}`);

            // First, get the current brand representatives to exclude them
            const representativesResponse = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/representative/${brandId}`,
                {
                    method: 'GET',
                    headers,
                }
            );

            if (!representativesResponse.ok) {
                throw new Error('Failed to fetch current representatives');
            }

            const representativesData = await representativesResponse.json();
            const currentRepresentativeIds = representativesData.brandRepresentatives.map(
                (rep: Representative) => rep.userId
            );

            // Fetch all users without limit
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/user`,
                {
                    method: 'GET',
                    headers,
                }
            );

            if (!response.ok) throw new Error('Failed to fetch users');

            const data = await response.json();
            
            // Filter out users who are already representatives for this brand
            return data.users
                .filter((user: any) => !currentRepresentativeIds.includes(user.id))
                .map((user: any) => ({
                    value: user.id,
                    label: `${user.fullname} (${user.email})`,
                    roles: user.roles,
                    imageUrl: user.imageUrl
                }));
        } catch (error) {
            console.error('Error loading initial users:', error);
            return [];
        }
    };

    const loadUsers = (
        inputValue: string
    ): Promise<OptionsOrGroups<UserOption, GroupBase<UserOption>>> => {
        return new Promise(async (resolve) => {
            try {
                const headers = new Headers();
                headers.append('Authorization', `Bearer ${token}`);

                // Get current representatives
                const representativesResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/representative/${brandId}`,
                    { method: 'GET', headers }
                );
                const representativesData = await representativesResponse.json();
                const currentRepresentativeIds = representativesData.brandRepresentatives.map(
                    (rep: Representative) => rep.userId
                );

                // Get users
                const url = inputValue 
                    ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/user?keyword=${inputValue}`
                    : `${process.env.NEXT_PUBLIC_BASE_URL}/api/user`;
                const response = await fetch(url, { method: 'GET', headers });
                const data = await response.json();

                // Return filtered users
                resolve(data.users
                    .filter((user: any) => !currentRepresentativeIds.includes(user.id))
                    .map((user: any) => ({
                        value: user.id,
                        label: `${user.fullname} (${user.email})`,
                        roles: user.roles,
                        imageUrl: user.imageUrl
                    }))
                );
            } catch (error) {
                console.error('Error loading users:', error);
                resolve([]);
            }
        });
    };

    const onSubmit = async (data: RepresentativeFormData) => {
        if (!selectedUser) {
            toast.error(t('user.selectRepresentative'));
            return;
        }

        try {
            setLoading(true);
            const headers = new Headers();
            headers.append('Authorization', `Bearer ${token}`);
            headers.append('Content-Type', 'application/json');

            const requestBody = {
                userId: selectedUser.value
            };

            const requestOptions = {
                method: 'POST',
                headers,
                body: JSON.stringify(requestBody),
                redirect: 'follow' as RequestRedirect
            };

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/representative/${brandId}`,
                requestOptions
            );

            const result = await response.text();
            let errorMessage;

            try {
                const data = JSON.parse(result);
                if (!response.ok) {
                    // Check if the error is about existing representative
                    if (data.message && data.message.includes('already')) {
                        errorMessage = data.message;
                    } else {
                        errorMessage = t('brand.representativeAddError');
                    }
                    throw new Error(errorMessage);
                }

                toast.success(t('brand.representativeAddSuccess'));
                setIsAddDialogOpen(false);
                reset();
                setSelectedUser(null);
                await fetchRepresentatives();
            } catch (parseError) {
                throw new Error(errorMessage || result || t('brand.representativeAddError'));
            }
        } catch (error: any) {
            console.error('Error adding representative:', error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

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
                bgColor="#dfe2e8"
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
                    <h2 className="text-lg font-semibold mb-4 text-center">{(t('addRepresentative'))}</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-sm mb-1">{(t('user.selectUser'))}:</label>
                            <Select
                                cacheOptions
                                defaultOptions={true}
                                loadOptions={loadUsers}
                                value={selectedUser}
                                onChange={(option) => setSelectedUser(option)}
                                isSearchable
                                className="w-full"
                                classNamePrefix="select"
                                placeholder={t('user.searchRepresentative')}
                                noOptionsMessage={({ inputValue }) => t('user.noRepresentativesFound')}
                                formatOptionLabel={(option: UserOption) => (
                                    <div className="flex items-center gap-2">
                                        {option.imageUrl && (
                                            <img 
                                                src={option.imageUrl} 
                                                alt="" 
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                        )}
                                        <div>
                                            <div>{option.label}</div>
                                            <div className="flex gap-1">
                                                {option.roles.map(role => (
                                                    <span
                                                        key={role.id}
                                                        className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                                                            role.name === 'admin' ? 'bg-red-100 text-red-800' :
                                                            role.name === 'brand representative' ? 'bg-blue-100 text-blue-800' :
                                                            role.name === 'customer' ? 'bg-green-100 text-green-800' :
                                                            'bg-gray-100 text-gray-800'
                                                        }`}
                                                    >
                                                        {role.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-1">{(t('user.validFrom'))}:</label>
                            <input
                                type="date"
                                {...register('validFrom', { required: true })}
                                className="w-full px-3 py-2 border rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-1">{(t('user.validTo'))}:</label>
                            <input
                                type="date"
                                {...register('validTo', { required: true })}
                                className="w-full px-3 py-2 border rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-1">{(t('user.status'))}:</label>
                            <select
                                {...register('status')}
                                defaultValue="ACTIVE"
                                className="w-full px-3 py-2 border rounded-lg"
                            >
                                <option value="ACTIVE">{(t('active'))}</option>
                                <option value="DEACTIVE">{(t('deactive'))}</option>
                            </select>
                        </div>

                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => setIsAddDialogOpen(false)}
                                className="px-4 py-2 border rounded-lg"
                            >
                                {(t('cancel'))}
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
                            >
                                {(t('add'))}
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