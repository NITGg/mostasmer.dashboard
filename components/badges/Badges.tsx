"use client";
import React, { useEffect, useState } from "react";
import Table from "@/components/ui/Table";
import { DateToText } from "@/lib/DateToText";
import { DeleteIcon, LoadingIcon } from "../icons";
import { EyeIcon, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import axios from "axios";
import toast from "react-hot-toast";
import { useAppContext } from "@/context/appContext";
import {
  Badge,
  deleteBadge,
  setBadges,
} from "@/redux/reducers/badgesReducer";
import BadgePopupForm from "./BadgePopupForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import ImageApi from "../ImageApi";
import Image from "next/image";

const Badges = ({
  loading,
  badges,
  count,
}: {
  loading: boolean;
  badges: Badge[];
  count: number;
}) => {
  const t = useTranslations("badges");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const headers = [
    { name: "id" },
    { name: "logo" },
    { name: "name" },
    { name: "pointsBack" },
    { name: "users" },
    { name: "validFrom" },
    { name: "validTo" },
    { name: "action", className: "text-center" },
  ];

  const [openForm, setOpenForm] = useState<boolean>(false);
  const [updateBadge, setUpdateBadge] = useState<Badge | undefined>(undefined);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [deleteBadgeId, setDeleteBadgeId] = useState<number | undefined>(undefined);
  const [pending, setPending] = useState<boolean>(false);
  const { token } = useAppContext();

  const badgesRedux = useAppSelector((state) => state.badges.badges);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setBadges(badges));
  }, [badges, dispatch]);

  const handleDeleteBadge = async () => {
    if (!deleteBadgeId) return;
    try {
      setPending(true);
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/badges/${deleteBadgeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(deleteBadge(deleteBadgeId));
      setOpenDelete(false);
      toast.success(t("successDelete"));
      setPending(false);
    } catch (error: any) {
      setPending(false);
      console.error(error);
      toast.error(error?.response?.data?.message || "There is an Error");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex-1 min-w-0 p-6 ml-72">
      <div className="space-y-6 max-w-full">
        <div className="flex justify-between items-center">
          <h4 className="font-bold text-lg md:text-xl lg:text-2xl">{t("badges")}</h4>
          <button
            onClick={() => setOpenForm(true)}
            className="px-5 py-2 rounded-md text-white font-medium"
          >
            <div className="flex gap-3 border-2 border-[#02161e] rounded-md px-2 py-1 bg-[#02161e] text-white">
              <Plus className="size-6 text-teal-500" />
              <div className="flex-1">{t("addBadge")}</div>
            </div>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(badgesRedux?.length ? badgesRedux : badges)
            ?.slice(0, 3)
            .map((badge: Badge) => (
              <div
                key={badge.id}
                className="bg-[#F0F2F5] overflow-hidden shadow-[0px_4px_10px_-4px_#00000040] rounded-2xl flex flex-col"
              >
                <div className="h-48 w-full p-2 relative flex flex-col justify-end text-white">
                  <Image
                    src={badge.cover}
                    alt={badge.name}
                    quality={100}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <h1 className="capitalize text-xl font-bold z-10">
                    {badge.name}
                  </h1>
                  <h3 className="capitalize text-lg font-bold z-10">
                    total purchase
                  </h3>
                  <p className="text-lg z-10">{badge.minAmount} SR</p>
                </div>
                <div className="h-16 px-4 flex justify-between items-center">
                  <span className="capitalize text-lg font-bold">points</span>
                  <span className="text-lg font-bold">{badge.points}%</span>
                </div>
              </div>
            ))}
          
          <div className="bg-[#F0F2F5] flex items-center justify-center shadow-[0px_4px_10px_-4px_#00000040] rounded-2xl min-h-[256px]">
            <button
              onClick={() => setOpenForm(true)}
              className="p-3 bg-[#02161e] rounded-md text-white font-medium hover:bg-[#02161e]/90 transition-colors"
            >
              <Plus className="size-8 text-teal-500" />
            </button>
          </div>
        </div>

        <div className="w-full overflow-hidden">
          <Table
            data={badgesRedux?.length ? badgesRedux : badges}
            headers={headers}
            count={count}
            loading={loading}
            bgColor="#02161e"
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            showCount={true}
            currentItems={(badgesRedux?.length || badges?.length) || 0}
          >
            {(badgesRedux?.length ? badgesRedux : badges)?.map(
              (badge: Badge, index) => (
                <tr
                  key={badge.id}
                  className="group odd:bg-white even:bg-[#F0F2F5] border-b"
                >
                  <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                  <td scope="row" className="px-6 py-4">
                    <div className="w-7 h-7 p-1 rounded-full group-even:bg-white justify-items-center content-center">
                      <ImageApi
                        src={badge.logo}
                        alt={badge.name + " logo"}
                        height={150}
                        width={150}
                        priority
                        className="object-scale-down"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{badge.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{badge.points}%</td>
                  <td className="px-6 py-4 whitespace-nowrap">{badge?.users}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {badge?.validFrom ? DateToText(badge?.validFrom) : "--"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {badge?.validTo ? DateToText(badge.validTo) : "--"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <div className="flex gap-2 items-center">
                        <button
                          type="button"
                          onClick={() => {
                            setUpdateBadge(badge);
                            setOpenForm(true);
                          }}
                        >
                          <EyeIcon className="size-6 text-primary" />
                        </button>
                        <button
                          onClick={() => {
                            setOpenDelete(true);
                            setDeleteBadgeId(badge.id);
                          }}
                        >
                          <DeleteIcon className="size-6 text-primary" />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              )
            )}
          </Table>
        </div>

        <BadgePopupForm
          openForm={openForm}
          setOpenForm={setOpenForm}
          badge={updateBadge}
          setBadge={setUpdateBadge}
        />

        <Dialog open={openDelete} onOpenChange={setOpenDelete}>
          <DialogContent className="bg-white p-0 rounded-lg">
            <div className="p-6 space-y-6">
              <DialogHeader className="space-y-4 text-center">
                <DialogTitle className="text-xl font-bold text-black">
                  {t("deleteBadge")}
                </DialogTitle>
                <DialogDescription className="text-gray-500 text-base">
                  {t("deleteMessage")}
                </DialogDescription>
              </DialogHeader>
              
              <div className="flex justify-center gap-4 p-4">
                <button 
                  onClick={handleDeleteBadge}
                  className="bg-teal-500 hover:bg-[#003e35] hover:bg-teal-600 px-8 py-2 rounded-3xl text-white transition-colors w-28"
                >
                  {pending ? (
                    <LoadingIcon className="size-5 animate-spin" />
                  ) : (
                    t("delete")
                  )}
                </button>
                <button 
                  onClick={() => setOpenDelete(false)}
                  className="bg-white border border-gray-700 drop-shadow-2xl font-bold hover:bg-gray-200 px-8 py-2 rounded-3xl text-black transition-colors w-28"
                >
                  {t("cancel")}
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Badges;