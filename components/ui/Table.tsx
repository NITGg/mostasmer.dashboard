// "use client";
// import { useTranslations, useLocale } from "next-intl";
// import React, { ReactNode, useState, useEffect } from "react";
// import Pagination from "./Pagination";
// import { LoadingIcon } from "../icons";
// import toast from 'react-hot-toast';
// import { jsPDF } from 'jspdf';
// import 'jspdf-autotable';
// import { usePathname, useSearchParams } from 'next/navigation';
// import { useRouter } from 'next/navigation';


// import 'jspdf-autotable';
// import '../NotoNaskhArabic-Regular-normal.js';

// // Add proper type declaration for jsPDF with autoTable
// declare module 'jspdf' {
//   interface jsPDF {
//     autoTable: (options: {
//       head: string[][];
//       body: any[][];
//       startY?: number;
//       theme?: string;
//       styles?: {
//         font?: string;
//         fontSize?: number;
//         cellPadding?: number;
//       };
//       columnStyles?: {
//         [key: number]: { cellWidth: number | 'auto' };
//       };
//       margin?: {
//         top: number;
//         left: number;
//         right: number;
//       };
//     }) => jsPDF;
//   }
// }

// // Add interface for child components
// interface TableRowProps {
//   data: any[];
// }

// interface TableProps {
//   data: any[];
//   headers: { name: string; className?: string }[];
//   children: React.ReactElement<TableRowProps> | React.ReactElement<TableRowProps>[];
//   count?: number;
//   loading?: boolean;
//   showDateFilter?: boolean;
//   pageSize?: number;
//   bgColor?: 'white' | 'black' | '#02161e' | '#dfe2e8';
//   onPageChange?: (page: number) => void;
//   onPageSizeChange?: (size: number) => void;
//   showExport?: boolean;
//   onExport?: (format: 'pdf' | 'csv') => void;
//   onDateFilter?: (startDate: string, endDate: string) => void;
//   currentPage: number;
//   currentItems?: number;
//   showCount?: boolean;
//   initialData?: any[];
// }

// interface PaginationProps {
//   count: number;
//   limit: number;
//   setLimit: (limit: number) => void;
//   currentPage: number;
//   onPageChange: (page: number) => void;
//   onExport?: (format: 'pdf' | 'csv') => void;
//   onDateFilter?: (startDate: string, endDate: string) => void;
//   showExport?: boolean;
//   showDateFilter?: boolean;
//   bgColor?: 'white' | 'black' | '#02161e' | '#dfe2e8';
//   data: any[];
//   length: number;
//   isLoading?: boolean;
//   start: number;
//   end: number;
// }

// const Table = ({
//   data,
//   headers,
//   children,
//   count = 0,
//   loading = false,
//   showDateFilter = false,
//   pageSize = 10,
//   currentPage,
//   onPageChange,
//   onPageSizeChange,
//   showExport = false,
//   onExport,
//   bgColor = '#02161e',
//   onDateFilter,
// }: TableProps) => {
//   const t = useTranslations("Tablecomponent");
//   const [filteredData, setFilteredData] = useState(data);
//   const [isLoading, setIsLoading] = useState(loading);
//   const searchParams = useSearchParams();
//   const pathname = usePathname();
//   const { push } = useRouter();
//   const locale = useLocale();

//   // Update URL with new page number
//   const updatePage = (newPage: number) => {
//     const params = new URLSearchParams(searchParams);
//     params.set("page", newPage.toString());
//     push(`${pathname}?${params.toString()}`);
//   };

//   // Add the getTableType function
//   const getTableType = () => {
//     const path = pathname.split('/');
//     // Get the last segment of the path and remove any query parameters
//     const type = path[path.length - 1].split('?')[0];
//     // If the path ends with a number (like /brands/123), use the previous segment
//     return isNaN(Number(type)) ? type : path[path.length - 2];
//   };

//   // Update filtered data when raw data changes
//   useEffect(() => {
//     setIsLoading(loading);
//     setFilteredData(data);
//   }, [data, loading]);

//   // Handle date filtering (only if enabled)
//   const handleDateFilter = showDateFilter ? (startDate: string, endDate: string) => {
//     if (!startDate || !endDate) {
//       setFilteredData(data);
//       return;
//     }

//     const start = new Date(startDate);
//     const end = new Date(endDate);

//     const filtered = data.filter((item: any) => {
//       const itemDate = new Date(item.validFrom || item.createdAt);
//       return itemDate >= start && itemDate <= end;
//     });

//     setFilteredData(filtered);
//   } : undefined;


//   // Handle data export
//   const handleExport = async (format: 'pdf' | 'csv') => {
//     try {
//       const currentData = filteredData || data;
//       const tableType = getTableType();

//       if (format === 'pdf') {
//         try {
//           const doc = new jsPDF({
//             orientation: 'p',
//             unit: 'mm',
//             format: 'a4',
//             putOnlyUsedFonts: true,
//             hotfixes: ["px_scaling"],
//           });

//           // Set font and RTL for Arabic
//           if (locale === 'ar') {
//             doc.setR2L(false);
//             doc.setFont('NotoNaskhArabic-Regular', 'normal');
//           }

//           // Add title
//           doc.setFontSize(18);
//           const title = `${tableType.charAt(0).toUpperCase() + tableType.slice(1)} Export`;
//           doc.text(title, 105, 15, { align: 'center' });

//           // Filter out action columns and get visible headers
//           const visibleHeaders = headers
//             .filter(header => !header.name.toLowerCase().includes('action'))
//             .map(header => t(header.name));

//           // Generate table data
//           const tableData = currentData.map((item: any) => [
//             item.imageUrl || 'No image',
//             locale === 'ar' ? item.nameAr || item.name : item.name || item.nameEn
//           ]);

//           // Add table with proper typing
//           doc.autoTable({
//             head: [visibleHeaders],
//             body: tableData,
//             startY: 25,
//             theme: 'grid',
//             styles: {
//               font: locale === 'ar' ? 'NotoNaskhArabic-Regular' : undefined,
//               fontSize: 10,
//               cellPadding: 5
//             },
//             columnStyles: {
//               0: { cellWidth: 80 },
//               1: { cellWidth: 'auto' }
//             },
//             margin: { top: 30, left: 20, right: 20 }
//           });

//           // Save PDF
//           const timestamp = new Date().toISOString().split('T')[0];
//           doc.save(`${tableType}-export-${timestamp}.pdf`);

//         } catch (pdfError) {
//           console.error('PDF generation error:', pdfError);
//           toast.error('Failed to generate PDF');
//         }
//       } else if (format === 'csv') {
//         // Generate CSV
//         const visibleHeaders = headers
//           .filter(header => !header.name.toLowerCase().includes('action'))
//           .map(header => t(header.name));

//         const csvData = currentData.map((item: any) => [
//           item.imageUrl || 'No image',
//           locale === 'ar' ? item.nameAr || item.name : item.name || item.nameEn
//         ]);

//         const csvContent = [visibleHeaders, ...csvData]
//           .map(row => row.join(','))
//           .join('\n');

//         const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//         const link = document.createElement('a');
//         const timestamp = new Date().toISOString().split('T')[0];

//         link.href = URL.createObjectURL(blob);
//         link.download = `${tableType}-export-${timestamp}.csv`;
//         link.click();
//         URL.revokeObjectURL(link.href);
//       }
//     } catch (error) {
//       console.error('Export error:', error);
//       toast.error('Failed to export data');
//     }
//   };

//   // Update URL and trigger data fetch when page changes
//   const handlePageChange = (newPage: number) => {
//     // Update URL
//     const params = new URLSearchParams(searchParams);
//     params.set("page", newPage.toString());
//     push(`${pathname}?${params.toString()}`);

//     // Call the parent's onPageChange handler to fetch new data
//     if (onPageChange) {
//       onPageChange(newPage);
//     }
//   };

//   // Handle page size change with URL update
//   const handlePageSizeChange = (newSize: number) => {
//     const params = new URLSearchParams(searchParams);
//     params.set("limit", newSize.toString());
//     params.set("page", "1"); // Reset to first page when changing page size
//     push(`${pathname}?${params.toString()}`);

//     if (onPageSizeChange) {
//       onPageSizeChange(newSize);
//     }
//   };

//   // Calculate the range of items being displayed
//   const calculateRange = () => {
//     if (!count || count === 0) return { start: 0, end: 0, total: 0 };
    
//     if (pageSize === 0) { // When showing all records
//       return {
//         start: 1,
//         end: count,
//         total: count
//       };
//     }

//     const start = ((currentPage - 1) * pageSize) + 1;
//     const end = Math.min(currentPage * pageSize, count);
    
//     return {
//       start: count > 0 ? start : 0,
//       end,
//       total: count
//     };
//   };

//   const { start, end, total } = calculateRange();

//   return (
//     <div className="w-full mx-auto">
//       {/* <div className="rounded-t-xl overflow-auto max-h-[calc(100vh-350px)] border border-gray-200 bg-white sidebar-scrolling"> */}
//       <div className="rounded-t-xl overflow-auto max-h-[500px] border border-gray-200 bg-white sidebar-scrolling" >
//         <table className="w-full text-sm text-left rtl:text-right text-gray-500">
//           <thead className={`text-xs uppercase sticky top-0 z-50 ${bgColor === '#02161e' ? 'text-white bg-[#02161e]' :
//               'text-[#02161e] bg-[#dfe2e8]'
//             }`}>
//             <tr>
//               {headers.map(({ name, className }) => (
//                 <th
//                   key={name}
//                   scope="col"
//                   className={`px-6 py-4 whitespace-nowrap ${className || ""}`}
//                 >
//                   {t(name)}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className="bg-white">
//             {isLoading ? (
//               <tr className="odd:bg-white even:bg-primary/5">
//                 <td colSpan={headers.length} scope="row" className="px-6 py-4">
//                   <div className="w-full flex justify-center">
//                     <LoadingIcon className="animate-spin size-6" />
//                   </div>
//                 </td>
//               </tr>
//             ) : (
//               <>
//                 {!filteredData?.length ? (
//                   <tr className="odd:bg-white even:bg-primary/5 border-b">
//                     <td
//                       colSpan={headers.length}
//                       scope="row"
//                       className="px-6 py-4 text-center font-bold"
//                     >
//                       {t("no data yat")}
//                     </td>
//                   </tr>
//                 ) : (
//                   React.Children.map(children, (child) => {
//                     if (React.isValidElement<TableRowProps>(child)) {
//                       return React.cloneElement(child, {
//                         data: filteredData
//                       } as TableRowProps);
//                     }
//                     return child;
//                   })
//                 )}
//               </>
//             )}
//           </tbody>
//         </table>
//       </div>

//       <Pagination
//         count={total}
//         limit={pageSize}
//         setLimit={handlePageSizeChange}
//         currentPage={currentPage}
//         onPageChange={handlePageChange}
//         onExport={showExport ? handleExport : undefined}
//         onDateFilter={showDateFilter ? handleDateFilter : undefined}
//         showExport={showExport}
//         showDateFilter={showDateFilter}
//         bgColor={bgColor}
//         data={data}
//         length={data?.length || 0}
//         start={start}
//         end={end}
//       />

//     </div>
//   );
// };

// export default Table;


// "use client";
// import { useTranslations, useLocale } from "next-intl";
// import React, { ReactNode, useState, useEffect } from "react";
// import Pagination from "./Pagination";
// import { LoadingIcon } from "../icons";
// import toast from 'react-hot-toast';
// import { jsPDF } from 'jspdf';
// import 'jspdf-autotable';
// import { usePathname, useSearchParams } from 'next/navigation';
// import { useRouter } from 'next/navigation';


// import 'jspdf-autotable';
// import '../NotoNaskhArabic-Regular-normal.js';

// // Add proper type declaration for jsPDF with autoTable
// declare module 'jspdf' {
//   interface jsPDF {
//     autoTable: (options: {
//       head: string[][];
//       body: any[][];
//       startY?: number;
//       theme?: string;
//       styles?: {
//         font?: string;
//         fontSize?: number;
//         cellPadding?: number;
//       };
//       columnStyles?: {
//         [key: number]: { cellWidth: number | 'auto' };
//       };
//       margin?: {
//         top: number;
//         left: number;
//         right: number;
//       };
//     }) => jsPDF;
//   }
// }

// // Add interface for child components
// interface TableRowProps {
//   data: any[];
// }

// interface TableProps {
//   data: any[];
//   headers: { name: string; className?: string }[];
//   children: React.ReactElement<TableRowProps> | React.ReactElement<TableRowProps>[];
//   count?: number;
//   loading?: boolean;
//   showDateFilter?: boolean;
//   pageSize?: number;
//   bgColor?: 'white' | 'black' | '#02161e' | '#dfe2e8';
//   onPageChange?: (page: number) => void;
//   onPageSizeChange?: (size: number) => void;
//   showExport?: boolean;
//   onExport?: (format: 'pdf' | 'csv') => void;
//   onDateFilter?: (startDate: string, endDate: string) => void;
//   currentPage: number;
//   currentItems?: number;
//   showCount?: boolean;
//   initialData?: any[];
// }

// interface PaginationProps {
//   count: number;
//   limit: number;
//   setLimit: (limit: number) => void;
//   currentPage: number;
//   onPageChange: (page: number) => void;
//   onExport?: (format: 'pdf' | 'csv') => void;
//   onDateFilter?: (startDate: string, endDate: string) => void;
//   showExport?: boolean;
//   showDateFilter?: boolean;
//   bgColor?: 'white' | 'black' | '#02161e' | '#dfe2e8';
//   data: any[];
//   length: number;
//   isLoading?: boolean;
//   start: number;
//   end: number;
// }

// const Table = ({
//   data,
//   headers,
//   children,
//   count = 0,
//   loading = false,
//   showDateFilter = false,
//   pageSize = 10,
//   currentPage,
//   onPageChange,
//   onPageSizeChange,
//   showExport = false,
//   onExport,
//   bgColor = '#02161e',
//   onDateFilter,
// }: TableProps) => {
//   const t = useTranslations("Tablecomponent");
//   const [filteredData, setFilteredData] = useState(data);
//   const [isLoading, setIsLoading] = useState(loading);
//   const searchParams = useSearchParams();
//   const pathname = usePathname();
//   const { push } = useRouter();
//   const locale = useLocale();

//   // Update URL with new page number
//   const updatePage = (newPage: number) => {
//     const params = new URLSearchParams(searchParams);
//     params.set("page", newPage.toString());
//     push(`${pathname}?${params.toString()}`);
//   };

//   // Add the getTableType function
//   const getTableType = () => {
//     const path = pathname.split('/');
//     // Get the last segment of the path and remove any query parameters
//     const type = path[path.length - 1].split('?')[0];
//     // If the path ends with a number (like /brands/123), use the previous segment
//     return isNaN(Number(type)) ? type : path[path.length - 2];
//   };

//   // Update filtered data when raw data changes
//   useEffect(() => {
//     setIsLoading(loading);
//     setFilteredData(data);
//   }, [data, loading]);

//   // Handle date filtering (only if enabled)
//   const handleDateFilter = showDateFilter ? (startDate: string, endDate: string) => {
//     if (!startDate || !endDate) {
//       setFilteredData(data);
//       return;
//     }

//     const start = new Date(startDate);
//     const end = new Date(endDate);

//     const filtered = data.filter((item: any) => {
//       const itemDate = new Date(item.validFrom || item.createdAt);
//       return itemDate >= start && itemDate <= end;
//     });

//     setFilteredData(filtered);
//   } : undefined;


//   // Handle data export
//   const handleExport = async (format: 'pdf' | 'csv') => {
//     try {
//       const { headers: exportHeaders, rows: exportRows } = prepareExportData();
//       const tableType = getTableType();
//       const timestamp = new Date().toISOString().split('T')[0];

//       if (format === 'pdf') {
//         const doc = new jsPDF({
//           orientation: 'landscape',
//           unit: 'mm',
//           format: 'a4',
//           putOnlyUsedFonts: true,
//           hotfixes: ["px_scaling"],
//         });

//         // Set font and RTL for Arabic
//         if (locale === 'ar') {
//           doc.setR2L(true);
//           doc.setFont('NotoNaskhArabic-Regular', 'normal');
//         }

//         // Add title with styling
//         doc.setFontSize(20);
//         doc.setTextColor(0, 161, 143);
//         const title = `${tableType.charAt(0).toUpperCase() + tableType.slice(1)} Export`;
//         doc.text(title, doc.internal.pageSize.width / 2, 20, { align: 'center' });

//         // Add date
//         doc.setFontSize(10);
//         doc.setTextColor(100, 100, 100);
//         const date = new Date().toLocaleDateString(locale, {
//           year: 'numeric',
//           month: 'long',
//           day: 'numeric'
//         });
//         doc.text(date, doc.internal.pageSize.width - 20, 30, { align: 'right' });

//         // Add table with improved styling
//         doc.autoTable({
//           head: [exportHeaders],
//           body: exportRows,
//           startY: 40,
//           theme: 'grid',
//           styles: {
//             font: locale === 'ar' ? 'NotoNaskhArabic-Regular' : undefined,
//             fontSize: 10,
//             cellPadding: 8,
//             lineWidth: 0.1,
//             lineColor: [80, 80, 80],
//             textColor: [50, 50, 50]
//           },
//           headStyles: {
//             fillColor: [0, 161, 143],
//             textColor: [255, 255, 255],
//             fontSize: 12,
//             fontStyle: 'bold',
//             halign: 'center'
//           },
//           bodyStyles: {
//             halign: 'center'
//           },
//           alternateRowStyles: {
//             fillColor: [245, 245, 245]
//           },
//           columnStyles: Object.fromEntries(
//             exportHeaders.map((header, index) => {
//               let width = 'auto';
//               const headerLower = header.toLowerCase();
//               if (headerLower.includes('image')) {
//                 width = 50;
//               } else if (headerLower.includes('email')) {
//                 width = 70;
//               } else if (headerLower.includes('name')) {
//                 width = 60;
//               } else if (headerLower.includes('phone') || headerLower.includes('mobile')) {
//                 width = 40;
//               } else if (headerLower.includes('type')) {
//                 width = 40;
//               }
//               return [index, { 
//                 cellWidth: width,
//                 halign: 'center',
//                 valign: 'middle'
//               }];
//             })
//           ),
//           margin: { 
//             top: 40,
//             left: 10,
//             right: 10,
//             bottom: 20
//           },
//           didDrawPage: (data) => {
//             doc.setFontSize(10);
//             doc.setTextColor(100, 100, 100);
//             doc.text(
//               `Page ${doc.getCurrentPageInfo().pageNumber}`,
//               doc.internal.pageSize.width / 2,
//               doc.internal.pageSize.height - 10,
//               { align: 'center' }
//             );
//           }
//         });

//         doc.save(`${tableType}-export-${timestamp}.pdf`);
//       } else if (format === 'csv') {
//         const csvContent = [
//           exportHeaders.join(','),
//           ...exportRows.map(row => row.join(','))
//         ].join('\n');

//         const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//         const link = document.createElement('a');
//         link.href = URL.createObjectURL(blob);
//         link.download = `${tableType}-export-${timestamp}.csv`;
//         link.click();
//         URL.revokeObjectURL(link.href);
//       }
//     } catch (error) {
//       console.error('Export error:', error);
//       toast.error('Failed to export data');
//     }
//   };

//   // Update URL and trigger data fetch when page changes
//   const handlePageChange = (newPage: number) => {
//     // Update URL
//     const params = new URLSearchParams(searchParams);
//     params.set("page", newPage.toString());
//     push(`${pathname}?${params.toString()}`);

//     // Call the parent's onPageChange handler to fetch new data
//     if (onPageChange) {
//       onPageChange(newPage);
//     }
//   };

//   // Handle page size change with URL update
//   const handlePageSizeChange = (newSize: number) => {
//     const params = new URLSearchParams(searchParams);
//     params.set("limit", newSize.toString());
//     params.set("page", "1"); // Reset to first page when changing page size
//     push(`${pathname}?${params.toString()}`);

//     if (onPageSizeChange) {
//       onPageSizeChange(newSize);
//     }
//   };

//   // Calculate the range of items being displayed
//   const calculateRange = () => {
//     if (!count || count === 0) return { start: 0, end: 0, total: 0 };
    
//     if (pageSize === 0) { // When showing all records
//       return {
//         start: 1,
//         end: count,
//         total: count
//       };
//     }

//     const start = ((currentPage - 1) * pageSize) + 1;
//     const end = Math.min(currentPage * pageSize, count);
    
//     return {
//       start: count > 0 ? start : 0,
//       end,
//       total: count
//     };
//   };

//   const { start, end, total } = calculateRange();

//   return (
//     <div className="w-full mx-auto">
//       {/* <div className="rounded-t-xl overflow-auto max-h-[calc(100vh-350px)] border border-gray-200 bg-white sidebar-scrolling"> */}
//       <div className="rounded-t-xl overflow-auto max-h-[500px] border border-gray-200 bg-white sidebar-scrolling" >
//         <table className="w-full text-sm text-left rtl:text-right text-gray-500">
//           <thead className={`text-xs uppercase sticky top-0 z-50 ${bgColor === '#02161e' ? 'text-white bg-[#02161e]' :
//               'text-[#02161e] bg-[#dfe2e8]'
//             }`}>
//             <tr>
//               {headers.map(({ name, className }) => (
//                 <th
//                   key={name}
//                   scope="col"
//                   className={`px-6 py-4 whitespace-nowrap ${className || ""}`}
//                 >
//                   {t(name)}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className="bg-white">
//             {isLoading ? (
//               <tr className="odd:bg-white even:bg-primary/5">
//                 <td colSpan={headers.length} scope="row" className="px-6 py-4">
//                   <div className="w-full flex justify-center">
//                     <LoadingIcon className="animate-spin size-6" />
//                   </div>
//                 </td>
//               </tr>
//             ) : (
//               <>
//                 {!filteredData?.length ? (
//                   <tr className="odd:bg-white even:bg-primary/5 border-b">
//                     <td
//                       colSpan={headers.length}
//                       scope="row"
//                       className="px-6 py-4 text-center font-bold"
//                     >
//                       {t("no data yat")}
//                     </td>
//                   </tr>
//                 ) : (
//                   React.Children.map(children, (child) => {
//                     if (React.isValidElement<TableRowProps>(child)) {
//                       return React.cloneElement(child, {
//                         data: filteredData
//                       } as TableRowProps);
//                     }
//                     return child;
//                   })
//                 )}
//               </>
//             )}
//           </tbody>
//         </table>
//       </div>

//       <Pagination
//         count={total}
//         limit={pageSize}
//         setLimit={handlePageSizeChange}
//         currentPage={currentPage}
//         onPageChange={handlePageChange}
//         onExport={showExport ? handleExport : undefined}
//         onDateFilter={showDateFilter ? handleDateFilter : undefined}
//         showExport={showExport}
//         showDateFilter={showDateFilter}
//         bgColor={bgColor}
//         data={data}
//         length={data?.length || 0}
//         start={start}
//         end={end}
//       />

//     </div>
//   );
// };

// export default Table;

// function prepareExportData(): { headers: any; rows: any; } {
//   throw new Error("Function not implemented.");
// }

//from day 2-5-2025

// "use client";
// import { useTranslations, useLocale } from "next-intl";
// import React, { ReactNode, useState, useEffect } from "react";
// import Pagination from "./Pagination";
// import { LoadingIcon } from "../icons";
// import toast from 'react-hot-toast';
// import { jsPDF } from 'jspdf';
// import 'jspdf-autotable';
// import { usePathname, useSearchParams } from 'next/navigation';
// import { useRouter } from 'next/navigation';


// import 'jspdf-autotable';
// import '../NotoNaskhArabic-Regular-normal.js';

// // Add proper type declaration for jsPDF with autoTable
// declare module 'jspdf' {
//   interface jsPDF {
//     autoTable: (options: {
//       head: string[][];
//       body: any[][];
//       startY?: number;
//       theme?: string;
//       styles?: {
//         font?: string;
//         fontSize?: number;
//         cellPadding?: number;
//         lineWidth?: number;
//         lineColor?: number[];
//         textColor?: number[];
//       };
//       headStyles?: {
//         fillColor?: number[];
//         textColor?: number[];
//         fontSize?: number;
//         fontStyle?: string;
//         halign?: string;
//       };
//       bodyStyles?: {
//         halign?: string;
//       };
//       alternateRowStyles?: {
//         fillColor?: number[];
//       };
//       columnStyles?: {
//         [key: number]: {
//           cellWidth: number | 'auto';
//           halign?: string;
//           valign?: string;
//         };
//       };
//       margin?: {
//         top: number;
//         left: number;
//         right: number;
//         bottom: number;
//       };
//       didDrawPage?: (data: any) => void;
//     }) => jsPDF;
//   }
// }

// // Add interface for child components
// interface TableRowProps {
//   data: any[];
// }

// interface TableProps {
//   data: any[];
//   headers: { name: string; className?: string }[];
//   children: React.ReactElement<TableRowProps> | React.ReactElement<TableRowProps>[];
//   count?: number;
//   loading?: boolean;
//   showDateFilter?: boolean;
//   pageSize?: number;
//   bgColor?: 'white' | 'black' | '#02161e' | '#dfe2e8';
//   onPageChange?: (page: number) => void;
//   onPageSizeChange?: (size: number) => void;
//   showExport?: boolean;
//   onExport?: (format: 'pdf' | 'csv') => void;
//   onDateFilter?: (startDate: string, endDate: string) => void;
//   currentPage: number;
//   currentItems?: number;
//   showCount?: boolean;
//   initialData?: any[];
// }

// interface PaginationProps {
//   count: number;
//   limit: number;
//   setLimit: (limit: number) => void;
//   currentPage: number;
//   onPageChange: (page: number) => void;
//   onExport?: (format: 'pdf' | 'csv') => void;
//   onDateFilter?: (startDate: string, endDate: string) => void;
//   showExport?: boolean;
//   showDateFilter?: boolean;
//   bgColor?: 'white' | 'black' | '#02161e' | '#dfe2e8';
//   data: any[];
//   length: number;
//   isLoading?: boolean;
//   start: number;
//   end: number;
// }

// const Table = ({
//   data,
//   headers,
//   children,
//   count = 0,
//   loading = false,
//   showDateFilter = false,
//   pageSize = 10,
//   currentPage,
//   onPageChange,
//   onPageSizeChange,
//   showExport = false,
//   onExport,
//   bgColor = '#02161e',
//   onDateFilter,
// }: TableProps) => {
//   const t = useTranslations("Tablecomponent");
//   const [filteredData, setFilteredData] = useState(data);
//   const [isLoading, setIsLoading] = useState(loading);
//   const searchParams = useSearchParams();
//   const pathname = usePathname();
//   const { push } = useRouter();
//   const locale = useLocale();

//   // Update URL with new page number
//   const updatePage = (newPage: number) => {
//     const params = new URLSearchParams(searchParams);
//     params.set("page", newPage.toString());
//     push(`${pathname}?${params.toString()}`);
//   };

//   // Add the getTableType function
//   const getTableType = () => {
//     const path = pathname.split('/');
//     // Get the last segment of the path and remove any query parameters
//     const type = path[path.length - 1].split('?')[0];
//     // If the path ends with a number (like /brands/123), use the previous segment
//     return isNaN(Number(type)) ? type : path[path.length - 2];
//   };

//   // Update filtered data when raw data changes
//   useEffect(() => {
//     setIsLoading(loading);
//     setFilteredData(data);
//   }, [data, loading]);

//   // Handle date filtering (only if enabled)
//   const handleDateFilter = showDateFilter ? (startDate: string, endDate: string) => {
//     if (!startDate || !endDate) {
//       setFilteredData(data);
//       return;
//     }

//     const start = new Date(startDate);
//     const end = new Date(endDate);

//     const filtered = data.filter((item: any) => {
//       const itemDate = new Date(item.validFrom || item.createdAt);
//       return itemDate >= start && itemDate <= end;
//     });

//     setFilteredData(filtered);
//   } : undefined;


//   // Handle data export
//   const handleExport = async (format: 'pdf' | 'csv') => {
//     try {
//       const { headers: exportHeaders, rows: exportRows } = prepareExportData();
//       const tableType = getTableType();
//       const timestamp = new Date().toISOString().split('T')[0];

//       if (format === 'pdf') {
//         const doc = new jsPDF({
//           orientation: 'landscape',
//           unit: 'mm',
//           format: 'a4',
//           putOnlyUsedFonts: true,
//           hotfixes: ["px_scaling"],
//         });

//         // Set font and RTL for Arabic
//         if (locale === 'ar') {
//           doc.setR2L(true);
//           doc.setFont('NotoNaskhArabic-Regular', 'normal');
//         }

//         // Add title with styling
//         doc.setFontSize(20);
//         doc.setTextColor(0, 161, 143);
//         const title = `${tableType.charAt(0).toUpperCase() + tableType.slice(1)} Export`;
//         doc.text(title, doc.internal.pageSize.width / 2, 20, { align: 'center' });

//         // Add date
//         doc.setFontSize(10);
//         doc.setTextColor(100, 100, 100);
//         const date = new Date().toLocaleDateString(locale, {
//           year: 'numeric',
//           month: 'long',
//           day: 'numeric'
//         });
//         doc.text(date, doc.internal.pageSize.width - 20, 30, { align: 'right' });

//         // Add table with improved styling
//         doc.autoTable({
//           head: [exportHeaders],
//           body: exportRows,
//           startY: 40,
//           theme: 'grid',
//           styles: {
//             font: locale === 'ar' ? 'NotoNaskhArabic-Regular' : undefined,
//             fontSize: 10,
//             cellPadding: 8,
//             lineWidth: 0.1,
//             lineColor: [80, 80, 80],
//             textColor: [50, 50, 50]
//           },
//           headStyles: {
//             fillColor: [0, 161, 143],
//             textColor: [255, 255, 255],
//             fontSize: 12,
//             fontStyle: 'bold',
//             halign: 'center'
//           },
//           bodyStyles: {
//             halign: 'center'
//           },
//           alternateRowStyles: {
//             fillColor: [245, 245, 245]
//           },
//           columnStyles: Object.fromEntries(
//             exportHeaders.map((header: string, index: number) => {
//               let width: number | 'auto' = 'auto';
//               const headerLower = header.toLowerCase();
//               if (headerLower.includes('image')) {
//                 width = 50;
//               } else if (headerLower.includes('email')) {
//                 width = 70;
//               } else if (headerLower.includes('name')) {
//                 width = 60;
//               } else if (headerLower.includes('phone') || headerLower.includes('mobile')) {
//                 width = 40;
//               } else if (headerLower.includes('type')) {
//                 width = 40;
//               }
//               return [index, { 
//                 cellWidth: width,
//                 halign: 'center',
//                 valign: 'middle'
//               }];
//             })
//           ),
//           margin: { 
//             top: 40,
//             left: 10,
//             right: 10,
//             bottom: 20
//           },
//           didDrawPage: (data: any) => {
//             doc.setFontSize(10);
//             doc.setTextColor(100, 100, 100);
//             doc.text(
//               `Page ${doc.getCurrentPageInfo().pageNumber}`,
//               doc.internal.pageSize.width / 2,
//               doc.internal.pageSize.height - 10,
//               { align: 'center' }
//             );
//           }
//         });

//         doc.save(`${tableType}-export-${timestamp}.pdf`);
//       } else if (format === 'csv') {
//         const csvContent = [
//           exportHeaders.join(','),
//           ...exportRows.map((row: any[]) => row.join(','))
//         ].join('\n');

//         const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//         const link = document.createElement('a');
//         link.href = URL.createObjectURL(blob);
//         link.download = `${tableType}-export-${timestamp}.csv`;
//         link.click();
//         URL.revokeObjectURL(link.href);
//       }
//     } catch (error) {
//       console.error('Export error:', error);
//       toast.error('Failed to export data');
//     }
//   };

//   // Update URL and trigger data fetch when page changes
//   const handlePageChange = (newPage: number) => {
//     // Update URL
//     const params = new URLSearchParams(searchParams);
//     params.set("page", newPage.toString());
//     push(`${pathname}?${params.toString()}`);

//     // Call the parent's onPageChange handler to fetch new data
//     if (onPageChange) {
//       onPageChange(newPage);
//     }
//   };

//   // Handle page size change with URL update
//   const handlePageSizeChange = (newSize: number) => {
//     const params = new URLSearchParams(searchParams);
//     params.set("limit", newSize.toString());
//     params.set("page", "1"); // Reset to first page when changing page size
//     push(`${pathname}?${params.toString()}`);

//     if (onPageSizeChange) {
//       onPageSizeChange(newSize);
//     }
//   };

//   // Calculate the range of items being displayed
//   const calculateRange = () => {
//     if (!count || count === 0) return { start: 0, end: 0, total: 0 };
    
//     if (pageSize === 0) { // When showing all records
//       return {
//         start: 1,
//         end: count,
//         total: count
//       };
//     }

//     const start = ((currentPage - 1) * pageSize) + 1;
//     const end = Math.min(currentPage * pageSize, count);
    
//     return {
//       start: count > 0 ? start : 0,
//       end,
//       total: count
//     };
//   };

//   const { start, end, total } = calculateRange();

//   return (
//     <div className="w-full mx-auto">
//       {/* <div className="rounded-t-xl overflow-auto max-h-[calc(100vh-350px)] border border-gray-200 bg-white sidebar-scrolling"> */}
//       <div className="rounded-t-xl overflow-auto max-h-[500px] border border-gray-200 bg-white sidebar-scrolling" >
//         <table className="w-full text-sm text-left rtl:text-right text-gray-500">
//           {/* <thead className={`text-xs uppercase sticky top-0 z-50 ${bgColor === '#02161e' ? 'text-white bg-[#02161e]' : */}
//           <thead className={`text-xs uppercase sticky top-0 ${bgColor === '#02161e' ? 'text-white bg-[#02161e]' :
//               'text-[#02161e] bg-[#dfe2e8]'
//             }`}>
//             <tr>
//               {headers.map(({ name, className }) => (
//                 <th
//                   key={name}
//                   scope="col"
//                   className={`px-6 py-4 whitespace-nowrap ${className || ""}`}
//                 >
//                   {t(name)}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className="bg-white">
//             {isLoading ? (
//               <tr className="odd:bg-white even:bg-primary/5">
//                 <td colSpan={headers.length} scope="row" className="px-6 py-4">
//                   <div className="w-full flex justify-center">
//                     <LoadingIcon className="animate-spin size-6" />
//                   </div>
//                 </td>
//               </tr>
//             ) : (
//               <>
//                 {!filteredData?.length ? (
//                   <tr className="odd:bg-white even:bg-primary/5 border-b">
//                     <td
//                       colSpan={headers.length}
//                       scope="row"
//                       className="px-6 py-4 text-center font-bold"
//                     >
//                       {t("no data yat1")}
//                     </td>
//                   </tr>
//                 ) : (
//                   React.Children.map(children, (child) => {
//                     if (React.isValidElement<TableRowProps>(child)) {
//                       return React.cloneElement(child, {
//                         data: filteredData
//                       } as TableRowProps);
//                     }
//                     return child;
//                   })
//                 )}
//               </>
//             )}
//           </tbody>
//         </table>
//       </div>

//       <Pagination
//         count={total}
//         limit={pageSize}
//         setLimit={handlePageSizeChange}
//         currentPage={currentPage}
//         onPageChange={handlePageChange}
//         onExport={showExport ? handleExport : undefined}
//         onDateFilter={showDateFilter ? handleDateFilter : undefined}
//         showExport={showExport}
//         showDateFilter={showDateFilter}
//         bgColor={bgColor}
//         data={data}
//         length={data?.length || 0}
//         start={start}
//         end={end}
//       />

//     </div>
//   );
// };

// export default Table;

// function prepareExportData(): { headers: any; rows: any; } {
//   throw new Error("Function not implemented.");
// }

// "use client";
// import { useTranslations, useLocale } from "next-intl";
// import React, { ReactNode, useState, useEffect } from "react";
// import Pagination from "./Pagination";
// import { LoadingIcon } from "../icons";
// import toast from 'react-hot-toast';
// import { jsPDF } from 'jspdf';
// import 'jspdf-autotable';
// import { usePathname, useSearchParams } from 'next/navigation';
// import { useRouter } from 'next/navigation';


// import 'jspdf-autotable';
// import '../NotoNaskhArabic-Regular-normal.js';

// // Add proper type declaration for jsPDF with autoTable
// declare module 'jspdf' {
//   interface jsPDF {
//     autoTable: (options: {
//       head: string[][];
//       body: any[][];
//       startY?: number;
//       theme?: string;
//       styles?: {
//         font?: string;
//         fontSize?: number;
//         cellPadding?: number;
//       };
//       columnStyles?: {
//         [key: number]: { cellWidth: number | 'auto' };
//       };
//       margin?: {
//         top: number;
//         left: number;
//         right: number;
//       };
//     }) => jsPDF;
//   }
// }

// // Add interface for child components
// interface TableRowProps {
//   data: any[];
// }

// interface TableProps {
//   data: any[];
//   headers: {
//     name: string;
//     className?: string;
//     key?: string;
//     label?: string;
//     exclude?: boolean;
//   }[];
//   count?: number;
//   loading?: boolean;
//   showDateFilter?: boolean;
//   pageSize?: number;
//   bgColor?: 'white' | 'black' | '#02161e' | '#dfe2e8';
//   onPageChange?: (page: number) => void;
//   onPageSizeChange?: (size: number) => void;
//   showExport?: boolean;
//   onExport?: (format: 'pdf' | 'csv') => void;
//   onDateFilter?: (startDate: string, endDate: string) => void;
//   currentPage: number;
//   currentItems?: number;
//   showCount?: boolean;
//   initialData?: any[];
//   exportData?: (data: any[]) => Record<string, any>[];
//   children?: React.ReactNode;
// }

// interface PaginationProps {
//   count: number;
//   limit: number;
//   setLimit: (limit: number) => void;
//   currentPage: number;
//   onPageChange: (page: number) => void;
//   onExport?: (format: 'pdf' | 'csv') => void;
//   onDateFilter?: (startDate: string, endDate: string) => void;
//   showExport?: boolean;
//   showDateFilter?: boolean;
//   bgColor?: 'white' | 'black' | '#02161e' | '#dfe2e8';
//   data: any[];
//   length: number;
//   isLoading?: boolean;
//   start: number;
//   end: number;
// }

// const Table = ({
//   data,
//   headers,
//   children,
//   count = 0,
//   loading = false,
//   showDateFilter = false,
//   pageSize = 10,
//   currentPage,
//   onPageChange,
//   onPageSizeChange,
//   showExport = false,
//   onExport,
//   bgColor = '#02161e',
//   onDateFilter,
//   exportData,
// }: TableProps) => {
//   const t = useTranslations("Tablecomponent");
//   const [filteredData, setFilteredData] = useState(data);
//   const [isLoading, setIsLoading] = useState(loading);
//   const searchParams = useSearchParams();
//   const pathname = usePathname();
//   const { push } = useRouter();
//   const locale = useLocale();

//   // Update URL with new page number
//   const updatePage = (newPage: number) => {
//     const params = new URLSearchParams(searchParams);
//     params.set("page", newPage.toString());
//     push(`${pathname}?${params.toString()}`);
//   };

//   // Add the getTableType function
//   const getTableType = () => {
//     const path = pathname.split('/');
//     // Get the last segment of the path and remove any query parameters
//     const type = path[path.length - 1].split('?')[0];
//     // If the path ends with a number (like /brands/123), use the previous segment
//     return isNaN(Number(type)) ? type : path[path.length - 2];
//   };

//   // Update filtered data when raw data changes
//   useEffect(() => {
//     setIsLoading(loading);
//     setFilteredData(data);
//   }, [data, loading]);

//   // Handle date filtering (only if enabled)
//   const handleDateFilter = showDateFilter ? (startDate: string, endDate: string) => {
//     if (!startDate || !endDate) {
//       setFilteredData(data);
//       return;
//     }

//     const start = new Date(startDate);
//     const end = new Date(endDate);

//     const filtered = data.filter((item: any) => {
//       const itemDate = new Date(item.validFrom || item.createdAt);
//       return itemDate >= start && itemDate <= end;
//     });

//     setFilteredData(filtered);
//   } : undefined;

//   // Add helper function to prepare export data
//   const prepareExportData = () => {
//     const currentData = filteredData || data
//     const tableType = getTableType()
    
//     // Filter out action columns and get visible headers
//     const exportHeaders = headers
//       .filter(header => !header.name.toLowerCase().includes('action'))
//       .map(header => t(header.name))

//     // Map data to rows, handling all possible fields
//     const exportRows = currentData.map((item: any) => {
//       const row = []
      
//       // Handle common fields
//       if (item.id) row.push(item.id)
//       if (item.name || item.nameEn || item.nameAr) {
//         row.push(locale === 'ar' ? (item.nameAr || item.name) : (item.nameEn || item.name))
//       }
//       if (item.email) row.push(item.email)
//       if (item.phone || item.mobile) row.push(item.phone || item.mobile)
//       if (item.type || item.category) row.push(item.type || item.category)
//       if (item.status) row.push(t(item.status))
//       if (item.ratio) row.push(`${item.ratio}%`)
//       if (item.createdAt) row.push(new Date(item.createdAt).toLocaleDateString())
//       if (item.price) row.push(`${item.price} ${t('SAR')}`)
            
//       if (item.validFrom) row.push(new Date(item.validFrom).toLocaleDateString())
//       if (item.validTo) row.push(new Date(item.validTo).toLocaleDateString())
//       if (item.pointBackRatio) row.push(`${item.pointBackRatio}%`)
//       if (item.url) row.push(item.url)
//       if (item.pointBack) row.push(`${item.pointBack} ${t('SAR')}`)
//       if (item.pointBackValidFrom) row.push(new Date(item.pointBackValidFrom).toLocaleDateString())
//       if (item.pointBackValidTo) row.push(new Date(item.pointBackValidTo).toLocaleDateString())



//       // Handle specific business fields
//       if (item.company) row.push(item.company)
//       if (item.address) row.push(item.address)
//       if (item.balance) row.push(`${item.balance} ${t('SAR')}`)
//       if (item.revenue) row.push(`${item.revenue} ${t('SAR')}`)
//       if (item.transactions) row.push(item.transactions)
      
//       return row
//     })

//     return { exportHeaders, exportRows, tableType }
//   }

//   // Update handleExport function
//   const handleExport = async (format: 'pdf' | 'csv') => {
//     try {
//       const { exportHeaders, exportRows, tableType } = prepareExportData()
//       const timestamp = new Date().toISOString().split('T')[0]

//       if (format === 'pdf') {
//         const doc = new jsPDF({
//           orientation: exportHeaders.length > 6 ? 'l' : 'p',
//           unit: 'mm',
//           format: 'a4',
//           putOnlyUsedFonts: true,
//           hotfixes: ["px_scaling"],
//         })

//         // Set font and direction based on locale
//         if (locale === 'ar') {
//           doc.setR2L(false)
//           doc.setFont('NotoNaskhArabic-Regular', 'normal')
//         } else {
//           doc.setR2L(false)
//           doc.setFont('NotoNaskhArabic-Regular', 'normal')
//         }

//         // Add header
//         doc.setFillColor(0, 22, 30)
//         doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F')
        
//         // Add title
//         doc.setFont(locale === 'ar' ? 'NotoNaskhArabic-Regular' : 'normal')
//         doc.setFontSize(14)
//         doc.setTextColor(255, 255, 255)
//         const title = `${t(tableType)} ${t('Report')}`
//         doc.text(title, doc.internal.pageSize.width / 2, 25, { align: 'center' })

//         // Add metadata
//         doc.setFontSize(10)
//         doc.setTextColor(200, 200, 200)
//         const dateStr = new Date().toLocaleDateString(locale, {
//           year: 'numeric',
//           month: 'long',
//           day: 'numeric'
//         })
//         doc.text(dateStr, doc.internal.pageSize.width - 20, 15, { align: 'right' })
//         doc.text(`${t('Total Records')}: ${exportRows.length}`, 20, 15)

//         // Configure table styles based on locale
//         const tableConfig = {
//           head: [exportHeaders],
//           body: exportRows,
//           startY: 50,
//           theme: 'grid',
//           styles: {
//             font: locale === 'ar' ? 'NotoNaskhArabic-Regular' : 'normal',
//             fontSize: locale === 'ar' ? 4 : 8,
//             cellPadding: 1,
//             lineWidth: 0.1,
//             lineColor: [80, 80, 80],
//             textColor: [50, 50, 50]
//           },
//           headStyles: {
//             fillColor: [0, 161, 143],
//             textColor: [255, 255, 255],
//             fontSize: locale === 'ar' ? 12 : 10,
//             fontStyle: 'bold',
//             halign: 'center',
//             valign: 'middle',
//             minCellHeight: 2
//           },
//           bodyStyles: {
//             halign: 'center',
//             valign: 'middle',
//             fontSize: locale === 'ar' ? 10 : 8
//           },
//           alternateRowStyles: {
//             fillColor: [242, 242, 242]
//           },
//           columnStyles: Object.fromEntries(
//             exportHeaders.map((header: string, index: number) => {
//               const headerLower = header.toLowerCase()
//               let width: number | 'auto' = 'auto'
              
//               // Adjust column widths for English
//               if (locale === 'ar') {
//                 if (headerLower.includes('id')) width = 4
//                 else if (headerLower.includes('image')) width = 20
//                 else if (headerLower.includes('email')) width = 30
//                 else if (headerLower.includes('name')) width = 25
//                 else if (headerLower.includes('phone')) width = 17
//                 else if (headerLower.includes('date')) width = 20
//                 else if (headerLower.includes('status')) width = 20
//                 else if (headerLower.includes('price') || headerLower.includes('balance')) width = 35
//                 else if (headerLower.includes('ratio')) width = 4
//                 else if (headerLower.includes('pointBack')) width = 2

//               } else {
//                 if (headerLower.includes('id')) width = 15
//                 else if (headerLower.includes('image')) width = 25
//                 else if (headerLower.includes('email')) width = 40
//                 else if (headerLower.includes('name')) width = 35
//                 else if (headerLower.includes('phone')) width = 25
//                 else if (headerLower.includes('date')) width = 25
//                 else if (headerLower.includes('status')) width = 25
//                 else if (headerLower.includes('price') || headerLower.includes('balance')) width = 30
//               }
              
//               return [index, {
//                 cellWidth: width,
//                 halign: headerLower.includes('price') || headerLower.includes('balance') ? 'right' : 'center',
//                 valign: 'middle'
//               }]
//             })
//           ),
//           margin: { top: 0, left: 0, right: 0, bottom: 0 }
//         }

//         doc.autoTable(tableConfig)

//         // Save PDF
//         doc.save(`${tableType}-report-${timestamp}.pdf`)
//       } else if (format === 'csv') {
//         // Enhanced CSV export with proper encoding and formatting
//         const csvContent = [
//           '\ufeff', // Add BOM for proper UTF-8 encoding
//           exportHeaders.join(','),
//           ...exportRows.map(row => 
//             row.map(cell => {
//               // Handle cells that contain commas or quotes
//               const cellStr = String(cell)
//               if (cellStr.includes(',') || cellStr.includes('"')) {
//                 return `"${cellStr.replace(/"/g, '""')}"`
//               }
//               return cellStr
//             }).join(',')
//           )
//         ].join('\n')

//         const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
//         const link = document.createElement('a')
//         link.href = URL.createObjectURL(blob)
//         link.download = `${tableType}-report-${timestamp}.csv`
//         link.click()
//         URL.revokeObjectURL(link.href)
//       }
//     } catch (error) {
//       console.error('Export error:', error)
//       toast.error(t('Failed to export data'))
//     }
//   }

//   // Update URL and trigger data fetch when page changes
//   const handlePageChange = (newPage: number) => {
//     // Update URL
//     const params = new URLSearchParams(searchParams);
//     params.set("page", newPage.toString());
//     push(`${pathname}?${params.toString()}`);

//     // Call the parent's onPageChange handler to fetch new data
//     if (onPageChange) {
//       onPageChange(newPage);
//     }
//   };

//   // Handle page size change with URL update
//   const handlePageSizeChange = (newSize: number) => {
//     const params = new URLSearchParams(searchParams);
//     params.set("limit", newSize.toString());
//     params.set("page", "1"); // Reset to first page when changing page size
//     push(`${pathname}?${params.toString()}`);

//     if (onPageSizeChange) {
//       onPageSizeChange(newSize);
//     }
//   };

//   // Calculate the range of items being displayed
//   const calculateRange = () => {
//     if (!count || count === 0) return { start: 0, end: 0, total: 0 };
    
//     if (pageSize === 0) { // When showing all records
//       return {
//         start: 1,
//         end: count,
//         total: count
//       };
//     }

//     const start = ((currentPage - 1) * pageSize) + 1;
//     const end = Math.min(currentPage * pageSize, count);
    
//     return {
//       start: count > 0 ? start : 0,
//       end,
//       total: count
//     };
//   };

//   const { start, end, total } = calculateRange();

//   return (
//     <div className="w-full mx-auto">
//       {/* <div className="rounded-t-xl overflow-auto max-h-[calc(100vh-350px)] border border-gray-200 bg-white sidebar-scrolling"> */}
//       <div className="rounded-t-xl overflow-auto max-h-[500px] border border-gray-200 bg-white sidebar-scrolling" >
//         <table className="w-full text-sm text-left rtl:text-right text-gray-500">
//           <thead className={`text-xs uppercase sticky top-0 z-50 ${bgColor === '#02161e' ? 'text-white bg-[#02161e]' :
//               'text-[#02161e] bg-[#dfe2e8]'
//             }`}>
//             <tr>
//               {headers.map(({ name, className }) => (
//                 <th
//                   key={name}
//                   scope="col"
//                   className={`px-6 py-4 whitespace-nowrap ${className || ""}`}
//                 >
//                   {t(name)}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className="bg-white">
//             {isLoading ? (
//               <tr className="odd:bg-white even:bg-primary/5">
//                 <td colSpan={headers.length} scope="row" className="px-6 py-4">
//                   <div className="w-full flex justify-center">
//                     <LoadingIcon className="animate-spin size-6" />
//                   </div>
//                 </td>
//               </tr>
//             ) : (
//               <>
//                 {!filteredData?.length ? (
//                   <tr className="odd:bg-white even:bg-primary/5 border-b">
//                     <td
//                       colSpan={headers.length}
//                       scope="row"
//                       className="px-6 py-4 text-center font-bold"
//                     >
//                       {t("no data yat")}
//                     </td>
//                   </tr>
//                 ) : (
//                   React.Children.map(children, (child) => {
//                     if (React.isValidElement<TableRowProps>(child)) {
//                       return React.cloneElement(child, {
//                         data: filteredData
//                       } as TableRowProps);
//                     }
//                     return child;
//                   })
//                 )}
//               </>
//             )}
//           </tbody>
//         </table>
//       </div>

//       <Pagination
//         count={total}
//         limit={pageSize}
//         setLimit={handlePageSizeChange}
//         currentPage={currentPage}
//         onPageChange={handlePageChange}
//         onExport={showExport ? handleExport : undefined}
//         onDateFilter={showDateFilter ? handleDateFilter : undefined}
//         showExport={showExport}
//         showDateFilter={showDateFilter}
//         bgColor={bgColor}
//         data={data}
//         length={data?.length || 0}
//         start={start}
//         end={end}
//       />

//     </div>
//   );
// };

// export default Table;

"use client";
import { useTranslations, useLocale } from "next-intl";
import React, { ReactNode, useState, useEffect } from "react";
import Pagination from "./Pagination";
import { LoadingIcon } from "../icons";
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';


import 'jspdf-autotable';
import '../NotoNaskhArabic-Regular-normal.js';

// Add proper type declaration for jsPDF with autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: {
      head: string[][];
      body: any[][];
      startY?: number;
      theme?: string;
      styles?: {
        font?: string;
        fontSize?: number;
        cellPadding?: number;
      };
      columnStyles?: {
        [key: number]: { cellWidth: number | 'auto' };
      };
      margin?: {
        top: number;
        left: number;
        right: number;
      };
    }) => jsPDF;
  }
}

// Add interface for child components
interface TableRowProps {
  data: any[];
}

// Add these interfaces
interface SortConfig {
  key: string
  direction: 'asc' | 'desc'
}

interface TableHeader {
  name: string
  className?: string
  key?: string
  label?: string
  exclude?: boolean
  sortable?: boolean // Add this to mark sortable columns
}

interface TableProps {
  data: any[];
  headers: TableHeader[];
  count?: number;
  loading?: boolean;
  showDateFilter?: boolean;
  pageSize?: number;
  bgColor?: 'white' | 'black' | '#02161e' | '#dfe2e8';
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  showExport?: boolean;
  onExport?: (format: 'pdf' | 'csv') => void;
  onDateFilter?: (startDate: string, endDate: string) => void;
  currentPage: number;
  currentItems?: number;
  showCount?: boolean;
  initialData?: any[];
  exportData?: (data: any[]) => Record<string, any>[];
  children?: React.ReactNode;
  defaultSort?: SortConfig;
}

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

const Table = ({
  data,
  headers,
  children,
  count = 0,
  loading = false,
  showDateFilter = false,
  pageSize = 10,
  currentPage,
  onPageChange,
  onPageSizeChange,
  showExport = false,
  onExport,
  bgColor = '#02161e',
  onDateFilter,
  exportData,
  defaultSort,
}: TableProps) => {
  const t = useTranslations("Tablecomponent");
  const [filteredData, setFilteredData] = useState(data);
  const [isLoading, setIsLoading] = useState(loading);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { push } = useRouter();
  const locale = useLocale();
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(defaultSort || null)

  // Update URL with new page number
  const updatePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    push(`${pathname}?${params.toString()}`);
  };

  // Add the getTableType function
  const getTableType = () => {
    const path = pathname.split('/');
    // Get the last segment of the path and remove any query parameters
    const type = path[path.length - 1].split('?')[0];
    // If the path ends with a number (like /brands/123), use the previous segment
    return isNaN(Number(type)) ? type : path[path.length - 2];
  };

  // Add sorting function
  const sortData = (data: any[], sortConfig: SortConfig | null) => {
    if (!sortConfig) return data

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (aValue === null || aValue === undefined) return 1
      if (bValue === null || bValue === undefined) return -1

      // Handle different data types
      if (typeof aValue === 'string') {
        const comparison = aValue.localeCompare(bValue)
        return sortConfig.direction === 'asc' ? comparison : -comparison
      }

      if (typeof aValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue
      }

      // Handle dates
      if (aValue instanceof Date) {
        return sortConfig.direction === 'asc' 
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime()
      }

      return 0
    })
  }

  // Update useEffect to include sorting
  useEffect(() => {
    setIsLoading(loading)
    const sorted = sortData(data, sortConfig)
    setFilteredData(sorted)
  }, [data, loading, sortConfig])

  // Add sort handler
  const handleSort = (key: string) => {
    setSortConfig(current => {
      if (!current || current.key !== key) {
        return { key, direction: 'asc' }
      }
      if (current.direction === 'asc') {
        return { key, direction: 'desc' }
      }
      return null
    })
  }

  // Add sort indicator component
  const SortIndicator = ({ sortKey }: { sortKey: string }) => {
    if (!sortConfig || sortConfig.key !== sortKey) {
      return <span className="ml-1">↕</span>
    }
    return (
      <span className="ml-1">
        {sortConfig.direction === 'asc' ? '↑' : '↓'}
      </span>
    )
  }

  // Handle date filtering (only if enabled)
  const handleDateFilter = showDateFilter ? (startDate: string, endDate: string) => {
    if (!startDate || !endDate) {
      setFilteredData(data);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const filtered = data.filter((item: any) => {
      const itemDate = new Date(item.validFrom || item.createdAt);
      return itemDate >= start && itemDate <= end;
    });

    setFilteredData(filtered);
  } : undefined;

  // Add helper function to prepare export data
  const prepareExportData = () => {
    const currentData = filteredData || data
    const tableType = getTableType()
    
    // Filter out action columns and get visible headers
    const exportHeaders = headers
      .filter(header => !header.name.toLowerCase().includes('action'))
      .map(header => t(header.name))

    // Map data to rows, handling all possible fields
    const exportRows = currentData.map((item: any) => {
      const row = []
      
      // Handle common fields
      if (item.id) row.push(item.id)
      if (item.name || item.nameEn || item.nameAr) {
        row.push(locale === 'ar' ? (item.nameAr || item.name) : (item.nameEn || item.name))
      }
      if (item.email) row.push(item.email)
      if (item.phone || item.mobile) row.push(item.phone || item.mobile)
      
      // Add specific handling for UserTypes
      if (item.userType) row.push(item.userType)
      if (item.buyAmount) row.push(`${item.buyAmount} ${t('SAR')}`)
      if (item.ratio) row.push(`${item.ratio}%`)
      if (item.createdAt) row.push(new Date(item.createdAt).toLocaleDateString(locale))
        if (item.roles && Array.isArray(item.roles)) {
          const roleNames = item.roles.map((role: any) => role.name).join(', ')
          row.push(roleNames)
        } else if (item.type || item.category) {
          row.push(item.type || item.category)
        }
      
      // Handle other common fields
      if (item.email) row.push(item.email)
      if (item.phone || item.mobile) row.push(item.phone || item.mobile)
      if (item.type || item.category) row.push(item.type || item.category)
      if (item.status) row.push(t(item.status))
      if (item.ratio) row.push(`${item.ratio}%`)
      if (item.createdAt) row.push(new Date(item.createdAt).toLocaleDateString())
      if (item.price) row.push(`${item.price} ${t('SAR')}`)
            
      if (item.validFrom) row.push(new Date(item.validFrom).toLocaleDateString())
      if (item.validTo) row.push(new Date(item.validTo).toLocaleDateString())
      if (item.pointBackRatio) row.push(`${item.pointBackRatio}%`)
      if (item.url) row.push(item.url)
      if (item.pointBack) row.push(`${item.pointBack} ${t('SAR')}`)
      if (item.pointBackValidFrom) row.push(new Date(item.pointBackValidFrom).toLocaleDateString())
      if (item.pointBackValidTo) row.push(new Date(item.pointBackValidTo).toLocaleDateString())



      // Handle specific business fields
      if (item.pointBackValidFrom) row.push(new Date(item.pointBackValidFrom).toLocaleDateString(locale))
        if (item.pointBackValidTo) row.push(new Date(item.pointBackValidTo).toLocaleDateString(locale))
        if (item.roles) row.push(item.roles.map((role: any) => role.name).join(', '))
          if (item.validFrom) row.push(new Date(item.validFrom).toLocaleDateString(locale))
            if (item.validTo) row.push(new Date(item.validTo).toLocaleDateString(locale))
      if (item.company) row.push(item.company)
      if (item.address) row.push(item.address)
      if (item.balance) row.push(`${item.balance} ${t('SAR')}`)
      if (item.revenue) row.push(`${item.revenue} ${t('SAR')}`)
      if (item.transactions) row.push(item.transactions)
      
      return row
    })

    return { exportHeaders, exportRows, tableType }
  }

  // Update handleExport function
  const handleExport = async (format: 'pdf' | 'csv') => {
    try {
      const { exportHeaders, exportRows, tableType } = prepareExportData()
      const timestamp = new Date().toISOString().split('T')[0]

      if (format === 'pdf') {
        const doc = new jsPDF({
          orientation: exportHeaders.length > 6 ? 'l' : 'p',
          unit: 'mm',
          format: 'a4',
          putOnlyUsedFonts: true,
          hotfixes: ["px_scaling"],
        })

        // Set font and direction based on locale
        if (locale === 'ar') {
          doc.setR2L(false)
          doc.setFont('NotoNaskhArabic-Regular', 'normal')
        } else {
          doc.setR2L(false)
          doc.setFont('NotoNaskhArabic-Regular', 'normal')
        }

        // Add header
        doc.setFillColor(0, 22, 30)
        doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F')
        
        // Add title
        doc.setFont(locale === 'ar' ? 'NotoNaskhArabic-Regular' : 'normal')
        doc.setFontSize(14)
        doc.setTextColor(255, 255, 255)
        const title = `${t(tableType)} ${t('Report')}`
        doc.text(title, doc.internal.pageSize.width / 2, 25, { align: 'center' })

        // Add metadata
        doc.setFontSize(10)
        doc.setTextColor(200, 200, 200)
        const dateStr = new Date().toLocaleDateString(locale, {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
        doc.text(dateStr, doc.internal.pageSize.width - 20, 15, { align: 'right' })
        doc.text(`${t('Total Records')}: ${exportRows.length}`, 20, 15)

        // Configure table styles based on locale
        const tableConfig = {
          head: [exportHeaders],
          body: exportRows,
          startY: 50,
          theme: 'grid',
          styles: {
            font: locale === 'ar' ? 'NotoNaskhArabic-Regular' : 'normal',
            fontSize: locale === 'ar' ? 4 : 8,
            cellPadding: 1,
            lineWidth: 0.1,
            lineColor: [80, 80, 80],
            textColor: [50, 50, 50]
          },
          headStyles: {
            fillColor: [0, 161, 143],
            textColor: [255, 255, 255],
            fontSize: locale === 'ar' ? 12 : 10,
            fontStyle: 'bold',
            halign: 'center',
            valign: 'middle',
            minCellHeight: 2
          },
          bodyStyles: {
            halign: 'center',
            valign: 'middle',
            fontSize: locale === 'ar' ? 10 : 8
          },
          alternateRowStyles: {
            fillColor: [242, 242, 242]
          },
          columnStyles: Object.fromEntries(
            exportHeaders.map((header: string, index: number) => {
              const headerLower = header.toLowerCase()
              let width: number | 'auto' = 'auto'
              
              // Adjust column widths for English
              if (locale === 'ar') {
                if (headerLower.includes('id')) width = 4
                else if (headerLower.includes('image')) width = 20
                else if (headerLower.includes('email')) width = 30
                else if (headerLower.includes('name')) width = 25
                else if (headerLower.includes('phone')) width = 17
                else if (headerLower.includes('date')) width = 20
                else if (headerLower.includes('status')) width = 20
                else if (headerLower.includes('price') || headerLower.includes('balance')) width = 35
                else if (headerLower.includes('ratio')) width = 4
                else if (headerLower.includes('pointBack')) width = 2

              } else {
                if (headerLower.includes('id')) width = 15
                else if (headerLower.includes('image')) width = 25
                else if (headerLower.includes('email')) width = 40
                else if (headerLower.includes('name')) width = 35
                else if (headerLower.includes('phone')) width = 25
                else if (headerLower.includes('date')) width = 25
                else if (headerLower.includes('status')) width = 25
                else if (headerLower.includes('price') || headerLower.includes('balance')) width = 30
              }
              
              return [index, {
                cellWidth: width,
                halign: headerLower.includes('price') || headerLower.includes('balance') ? 'right' : 'center',
                valign: 'middle'
              }]
            })
          ),
          margin: { top: 0, left: 0, right: 0, bottom: 0 }
        }

        doc.autoTable(tableConfig)

        // Save PDF
        doc.save(`${tableType}-report-${timestamp}.pdf`)
      } else if (format === 'csv') {
        // Enhanced CSV export with proper encoding and formatting
        const csvContent = [
          '\ufeff', // Add BOM for proper UTF-8 encoding
          exportHeaders.join(','),
          ...exportRows.map(row => 
            row.map(cell => {
              // Handle cells that contain commas or quotes
              const cellStr = String(cell)
              if (cellStr.includes(',') || cellStr.includes('"')) {
                return `"${cellStr.replace(/"/g, '""')}"`
              }
              return cellStr
            }).join(',')
          )
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `${tableType}-report-${timestamp}.csv`
        link.click()
        URL.revokeObjectURL(link.href)
      }
    } catch (error) {
      console.error('Export error:', error)
      toast.error(t('Failed to export data'))
    }
  }

  // Update URL and trigger data fetch when page changes
  const handlePageChange = (newPage: number) => {
    // Update URL
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    push(`${pathname}?${params.toString()}`);

    // Call the parent's onPageChange handler to fetch new data
    if (onPageChange) {
      onPageChange(newPage);
    }
  };

  // Handle page size change with URL update
  const handlePageSizeChange = (newSize: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("limit", newSize.toString());
    params.set("page", "1"); // Reset to first page when changing page size
    push(`${pathname}?${params.toString()}`);

    if (onPageSizeChange) {
      onPageSizeChange(newSize);
    }
  };

  // Calculate the range of items being displayed
  const calculateRange = () => {
    if (!count || count === 0) return { start: 0, end: 0, total: 0 };
    
    if (pageSize === 0) { // When showing all records
      return {
        start: 1,
        end: count,
        total: count
      };
    }

    const start = ((currentPage - 1) * pageSize) + 1;
    const end = Math.min(currentPage * pageSize, count);
    
    return {
      start: count > 0 ? start : 0,
      end,
      total: count
    };
  };

  const { start, end, total } = calculateRange();

  return (
    <div className="w-full mx-auto">
      {/* <div className="rounded-t-xl overflow-auto max-h-[calc(100vh-350px)] border border-gray-200 bg-white sidebar-scrolling"> */}
      <div className="rounded-t-xl overflow-auto max-h-[500px] border border-gray-200 bg-white sidebar-scrolling" >
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className={`text-xs uppercase sticky top-0 z-50 ${bgColor === '#02161e' ? 'text-white bg-[#02161e]' :
              'text-[#02161e] bg-[#dfe2e8]'
            }`}>
            <tr>
              {headers.map(({ name, className, key, sortable }) => (
                <th
                  key={name}
                  scope="col"
                  className={`px-6 py-4 whitespace-nowrap ${className || ""} ${
                    sortable ? 'cursor-pointer hover:bg-opacity-80' : ''
                  }`}
                  onClick={() => sortable && key && handleSort(key)}
                >
                  <div className="flex items-center">
                    {t(name)}
                    {sortable && key && <SortIndicator sortKey={key} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {isLoading ? (
              <tr className="odd:bg-white even:bg-primary/5">
                <td colSpan={headers.length} scope="row" className="px-6 py-4">
                  <div className="w-full flex justify-center">
                    <LoadingIcon className="animate-spin size-6" />
                  </div>
                </td>
              </tr>
            ) : (
              <>
                {!filteredData?.length ? (
                  <tr className="odd:bg-white even:bg-primary/5 border-b">
                    <td
                      colSpan={headers.length}
                      scope="row"
                      className="px-6 py-4 text-center font-bold"
                    >
                      {t("no data yat")}
                    </td>
                  </tr>
                ) : (
                  React.Children.map(children, (child) => {
                    if (React.isValidElement<TableRowProps>(child)) {
                      return React.cloneElement(child, {
                        data: filteredData
                      } as TableRowProps);
                    }
                    return child;
                  })
                )}
              </>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        count={total}
        limit={pageSize}
        setLimit={handlePageSizeChange}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onExport={showExport ? handleExport : undefined}
        onDateFilter={showDateFilter ? handleDateFilter : undefined}
        showExport={showExport}
        showDateFilter={showDateFilter}
        bgColor={bgColor}
        data={data}
        length={data?.length || 0}
        start={start}
        end={end}
      />

    </div>
  );
};

export default Table;
