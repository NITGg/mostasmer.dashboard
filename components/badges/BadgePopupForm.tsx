"use client";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { LoadingIcon, PhotoIcon } from "../icons";
import axios from "axios";
import { useAppContext } from "@/context/appContext";
import toast from "react-hot-toast";
import { useAppDispatch } from "@/hooks/redux";
import { addBadge, Badge } from "@/redux/reducers/badgesReducer";
import UserInput from "../users/UserInput";
import CustomDatePicker from "../CustomDatePicker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Edit, MoveUp } from "lucide-react";
import clsx from "clsx";
import ErrorMsg from "../ErrorMsg";
import Image from "next/image";

const BadgePopupForm = ({
  openForm,
  setOpenForm,
  badge,
  setBadge,
}: {
  badge?: Badge;
  setBadge?: (badge: Badge | undefined) => void;
  openForm: boolean;
  setOpenForm: (open: boolean) => void;
}) => {
  const { token } = useAppContext();
  const t = useTranslations("badges");
  const [loading, setLoading] = useState<boolean>(false);
  const [cover, setCover] = useState<string>("");
  const [logo, setLogo] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
    setError,
    watch,
  } = useForm();
  const dispatch = useAppDispatch();
  const minAmount = watch("minAmount");
  const validFrom = watch("validFrom");
  useEffect(() => {
    reset(
      badge || {
        name: "",
        cover: "",
        logo: "",
        color: "",
        points: "",
        minAmount: "",
        maxAmount: "",
        validFrom: "",
        validTo: "",
      }
    );
  }, [badge, reset]);

  useEffect(() => {
    if (badge) {
      setCover(badge?.cover || "");
      setLogo(badge?.logo || "");
    }
  }, [badge]);

  const handleAddBadge = handleSubmit(async (formData) => {
    try {
      setLoading(true);
      const badgeData = { ...formData };
      delete badgeData.coverFile;
      delete badgeData.logoFile;
      delete badgeData.validFrom;
      delete badgeData.validTo;

      if (formData.validFrom)
        badgeData.validFrom = formData.validFrom.toISOString();

      if (formData.validTo) badgeData.validTo = formData.validTo.toISOString();

      if (formData.coverFile?.[0]) badgeData.cover = formData.coverFile[0];

      if (formData.logoFile?.[0]) badgeData.logo = formData.logoFile[0];
      console.log(badgeData);

      const { data } = await axios.post(`/api/badges`, badgeData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch(addBadge(data.badge));

      toast.success(t("success"));
      handelClose();
    } catch (error: any) {
      console.error("Submit Error:", error);
      if (error.response?.data?.error?.includes("Badge_name_key")) {
        toast.error(t("badgeNameError"));
        setError("name", {
          type: "manual",
          message: t("badgeNameError"),
        });
      } else {
        toast.error(error?.response?.data?.message || "There is an Error");
      }
    } finally {
      setLoading(false);
    }
  });

  const handleUpdateBadge = handleSubmit(async (formData) => {
    if (!badge) return;
    try {
      setLoading(true);
      const badgeData = { ...formData };
      delete badgeData.coverFile;
      delete badgeData.logoFile;
      delete badgeData.validFrom;
      delete badgeData.validTo;

      if (formData.validFrom && formData.validFrom instanceof Date)
        badgeData.validFrom = formData.validFrom.toISOString();

      if (formData.validTo && formData.validTo instanceof Date)
        badgeData.validTo = formData.validTo.toISOString();

      if (formData.coverFile?.[0]) badgeData.cover = formData.coverFile[0];

      if (formData.logoFile?.[0]) badgeData.logo = formData.logoFile[0];

      const { data } = await axios.put(`/api/badges/${badge.id}`, badgeData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      await axios.put(
        `/api/user-types/${badge.userType?.id}`,
        {
          buyAmount: data.badge.maxAmount,
          ratio: data.badge.points,
          userType: data.badge.name,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(t("successUpdate"));
      handelClose();
      setTimeout(() => window.location.reload(), 500);
    } catch (error: any) {
      console.error("Submit Error:", error);
      if (error.response?.data?.error?.includes("Badge_name_key")) {
        toast.error(t("badgeNameError"));
        setError("name", {
          type: "manual",
          message: t("badgeNameError"),
        });
      } else {
        toast.error(error?.response?.data?.message || "There is an Error");
      }
    } finally {
      setLoading(false);
    }
  });

  const handelClose = () => {
    URL.revokeObjectURL(cover);
    URL.revokeObjectURL(logo);
    setCover("");
    setLogo("");
    reset();
    setBadge?.(undefined);
    setOpenForm(false);
  };

  return (
    <Dialog open={openForm} onOpenChange={handelClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{badge ? t("updateTitle") : t("addTitle")} </DialogTitle>
          <DialogDescription> </DialogDescription>
        </DialogHeader>
        <form onSubmit={badge ? handleUpdateBadge : handleAddBadge}>
          <div className="space-y-5">
            <div className="grid items-center grid-cols-[1fr_2.5fr] w-full h-min relative">
              <label className="text-nowrap" htmlFor="coverFile">
                {t("uploadCover")}:
              </label>
              <input
                type="file"
                accept="image/*"
                {...register("coverFile", {
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setCover(URL.createObjectURL(file));
                    }
                  },
                  required: badge ? false : t("coverRequired"),
                })}
                id="coverFile"
                className="hidden"
              />
              {cover ? (
                <div
                  className={clsx(
                    "border-2 w-full border-[#DADADA] h-20 rounded-xl relative bg-transparent shadow-[0px_0px_5px_-1px_#00000040] outline-none",
                    "hover:border-primary focus:border-primary",
                    "transition-colors duration-200 ease-in-out",
                    "flex justify-center"
                  )}
                >
                  <div className="absolute w-[80%] h-full justify-items-center content-center bg-[#F5F5F5]">
                    <Image
                      src={cover}
                      alt="cover"
                      height={200}
                      width={200}
                      priority
                      className="size-full object-cover"
                    />
                  </div>
                  <label
                    htmlFor="coverFile"
                    className="cursor-pointer absolute p-3 bg-white right-0 -bottom-2 rounded-full shadow-[0px_0px_5px_-1px_#00000040] z-10 border text-primary"
                  >
                    <Edit className="size-4" />
                  </label>
                </div>
              ) : (
                <label
                  htmlFor="coverFile"
                  className={clsx(
                    "border-2 w-full border-[#DADADA] h-20 rounded-xl relative bg-transparent shadow-[0px_0px_5px_-1px_#00000040] outline-none",
                    "hover:border-primary focus:border-primary",
                    "transition-colors duration-200 ease-in-out",
                    "flex justify-center"
                  )}
                >
                  <div className="absolute w-[80%] h-full justify-items-center content-center bg-[#F5F5F5]">
                    <PhotoIcon className="size-10" />
                  </div>
                </label>
              )}
              <div className="col-span-full">
                <ErrorMsg message={errors?.coverFile?.message as string} />
              </div>
            </div>
            <div className="grid items-center grid-cols-[1fr_2.5fr] w-full h-min relative">
              <label className="text-nowrap" htmlFor="logoFile">
                {t("uploadLogo")}:
              </label>
              <input
                type="file"
                accept="image/*"
                {...register("logoFile", {
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setLogo(URL.createObjectURL(file));
                    }
                  },
                  required: badge ? false : t("logoRequired"),
                })}
                id="logoFile"
                className="hidden"
              />
              {logo ? (
                <div className="w-full h-7">
                  <Image
                    src={logo}
                    alt="logo"
                    height={200}
                    width={200}
                    priority
                    className="object-scale-down size-full"
                  />
                  <label
                    htmlFor="logoFile"
                    className="cursor-pointer absolute p-3 right-0 top-1/2 -translate-y-1/2 text-primary"
                  >
                    <Edit className="size-4" />
                  </label>
                </div>
              ) : (
                <label
                  htmlFor="logoFile"
                  className={clsx(
                    "border-2 border-[#DADADA] p-5 rounded-xl relative bg-transparent shadow-[0px_0px_5px_-1px_#00000040] outline-none",
                    "hover:border-primary focus:border-primary",
                    "transition-colors duration-200 ease-in-out"
                  )}
                >
                  <span className="absolute top-1/2 -translate-y-1/2 right-2 z-10 rounded-full p-1 bg-primary">
                    <MoveUp className="size-5 text-white" />
                  </span>
                </label>
              )}
              <div className="col-span-full">
                <ErrorMsg message={errors?.logoFile?.message as string} />
              </div>
            </div>
            <UserInput
              defaultValue={badge?.name}
              register={register}
              errors={errors}
              fieldForm="name"
              label={t("badgeName")}
              roles={{
                value: badge?.name,
                required: t("nameIsRequired"),
                minLength: { value: 3, message: t("nameMinLength") },
              }}
            />
            <div className="grid grid-cols-2 gap-3">
              <UserInput
                defaultValue={badge?.color}
                register={register}
                errors={errors}
                fieldForm="color"
                label={t("badgeColor")}
                className="w-24 justify-self-end"
                roles={{
                  value: badge?.color,
                  required: t("colorIsRequired"),
                }}
                type="color"
              />
              <UserInput
                defaultValue={badge?.points}
                register={register}
                errors={errors}
                fieldForm="points"
                label={t("badgePoints")}
                className="w-24 justify-self-end"
                roles={{
                  value: badge?.points,
                  required: t("pointsIsRequired"),
                  validate: (value) =>
                    Number(value) > 0 || t("GreaterThanZero"),
                }}
                type="number"
                min={0}
              />
              <UserInput
                defaultValue={badge?.minAmount}
                register={register}
                errors={errors}
                fieldForm="minAmount"
                label={t("badgeMinAmount")}
                className="w-24 justify-self-end"
                roles={{
                  value: badge?.minAmount,
                  required: t("minAmountIsRequired"),
                  validate: (value) =>
                    Number(value) >= 0 || t("GreaterThanZero"),
                }}
                type="number"
                min={0}
              />
              <UserInput
                defaultValue={badge?.maxAmount}
                register={register}
                errors={errors}
                fieldForm="maxAmount"
                label={t("badgeMaxAmount")}
                className="w-24 justify-self-end"
                roles={{
                  value: badge?.maxAmount,
                  required: t("maxAmountIsRequired"),
                  validate: (value) =>
                    Number(value) > Number(minAmount) ||
                    t("MaxAmountGreaterThanMin"),
                }}
                type="number"
                min={1}
              />

              <CustomDatePicker
                defaultValue={
                  badge?.validFrom ? new Date(badge?.validFrom) : null
                }
                label={t("validFrom")}
                fieldForm="validFrom"
                control={control}
                errors={errors}
                setValue={setValue}
                rules={{
                  required: false,
                  valueAsDate: true,
                }}
                className="w-32 justify-self-end"
              />
              <CustomDatePicker
                defaultValue={badge?.validTo ? new Date(badge?.validTo) : null}
                label={t("validTo")}
                fieldForm="validTo"
                control={control}
                errors={errors}
                setValue={setValue}
                rules={{
                  required: false,
                  valueAsDate: true,
                  validate: (value) =>
                    !validFrom ||
                    new Date(value) > new Date(validFrom) ||
                    t("ValidToAfterValidFrom"),
                }}
                className="w-32 justify-self-end"
              />
            </div>

            <div className=" w-full flex justify-center items-center gap-4">
              <button
                disabled={loading}
                className="py-1 px-12 rounded-3xl border-1 border-primary bg-primary text-white duration-200 flex justify-center"
              >
                {loading && (
                  <LoadingIcon className="w-6 h-6 animate-spin hover:stroke-white" />
                )}
                {!loading && badge ? t("edit") : t("add")}
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

export default BadgePopupForm;
