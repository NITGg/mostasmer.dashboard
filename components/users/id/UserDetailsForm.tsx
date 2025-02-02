import React, { useState } from "react";
import CustomSelect from "../CustomSelect";
import UserInput from "../UserInput";
import { useTranslations } from "next-intl";
import {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
  FieldValues,
  Control,
} from "react-hook-form";
import { User } from "@/redux/reducers/usersReducer";
import CustomDatePicker from "@/components/CustomDatePicker";
import { ShowPassword } from "../AddUserForm";

const UserDetailsForm = ({
  user,
  register,
  errors,
  setValue,
  control,
  handleFieldClick,
}: {
  user: User;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  control: Control<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
  handleFieldClick: () => void;
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const t = useTranslations("user");
  return (
    <div className="space-y-5">
      <UserInput
        roles={{
          value: user.fullname,
          minLength: { value: 2, message: t("fullNameMinLength") },
          maxLength: { value: 50, message: t("fullNameMaxLength") },
        }}
        errors={errors}
        onClick={handleFieldClick}
        defaultValue={user.fullname}
        fieldForm="fullname"
        register={register}
        label={t("fullName")}
      />
      <CustomSelect
        roles={{ value: user.gender }}
        defaultValue={user.gender}
        errors={errors}
        label={t("gender")}
        fieldForm="gender"
        register={register}
        onClick={handleFieldClick}
        options={[
          { value: "MALE", label: t("male") },
          { value: "FEMALE", label: t("female") },
        ]}
      />
      <div onClick={handleFieldClick}>
        <CustomDatePicker
          setValue={setValue}
          errors={errors}
          label={t("birthday")}
          fieldForm="birthDate"
          control={control}
          defaultValue={new Date(user.birthDate ?? "")}
        />
      </div>

      <UserInput
        roles={{ value: user.email }}
        errors={errors}
        onClick={handleFieldClick}
        defaultValue={user.email}
        fieldForm="email"
        register={register}
        label={t("email")}
        disabled={true}
      />

      <UserInput
        roles={{ value: user.phone }}
        errors={errors}
        onClick={handleFieldClick}
        defaultValue={user.phone}
        fieldForm="phone"
        register={register}
        label={t("phone")}
        disabled={true}
      />

      <UserInput
        roles={{ minLength: { value: 6, message: t("passwordError") } }}
        errors={errors}
        onClick={handleFieldClick}
        register={register}
        label={t("password")}
        fieldForm="password"
        type={showPassword ? "text" : "password"}
        icon={
          <ShowPassword
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />
        }
      />

      <CustomSelect
        key={"isActive"}
        roles={{ value: String(user.isActive) }}
        errors={errors}
        label={t("status")}
        defaultValue={String(user.isActive)}
        fieldForm="isActive"
        register={register}
        onClick={handleFieldClick}
        options={[
          { value: "true", label: t("active") },
          { value: "false", label: t("blocked") },
        ]}
      />

      <CustomSelect
        key={"lang"}
        roles={{ value: user.lang }}
        errors={errors}
        label={t("language")}
        defaultValue={user.lang}
        fieldForm="lang"
        register={register}
        onClick={handleFieldClick}
        options={[
          { value: "ar", label: "عربي" },
          { value: "en", label: "English" },
        ]}
      />

      <CustomSelect
        key={"isConfirmed"}
        roles={{ value: String(user.isConfirmed) }}
        errors={errors}
        label={t("confirmed")}
        defaultValue={String(user.isConfirmed)}
        fieldForm="isConfirmed"
        register={register}
        onClick={handleFieldClick}
        options={[
          { value: "true", label: t("true") },
          { value: "false", label: t("false") },
        ]}
      />
    </div>
  );
};

export default UserDetailsForm;
