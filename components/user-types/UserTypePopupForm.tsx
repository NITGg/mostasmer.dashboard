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
  addUserType,
  updateUserType,
  UserType,
} from "@/redux/reducers/userTypesReducer";
import { useAppDispatch } from "@/hooks/redux";
import FetchSelect from "../FetchSelect";
import { Badge } from "@/redux/reducers/badgesReducer";
import UserInput from "../users/UserInput";

const UserTypePopupForm = ({
  openForm,
  setOpenForm,
  type,
  setType,
}: {
  type?: UserType;
  setType?: (type: UserType | undefined) => void;
  openForm: boolean;
  setOpenForm: (open: boolean) => void;
}) => {
  const { token } = useAppContext();
  const t = useTranslations("userTypes");
  const [loading, setLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();
  const dispatch = useAppDispatch();

  useEffect(() => {
    reset(
      type || { userType: "", color: "", badgeId: "", buyAmount: "", ratio: "" }
    );
  }, [type, reset]);

  const fetchBadges = async ({
    search,
    page,
    limit,
  }: {
    search: string;
    page: number;
    limit: number;
  }) => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/badges`,
        {
          params: {
            keyword: search,
            page,
            limit,
            userType: "null",
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return {
        data: data.badges,
        totalPages: data.totalPages,
      };
    } catch (error) {
      console.error("Error fetching badges:", error);
      return { data: [], totalPages: 0 };
    }
  };

  const addType = handleSubmit(async (formData) => {
    try {
      setLoading(true);
      const formattedData = {
        ...formData,
        buyAmount: +formData.buyAmount,
        ratio: +formData.ratio,
      };

      const { data } = await axios.post(
        `/api/user-types`,
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(addUserType(data.data));

      toast.success(t("success"));
      setOpenForm(false);
    } catch (error: any) {
      console.error("Submit Error:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  });
  const updateType = handleSubmit(async (formData) => {
    try {
      setLoading(true);
      const formattedData = {
        ...formData,
        buyAmount: +formData.buyAmount,
        ratio: +formData.ratio,
      };

      const { data } = await axios.put(
        `/api/user-types/${type?.id}`,
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(updateUserType(data.data));
      toast.success(t("successUpdate"));
      setTimeout(() => window.location.reload(), 500);
      setOpenForm(false);
    } catch (error: any) {
      setLoading(false);
      console.error("Submit Error:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  });

  const handelClose = () => {
    reset();
    setType?.(undefined);
    setOpenForm(false);
  };

  return (
    <Dialog open={openForm} onOpenChange={handelClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle> {type ? t("updateTitle") : t("addTitle")} </DialogTitle>
          <DialogDescription> </DialogDescription>
        </DialogHeader>
        <form onSubmit={type ? updateType : addType}>
          <div className="space-y-5">
            <UserInput
              fieldForm="userType"
              label={t("userType")}
              roles={{ required: t("UserTypeIsRequired") }}
              register={register}
              errors={errors}
              defaultValue={type?.userType}
            />
            <FetchSelect<Badge>
              fieldForm="badgeId"
              label={t("badge")}
              placeholder={""}
              fetchFunction={fetchBadges}
              getOptionLabel={(badge) => badge.name}
              getOptionValue={(badge) => badge.id}
              defaultValue={type?.badge}
              roles={{ required: t("badgeIsRequired") }}
              register={register}
              setValue={setValue}
              errors={errors}
            />
            <UserInput
              fieldForm="buyAmount"
              label={t("buyAmount")}
              roles={{
                required: "buyAmountIsRequired",
                min: { value: 1, message: t("GreaterThanZero") },
              }}
              register={register}
              errors={errors}
              defaultValue={type?.buyAmount}
              type="number"
              min={0}
            />
            <UserInput
              fieldForm="ratio"
              label={t("ratio")}
              roles={{
                required: t("ratioIsRequired"),
                validate: (value) => value > 0 || t("GreaterThanZero"),
              }}
              register={register}
              errors={errors}
              defaultValue={type?.ratio}
              type="number"
              min={0}
            />

            <div className=" w-full flex justify-center items-center gap-4">
              <button
                disabled={loading}
                className="py-1 px-12 rounded-3xl border-1 border-primary bg-primary text-white duration-200 flex justify-center"
              >
                {loading && (
                  <LoadingIcon className="w-6 h-6 animate-spin hover:stroke-white" />
                )}
                {!loading && type ? t("edit") : t("add")}
              </button>
              <button
                className="py-1 px-12 rounded-3xl border-1"
                type="reset"
                onClick={handelClose}
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

export default UserTypePopupForm;
