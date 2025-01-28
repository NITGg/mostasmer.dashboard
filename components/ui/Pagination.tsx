"use client";
import { useLocale, useTranslations } from "next-intl";
// import { ChevronLeftIcon, ChevronRightIcon } from "@icons/material";
import clsx from "clsx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { ChevronDownIcon,ChevronLeftIcon,ChevronRightIcon } from "@heroicons/react/24/outline";
// import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { MdOutlineDownload } from "react-icons/md";
import { chevleft,LoadingIcon } from "@/components/icons";

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
  length
}: PaginationProps) => {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'csv'>('pdf');
  const [dateRange, setDateRange] = useState({
    from: '',
    to: ''
  });
  const [isPageSizeOpen, setIsPageSizeOpen] = useState(false);

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

  const t = useTranslations("pagination");
  const locale = useLocale();

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { push } = useRouter();

  // Get page and limit from URL or use defaults
  const pageFromUrl = Number(searchParams.get("page")) || 1;
  const limitFromUrl = Number(searchParams.get("limit")) || 10;

  const updateUrlAndFetch = (page: number, newLimit?: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    if (newLimit) {
      params.set("limit", newLimit.toString());
    }
    push(`${pathname}?${params.toString()}`);
    
    // Calculate skip based on page and limit
    const skip = (page - 1) * (newLimit || limit);
    onPageChange(page);
  };

  // Calculate pagination values
  const totalPages = Math.ceil(count / limit);
  const startRecord = count > 0 ? (currentPage - 1) * limit + 1 : 0;
  const endRecord = Math.min(currentPage * limit, count);

  // Handle previous page navigation
  const handlePrevPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      onPageChange(newPage);
    }
  };

  // Handle next page navigation
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      onPageChange(newPage);
    }
  };

  // Handle page size selection
  const handlePageSizeSelect = (newLimit: number) => {
    setLimit(newLimit);
    setIsPageSizeOpen(false);
  };

  return (
    <div className={`px-4 py-3 flex items-center justify-between rounded-b-xl text-xs ${
      bgColor === '#02161e' ? 'bg-[#02161e] text-white' : 
      'bg-[#dfe2e8] text-gray-600'
    }`}>
      {/* Export and Date Filter Controls */}
      {(showExport || showDateFilter) && (
        <div className="flex items-center gap-2 font-semibold">
          {showExport && onExport && (
            <>
              <span>{t('downloadas')}</span>
              <div className="relative">
                <button
                  onClick={() => setIsExportOpen(!isExportOpen)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#ffffff] border-1  rounded-2xl hover:bg-teal-600 text-[#9c9c9c] hover:text-white"
                >
                  {selectedFormat === 'pdf' ? t('pdfformat') : t('csvformat')}
                  
                  <ChevronDownIcon className="w-4 h-4 text-[#2ab09c]" />
                </button>

                {isExportOpen && (
                  <div className="absolute bottom-full left-0 mb-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                    <button
                      onClick={() => handleExport('pdf')}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-200 rounded-t-lg hover:text-teal-700"
                    >
                      {t('pdfformat')}
                    </button>
                    <button
                      onClick={() => handleExport('csv')}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-200 rounded-b-lg transition-colors duration-200 text-gray-700 hover:text-teal-700"
                    >
                      {t('csvformat')}
                    </button>
                  </div>
                )}
              </div>
              <MdOutlineDownload 
                onClick={() => handleExport(selectedFormat)}
                className="bg-[#2ab09c] text-2xl rounded-full p-1 text-[#fff] cursor-pointer hover:bg-[#2ab09c] transition-colors  hover:border-white hover:border-2"
              />
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
      <div className="flex items-center gap-4 ml-auto">
        {/* Page size selector */}
        <div className="flex gap-2 items-center font-semibold">

          <span>{t('rowPerPage')}</span>
        </div>
        <div className="relative">
          <button
            onClick={() => setIsPageSizeOpen(!isPageSizeOpen)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#ffffff] border-1 rounded-2xl hover:bg-teal-600 text-[#9c9c9c] hover:text-white ml-4"
          >
            {limit === count ? 'All' : limit}
            <ChevronDownIcon className="w-4 h-4 text-[#2ab09c] transform rotate-180" />
          </button>

          {isPageSizeOpen && (
            <div className="absolute bottom-full left-0 mb-2 w-48 bg-white rounded-lg shadow-lg border z-50">
              {[10, 20, 50, count].map((size) => (
                <button
                  key={size}
                  onClick={() => handlePageSizeSelect(size)}
                  className={`w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-200 hover:text-teal-700 ${
                    size === 10 ? 'rounded-t-lg' : 
                    size === count ? 'rounded-b-lg' : ''
                  } ${limit === size ? 'bg-gray-100' : ''}`}
                >
                  {size === count ? 'All' : size}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Page info display */}
        <div className="min-w-[100px] text-center">
          {count > 0 ? (
            <span>
              {startRecord}-{endRecord} {t('of')} {count}
            </span>
          ) : (
            <span>0 {t('of')} 0</span>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-2">
          <button 
            disabled={currentPage <= 1}
            onClick={handlePrevPage}
            className={`p-1 rounded transition-colors duration-200 ${
              currentPage <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10'
            }`}
            aria-label="Previous page"
          >
            <ChevronLeftIcon className={clsx("w-5 h-5", { "rotate-180": locale === "ar" })} />
          </button>
          <button 
            disabled={currentPage >= totalPages}
            onClick={handleNextPage}
            className={`p-1 rounded transition-colors duration-200 ${
              currentPage >= totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10'
            }`}
            aria-label="Next page"
          >
            <ChevronRightIcon className={clsx("w-5 h-5", { "rotate-180": locale === "ar" })} />
          </button>
        </div>
        
        {/* Optional: Add page numbers display */}
        <div className="ml-2">
          <span className="text-sm">
            {currentPage} / {totalPages}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
