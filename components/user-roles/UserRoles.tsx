"use client";
import React, { useEffect, useState } from "react";
import { DeleteIcon, LoadingIcon, PluseCircelIcon } from "../icons";
import { EyeIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useTranslations } from "next-intl";
import UserRolesPopupForm from "./UserRolesPopupForm";
import {
  deleteRole,
  setRoles,
  UserRole,
} from "@/redux/reducers/userRolesReducer";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import axios from "axios";
import toast from "react-hot-toast";
import { useAppContext } from "@/context/appContext";
import Table from "../ui/Table";

const UserRoles = ({
  loading,
  userRoles,
  count,
}: {
  loading: boolean;
  userRoles: UserRole[];
  count: number;
}) => {
  const t = useTranslations("userRoles");
  const headers = [
    { name: "id" },
    { name: "name" },
    { name: "action", className: "text-center" },
  ];
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [updateRole, setUpdateRole] = useState<UserRole | undefined>(undefined);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [deleteRoleId, setDeleteRoleId] = useState<number | undefined>(
    undefined
  );
  const [pending, setPending] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { token } = useAppContext();
  const userRolesRedux = useAppSelector((state) => state.userRoles.roles);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setRoles(userRoles));
  }, []);

  const handleDeleteRole = async () => {
    if (!deleteRoleId) return;
    try {
      setPending(true);
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/roles/${deleteRoleId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(deleteRole(deleteRoleId));
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
          className="px-5 py-2 bg-primary rounded-md text-white font-medium"
        >
          <div className="flex gap-3">
            <PluseCircelIcon className="size-6" />
            <div className="flex-1">{t("addRole")}</div>
          </div>
        </button>
      </div>
      <div className="bg-white border rounded-xl">
        <Table
          data={userRoles}
          headers={headers}
          count={userRoles.length}
          loading={loading}
          showDateFilter={false}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
          onPageSizeChange={(size) => setPageSize(size)}
        >
          {(userRolesRedux?.length ? userRolesRedux : userRoles)?.map(
            (role: UserRole, index) => (
              <tr
                key={role.id}
                className="odd:bg-white even:bg-[#F0F2F5] border-b"
              >
                <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap">{role.name}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <div className="flex gap-2 items-center">
                      <button
                        type="button"
                        onClick={() => {
                          setUpdateRole(role);
                          setOpenForm(true);
                        }}
                      >
                        <EyeIcon className="size-6 text-primary" />
                      </button>
                      <button
                        onClick={() => {
                          setOpenDelete(true);
                          setDeleteRoleId(role.id);
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
      <UserRolesPopupForm
        openForm={openForm}
        setOpenForm={setOpenForm}
        role={updateRole}
        setRole={setUpdateRole}
      />
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("deleteRole")}</DialogTitle>
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
              onClick={handleDeleteRole}
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

export default UserRoles;
