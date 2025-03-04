"use client";
import React, { useEffect, useState } from "react";
import { DeleteIcon, EditIcon, PluseCircelIcon } from "../icons";
import { useTranslations } from "next-intl";
import UserRolesPopupForm from "./UserRolesPopupForm";
import { setRoles, UserRole } from "@/redux/reducers/userRolesReducer";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import Table from "../ui/Table";
import Pagination from "../ui/Pagination";
import DownloadButton from "../ui/DownloadButton";
import DeleteUserRole from "./DeleteUserRole";

const UserRoles = ({
  totalPages,
  userRoles,
  count,
}: {
  totalPages: number;
  userRoles: UserRole[];
  count: number;
}) => {
  const t = useTranslations("userRoles");
  const headers = [
    { name: "id" },
    { name: "name", sortable: true, key: "name" },
    { name: "action", className: "text-center" },
  ];
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [updateRole, setUpdateRole] = useState<UserRole | undefined>(undefined);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [deleteRoleId, setDeleteRoleId] = useState<number | undefined>(
    undefined
  );

  const userRolesRedux = useAppSelector((state) => state.userRoles.roles);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setRoles(userRoles));
  }, []);

  return (
    <>
      <UserRolesPopupForm
        openForm={openForm}
        setOpenForm={setOpenForm}
        role={updateRole}
        setRole={setUpdateRole}
      />
      {deleteRoleId && (
        <DeleteUserRole
          deleteRoleId={deleteRoleId}
          openDelete={openDelete}
          setOpenDelete={setOpenDelete}
        />
      )}
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
          headers={headers}
          pagination={
            <Pagination
              count={count}
              totalPages={totalPages}
              downloadButton={
                <DownloadButton<UserRole>
                  model="roles"
                  fields={["id", "name"]}
                />
              }
            />
          }
        >
          {!userRolesRedux.length && (
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
          {(userRolesRedux?.length ? userRolesRedux : userRoles)?.map(
            (role: UserRole, index) => (
              <tr
                key={role.id}
                className="odd:bg-white even:bg-[#F0F2F5] border-b"
              >
                <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap">{role.name}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2 items-center">
                    <button
                      type="button"
                      onClick={() => {
                        setUpdateRole(role);
                        setOpenForm(true);
                      }}
                      className="text-primary hover:text-gray-700 transition-colors"
                    >
                      <EditIcon className="size-4" />
                    </button>
                    <button
                      onClick={() => {
                        setOpenDelete(true);
                        setDeleteRoleId(role.id);
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
      </div>
    </>
  );
};

export default UserRoles;
