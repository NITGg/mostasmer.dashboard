"use client";
import { useLocale, useTranslations } from "next-intl";
// import { ChevronLeftIcon, ChevronRightIcon } from "@icons/material";
import clsx from "clsx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { ChevronDownIcon,ChevronLeftIcon,ChevronRightIcon } from "@heroicons/react/24/outline";
import { MdOutlineDownload } from "react-icons/md";

interface PaginationProps {
  count: number;
  limit: number;
  setLimit: (limit: number) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  onExport?: (format: 'pdf' | 'csv') => void;
  onDateFilter?: (startDate: string, endDate: string) => void;
  showExport?: boolean;
  showDateFilter?: boolean;
  bgColor?: 'white' | 'black' | '#02161e' | '#dfe2e8';
  data: any[];
  length: number;
  isLoading?: boolean;
  start: number;
  end: number;
}

const Pagination = ({
  count,
  limit,
  setLimit,
  currentPage,
  onPageChange,
  onExport,
  onDateFilter,
  showExport = false,
  showDateFilter = false,
  bgColor = '#02161e',
  data,
  length,
  isLoading = false,
  start,
  end,
}: PaginationProps) => {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'csv'>('pdf');
  const [dateRange, setDateRange] = useState({
    from: '',
    to: ''
  });
  const [isPageSizeOpen, setIsPageSizeOpen] = useState(false);
  const pageSizeRef = useRef<HTMLDivElement>(null);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  const t = useTranslations("pagination");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Handle clicking outside of both dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pageSizeRef.current && !pageSizeRef.current.contains(event.target as Node)) {
        setIsPageSizeOpen(false);
      }
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setIsExportOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handlePageSizeSelect = (size: number) => {
    const params = new URLSearchParams(searchParams);
    
    if (size === 0) { // "All" option
      params.set('limit', '0');
      params.set('skip', '0');
      params.set('page', '1');
    } else {
      params.set('limit', size.toString());
      params.set('page', '1');
    }
    
    router.push(`${pathname}?${params.toString()}`);
    setLimit(size);
    setIsPageSizeOpen(false);
  };

  const handleExport = (format: 'pdf' | 'csv') => {
    setSelectedFormat(format);
    if (onExport) {
      onExport(format);
    }
    setIsExportOpen(false);
  };

  const handleDateChange = (type: 'from' | 'to', value: string) => {
    const newDateRange = { ...dateRange, [type]: value };
    setDateRange(newDateRange);

    if (newDateRange.from && newDateRange.to && onDateFilter) {
      onDateFilter(newDateRange.from, newDateRange.to);
    }
  };

  // Calculate total pages
  const totalPages = limit === 0 ? 1 : Math.ceil(count / limit);

  // Check if can go to previous/next page
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div className={`w-full px-4 py-3 flex flex-wrap items-center justify-between rounded-b-xl text-xs ${
      bgColor === '#02161e' ? 'bg-[#02161e] text-white' : 
      'bg-[#dfe2e8] text-gray-600'
    }`}>
      {/* Export and Date Filter Controls */}
      {(showExport || showDateFilter) && (
        <div className="flex items-center gap-2 font-semibold">
          {showExport && onExport && (
            <>
              <span>{t('downloadas')}</span>
              <div ref={exportMenuRef} className="relative">
                <button
                  onClick={() => setIsExportOpen(!isExportOpen)}
                  className="flex items-center gap-2 px-3 py-1 rounded border border-[#2ab09c] text-[#2ab09c] hover:bg-[#2ab09c]/10"
                >
                  <MdOutlineDownload className="w-4 h-4" />
                  {selectedFormat.toUpperCase()}
                </button>

                {isExportOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                    {['pdf', 'csv'].map((format) => (
                      <button
                        key={format}
                        onClick={() => handleExport(format as 'pdf' | 'csv')}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {format.toUpperCase()}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {showDateFilter && onDateFilter && (
            <div className="flex items-center gap-2 ml-4">
              <span>{t('from')}</span>
              <input 
                type="date" 
                value={dateRange.from}
                className="bg-transparent border border-white rounded px-2 py-1"
                onChange={(e) => handleDateChange('from', e.target.value)}
                aria-label="From date"
              />
              <span>{t('to')}</span>
              <input 
                type="date" 
                value={dateRange.to}
                className="bg-transparent border border-white rounded px-2 py-1"
                onChange={(e) => handleDateChange('to', e.target.value)}
                aria-label="To date"
              />
            </div>
          )}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center gap-4">
        {/* Page size selector */}
        <div ref={pageSizeRef} className="relative">
          <button
            onClick={() => setIsPageSizeOpen(!isPageSizeOpen)}
            className="flex items-center space-x-1 px-3 py-1 rounded border border-[#2ab09c] text-[#2ab09c] hover:bg-[#2ab09c]/10"
          >
            {limit === 0 ? 'All' : limit}
            <ChevronDownIcon className="w-4 h-4 text-[#2ab09c] transform rotate-180" />
          </button>

          {isPageSizeOpen && (
            <div className="absolute bottom-full left-0 mb-2 w-48 bg-white rounded-lg shadow-lg border z-50">
              {[10, 20, 50, 100].map((size) => (
                <button
                  key={size}
                  onClick={() => handlePageSizeSelect(size)}
                  className={`w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-200 hover:text-teal-700 ${
                    size === 10 ? 'rounded-t-lg' : 
                    size === 0 ? 'rounded-b-lg' : ''
                  } ${limit === size ? 'bg-gray-100' : ''}`}
                >
                  {size === 0 ? 'All' : size}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Updated Page info display */}
        <div className="min-w-[100px] text-center">
          {isLoading ? (
            <span className="text-sm">Loading...</span>
          ) : count > 0 ? (
            <span className="text-sm">
              {start}-{end} {t('of')} {count}
            </span>
          ) : (
            <span className="text-sm">0 {t('of')} 0</span>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-2">
          <button 
            disabled={!canGoPrevious}
            onClick={() => onPageChange(currentPage - 1)}
            className={`p-1 rounded transition-colors duration-200 ${
              !canGoPrevious ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10'
            }`}
            aria-label="Previous page"
          >
            <ChevronLeftIcon className={clsx("w-5 h-5", { "rotate-180": locale === "ar" })} />
          </button>
          <button 
            disabled={!canGoNext}
            onClick={() => onPageChange(currentPage + 1)}
            className={`p-1 rounded transition-colors duration-200 ${
              !canGoNext ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10'
            }`}
            aria-label="Next page"
          >
            <ChevronRightIcon className={clsx("w-5 h-5", { "rotate-180": locale === "ar" })} />
          </button>
        </div>
        
        {/* Current page display */}
        <div className="ml-2">
          <span className="text-sm">
            {currentPage} / {totalPages || 1}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Pagination;