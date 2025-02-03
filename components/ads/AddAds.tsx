import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { LoadingIcon } from "../icons";
import ErrorMsg from "../ErrorMsg";
import { useTranslations } from "next-intl";
import axios from "axios";
import { useAppContext } from "@/context/appContext";
import toast from "react-hot-toast";
import { useAppDispatch } from "@/hooks/redux";
import { addAds, Ads, AdsType, updateAds } from "@/redux/reducers/ads";
import "react-datepicker/dist/react-datepicker.css";
import UserInput from "../users/UserInput";
import clsx from "clsx";
import { Brand } from "../users/BrandSelect";
import CustomSelect from "../users/CustomSelect";
import AddImageInput from "../AddImageInput";
import { CircleAlert } from "lucide-react";
import CustomDatePicker from "../CustomDatePicker";
import FetchSelect from "../FetchSelect";

const AddAds = ({ handleClose, ad }: { handleClose: () => void; ad?: Ads }) => {
  const t = useTranslations("ads");
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
  console.log(ad);

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(ad?.imageUrl ?? null);
  const { token } = useAppContext();
  const dispatch = useAppDispatch();
  const BasicType = ad?.userTypes?.find(
    (ut) => ut.userType?.userType === "Basic"
  );
  const StandardType = ad?.userTypes?.find(
    (ut) => ut.userType?.userType === "Standard"
  );
  const VIPType = ad?.userTypes?.find((ut) => ut.userType?.userType === "VIP");

  const onSubmit = handleSubmit(async (formData) => {
    try {
      setLoading(true);
      if (!formData.imageFile[0]) {
        setError("imageFile", {
          type: "manual",
          message: "Image is required",
        });
      }
      let adData = { ...formData };

      const userTypes = [];
      delete adData.basic;
      delete adData.basicStart;
      delete adData.basicEnd;
      delete adData.standard;
      delete adData.standardStart;
      delete adData.standardEnd;
      delete adData.VIP;
      delete adData.VIPStart;
      delete adData.VIPEnd;

      if (formData.basic) {
        userTypes.push({
          name: "Basic",
          startDate: formData.basicStart,
          endDate: formData.basicEnd,
        });
      }
      if (formData.standard) {
        userTypes.push({
          name: "Standard",
          startDate: formData.standardStart,
          endDate: formData.standardEnd,
        });
      }
      if (formData.VIP) {
        userTypes.push({
          name: "VIP",
          startDate: formData.VIPStart,
          endDate: formData.VIPEnd,
        });
      }

      adData.imageUrl = adData.imageFile[0];
      delete adData.imageFile;
      adData.userTypes = JSON.stringify(userTypes);
      adData.budget = 10;
      adData.priority = 1;
      adData.timing = 2;
      adData.startDate = new Date();
      const nextYearDate = new Date();
      nextYearDate.setFullYear(nextYearDate.getFullYear() + 1);
      adData.endDate = nextYearDate;

      const { data } = await axios.post(
        `/api/ads`,
        adData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(t("success"));
      dispatch(addAds(data.ad));
      setTimeout(() => window.location.reload(), 500);
      reset();
      handleClose();
    } catch (err: any) {
      setLoading(false);
      console.error(err);
      toast.error(err?.response?.data?.message || "There is an Error");
    } finally {
      URL.revokeObjectURL(image ?? "");
      setLoading(false);
    }
  });
  const handleUpdate = handleSubmit(async (formData) => {
    try {
      setLoading(true);
      let adData = { ...formData };
      delete adData.imageFile;
      const userTypes = [];
      delete adData.basic;
      delete adData.basicStart;
      delete adData.basicEnd;

      delete adData.standard;
      delete adData.standardStart;
      delete adData.standardEnd;

      delete adData.VIP;
      delete adData.VIPStart;
      delete adData.VIPEnd;

      if (formData.basic) {
        userTypes.push({
          name: "Basic",
          startDate: formData.basicStart,
          endDate: formData.basicEnd,
        });
      }
      if (formData.standard) {
        userTypes.push({
          name: "Standard",
          startDate: formData.standardStart,
          endDate: formData.standardEnd,
        });
      }
      if (formData.VIP) {
        userTypes.push({
          name: "VIP",
          startDate: formData.VIPStart,
          endDate: formData.VIPEnd,
        });
      }
      adData.userTypes = JSON.stringify(userTypes);
      adData.budget = 10;
      adData.priority = 1;
      adData.timing = 2;
      adData.startDate = new Date();
      const nextYearDate = new Date();
      nextYearDate.setFullYear(nextYearDate.getFullYear() + 1);
      adData.endDate = nextYearDate;
      if (formData.imageFile[0]) {
        adData.imageUrl = formData.imageFile[0];
      }
      const { data } = await axios.put(
        `/api/ads/${ad?.id}`,
        adData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(t("successUpdate"));
      dispatch(updateAds(data.ad));
      reset();
      handleClose();
    } catch (err: any) {
      setLoading(false);
      console.error("Submit Error:", err);
      toast.error(err.message);
    } finally {
      URL.revokeObjectURL(image ?? "");
      setLoading(false);
    }
  });

  const fetchBrand = async ({
    search,
    page,
    limit,
  }: {
    search: string;
    page: number;
    limit: number;
  }) => {
    try {
      const { data } = await axios.get("/api/brand", {
        params: {
          sort: "-purchaseCount",
          limit,
          keyword: search,
          page,
        },
      });

      return {
        data: data.brands,
        totalPages: data.totalPages,
      };
    } catch (error) {
      console.error("Error fetching brands:", error);
      return { data: [], totalPages: 0 };
    }
  };
  return (
    <div className="rounded-xl w-[calc(100vw-42px)]  md:w-full border p-6 ">
      <h3 className="text-2xl font-bold mb-6">{t("adInfo")}</h3>
      <form
        className="grid grid-cols-[1fr_2fr] gap-x-14"
        onSubmit={ad ? handleUpdate : onSubmit}
      >
        <div className="flex flex-col gap-3">
          <UserInput
            errors={errors}
            roles={{ value: ad?.title, required: t("titleRequired") }}
            fieldForm="title"
            register={register}
            label={t("title")}
            defaultValue={ad?.title}
          />

          <div className="grid items-center grid-cols-[1fr_2.5fr] w-full h-min relative">
            <label className="text-nowrap" htmlFor="description">
              {t("description")}:
            </label>
            <textarea
              defaultValue={ad?.description}
              {...register("description", {
                value: ad?.description,
              })}
              id="description"
              className={clsx(
                "border-2 border-[#DADADA] p-2 rounded-xl bg-transparent shadow-[0px_0px_5px_-1px_#00000040] outline-none",
                "hover:border-primary focus:border-primary",
                "transition-colors duration-200 ease-in-out"
              )}
            ></textarea>
            <ErrorMsg message={errors?.description?.message as string} />
          </div>

          <FetchSelect<Brand>
            fieldForm="brandId"
            label={t("brand")}
            placeholder={""}
            fetchFunction={fetchBrand}
            getOptionLabel={(brand) => brand.name}
            getOptionValue={(brand) => brand.id}
            defaultValue={ad?.brand ?? null}
            roles={{ required: t("brandIsRequired") }}
            register={register}
            setValue={setValue}
            errors={errors}
          />

          <CustomSelect
            roles={{ value: ad?.status, required: t("statusRequired") }}
            errors={errors}
            fieldForm="status"
            label={t("status")}
            register={register}
            defaultValue={ad?.status}
            options={[
              { value: "Active", label: t("active") },
              { value: "Inactive", label: t("blocked") },
            ]}
          />
        </div>
        <div className="flex flex-col gap-3">
          <div className="">
            <AddImageInput
              register={register}
              text={t("addImage")}
              imagePreview={image}
              setImagePreview={setImage}
              required={!ad}
            />
            <ErrorMsg message={errors?.imageFile?.message as string} />
          </div>
          <UserInput
            fieldForm="targetUrl"
            register={register}
            roles={{ value: ad?.targetUrl, required: t("targetUrlRequired") }}
            defaultValue={ad?.targetUrl}
            errors={errors}
            label={t("targetUrl")}
          />

          <CustomSelect
            errors={errors}
            fieldForm="adType"
            label={t("adType")}
            register={register}
            roles={{ value: ad?.adType, required: t("adTypeRequired") }}
            defaultValue={ad?.adType}
            options={Object.values(AdsType).map((type) => ({
              value: type,
              label: t(type),
            }))}
          />
          <div className="flex pl-2 gap-3 items-center w-full">
            <CircleAlert className="text-white bg-primary rounded-full size-5 " />
            <CustomSelect
              errors={errors}
              fieldForm="priority"
              label={t("priority")}
              register={register}
              roles={{ value: ad?.priority, required: t("priorityRequired") }}
              defaultValue={ad?.priority}
              options={Array.from({ length: 10 }, (_, index) => ({
                value: index + 1,
                label: index + 1,
              }))}
            />
          </div>
          <h5>{t("appearToUser")}</h5>
          <div className="grid grid-cols-[0.5fr_1fr_1fr] gap-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                className="accent-primary"
                id="basic"
                {...register("basic", {
                  value: !!BasicType,
                })}
              />
              <label htmlFor="basic"> {t("basic")} </label>
            </div>
            {(watch("basic") || BasicType) && (
              <>
                <CustomDatePicker
                  errors={errors}
                  rules={{
                    value: BasicType?.startDate,
                    required: watch("basic") ? t("startDateRequired") : false,
                  }}
                  setValue={setValue}
                  control={control}
                  defaultValue={
                    BasicType?.startDate ? new Date(BasicType.startDate) : null
                  }
                  label={t("startDate")}
                  fieldForm="basicStart"
                  className="w-full p-1 text-xs ml-auto border-1"
                />
                <CustomDatePicker
                  errors={errors}
                  rules={{
                    value: BasicType?.endDate,
                    required: watch("basic") ? t("endDateRequired") : false,
                  }}
                  setValue={setValue}
                  control={control}
                  defaultValue={
                    BasicType?.endDate ? new Date(BasicType.endDate) : null
                  }
                  label={t("endDate")}
                  fieldForm="basicEnd"
                  className="w-full p-1 text-xs ml-auto border-1"
                />
              </>
            )}
          </div>
          <div className="grid grid-cols-[0.5fr_1fr_1fr] gap-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                className="accent-primary"
                id="standard"
                {...register("standard", {
                  value: !!StandardType,
                })}
              />
              <label htmlFor="standard">{t("standard")}</label>
            </div>

            {(watch("standard") || StandardType) && (
              <>
                <CustomDatePicker
                  errors={errors}
                  control={control}
                  setValue={setValue}
                  rules={{
                    value: StandardType?.startDate,
                    required: watch("standard")
                      ? t("startDateRequired")
                      : false,
                  }}
                  defaultValue={
                    StandardType?.startDate
                      ? new Date(StandardType.startDate)
                      : null
                  }
                  label={t("startDate")}
                  fieldForm="standardStart"
                  className="w-full p-1 text-xs ml-auto border-1"
                />
                <CustomDatePicker
                  errors={errors}
                  rules={{
                    value: StandardType?.endDate,
                    required: watch("standard") ? t("endDateRequired") : false,
                  }}
                  defaultValue={
                    StandardType?.endDate
                      ? new Date(StandardType.endDate)
                      : null
                  }
                  setValue={setValue}
                  control={control}
                  label={t("endDate")}
                  fieldForm="standardEnd"
                  className="w-full p-1 text-xs ml-auto border-1"
                />
              </>
            )}
          </div>
          <div className="grid grid-cols-[0.5fr_1fr_1fr] gap-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                className="accent-primary"
                id="vip"
                {...register("VIP", {
                  value: !!VIPType,
                })}
              />
              <label htmlFor="vip"> {t("vip")} </label>
            </div>
            {(watch("VIP") || VIPType) && (
              <>
                <CustomDatePicker
                  errors={errors}
                  control={control}
                  setValue={setValue}
                  rules={{
                    value: VIPType?.startDate,
                    required: watch("VIP") ? t("startDateRequired") : false,
                  }}
                  defaultValue={
                    VIPType?.startDate ? new Date(VIPType.startDate) : null
                  }
                  label={t("startDate")}
                  fieldForm="VIPStart"
                  className="w-full p-1 text-xs ml-auto border-1"
                />
                <CustomDatePicker
                  errors={errors}
                  control={control}
                  setValue={setValue}
                  rules={{
                    value: VIPType?.endDate,
                    required: watch("VIP") ? t("endDateRequired") : false,
                  }}
                  defaultValue={
                    VIPType?.endDate ? new Date(VIPType.endDate) : null
                  }
                  label={t("endDate")}
                  fieldForm="VIPEnd"
                  className="w-full p-1 text-xs ml-auto border-1"
                />
              </>
            )}
          </div>
          <div className="grid grid-cols-2 gap-10">
            <button
              disabled={loading}
              className="py-2 px-12 rounded-3xl bg-primary text-white flex justify-center"
            >
              {loading && (
                <LoadingIcon className="w-6 h-6 animate-spin hover:stroke-white" />
              )}
              {!loading && (ad ? t("edit") : t("add"))}
            </button>
            <button
              className="py-2 px-12 rounded-3xl border border-[#E9E9E9]"
              type="reset"
              onClick={() => {
                reset();
                handleClose();
              }}
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddAds;
