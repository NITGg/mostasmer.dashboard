"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { LoadingIcon } from "../icons";
import axios from "axios";
import { useAppContext } from "@/context/appContext";
import toast from "react-hot-toast";
import {
  addRole,
  updateRole,
  UserRole,
} from "@/redux/reducers/userRolesReducer";
import { useAppDispatch } from "@/hooks/redux";

import UserInput from "../users/UserInput";

const UserRolesPopupForm = ({
  openForm,
  setOpenForm,
  role,
  setRole,
}: {
  role?: UserRole;
  setRole?: (role: UserRole | undefined) => void;
  openForm: boolean;
  setOpenForm: (open: boolean) => void;
}) => {
  const { token } = useAppContext();
  const t = useTranslations("userRoles");
  const [loading, setLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const dispatch = useAppDispatch();

  useEffect(() => {
    reset(role || { name: "" });
  }, [role, reset]);

  const handleAddRole = handleSubmit(async (formData) => {
    try {
      setLoading(true);
      const { data } = await axios.post(`/api/roles`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(addRole(data.data));
      toast.success(t("success"));
    } catch (error: any) {
      console.error("Submit Error:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
      setOpenForm(false);
    }
  });

  const handleUpdateRole = handleSubmit(async (formData) => {
    try {
      setLoading(true);
      const { data } = await axios.put(`/api/roles/${role?.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(updateRole(data.data));
      toast.success(t("successUpdate"));
    } catch (error: any) {
      console.error("Submit Error:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
      setOpenForm(false);
    }
  });

  const handleClose = () => {
    reset();
    setRole?.(undefined);
    setOpenForm(false);
  };

  return (
    <Dialog open={openForm} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{role ? t("updateTitle") : t("addTitle")}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form onSubmit={role ? handleUpdateRole : handleAddRole}>
          <div className="space-y-5">
            <UserInput
              fieldForm="name"
              label={t("name")}
              roles={{ required: t("nameIsRequired") }}
              register={register}
              errors={errors}
              defaultValue={role?.name}
            />
            <div className="w-full flex justify-center items-center gap-4">
              <button
                disabled={loading}
                className="py-1 px-12 rounded-3xl border-1 border-primary bg-primary text-white duration-200 flex justify-center"
              >
                {loading && (
                  <LoadingIcon className="w-6 h-6 animate-spin hover:stroke-white" />
                )}
                {!loading && role ? t("edit") : t("add")}
              </button>
              <button
                className="py-1 px-12 rounded-3xl border-1"
                type="reset"
                onClick={handleClose}
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserRolesPopupForm;
