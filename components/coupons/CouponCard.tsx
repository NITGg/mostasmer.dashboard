'use client'

import { Coupon } from '@/types/coupon'
import ImageApi from '@/components/ImageApi'
import { useLocale, useTranslations } from 'next-intl'

interface CouponCardProps {
  coupon: Coupon
}

const CouponCard = ({ coupon }: CouponCardProps) => {
  const locale = useLocale()
  const t = useTranslations('Coupons')

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
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
        </div>
      </div>
    </div>
  )
}

export default CouponCard 