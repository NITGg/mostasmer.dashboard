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
import { Badge, deleteBadge, setBadges } from "@/redux/reducers/badgesReducer";
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
  const [deleteBadgeId, setDeleteBadgeId] = useState<Badge | undefined>(
    undefined
  );
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
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user-types/${deleteBadgeId.userType?.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/badges/${deleteBadgeId.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(deleteBadge(deleteBadgeId.id));
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
    <>
      <div className="flex gap-10 items-center w-full p-4">
        <div className="w-[80%] h-44 flex gap-4">
          {(badgesRedux?.length ? badgesRedux : badges)
            ?.slice(0, 3)
            .map((badge: Badge) => (
              <div
                key={badge.id}
                className="bg-[#F0F2F5] overflow-hidden shadow-[0px_4px_10px_-4px_#00000040] w-48 h-44 rounded-2xl flex flex-col"
              >
                <div className="h-2/3 w-full p-2 relative flex flex-col justify-end text-white">
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
                <div className="h-1/3 px-2 flex justify-between items-center">
                  <span className="capitalize text-lg font-bold">points</span>
                  <span className="text-lg font-bold">{badge.points}%</span>
                </div>
              </div>
            ))}
        </div>
        <div className="bg-[#F0F2F5] grid place-content-center shadow-[0px_4px_10px_-4px_#00000040] w-1/5 h-44 rounded-2xl">
          <button
            onClick={() => setOpenForm(true)}
            className="p-1 bg-primary rounded-md text-white font-medium"
          >
            <Plus className="size-6" />
          </button>
        </div>
      </div>

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
        currentItems={badgesRedux?.length || badges?.length || 0}
      >
        {(badgesRedux?.length ? badgesRedux : badges)?.map(
          (badge: Badge, index) => (
            <tr
              key={badge.id}
              className="group odd:bg-white even:bg-[#F0F2F5] border-b"
            >
              <td className="px-6 py-4 whitespace-nowrap">{badge.id}</td>
              {/* <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td> */}
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
                        setDeleteBadgeId(badge);
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

      <BadgePopupForm
        openForm={openForm}
        setOpenForm={setOpenForm}
        badge={updateBadge}
        setBadge={setUpdateBadge}
      />

      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("deleteBadge")}</DialogTitle>
            <DialogDescription>{t("deleteMessage")}</DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <button
              onClick={() => setOpenDelete(false)}
              className="px-3 py-2 rounded-md border"
            >
              {t("cancel")}
            </button>
            <button
              onClick={handleDeleteBadge}
              className="px-3 py-2 rounded-md bg-red-500 text-white"
            >
              {pending ? (
                <LoadingIcon className="size-5 animate-spin" />
              ) : (
                t("delete")
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Badges;
