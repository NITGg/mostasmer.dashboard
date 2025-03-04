"use client";
import React, { useEffect, useState } from "react";
import {
  CategoryIconn_green,
  LoadingIcon,
  PluseCircelIcon,
  Restore_brand,
  ArrowTopRightOnSquareIconn,
  TrashIconn,
} from "../icons";
import AddBrand2 from "./AddBrand2";
import { useLocale, useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { useAppContext } from "@/context/appContext";
import mlang from "@/lib/mLang";
import ImageApi from "@/components/ImageApi";
import Table from "@/components/ui/Table";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import Pagination from "../ui/Pagination";
import DownloadButton from "../ui/DownloadButton";

type SupportedLocale = "ar" | "en";

interface Brand {
  id: number;
  name: string;
  url: string;
  phone: string;
  email: string;
  logo?: string;
  validFrom: string;
  validTo: string;
  purchaseCount?: number;
  isActive?: boolean;
  ratio?: number;
  isDeleted?: boolean;
  status?: "ACTIVE" | "INACTIVE" | "DELETED" | "ADMINACTIVE";
}

// interface BrandsProps {
//   initialBrands?: Brand[];
//   initialCount?: number;
//   validTo: string;
//   purchaseCount: number;
//   isActive: boolean;
//   ratio?: number;
//   url?: string;
// }

interface BrandsProps {
  brands: Brand[];
  count: number;
  totalPages: number;
}

interface Offer {
  category: {
    id: number;
  };
  validTo?: string;
}

// const Brands: React.FC<BrandsProps> = ({ initialBrands, initialCount }) => {
const Brands: React.FC<BrandsProps> = ({ brands, count, totalPages }) => {
  // const [brands, setBrands] = useState<Brand[]>(initialBrands || []);
  // const [count, setCount] = useState(initialCount || 0);
  const [openDelete, setOpenDelete] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { token } = useAppContext();
  const [isAddBrandOpen, setIsAddBrandOpen] = useState(false);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [pageSize, setPageSize] = useState(10);
  const searchParams = useSearchParams();
  const categoryName = searchParams.get("categoryName");
  const [brandCategories, setBrandCategories] = useState<any[]>([]);
  const [showCategoriesDialog, setShowCategoriesDialog] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  const t = useTranslations("brand");
  const locale = useLocale() as SupportedLocale;
  const router = useRouter();

  // Add state for filtered brands if needed
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);

  // Add categoryName state
  const [categoryNameState, setCategoryNameState] = useState<string>("");

  // Add categoryId from route params
  const params = useParams();
  const categoryIdFromRoute = params?.categoryId as string;

  // Update handleViewBrand to handle brand ID
  const handleViewBrand = async (brandId: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/offers?brandId=${brandId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch brand offers");

      const data = await response.json();
      const uniqueCategories = data.offers.reduce((acc: any[], offer: any) => {
        const categoryExists = acc.some((cat) => cat.id === offer.category.id);
        if (!categoryExists && offer.category) {
          const categoryOffers = data.offers.filter(
            (o: Offer) => o.category.id === offer.category.id
          );
          const hasExpiredOffers = categoryOffers.some(
            (o: Offer) => o.validTo && new Date(o.validTo) < new Date()
          );

          acc.push({
            id: offer.category.id,
            name: offer.category.name,
            imageUrl: offer.category.imageUrl || "/imgs/notfound.png",
            isExpired: hasExpiredOffers,
          });
        }
        return acc;
      }, []);

      setBrandCategories(uniqueCategories);
      setShowCategoriesDialog(true);
    } catch (error) {
      console.error("Error fetching brand offers:", error);
      toast.error("Failed to fetch brand categories");
    }
  };

  // Update fetchBrands function to use offers endpoint
  // const fetchBrands = async (page: number, limit: number) => {
  //     try {
  //         setLoading(true)
  //         const skip = (page - 1) * limit

  //         // Get brandIds from URL if they exist
  //         const brandIds = searchParams.get('ids')

  //         // Construct URL with proper parameters
  //         const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brand`)
  //         url.searchParams.set('limit', limit.toString())
  //         url.searchParams.set('skip', skip.toString())

  //         if (brandIds) {
  //             url.searchParams.set('ids', brandIds)
  //         }

  //         const response = await fetch(url, {
  //             headers: {
  //                 'Authorization': `Bearer ${token}`,
  //                 'Content-Type': 'application/json'
  //             }
  //         })

  //         if (!response.ok) throw new Error('Failed to fetch brands')

  //         const data = await response.json()
  //         setBrands(data.brands || [])
  //         setCount(data.totalCount || 0)
  //     } catch (error) {
  //         console.error('Error fetching brands:', error)
  //         toast.error('Failed to fetch brands')
  //     } finally {
  //         setLoading(false)
  //     }
  // }

  // // Update useEffect to react to URL parameter changes
  // useEffect(() => {
  //     fetchBrands(currentPage, pageSize)
  // }, [searchParams, currentPage, pageSize])

  const fetchCategoryName = async (id: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/category/${id}?lang=${locale}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch category");
      const data = await response.json();
      setCategoryNameState(data.category.name);
    } catch (error) {
      console.error("Error fetching category:", error);
    }
  };

  // Add pagination calculations
  // const paginatedBrands = brands.slice(
  //     (currentPage - 1) * pageSize,
  //     currentPage * pageSize
  // );

  // Update handleDeleteBrand to handle brand ID
  const handleDeleteBrand = async (brandId: number) => {
    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/${brandId}/delete`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t("deleteFailed"));
      }

      //   setBrands((prevBrands) =>
      //     prevBrands.map((brand) =>
      //       brand.id === brandId
      //         ? { ...brand, isDeleted: true, status: "DELETED" }
      //         : brand
      //     )
      //   );

      setOpenDelete(null);
      toast.success(data.message || t("successDelete"));
    } catch (error: any) {
      console.error("Delete brand error:", error);
      toast.error(error.message || t("deleteFailed"));
    } finally {
      setLoading(false);
    }
  };

  // Update handleRestoreBrand to handle brand ID
  const handleRestoreBrand = async (brandId: number) => {
    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/${brandId}/restore`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t("restoreFailed"));
      }

      //   setBrands((prevBrands) =>
      //     prevBrands.map((brand) =>
      //       brand.id === brandId
      //         ? {
      //             ...brand,
      //             isDeleted: false,
      //             status: data.brand.status,
      //           }
      //         : brand
      //     )
      //   );

      toast.success(data.message || t("successRestore"));
    } catch (error: any) {
      console.error("Restore brand error:", error);
      toast.error(error.message || t("restoreFailed"));
    } finally {
      setLoading(false);
    }
  };

  // Table headers configuration
  const tableHeaders = [
    { name: "image", className: "w-[100px]" },
    { name: "brandName", className: "w-[200px]", sortable: true, key: "name" },
    { name: "BrandContactNumber", className: "w-[200px]" },
    { name: "BrandValidFrom", className: "w-[150px]" },
    { name: "BrandValidTo", className: "w-[150px]" },
    { name: "BrandStatus", className: "w-[100px]" },
    { name: "brandAction", className: "w-[100px] text-right" },
  ];

  // Table row render function
  const renderTableRows = () => {
    if (brands.length === 0) {
      return (
        <tr className="odd:bg-white even:bg-primary/5 border-b">
          <td
            colSpan={tableHeaders.length}
            scope="row"
            className="px-6 py-4 text-center font-bold"
          >
            {t("no data yat")}
          </td>
        </tr>
      );
    }
    return brands
      .map((brand) => {
        if (!brand.id) return null; // Skip brands without IDs

        // Determine the display status and background color
        const displayStatus =
          brand.status === "ADMINACTIVE" ? "ACTIVE" : brand.status;
        const statusColor =
          brand.status === "DELETED"
            ? "bg-red-100 text-red-800"
            : displayStatus === "ACTIVE"
            ? "bg-green-100 text-green-800"
            : "bg-yellow-100 text-yellow-800";

        // Check if brand has passed its valid-to date
        const isExpired = brand.validTo
          ? new Date(brand.validTo) < new Date()
          : false;

        // Determine row background color based on deletion status and expiration
        const rowBackground =
          brand.status === "DELETED"
            ? "bg-red-100/60"
            : isExpired
            ? "bg-red-50"
            : "odd:bg-white even:bg-primary/5";

        return (
          <tr
            key={brand.id}
            className={`border-b ${rowBackground} ${
              isExpired ? "text-red-700" : ""
            }`}
          >
            <td className="px-6 py-4">
              <div className="size-12">
                <ImageApi
                  src={brand.logo || "/imgs/notfound.png"}
                  alt={mlang(brand.name, locale)}
                  loader={() => brand.logo || "/imgs/notfound.png"}
                  loading="lazy"
                  height={48}
                  width={48}
                  className="object-cover rounded-full w-full h-full"
                />
              </div>
            </td>
            <td className="px-6 py-4 font-medium">
              {mlang(brand.name, locale)}
            </td>
            <td className="px-6 py-4">{brand.phone || t("noPhone")}</td>
            <td className="px-6 py-4">
              {brand.validFrom
                ? new Date(brand.validFrom).toLocaleDateString(locale)
                : "-"}
            </td>
            <td className="px-6 py-4">
              {brand.validTo
                ? new Date(brand.validTo).toLocaleDateString(locale)
                : "-"}
            </td>
            <td className="px-6 py-4">
              <span className={`px-2 py-1 rounded-full text-xs ${statusColor}`}>
                {displayStatus === "DELETED"
                  ? t("deleted")
                  : displayStatus === "ACTIVE"
                  ? t("active")
                  : t("notActive")}
              </span>
            </td>
            <td className="px-6 py-4 text-right">
              <div className="flex justify-end gap-3">
                {brand.status !== "DELETED" ? (
                  <>
                    <button
                      onClick={() => handleViewBrand(brand.id)}
                      className="text-green-500 hover:text-green-700 text-[#24ae9f]"
                      aria-label={t("viewCategories")}
                    >
                      <CategoryIconn_green className="w-5 h-5 text-[#24ae9f]/80 hover:text-gray-700" />
                    </button>

                    <button
                      onClick={() =>
                        router.push(`/${locale}/brands/${brand.id}`)
                      }
                      className="text-blue-500 hover:text-blue-700"
                      aria-label={t("viewBrandDetails")}
                    >
                      <ArrowTopRightOnSquareIconn className="w-5 h-5 text-[#00a18f] hover:text-gray-700" />
                    </button>

                    <button
                      onClick={() => setOpenDelete(brand.id)}
                      className="text-red-500 hover:text-red-700"
                      aria-label={t("deleteBrand")}
                    >
                      <TrashIconn className="w-5 h-5 text-[#00a18f] hover:text-gray-700" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleRestoreBrand(brand.id)}
                    className="flex items-center gap-2 text-primary hover:text-primary/70"
                    aria-label={t("restoreBrand")}
                  >
                    <Restore_brand className="w-5 h-5" />
                    <span>{t("restore")}</span>
                  </button>
                )}
              </div>
            </td>
          </tr>
        );
      })
      .filter(Boolean); // Remove null rows
  };

  // Add this function to handle language change
  const handleLanguageChange = (newLocale: string) => {
    // Preserve the current URL parameters when changing language
    const params = new URLSearchParams(searchParams.toString());
    router.push(`/${newLocale}/brands?${params.toString()}`);
  };

  // Add event listener for offer changes
  //   useEffect(() => {
  //     const handleOffersChange = () => {
  //       // Refresh the brands list when offers change
  //       fetchBrands(currentPage, pageSize);
  //     };

  //     window.addEventListener("brandOffersChanged", handleOffersChange);

  //     return () => {
  //       window.removeEventListener("brandOffersChanged", handleOffersChange);
  //     };
  //   }, [currentPage, pageSize]);

  if (isAddBrandOpen) {
    return (
      <AddBrand2
        onSubmit={async (formData: FormData) => {
          try {
            setLoading(true);
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand`,
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                body: formData,
              }
            );

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.message || t("addFailed"));
            }

            // Refresh the brands list
            // await fetchBrands(currentPage, pageSize);
            setIsAddBrandOpen(false);
            toast.success(t("successAdd"));
          } catch (error: any) {
            console.error("Add brand error:", error);
            toast.error(
              error instanceof Error ? error.message : t("addFailed")
            );
          } finally {
            setLoading(false);
          }
        }}
        onCancel={() => {
          setIsAddBrandOpen(false);
          setEditingBrand(null);
        }}
        initialData={editingBrand}
        isLoading={loading}
      />
    );
  }

  return (
    <div className="p-container space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h4 className="font-bold text-lg md:text-xl lg:text-2xl">
            {t("title")}
          </h4>
          {searchParams.get("ids") && categoryName && (
            <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full">
              <span className="text-sm text-primary">
                {t("filteredBy")}: {decodeURIComponent(categoryName)}
              </span>
              <button
                onClick={() => router.push(`/${locale}/brands`)}
                className="text-primary hover:text-primary/70"
                aria-label={t("clear_filter")}
              >
                <TrashIconn className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsAddBrandOpen(true)}
          className="px-5 py-2 bg-primary rounded-md text-white font-medium"
        >
          <div className="flex gap-3">
            <PluseCircelIcon className="size-6" />
            <div className="flex-1">{t("brandaddButton")}</div>
          </div>
        </button>
      </div>

      <Table
        headers={tableHeaders}
        pagination={
          <Pagination
            count={count}
            totalPages={totalPages ?? 0}
            downloadButton={
              <DownloadButton
                fields={["id", "name", "email", "phone", "createdAt"]}
                model="brand"
              />
            }
          />
        }
      >
        {renderTableRows()}
      </Table>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!openDelete} onOpenChange={() => setOpenDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("branddeleteButton")}</DialogTitle>
            <DialogDescription>{t("deleteMessage")}</DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <button
              onClick={() => setOpenDelete(null)}
              className="px-3 py-2 rounded-md border"
            >
              {t("cancel_delete_brand")}
            </button>
            <button
              onClick={() => openDelete && handleDeleteBrand(openDelete)}
              className="px-3 py-2 rounded-md bg-red-500 text-white"
            >
              {loading ? (
                <LoadingIcon className="size-5 animate-spin" />
              ) : (
                t("deleteBrand")
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Brand Categories Dialog */}
      <Dialog
        open={showCategoriesDialog}
        onOpenChange={setShowCategoriesDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("brandCategories")}</DialogTitle>
            <DialogDescription>
              {brandCategories.length > 0
                ? t("brandCategoriesDescription")
                : t("noCategoriesFound")}
            </DialogDescription>
          </DialogHeader>
          {brandCategories.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {brandCategories.map((category) => (
                <div
                  key={category.id}
                  className={`p-4 border rounded-lg flex items-center gap-3 
                                        ${
                                          category.isExpired
                                            ? "bg-red-50 text-red-700 border-red-200"
                                            : "bg-white"
                                        }`}
                >
                  <div className="w-10 h-10 flex-shrink-0">
                    <ImageApi
                      src={category.imageUrl}
                      alt={mlang(category.name, locale)}
                      loader={() => category.imageUrl}
                      loading="lazy"
                      height={40}
                      width={40}
                      className="object-cover rounded w-full h-full"
                    />
                  </div>
                  <span className="flex-1 truncate">
                    {mlang(category.name, locale)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              {t("noCategoriesFound")}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export type { Brand, BrandsProps };
export default Brands;
