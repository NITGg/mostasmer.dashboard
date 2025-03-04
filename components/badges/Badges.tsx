"use client";
import React, { useEffect, useState } from "react";
import Table, { TableHeader } from "@/components/ui/Table";
import { DeleteIcon, EditIcon } from "../icons";
import { Plus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { Badge, setBadges } from "@/redux/reducers/badgesReducer";
import BadgePopupForm from "./BadgePopupForm";
import ImageApi from "../ImageApi";
import BadgesSwiper from "./BadgesSwiper";
import Pagination from "../ui/Pagination";
import DownloadButton from "../ui/DownloadButton";
import DeleteBadgePopup from "./DeleteBadgePopup";
import { useTranslations } from "next-intl";

const Badges = ({
  totalPages,
  badges,
  count,
}: {
  totalPages: number;
  badges: Badge[];
  count: number;
}) => {
  const t = useTranslations("Tablecomponent");

  const headers: TableHeader[] = [
    { name: "id" },
    { name: "logo" },
    { name: "name", sortable: true, key: "name" },
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

  const badgesRedux = useAppSelector((state) => state.badges.badges);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setBadges(badges));
  }, [badges, dispatch]);

  return (
    <div className="flex flex-col gap-3">
      <BadgePopupForm
        openForm={openForm}
        setOpenForm={setOpenForm}
        badge={updateBadge}
        setBadge={setUpdateBadge}
      />

      {deleteBadgeId && (
        <DeleteBadgePopup
          deleteBadgeId={deleteBadgeId}
          openDelete={openDelete}
          setOpenDelete={setOpenDelete}
        />
      )}

      <div className="flex gap-6 items-center w-full p-4 max-sm:flex-col">
        <div className="w-[80%] flex gap-4 max-sm:w-full">
          {!!badgesRedux.length && (
            <BadgesSwiper
              badges={badgesRedux ?? badges}
              setOpenForm={setOpenForm}
              setUpdateBadge={setUpdateBadge}
            />
          )}
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
        headers={headers}
        pagination={
          <Pagination
            count={count}
            totalPages={totalPages}
            downloadButton={
              <DownloadButton<Badge>
                model="badge"
                fields={["id", "name", "points", "minAmount", "maxAmount"]}
              />
            }
          />
        }
      >
        {!badgesRedux.length && (
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
        {badgesRedux?.map((badge: Badge, index) => (
          <tr
            key={badge.id}
            className="odd:bg-white even:bg-[#F0F2F5] border-b"
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
            <td className="px-6 py-4">
              <div className="flex gap-2 items-center">
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
        ))}
      </Table>
    </div>
  );
};

export default Badges;
