"use client";
import React, { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useAppContext } from "@/context/appContext";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import Table from "@/components/ui/Table";
import CustomDatePicker from "@/components/CustomDatePicker";
import { TrashIconn, EditIcon, PluseCircelIcon } from "@/components/icons";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import Pagination from "@/components/ui/Pagination";
import DownloadButton from "@/components/ui/DownloadButton";

interface ExclusiveOffer {
  id: number;
  brandId: number;
  validFrom: string;
  validTo: string;
  ratio: number;
  purchaseCount: number;
  createdAt: string;
  updatedAt: string;
}

interface OfferFormData {
  ratio: number;
  validFrom: Date;
  validTo: Date;
  purchaseCount: number;
}

interface OfferTypeInfo {
  id: number;
  name: string;
  description: string;
  offerType: string;
}

const DigitalSeals = ({ brandId }: { brandId: string }) => {
  const [offers, setOffers] = useState<ExclusiveOffer[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<ExclusiveOffer | null>(null);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<
    number | null
  >(null);
  const { token } = useAppContext();
  const t = useTranslations("brand");
  const [showHelp, setShowHelp] = useState(false);
  const [offerTypeInfo, setOfferTypeInfo] = useState<OfferTypeInfo | null>(
    null
  );
  const locale = useLocale();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
    setValue,
  } = useForm<OfferFormData>();
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

  useEffect(() => {
    fetchExclusiveOffers();
    fetchOfferTypeInfo();
  }, [brandId]);

  const fetchExclusiveOffers = async () => {
    try {
      setLoading(true);
      const headers = new Headers();
      headers.append("Authorization", `Bearer ${token}`);
      headers.append("Content-Type", "application/json");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/digital-seals/${brandId}`,
        {
          method: "GET",
          headers,
        }
      );

      if (!response.ok) throw new Error("Failed to fetch offers");

      const data = await response.json();
      setOffers(data.digitalSeals || []);
    } catch (error: unknown) {
      const err = error as Error;
      console.error("Error:", err);
      toast.error("Failed to load offers");
    } finally {
      setLoading(false);
    }
  };

  const fetchOfferTypeInfo = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/offer-info/4?lang=${locale}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch offer type info");
      const data = await response.json();
      setOfferTypeInfo(data.offerInfo);
    } catch (error) {
      console.error("Error fetching offer type info:", error);
      toast.error(t("failed_to_fetch_offer_info"));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const headers = [
    { name: "digital_seal_table_id" },
    { name: "digital_seal_table_title" },
    { name: "digital_seal_table_point_back" },
    { name: "digital_seal_table_purchase_count" },
    { name: "digital_seal_table_valid_from" },
    { name: "digital_seal_table_valid_to" },
    { name: "digital_seal_table_actions" },
  ];

  const renderTableRows = () => {
    if (offers.length === 0) {
      return (
        <tr className="odd:bg-white even:bg-primary/5 border-b">
          <td
            colSpan={headers.length}
            scope="row"
            className="px-6 py-4 text-center font-bold"
          >
            {t("no data yat")}
          </td>
        </tr>
      );
    }
    return offers.map((offer) => (
      <tr key={offer.id} className="odd:bg-white even:bg-primary/5 border-b">
        <td className="px-6 py-4">{offer.id.toString().padStart(3, "0")}</td>
        <td className="px-6 py-4 font-medium">Digital seal</td>
        <td className="px-6 py-4">{offer.ratio}%</td>
        <td className="px-6 py-4">{offer.purchaseCount || 0}</td>
        <td className="px-6 py-4">{formatDate(offer.validFrom)}</td>
        <td className="px-6 py-4">{formatDate(offer.validTo)}</td>
        <td className="px-6 py-4">
          <div className="flex gap-2">
            <button
              onClick={() => handleEdit(offer)}
              className="p-1 hover:bg-slate-100 rounded"
              disabled={loading}
              title="Edit digital seal"
            >
              <EditIcon className="w-4 h-4 text-teal-500" />
            </button>
            <button
              onClick={() => setDeleteConfirmationId(offer.id)}
              className="p-1 hover:bg-slate-100 rounded"
              disabled={loading}
              title="Delete digital seal"
            >
              <TrashIconn className="w-4 h-4 text-red-500" />
            </button>
          </div>
        </td>
      </tr>
    ));
  };

  const onSubmit = async (data: OfferFormData) => {
    // Validate dates
    const validFrom = data.validFrom;
    const validTo = data.validTo;

    if (validTo <= validFrom) {
      toast.error(t("validTo_error"));
      return;
    }

    try {
      setLoading(true);
      const headers = new Headers();
      headers.append("Authorization", `Bearer ${token}`);
      headers.append("Content-Type", "application/json");

      // Format dates to match the required ISO format
      const formatDate = (date: Date) => {
        return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
      };

      const body = JSON.stringify({
        ratio: Number(data.ratio),
        purchaseCount: Number(data.purchaseCount),
        validFrom: formatDate(data.validFrom),
        validTo: formatDate(data.validTo),
      });

      const url = editingOffer
        ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/digital-seals/${brandId}/${editingOffer.id}`
        : `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/digital-seals/${brandId}`;

      const response = await fetch(url, {
        method: editingOffer ? "PUT" : "POST",
        headers,
        body,
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to save offer");
      }

      toast.success(
        editingOffer
          ? t("offer_updated_successfully")
          : t("offer_added_successfully")
      );
      fetchExclusiveOffers();
      handleCloseDialog();
    } catch (error: unknown) {
      const err = error as Error;
      console.error("Error details:", err);
      toast.error(err.message || t("failed_to_save_offer"));
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
    setEditingOffer(null);
    reset();
  };

  const handleEdit = (offer: ExclusiveOffer) => {
    setEditingOffer(offer);
    setIsAddDialogOpen(true);

    reset({
      ratio: offer.ratio,
      purchaseCount: offer.purchaseCount,
      validFrom: new Date(offer.validFrom),
      validTo: new Date(offer.validTo),
    });
  };

  const handleDelete = async (offerId: number) => {
    try {
      setLoading(true);
      const headers = new Headers();
      headers.append("Authorization", `Bearer ${token}`);
      headers.append("Content-Type", "application/json");

      const body = JSON.stringify({
        ratio: 10, // Required by the API
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/digital-seals/${brandId}/${offerId}`,
        {
          method: "DELETE",
          headers,
          body,
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete offer");
      }

      toast.success("Offer deleted successfully");
      fetchExclusiveOffers();
    } catch (error: unknown) {
      const err = error as Error;
      console.error("Delete error:", err);
      toast.error(err.message || "Failed to delete offer");
    } finally {
      setLoading(false);
      setDeleteConfirmationId(null);
    }
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">
            {offerTypeInfo?.name || t("loading")}
          </h2>
          <button
            onClick={() => setShowHelp(true)}
            className="p-1 hover:bg-gray-100 rounded-full"
            title={t("help")}
          >
            <QuestionMarkCircleIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Help Dialog */}
      <Dialog open={showHelp} onOpenChange={setShowHelp}>
        <DialogContent>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">
              {offerTypeInfo?.name || t("loading")}
            </h3>
            <p className="text-gray-600">
              {offerTypeInfo?.description || t("loading")}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Table
        headers={headers}
        bgColor
        pagination={
          <Pagination
            bgColor
            count={offers.length}
            totalPages={0}
            downloadButton={
              <DownloadButton
                filters={{ brandId: +brandId }}
                fields={["id", "ratio", "purchaseCount", "createdAt", "brand"]}
                model="digitalSeals"
                include={{
                  brand: { select: { name: true } },
                }}
              />
            }
          />
        }
      >
        {renderTableRows()}
      </Table>

      {/* Add Button */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setIsAddDialogOpen(true)}
          className={`p-2 text-white rounded-full transition-colors ${
            offers.length > 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-teal-500 hover:bg-teal-600"
          }`}
          disabled={offers.length > 0}
          title={
            offers.length > 0
              ? t("digital_seal_already_exists")
              : t("add_digital_seal")
          }
        >
          <PluseCircelIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <h2 className="text-lg font-semibold mb-4 text-center">
            {editingOffer ? t("editOffer") : t("addOffer")}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">
                {t("Tablecomponent.digital_seal_table_point_back")}
              </label>
              <input
                type="number"
                step="0.1"
                {...register("ratio", {
                  required: t("pointbackratio_required"),
                })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">
                {t("Tablecomponent.digital_seal_table_purchase_count")}
              </label>
              <input
                type="number"
                {...register("purchaseCount", {
                  required: "Purchase count is required",
                  min: { value: 0, message: "Purchase count must be positive" },
                })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <CustomDatePicker
                label={t("Tablecomponent.digital_seal_table_valid_from")}
                fieldForm="validFrom"
                errors={errors}
                control={control}
                setValue={setValue}
                rules={{ required: t("validFrom_required") }}
                className="w-full"
              />
            </div>
            <div>
              <CustomDatePicker
                label={t("Tablecomponent.digital_seal_table_valid_to")}
                fieldForm="validTo"
                errors={errors}
                control={control}
                setValue={setValue}
                rules={{ required: t("validTo_required") }}
                className="w-full"
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={handleCloseDialog}
                className="px-4 py-2 border rounded-lg"
              >
                {t("cancel")}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
              >
                {loading ? t("saving") : editingOffer ? t("update") : t("add")}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteConfirmationId}
        onOpenChange={() => setDeleteConfirmationId(null)}
      >
        <DialogContent>
          <h2 className="text-lg font-semibold mb-4 text-center">
            {t("branddeleteButton")}
          </h2>
          <p className="mb-4">{t("deleteMessage")}</p>
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setDeleteConfirmationId(null)}
              className="px-4 py-2 border rounded-lg"
            >
              {t("cancel_delete_brand")}
            </button>
            <button
              onClick={() =>
                deleteConfirmationId && handleDelete(deleteConfirmationId)
              }
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              disabled={loading}
            >
              {loading ? "Deleting..." : t("deleteBrand")}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DigitalSeals;
