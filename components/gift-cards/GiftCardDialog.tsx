"use client";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { LoadingIcon } from "../icons";
import { GiftCard } from "@/redux/reducers/giftCardsReducers";
import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";
import { useAppContext } from "@/context/appContext";

interface GiftCardDialogProps {
  open: boolean;
  onOpenChange: () => void;
  gift: GiftCard;
}

const GiftCardDialog = ({ open, onOpenChange, gift }: GiftCardDialogProps) => {
  const t = useTranslations("giftCards");
  const [pending, setPending] = useState<boolean>(false);
  const { token } = useAppContext();

  const resendGift = async () => {
    try {
      setPending(true);
      const data = {
        name: gift.userFrom.fullname,
        phone: gift.userFrom.phone,
        point: gift.point,
        message: gift.message,
      };
      await axios.post(`/api/gift`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(t("giftResendSuccessfully"));
    } catch (error: any) {
      toast.error(t("errorResendGift"));
      console.error(error);
      toast.error(error?.response?.data?.message || "There is an Error");
    } finally {
      setPending(false);
      onOpenChange();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("giftCardsDetails")}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex gap-4 flex-col items-center">
          <div className="flex gap-4 w-1/2 flex-col items-center ">
            <img
              alt="card"
              src={"/imgs/Untitled.svg"}
              style={{ objectFit: "contain", width: "100%" }}
            />
            <p className="-mt-12 text-xl tracking-wider ">
              {new Date(gift?.createdAt ?? "").getTime()}
            </p>
          </div>

          <button
            type="button"
            onClick={resendGift}
            className="p-2 w-1/3 rounded-3xl text-sm bg-primary text-white"
          >
            {pending ? (
              <LoadingIcon className="w-6 h-6 animate-spin m-auto hover:stroke-white" />
            ) : (
              t("resend")
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GiftCardDialog;
