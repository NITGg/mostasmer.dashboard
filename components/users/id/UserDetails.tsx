"use client";
import clsx from "clsx";
import { useLocale, useTranslations } from "next-intl";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useAppContext } from "@/context/appContext";
import { DateToText } from "@/lib/DateToText";
import Link from "next/link";
import { sliceText } from "@/lib/sliceText";
import toast from "react-hot-toast";
import UserBadge from "./UserBadge";
import UserTypeAndPoints from "./UserTypeAndPoints";
import UserDetailsForm from "./UserDetailsForm";
import { LoadingIcon } from "@/components/icons";
import { useRouter } from "next/navigation";
import { Role, updateUser, User } from "@/redux/reducers/usersReducer";
import { useAppDispatch } from "@/hooks/redux";
import MultipleSelect from "../../MultipleSelect";
import { Brand } from "../BrandSelect";
import { fetchBrands, fetchRoles } from "../AddUserForm";
import { UserType } from "@/redux/reducers/badgesReducer";

type Wallet = {
  id: number;
  point: number;
  userId: string;
  checkAt: string;
  buyerAmount: number;
  createdAt: string;
  updatedAt: string;
};

type NextType = UserType;

export type TypeUser = {
  wallet: Wallet;
  userType: UserType;
  nextType: NextType;
};

type HistoryEntry = {
  id: number;
  walletId: number;
  point: number;
  paymentamount: number | null;
  brandId: number;
  status: boolean;
  brandAmount: number;
  type: "PAYMENT" | "GIFT" | "RECHARGE";
  validTo: string | null;
  invoice: string | null;
  mostasmer: number;
  user: number | null;
  createdAt: string;
  updatedAt: string;
};

type Transaction = {
  payment: number;
  gift: number;
  recharge: number;
  total: number;
};

export type WalletData = {
  history: HistoryEntry[];
  transaction: Transaction;
};

const UserDetails = ({
  user,
  type,
  walletHistory,
  searchParams,
}: {
  user: User;
  type?: TypeUser;
  walletHistory?: WalletData;
  searchParams?: any;
}) => {
  const t = useTranslations("user");
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    resetField,
  } = useForm();
  const local = useLocale();
  const [isEditable, setIsEditable] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token } = useAppContext();
  const dispatch = useAppDispatch();
  const [image, setImage] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const router = useRouter();
  const onSubmit = handleSubmit(async (formData) => {
    try {
      setLoading(true);
      let userData = { ...formData };
      delete userData.password;
      delete userData.phone;
      delete userData.email;
      delete userData.imageFile;

      if (!selectedRoles.includes("brand representative"))
        delete userData.brands;

      if (formData.imageFile[0]) {
        userData.imageUrl = formData.imageFile[0];
      }

      if (formData.password) {
        userData.password = formData.password;
      }

      const { data } = await axios.put(
        `/api/user/${user.id}`,
        { ...userData },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(updateUser(data.user));

      setIsEditable(false);
      toast.success("Successfully Updated!!!");
      URL.revokeObjectURL(image);
      setImage("");
      resetField("imageFile");
      router.push(`/${local}/users`);
      setTimeout(() => window.location.reload(), 500);
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.message || "There is an Error");
    } finally {
      setLoading(false);
    }
  });

  const handleFieldClick = () => {
    setIsEditable(true);
  };

  return (
    <div className="p-container">
      <div className="space-y-10 bg-white p-3 md:p-5 rounded-lg">
        <form
          onSubmit={onSubmit}
          className="grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] gap-7"
        >
          <div className="flex flex-col gap-3">
            <UserBadge
              user={user}
              userType={type?.userType.userType ?? ""}
              handleFieldClick={handleFieldClick}
              image={image}
              setImage={setImage}
              register={register}
            />
            {type && walletHistory ? (
              <UserTypeAndPoints
                uid={user?.id}
                type={type}
                walletHistory={walletHistory}
              />
            ) : (
              <h2 className="text-lg font-bold">{user?.roles[0].name}</h2>
            )}
            <div onClick={handleFieldClick}>
              <MultipleSelect<Role>
                fieldForm="roles"
                label={t("role")}
                placeholder={""}
                fetchFunction={(params) => fetchRoles({ ...params, token })}
                getOptionLabel={(role) => role.name}
                getOptionValue={(role) => role.name}
                roles={{ required: t("roleRequired") }}
                defaultValues={user.roles}
                register={register}
                setValue={setValue}
                errors={errors}
                onChange={(selectedOptions) => {
                  const selectedRoleNames = selectedOptions.map(
                    (role) => role.name
                  );
                  setSelectedRoles(selectedRoleNames);
                }}
              />
            </div>
            {selectedRoles.includes("brand representative") && (
              <div onClick={handleFieldClick}>
                <MultipleSelect<Brand>
                  fieldForm="brands"
                  label={t("brands")}
                  placeholder={""}
                  fetchFunction={(params) => fetchBrands({ ...params, token })}
                  getOptionLabel={(brand) => brand.name}
                  getOptionValue={(brand) => brand.id}
                  defaultValues={
                    user.BrandRepresentative?.map(
                      (brandRep) => brandRep.brand
                    ) ?? undefined
                  }
                  roles={{
                    required: selectedRoles.includes("brand representative")
                      ? t("brandRequired")
                      : false,
                  }}
                  register={register}
                  setValue={setValue}
                  errors={errors}
                />
              </div>
            )}
          </div>
          <div className="w-full contents">
            <div>
              <UserDetailsForm
                control={control}
                errors={errors}
                user={user}
                register={register}
                setValue={setValue}
                handleFieldClick={handleFieldClick}
              />
            </div>
            <div className="flex flex-col ">
              <div className="bg-[#F0F2F5] p-5 rounded-xl space-y-5">
                <div className="flex justify-between flex-wrap items-center">
                  <p className={clsx("font-medium text-sm text-left")}>
                    CreatedAt:
                  </p>
                  <div className="text-sm text-nowrap">
                    {DateToText(user?.createdAt ? user?.createdAt : "")}
                  </div>
                </div>
                <div className="flex justify-between flex-wrap items-center">
                  <p className={clsx("font-medium text-sm text-left")}>
                    UpdatedAt:
                  </p>
                  <div className="text-sm text-nowrap">
                    {DateToText(user?.updatedAt ? user?.updatedAt : "")}
                  </div>
                </div>
                <div className="flex justify-between flex-wrap items-center">
                  <p className={clsx("font-medium text-sm text-left")}>
                    PasswordLastUpdated:
                  </p>
                  <div className="text-sm text-nowrap">
                    {DateToText(
                      user?.passwordLastUpdated ? user?.passwordLastUpdated : ""
                    )}
                  </div>
                </div>
                <div className="flex justify-between flex-wrap items-center">
                  <p className={clsx("font-medium text-sm text-left")}>
                    LastLoginAt:
                  </p>
                  <div className="text-sm text-nowrap">
                    {DateToText(user?.lastLoginAt ? user?.lastLoginAt : "")}
                  </div>
                </div>
                <div className="flex justify-between flex-wrap items-center">
                  <p className={clsx("font-medium text-sm text-left")}>uuid:</p>
                  {/* <div>{user.uuid}</div> */}
                </div>
                {!user?.Address?.length ? (
                  " "
                ) : (
                  <div>
                    <h5>Addresses: </h5>
                    <ul>
                      {user.Address.map((address: any, i: any) => (
                        <li key={address.id}>
                          <span>{i + 1} - </span>
                          <Link
                            className="hover:text-red-500 duration-500"
                            href={`https://www.google.com/maps?q=${address.lat},${address.long}`}
                            target="_blank"
                          >
                            {sliceText(address.address, 40)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="flex gap-1 justify-center w-full mt-auto max-md:mt-5">
                {isEditable && (
                  <>
                    <button
                      type="submit"
                      className="py-2  w-1/2 rounded-2xl text-sm bg-primary text-white"
                    >
                      {loading ? (
                        <LoadingIcon className="w-6 h-6 animate-spin m-auto hover:stroke-white" />
                      ) : (
                        t("updateProfile")
                      )}
                    </button>
                    <button
                      type="reset"
                      onClick={() => setIsEditable(false)}
                      className="py-2  w-1/2 rounded-2xl border-black border text-sm text-black"
                    >
                      {t("cancel")}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserDetails;
