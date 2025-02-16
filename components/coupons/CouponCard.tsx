// // 'use client'

// // import { Coupon } from '@/types/coupon'
// // import ImageApi from '@/components/ImageApi'
// // import { useLocale, useTranslations } from 'next-intl'

// // interface CouponCardProps {
// //   coupon: Coupon
// // }

// // const CouponCard = ({ coupon }: CouponCardProps) => {
// //   const locale = useLocale()
// //   const t = useTranslations('Coupons')

// //   return (
// //     <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
// //       {/* Brand Header */}
// //       <div className="p-4 bg-primary/5 flex items-center gap-3 border-b">
// //         <div className="size-12">
// //           <ImageApi
// //             src={coupon.brand.logo || '/imgs/notfound.png'}
// //             alt={coupon.brand.name}
// //             loader={() => coupon.brand.logo}
// //             loading='lazy'
// //             height={48}
// //             width={48}
// //             className='object-cover rounded-full w-full h-full'
// //           />
// //         </div>
// //         <h3 className="font-semibold text-lg">{coupon.brand.name}</h3>
// //       </div>

// //       {/* Coupon Details */}
// //       <div className="p-4 space-y-3">
// //         {/* Code and Ratio */}
// //         <div className="flex justify-between items-center">
// //           <div className="bg-primary/10 px-3 py-1 rounded-full">
// //             <span className="font-mono font-bold text-primary">
// //               {coupon.code}
// //             </span>
// //           </div>
// //           <div className="text-lg font-bold text-primary">
// //             {coupon.ratio}%
// //           </div>
// //         </div>

// //         {/* Validity Period */}
// //         <div className="space-y-1 text-sm text-gray-600">
// //           <div className="flex justify-between">
// //             <span>{t('ValidFrom')}:</span>
// //             <span className="font-medium">
// //               {new Date(coupon.validFrom).toLocaleDateString(locale)}
// //             </span>
// //           </div>
// //           <div className="flex justify-between">
// //             <span>{t('ValidTo')}:</span>
// //             <span className="font-medium">
// //               {new Date(coupon.validTo).toLocaleDateString(locale)}
// //             </span>
// //           </div>
// //         </div>

// //         {/* Description */}
// //         <div className="pt-2 border-t">
// //           <p className="text-sm text-gray-600 line-clamp-2">
// //             {coupon.description}
// //           </p>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }

// // export default CouponCard 

// 'use client'

// import { Coupon } from '@/types/coupon'
// import ImageApi from '@/components/ImageApi'
// import { useLocale, useTranslations } from 'next-intl'
// import { TrashIconn, EditIcon } from '../icons'
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
// import { useState } from 'react'
// import toast from 'react-hot-toast'
// import { useAppContext } from '@/context/appContext'

// interface CouponCardProps {
//   coupon: Coupon
//   onEdit: () => void
//   onDelete?: () => void
//   onRefresh: () => void
// }

// const CouponCard = ({ coupon, onEdit, onDelete, onRefresh }: CouponCardProps) => {
//   const locale = useLocale()
//   const t = useTranslations('Coupons')
//   const { token } = useAppContext()
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
//   const [isDeleting, setIsDeleting] = useState(false)

//   const handleDelete = async () => {
//     try {
//       setIsDeleting(true)
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/coupons/${coupon.brandId}/${coupon.id}`,
//         {
//           method: 'DELETE',
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         }
//       )

//       if (!response.ok) throw new Error('Failed to delete coupon')

//       toast.success(t('deleteSuccess'))
//       setIsDeleteDialogOpen(false)
//       if (onDelete) {
//         onDelete()
//       }
//       onRefresh()
//     } catch (error) {
//       console.error('Error deleting coupon:', error)
//       toast.error(t('error.deleteFailed'))
//     } finally {
//       setIsDeleting(false)
//     }
//   }

//   return (
//     <>
//       <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
//         {/* Brand Header */}
//         <div className="p-4 bg-primary/5 flex items-center gap-3 border-b">
//           <div className="size-12">
//             <ImageApi
//               src={coupon.brand.logo || '/imgs/notfound.png'}
//               alt={coupon.brand.name}
//               loader={() => coupon.brand.logo}
//               loading='lazy'
//               height={48}
//               width={48}
//               className='object-cover rounded-full w-full h-full'
//             />
//           </div>
//           <h3 className="font-semibold text-lg">{coupon.brand.name}</h3>
//         </div>

//         {/* Coupon Details */}
//         <div className="p-4 space-y-3">
//           {/* Code and Ratio */}
//           <div className="flex justify-between items-center">
//             <div className="bg-primary/10 px-3 py-1 rounded-full">
//               <span className="font-mono font-bold text-primary">
//                 {coupon.code}
//               </span>
//             </div>
//             <div className="text-lg font-bold text-primary">
//               {coupon.ratio}%
//             </div>
//           </div>

//           {/* Validity Period */}
//           <div className="space-y-1 text-sm text-gray-600">
//             <div className="flex justify-between">
//               <span>{t('ValidFrom')}:</span>
//               <span className="font-medium">
//                 {new Date(coupon.validFrom).toLocaleDateString(locale)}
//               </span>
//             </div>
//             <div className="flex justify-between">
//               <span>{t('ValidTo')}:</span>
//               <span className="font-medium">
//                 {new Date(coupon.validTo).toLocaleDateString(locale)}
//               </span>
//             </div>
//           </div>

//           {/* Description */}
//           <div className="pt-2 border-t">
//             <p className="text-sm text-gray-600 line-clamp-2">
//               {coupon.description}
//             </p>
//             <div className='flex justify-between mt-4'>
//               <button 
//                 onClick={onEdit}
//                 className='flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors'
//               >
//                 <EditIcon className='size-4' />
//                 {t('edit')}
//               </button>
//               <button 
//                 onClick={() => setIsDeleteDialogOpen(true)}
//                 className='flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors'
//               >
//                 <TrashIconn className='size-4' />
//                 {t('delete')}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Delete Confirmation Dialog */}
//       <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>{t('deleteCoupon')}</DialogTitle>
//             <DialogDescription>
//               {t('deleteConfirm')}
//             </DialogDescription>
//           </DialogHeader>
//           <DialogFooter className="flex justify-end gap-3 pt-4">
//             <button
//               onClick={() => setIsDeleteDialogOpen(false)}
//               className="px-4 py-2 border rounded-md hover:bg-gray-100"
//               disabled={isDeleting}
//             >
//               {t('cancel')}
//             </button>
//             <button
//               onClick={handleDelete}
//               disabled={isDeleting}
//               className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
//             >
//               {isDeleting ? t('deleting') : t('confirmDelete')}
//             </button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </>
//   )
// }

// export default CouponCard 

'use client'

import { Coupon } from '@/types/coupon'
import ImageApi from '@/components/ImageApi'
import { useLocale, useTranslations } from 'next-intl'
import { TrashIconn, EditIcon } from '../icons'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useAppContext } from '@/context/appContext'
import { useRouter } from 'next/navigation'

interface CouponCardProps {
  coupon: Coupon
  onEdit: () => void
  onDelete?: () => void
  onRefresh: () => void
}

const CouponCard = ({ coupon, onEdit, onDelete, onRefresh }: CouponCardProps) => {
  const locale = useLocale()
  const t = useTranslations('Coupons')
  const { token } = useAppContext()
  const router = useRouter()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/coupons/${coupon.brandId}/${coupon.id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )

      if (!response.ok) throw new Error('Failed to delete coupon')

      toast.success(t('deleteSuccess'))
      setIsDeleteDialogOpen(false)
      if (onDelete) {
        onDelete()
      }
      onRefresh()
    } catch (error) {
      console.error('Error deleting coupon:', error)
      toast.error(t('error.deleteFailed'))
    } finally {
      setIsDeleting(false)
    }
  }

  const navigateToBrand = (e: React.MouseEvent) => {
    // Don't navigate if clicking on buttons
    if ((e.target as HTMLElement).closest('button')) return
    router.push(`/${locale}/brands/${coupon.brandId}`)
  }

  return (
    <>
      <div 
        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
        onClick={navigateToBrand}
      >
        {/* Brand Header */}
        <div className="p-4 bg-primary/5 flex items-center gap-3 border-b">
          <div className="size-12">
            <ImageApi
              src={coupon.brand.logo || '/imgs/notfound.png'}
              alt={coupon.brand.name}
              loader={() => coupon.brand.logo}
              loading='lazy'
              height={48}
              width={48}
              className='object-cover rounded-full w-full h-full'
            />
          </div>
          <h3 className="font-semibold text-lg">{coupon.brand.name}</h3>
        </div>

        {/* Coupon Details */}
        <div className="p-4 space-y-3">
          {/* Code and Ratio */}
          <div className="flex justify-between items-center">
            <div className="bg-primary/10 px-3 py-1 rounded-full">
              <span className="font-mono font-bold text-primary">
                {coupon.code}
              </span>
            </div>
            <div className="text-lg font-bold text-primary">
              {coupon.ratio}%
            </div>
          </div>

          {/* Validity Period */}
          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>{t('ValidFrom')}:</span>
              <span className="font-medium">
                {new Date(coupon.validFrom).toLocaleDateString(locale)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>{t('ValidTo')}:</span>
              <span className="font-medium">
                {new Date(coupon.validTo).toLocaleDateString(locale)}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="pt-2 border-t">
            <p className="text-sm text-gray-600 line-clamp-2">
              {coupon.description}
            </p>
            <div className='flex justify-between mt-4'>
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit()
                }}
                className='flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors'
              >
                <EditIcon className='size-4' />
                {t('edit')}
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  setIsDeleteDialogOpen(true)
                }}
                className='flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors'
              >
                <TrashIconn className='size-4' />
                {t('delete')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('deleteCoupon')}</DialogTitle>
            <DialogDescription>
              {t('deleteConfirm')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setIsDeleteDialogOpen(false)}
              className="px-4 py-2 border rounded-md hover:bg-gray-100"
              disabled={isDeleting}
            >
              {t('cancel')}
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
            >
              {isDeleting ? t('deleting') : t('confirmDelete')}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default CouponCard 