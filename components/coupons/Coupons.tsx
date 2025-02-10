'use client'

import { useEffect, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useAppContext } from '@/context/appContext'
import Table from '@/components/ui/Table'
import { LoadingIcon } from '@/components/icons'
import toast from 'react-hot-toast'
import ImageApi from '@/components/ImageApi'
import { Coupon } from '@/types/coupon'
import CouponCard from './CouponCard'
import { TableCellsIcon, Squares2X2Icon } from '@heroicons/react/24/outline'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'

type ViewMode = 'table' | 'cards'

const Coupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [currentItems, setCurrentItems] = useState(0)
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const { token } = useAppContext()
  const t = useTranslations('Coupons')
  const locale = useLocale()
  
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  // Get current pagination state from URL or defaults
  const currentPage = Number(searchParams.get('page')) || 1
  const pageSize = Number(searchParams.get('limit')) || 10

  // Function to update URL and fetch data
  const updatePaginationAndFetch = async (page: number, limit: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', page.toString())
    params.set('limit', limit.toString())
    router.push(`${pathname}?${params.toString()}`)
    
    await fetchCoupons(page, limit)
  }

  // Add function to fetch total count
  const fetchTotalCount = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/coupons`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )

      if (!response.ok) throw new Error('Failed to fetch total count')

      const data = await response.json()
      setTotalCount(data.coupons?.length || 0)
    } catch (error) {
      console.error('Error fetching total count:', error)
    }
  }

  // Update fetchCoupons to handle pagination
  const fetchCoupons = async (page: number, limit: number) => {
    try {
      setLoading(true)
      const skip = (page - 1) * limit
      
      // Construct URL with pagination parameters
      const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/coupons`)
      url.searchParams.set('limit', limit.toString())
      url.searchParams.set('skip', skip.toString())

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) throw new Error('Failed to fetch coupons')

      const data = await response.json()
      
      // Update states
      setCoupons(data.coupons)
      setCurrentItems(data.coupons.length)
      
      // Fetch total count if needed
      if (page === 1) {
        await fetchTotalCount()
      }
    } catch (error) {
      console.error('Error fetching coupons:', error)
      toast.error(t('fetchError'))
    } finally {
      setLoading(false)
    }
  }

  // Initialize data on component mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Fetch total count first
        await fetchTotalCount()

        // Then fetch paginated data
        if (!searchParams.has('page') || !searchParams.has('limit')) {
          await updatePaginationAndFetch(1, 10)
        } else {
          await fetchCoupons(currentPage, pageSize)
        }
      } catch (error) {
        console.error('Error initializing data:', error)
      }
    }

    initializeData()
  }, [])

  // Handle page change
  const handlePageChange = (newPage: number) => {
    updatePaginationAndFetch(newPage, pageSize)
  }

  // Handle page size change
  const handlePageSizeChange = (newSize: number) => {
    updatePaginationAndFetch(1, newSize) // Reset to first page when changing page size
  }

  // Table headers configuration
  const tableHeaders = [
    { name: 'brands', className: 'w-[150px]', key: 'brand.name', sortable: true },
    { name: 'code', className: 'w-[100px]', key: 'code', sortable: true },
    { name: 'ratio', className: 'w-[100px]', key: 'ratio', sortable: true },
    { name: 'validFrom', className: 'w-[150px]', key: 'validFrom', sortable: true },
    { name: 'validTo', className: 'w-[150px]', key: 'validTo', sortable: true },
    { name: 'Description', className: 'w-[200px]', key: 'description', sortable: true }
  ]

  // Table row render function
  const renderTableRows = () => {
    if (!coupons?.length) return []

    return coupons.map((coupon: Coupon) => (
      <tr key={coupon.id} className="border-b odd:bg-white even:bg-primary/5">
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="size-10">
              <ImageApi
                src={coupon.brand.logo || '/imgs/notfound.png'}
                alt={coupon.brand.name}
                loader={() => coupon.brand.logo}
                loading='lazy'
                height={40}
                width={40}
                className='object-cover rounded-full w-full h-full'
              />
            </div>
            <span>{coupon.brand.name}</span>
          </div>
        </td>
        <td className="px-6 py-4 font-medium">{coupon.code}</td>
        <td className="px-6 py-4">{coupon.ratio}%</td>
        <td className="px-6 py-4">
          {new Date(coupon.validFrom).toLocaleDateString(locale)}
        </td>
        <td className="px-6 py-4">
          {new Date(coupon.validTo).toLocaleDateString(locale)}
        </td>
        <td className="px-6 py-4">{coupon.description}</td>
      </tr>
    ))
  }

  const ViewToggle = () => (
    <div className="flex items-center gap-2 bg-white rounded-lg shadow p-1">
      <button
        onClick={() => setViewMode('table')}
        className={`p-2 rounded ${
          viewMode === 'table' 
            ? 'bg-primary text-white' 
            : 'hover:bg-gray-100'
        }`}
        aria-label={t('tableView')}
      >
        <TableCellsIcon className="size-5" />
      </button>
      <button
        onClick={() => setViewMode('cards')}
        className={`p-2 rounded ${
          viewMode === 'cards' 
            ? 'bg-primary text-white' 
            : 'hover:bg-gray-100'
        }`}
        aria-label={t('cardView')}
      >
        <Squares2X2Icon className="size-5" />
      </button>
    </div>
  )

  const CardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {loading ? (
        <div className="col-span-full flex justify-center py-10">
          <LoadingIcon className="animate-spin size-6" />
        </div>
      ) : !coupons?.length ? (
        <div className="col-span-full text-center py-10 text-gray-500">
          {t('noCoupons')}
        </div>
      ) : (
        coupons.map(coupon => (
          <CouponCard key={coupon.id} coupon={coupon} />
        ))
      )}
    </div>
  )

  return (
    <div className='p-container space-y-6'>
      <div className='flex justify-between items-center'>
        <h4 className='font-bold text-lg md:text-xl lg:text-2xl'>
          {t('title')}
        </h4>
        <ViewToggle />
      </div>

      {viewMode === 'table' ? (
        <Table
          data={coupons}
          headers={tableHeaders}
          count={totalCount}
          loading={loading}
          showDateFilter={false}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          showExport={true}
          bgColor="#02161e"
          currentItems={currentItems}
        >
          {renderTableRows()}
        </Table>
      ) : (
        <CardView />
      )}
    </div>
  )
}

export default Coupons 