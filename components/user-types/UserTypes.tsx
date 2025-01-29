"use client";
import React, { useEffect, useState } from "react";
import { DateToText } from "@/lib/DateToText";
import { DeleteIcon, LoadingIcon } from "../icons";
import { EyeIcon, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import { useTranslations } from "next-intl";
import UserTypePopupForm from "./UserTypePopupForm";
import {
  deleteUserType,
  setUserTypes,
  UserType,
} from "@/redux/reducers/userTypesReducer";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import axios from "axios";
import toast from "react-hot-toast";
import { useAppContext } from "@/context/appContext";
import ImageApi from "../ImageApi";
import Table from "../ui/Table";

const UserTypes = ({
  loading,
  userTypes,
  count,
}: {
  loading: boolean;
  userTypes: UserType[];
  count: Number;
}) => {
  // console.log(userTypes);

  const t = useTranslations("userTypes");
  const headers = [
    { name: "type" },
    { name: "logo" },
    { name: "buyAmount" },
    { name: "ratio" },
    { name: "createdAt" },
    { name: "action", className: "text-center" },
  ];
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [updateType, setUpdateType] = useState<UserType | undefined>(undefined);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [deleteType, setDeleteType] = useState<number | undefined>(undefined);
  const [pending, setPending] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { token } = useAppContext();

  const userTypesRedux = useAppSelector((state) => state.userTypes.userTypes);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setUserTypes(userTypes));
  }, []);

  const handleDeleteType = async () => {
    if (!deleteType) return;
    try {
      setPending(true);
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user-types/${deleteType}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(deleteUserType(deleteType));
      setOpenDelete(false);
      toast.success(t("successDelete"));
      setPending(false);
    } catch (error: any) {
      setPending(false);
      console.error(error);
      toast.error(error?.response?.data?.message || "There is an Error");
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold capitalize">{t("title")}</h1>
        <button
          onClick={() => setOpenForm(true)}
          className="p-1 bg-primary rounded-md text-white font-medium"
        >
          <Plus className="size-6" />
        </button>
      </div>
      <div className="bg-white border rounded-xl">
        <Table
          data={userTypes}
          headers={headers}
          count={userTypes.length}
          loading={loading}
          showDateFilter={false}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
          onPageSizeChange={(size) => setPageSize(size)}
        >
          {(userTypesRedux?.length ? userTypesRedux : userTypes)?.map(
            (type: UserType) => (
              <tr
                key={type.id}
                className="odd:bg-white even:bg-[#F0F2F5] border-b"
              >
                <td className="px-6 py-4 whitespace-nowrap">{type.userType}</td>
                <td scope="row" className="px-6 py-4 ">
                  <div className="w-7 h-7 p-1 rounded-full group-even:bg-white justify-items-center content-center">
                    <ImageApi
                      src={type.badge?.logo ?? ""}
                      alt={type.badge?.name + " logo"}
                      height={150}
                      width={150}
                      priority
                      className="object-scale-down"
                    />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {type.buyAmount + " " + t("sr")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{type.ratio}%</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {DateToText(type.createdAt)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <div className="flex gap-2 items-center">
                      <button
                        type="button"
                        onClick={() => {
                          setUpdateType(type);
                          setOpenForm(true);
                        }}
                      >
                        <EyeIcon className="size-6 text-primary" />
                      </button>
                      <button
                        onClick={() => {
                          setOpenDelete(true);
                          setDeleteType(type.id);
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
      <UserTypePopupForm
        openForm={openForm}
        setOpenForm={setOpenForm}
        type={updateType}
        setType={setUpdateType}
      />
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("deleteType")}</DialogTitle>
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
              onClick={handleDeleteType}
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

export default UserTypes;
