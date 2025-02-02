"use client";
import ImageApi from "@/components/ImageApi";
import { User } from "@/redux/reducers/usersReducer";
import { Edit } from "lucide-react";
import { FieldValues, UseFormRegister } from "react-hook-form";

type userBadge = {
  user: User;
  userType: string;
  image: string;
  setImage: (image: string) => void;
  register: UseFormRegister<FieldValues>;
  handleFieldClick: () => void;
};

const UserBadge = ({
  user,
  userType,
  image,
  setImage,
  register,
  handleFieldClick,
}: userBadge) => {
  const userTypeColor = {
    Basic: "url(/imgs/basicImage.svg)",
    Standard: "url(/imgs/standardImage.svg)",
    VIP: "url(/imgs/vipImage.svg)",
  }[userType];

  const { fullname, email, phone, imageUrl } = user;
  return (
    <div
      style={{ background: userTypeColor ?? "#02161E" }}
      className="h-[200px] !bg-center !bg-cover !bg-no-repeat w-full border-1 rounded-xl flex justify-center items-center gap-1 flex-col"
    >
      <div className="relative rounded-full h-20">
        <input
          type="file"
          accept="image/*"
          {...register("imageFile", {
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              const file = e.target.files?.[0];
              if (file) {
                setImage(URL.createObjectURL(file));
              }
            },
          })}
          id="imageFile"
          className="hidden"
          onClick={handleFieldClick}
        />
        {image && (
          <ImageApi
            src={image}
            alt="user image"
            height={200}
            width={200}
            priority
            className="rounded-full size-full"
          />
        )}
        {!image && (
          <>
            <ImageApi
              src={imageUrl ?? "/imgs/avatar.png"}
              alt="user image"
              height={200}
              width={200}
              priority
              className="rounded-full size-full"
            />
            <label
              htmlFor="imageFile"
              className="absolute bottom-0 right-0 z-10 rounded bg-white text-black cursor-pointer"
            >
              <Edit className="size-6" />
            </label>
          </>
        )}
      </div>
      <h4 className="text-white">{fullname}</h4>
      <h5 className="text-xs font-light text-white">{email}</h5>
      <h6 className="text-xs font-light text-white">{phone}</h6>
    </div>
  );
};

export default UserBadge;
