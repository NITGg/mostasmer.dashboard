"use client";
import React, { useEffect, useState } from "react";
import Table from "@/components/ui/Table";
import { DeleteIcon, LoadingIcon, EditIcon } from "../icons";
import { Plus } from "lucide-react";
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
import BadgesSwiper from "./BadgesSwiper";

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
      await axios.delete(`/api/user-types/${deleteBadgeId.userType?.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await axios.delete(`/api/badges/${deleteBadgeId.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
      <div className="flex gap-6 items-center w-full p-4 max-sm:flex-col">
        <div className="w-[80%] h-44 flex gap-4 max-sm:w-full">
          {
            <BadgesSwiper
              badges={badgesRedux ?? badges}
              setOpenForm={setOpenForm}
              setUpdateBadge={setUpdateBadge}
            />
          }
        </div>
        <button
          type="button"
          onClick={() => setOpenForm(true)}
          className="bg-[#F0F2F5] grid max-sm:w-full place-content-center shadow-[0px_4px_10px_-4px_#00000040] w-1/5 h-44 rounded-2xl hover:scale-95 focus-within:scale-95 transition-transform"
        >
          <span className="p-1 bg-primary rounded-md text-white font-medium hover:text-gray-700 transition-colors">
            <Plus className="size-6" />
          </span>
        </button>
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
              <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
              <td className="px-6 py-4">
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
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-6">
                  <button
                    type="button"
                    onClick={() => {
                      setUpdateBadge(badge);
                      setOpenForm(true);
                    }}
                    className="text-primary hover:text-gray-700 transition-colors"
                  >
                    <EditIcon className="size-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOpenDelete(true);
                      setDeleteBadgeId(badge);
                    }}
                    className="text-primary hover:text-gray-700 transition-colors"
                  >
                    <DeleteIcon className="size-4" />
                  </button>
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
