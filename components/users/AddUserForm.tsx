import React, { useState } from "react";
import UserInput from "./UserInput";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import CustomSelect from "./CustomSelect";
import { Eye, EyeOff, MapPin } from "lucide-react";
import CustomDatePicker from "../CustomDatePicker";
import BrandSelect, { Brand } from "./BrandSelect";
import { LoadingIcon } from "../icons";
import axios from "axios";
import { useAppContext } from "@/context/appContext";
import toast from "react-hot-toast";
import AddImageInput from "../AddImageInput";
import { useAppDispatch } from "@/hooks/redux";
import { addUser } from "@/redux/reducers/usersReducer";

export const ShowPassword: React.FC<{
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ showPassword, setShowPassword }) => (
  <button type="button" onClick={() => setShowPassword((prev) => !prev)}>
    {showPassword ? <Eye /> : <EyeOff />}
  </button>
);

const AddUserForm = ({ handelClose }: { handelClose: () => void }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
    setError,
  } = useForm();
  const t = useTranslations("user");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("customer");
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { token } = useAppContext();
  const dispatch = useAppDispatch();

  const onSubmit = handleSubmit(async (fData) => {
    try {
      setLoading(true);
      const filteredData = new FormData();

      Object.entries(fData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "" && value[0]) {
          filteredData.append(key, value);
        }
      });
      if (fData.birthDate)
        filteredData.append("birthDate", fData.birthDate.toISOString());

      if (fData.imageFile[0]) {
        filteredData.append("imageUrl", fData.imageFile[0]);
      }

      if (selectedRole === "representative" && selectedBrand) {
        filteredData.append("brand", selectedBrand.id.toString());
      }

      const { data } = await axios.post(
        "/api/user",
        filteredData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      dispatch(addUser(data.user));
      toast.success("User added successfully");
      reset();
      handelClose();
    } catch (error: any) {
      if (
        error?.response?.data?.message === "This phone number is already used"
      ) {
        setError("phone", {
          type: "manual",
          message: t("phoneAlreadyInUse"),
        });
      }
      if (
        error?.response?.data?.message === "This email address is already used"
      ) {
        setError("email", {
          type: "manual",
          message: t("emailAlreadyInUse"),
        });
      }

      console.error(error);
      toast.error(error?.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  });

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold mb-6">{t("addInfo")}</h3>

      <form onSubmit={onSubmit} className="grid grid-cols-[1fr_2fr] gap-x-14 ">
        <div className="flex flex-col gap-3">
          <UserInput
            roles={{
              required: t("fullNameRequired"),
              minLength: { value: 2, message: t("fullNameMinLength") },
              maxLength: { value: 50, message: t("fullNameMaxLength") },
            }}
            errors={errors}
            register={register}
            label={t("fullName")}
            fieldForm="fullname"
            type="text"
          />
          <UserInput
            roles={{ required: false }}
            errors={errors}
            register={register}
            label={t("email")}
            fieldForm="email"
            type="email"
          />
          <UserInput
            roles={{
              required: t("phoneRequired"),
              pattern: {
                value: /^\+20\d{10}$|^\+966\d{9}$/,
                message: t("phoneInvalid"),
              },
            }}
            errors={errors}
            register={register}
            label={t("phone")}
            fieldForm="phone"
            type="tel"
          />

          <CustomSelect
            roles={{ required: false }}
            errors={errors}
            label={t("gender")}
            fieldForm="gender"
            register={register}
            options={[
              { value: "MALE", label: t("male") },
              { value: "FEMALE", label: t("female") },
            ]}
          />
          <CustomDatePicker
            control={control}
            setValue={setValue}
            rules={{ required: false }}
            errors={errors}
            label={t("birthday")}
            fieldForm="birthDate"
          />
          <CustomSelect
            roles={{ required: false, value: "true" }}
            errors={errors}
            label={t("status")}
            fieldForm="isActive"
            register={register}
            options={[
              { value: "true", label: t("active") },
              { value: "false", label: t("blocked") },
            ]}
          />
          <CustomSelect
            roles={{ required: false, value: "true" }}
            errors={errors}
            label={t("confirmed")}
            fieldForm="isConfirmed"
            register={register}
            options={[
              { value: "true", label: t("true") },
              { value: "false", label: t("false") },
            ]}
          />
          <CustomSelect
            roles={{ required: false }}
            errors={errors}
            label={t("language")}
            fieldForm="lang"
            register={register}
            options={[
              { value: "ar", label: "عربي" },
              { value: "en", label: "English" },
            ]}
          />
          <CustomSelect
            roles={{ required: false }}
            errors={errors}
            label={t("role")}
            fieldForm="role"
            register={register}
            options={[
              { value: "customer", label: t("customer") },
              { value: "representative", label: t("representative") },
              { value: "admin", label: t("admin") },
            ]}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setSelectedRole(e.target.value)
            }
          />
        </div>
        <div className="flex flex-col gap-5">
          <AddImageInput
            register={register}
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
            text={t("userPicture")}
          />
          <UserInput
            roles={{ required: false }}
            errors={errors}
            register={register}
            label={t("address")}
            fieldForm="address"
            type={"text"}
            icon={<MapPin className="text-[#FFC106]" />}
          />
          <UserInput
            roles={{
              required: t("passwordRequired"),
              minLength: { value: 6, message: t("passwordError") },
            }}
            errors={errors}
            register={register}
            label={t("password")}
            fieldForm="password"
            type={showPassword ? "text" : "password"}
            icon={
              <ShowPassword
                key={"showPassword"}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              />
            }
          />

          {selectedRole === "representative" && (
            <>
              <BrandSelect onSelect={(brand) => setSelectedBrand(brand)} />
              <div className="grid grid-cols-2 items-center gap-3">
                <CustomDatePicker
                  errors={errors}
                  control={control}
                  setValue={setValue}
                  label={t("validFrom")}
                  fieldForm="validFrom"
                />
                <CustomDatePicker
                  errors={errors}
                  control={control}
                  setValue={setValue}
                  label={t("validTo")}
                  fieldForm="validTo"
                />
              </div>
            </>
          )}
          <div className="grid grid-cols-2 gap-10">
            <button
              disabled={loading}
              className="py-2 px-12 rounded-3xl bg-primary text-white flex justify-center"
            >
              {loading ? (
                <LoadingIcon className="w-6 h-6 animate-spin m-auto hover:stroke-white" />
              ) : (
                t("add")
              )}
            </button>
            <button
              className="py-2 px-12 rounded-3xl border border-[#E9E9E9]"
              type="reset"
              onClick={() => {
                reset();
                handelClose();
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

export default AddUserForm;
