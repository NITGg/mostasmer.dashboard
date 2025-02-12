"use client";
import FetchSelect from "@/components/FetchSelect";
import { LoadingIcon } from "@/components/icons";
import { Brand } from "@/components/users/BrandSelect";
import UserInput from "@/components/users/UserInput";
import { useAppContext } from "@/context/appContext";
import axios from "axios";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const Page = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [brand, setBrand] = useState<Brand | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const t = useTranslations("payment");
  const { token } = useAppContext();

  const handlePayment = handleSubmit(async (formData) => {
    if (!brand) return;

    try {
      setLoading(true);
      const { data } = await axios.get(`/api/brand/tokens/${brand.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const brandToken = data.token;

      const response = await axios.post(
        `/api/redirect-payment`,
        {
          amount: +formData.amount,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${brandToken}`,
          },
        }
      );
      const result = response;

      if (result.data.redirectUrl) {
        window.open(result.data.redirectUrl, "_blank");
      }
    } catch (error: any) {
      console.error("Submit Error:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  });
  const fetchBrand = async ({
    search,
    skip,
    limit,
  }: {
    search: string;
    skip: number;
    limit: number;
  }) => {
    try {
      const queryParams = new URLSearchParams({
        sort: "name",
        limit: String(limit),
        keyword: search,
        skip: String(skip),
        fields: "id,name",
        status: "ACTIVE",
      });
      const { data } = await axios.get(
        `/api/brand?${queryParams.toString()}`,
        {}
      );

      console.log(data.brands[0]);

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
    <div className="p-container place-items-center">
      <form
        className="flex flex-col gap-5 items-center justify-center w-4/5 h-[80dvh]"
        onSubmit={handlePayment}
      >
        <FetchSelect<Brand>
          fieldForm="brandId"
          label={t("brand")}
          placeholder={""}
          fetchFunction={fetchBrand}
          getOptionLabel={(brand) => brand.name}
          getOptionValue={(brand) => brand.id}
          roles={{ required: t("brandIsRequired") }}
          register={register}
          setValue={setValue}
          errors={errors}
          onChange={(selectedOptions) => {
            if (selectedOptions.length > 0) {
              setBrand(selectedOptions[0]);
            } else {
              setBrand(null);
            }
          }}
        />
        <UserInput
          fieldForm="amount"
          label={t("totalAmount")}
          roles={{ required: t("amountIsRequired") }}
          register={register}
          errors={errors}
          type="number"
          min={0}
        />
        <button
          disabled={loading}
          className="py-1 px-12 rounded-3xl border-1 border-primary bg-primary text-white duration-200 flex justify-center"
        >
          {loading && (
            <LoadingIcon className="w-6 h-6 animate-spin hover:stroke-white" />
          )}
          {!loading && t("proceedToPayment")}
        </button>
      </form>
    </div>
  );
};

export default Page;
