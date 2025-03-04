"use client";
import React, { useEffect, useState } from "react";
import { DeleteIcon, EditIcon, PluseCircelIcon } from "../icons";
import { useTranslations } from "next-intl";
import ImageApi from "../ImageApi";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { Ad, setAds } from "@/redux/reducers/adsReducer";
import AddAds from "./AddAds";
import { DateToText } from "@/lib/DateToText";
import Table, { TableHeader } from "../ui/Table";
import Pagination from "../ui/Pagination";
import DownloadButton from "../ui/DownloadButton";
import DeleteAds from "./DeleteAds";

const AdsList = ({
  ads,
  count,
  totalPages,
}: {
  ads: Ad[];
  count: number;
  totalPages: number;
}) => {
  const t = useTranslations("ads");
  const [open, setOpen] = useState<boolean>(false);
  const [edit, setEdit] = useState<Ad | null>(null);
  const [deleteAd, setDeleteAd] = useState<Ad | null>(null);
  const [deletePopup, setDeletePopup] = useState<boolean>(false);

  const adsRedux = useAppSelector((s) => s.ads.ads);
  const dispatch = useAppDispatch();

  const headers: TableHeader[] = [
    { name: "ad", sortable: true, key: "id" },
    { name: "logo" },
    { name: "viewType", sortable: true, key: "adType" },
    { name: "startDate", sortable: true, key: "startDate" },
    { name: "endDate", sortable: true, key: "endDate" },
    { name: "actions", className: "text-center" },
  ];

  useEffect(() => {
    dispatch(setAds(ads));
  }, []);

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
      </div>
      {!open && (
        <Table
          headers={headers}
          pagination={
            <Pagination
              count={count}
              totalPages={totalPages}
              downloadButton={
                <DownloadButton<Ad>
                  fields={["id", "title", "adType", "budget", "brand"]}
                  include={{
                    brand: { select: { name: true } },
                  }}
                  model="ads"
                />
              }
            />
          }
        >
          {!adsRedux.length && (
            <tr className="odd:bg-white even:bg-primary/5 border-b">
              <td
                colSpan={headers.length}
                scope="row"
                className="px-6 py-4 text-center font-bold"
              >
                {t("no data yat")}
              </td>
            </tr>
          )}
          {adsRedux.map((ad: Ad) => (
            <tr key={ad.id} className="odd:bg-white even:bg-[#F0F2F5] border-b">
              <td scope="row" className="px-6 py-4">
                {ad.id}
              </td>
              <td scope="row" className="px-6 py-4">
                <div className="size-16">
                  <ImageApi
                    src={ad.imageUrl}
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
                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => {
                      setEdit(ad);
                      setOpen(true);
                    }}
                    className="text-primary hover:text-gray-700 transition-colors"
                  >
                    <EditIcon className="size-4" />
                  </button>
                  <button
                    onClick={() => {
                      setDeleteAd(ad);
                      setDeletePopup(true);
                    }}
                    className="text-primary hover:text-gray-700 transition-colors"
                  >
                    <DeleteIcon className="size-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      )}

      {open && edit && (
        <AddAds
          handleClose={() => {
            setOpen(false);
            setEdit(null);
          }}
          ad={edit}
        />
      )}

      {deleteAd && (
        <DeleteAds
          deleteAd={deleteAd}
          openDelete={deletePopup}
          setOpenDelete={setDeletePopup}
        />
      )}
    </div>
  );
};

export default AdsList;
