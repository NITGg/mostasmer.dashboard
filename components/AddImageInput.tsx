import React from "react";
import Image from "next/image";
import { Cross, Edit } from "lucide-react";
import { UseFormRegister } from "react-hook-form";

type AddImageInputProps = {
  register: UseFormRegister<any>;
  required?: boolean;
  text: string;
  imagePreview: string | null;
  setImagePreview: (value: string | null) => void;
};

const AddImageInput: React.FC<AddImageInputProps> = ({
  register,
  text,
  imagePreview,
  required = false,
  setImagePreview,
}) => {
  return (
    <div className="size-36 border-[#E9E9E9] rounded-md border">
      <input
        type="file"
        accept="image/*"
        id="image-upload"
        {...register("imageFile", {
          onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (file) {
              setImagePreview(URL.createObjectURL(file));
            }
          },
          required,
        })}
        className="hidden"
      />
      {!imagePreview ? (
        <label
          htmlFor="image-upload"
          className="flex flex-col gap-2 justify-center items-center cursor-pointer h-full w-full"
        >
          <span className="size-10 bg-[#2ab09c] rounded-full grid place-content-center">
            <Cross color="white" fill="white" className="size-5" />
          </span>
          <span>{text}</span>
        </label>
      ) : (
        <div className="w-full h-full grid place-content-center relative">
          <Image
            src={imagePreview}
            alt="Uploaded Image"
            fill
            className="object-cover rounded-md"
          />
          <label
            htmlFor="image-upload"
            className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md cursor-pointer"
          >
            <Edit className="text-primary size-5" />
          </label>
        </div>
      )}
    </div>
  );
};

export default AddImageInput;
