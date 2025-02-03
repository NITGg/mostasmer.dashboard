"use client";
import React, { useEffect, useState } from "react";
import { LoadingIcon, PluseCircelIcon } from "../icons";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { EditIcon, Trash } from "lucide-react";
import ImageApi from "../ImageApi";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import toast from "react-hot-toast";
import axios from "axios";
import { useAppContext } from "@/context/appContext";
import { Ads, deleteAds, setAds } from "@/redux/reducers/ads";
import AddAds from "./AddAds";
import { DateToText } from "@/lib/DateToText";
import Table from "../ui/Table";

const AdsHeader = ({ data, count }: { data: Ads[]; count: number }) => {
  const t = useTranslations("ads");
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null as any);
  const [deleteBoard, setDeleteBoard] = useState(null as any);
  const [loading, setLoading] = useState(false);
  const { token } = useAppContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const ads = useAppSelector((s) => s.ads.ads);
  const dispatch = useAppDispatch();

  const headers = [
    { name: "ad" },
    { name: "logo" },
    { name: "viewType" },
    { name: "startDate" },
    { name: "endDate" },
    { name: "actions", className: "text-center" },
  ];

  useEffect(() => {
    dispatch(setAds(data));
  }, []);
  const handleDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `/api/ads/${deleteBoard}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(deleteAds(deleteBoard));
      setDeleteBoard(false);
      toast.success(t("successDelete"));
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      console.error(error);
      toast.error(error?.response?.data?.message || "There is an Error");
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <h4 className="font-bold text-lg md:text-xl lg:text-2xl">
          {t("title")}
        </h4>
        <button
          onClick={() => {
            setOpen(!open);
          }}
          className="px-5 py-2 bg-primary rounded-md text-white font-medium"
        >
          <div className="flex gap-3">
            <PluseCircelIcon className="size-6" />
            <div className="flex-1">{t("add")}</div>
          </div>
        </button>

        <Dialog open={deleteBoard} onOpenChange={setDeleteBoard}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("delete")}</DialogTitle>
              <DialogDescription>{t("deleteMessage")}</DialogDescription>
            </DialogHeader>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteBoard(false)}
                className="px-3 py-2 rounded-md border"
              >
                {t("cancel")}
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-2 rounded-md bg-red-500 text-white"
              >
                {loading ? (
                  <LoadingIcon className="size-5 animate-spin" />
                ) : (
                  t("delete")
                )}
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {!open && (
        <Table
          count={data.length}
          headers={headers}
          data={data}
          loading={loading}
          showDateFilter={false}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
          onPageSizeChange={(size) => setPageSize(size)}>
          {(ads?.length ? ads : data)?.map((ad: Ads) => {
            return (
              <tr
                key={ad.id}
                className="odd:bg-white even:bg-[#F0F2F5] border-b"
              >
                <td scope="row" className="px-6 py-4">
                  {ad.id}
                </td>
                <td scope="row" className="px-6 py-4">
                  <div className="size-16">
                    <ImageApi
                      src={ad.imageUrl}
                      loader={() => ad.imageUrl}
                      loading="lazy"
                      alt="ad"
                      className="size-full rounded-full object-cover border-2"
                      width={200}
                      height={200}
                    />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{ad.adType}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {DateToText(ad.startDate.toString())}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {DateToText(ad.endDate.toString())}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <div className="flex gap-2 items-center">
                      <button
                        onClick={() => {
                          setEdit(ad);
                          setOpen(true);
                        }}
                        className="block"
                      >
                        <EditIcon className="size-6 text-primary" />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteBoard(ad.id);
                        }}
                      >
                        <Trash className="size-6 text-primary" />
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </Table>
      )}

      {open && (
        <AddAds
          handleClose={() => {
            setOpen(false);
            setEdit(null);
          }}
          ad={edit}
        />
      )}
    </div>
  );
};

export default AdsHeader;
