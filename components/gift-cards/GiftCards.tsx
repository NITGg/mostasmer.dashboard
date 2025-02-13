"use client";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { LoadingIcon } from "../icons";
import axios from "axios";
import toast from "react-hot-toast";
import { useAppContext } from "@/context/appContext";
import { GiftCard } from "@/redux/reducers/giftCardsReducers";
import Table from "../ui/Table";

const GiftCards = ({
  giftCards,
  count,
  loading,
}: {
  giftCards: GiftCard[];
  count: number;
  loading: boolean;
}) => {
  console.log(giftCards);

  const t = useTranslations("giftCards");
  const { token } = useAppContext();
  const [pending, setPending] = useState<boolean>(false);
  const [openCard, setOpenCard] = useState<boolean>(false);
  const [gift, setGift] = useState<GiftCard | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const headers = [
    { name: "sender" },
    { name: "received" },
    { name: "cardValue" },
    { name: "cardValueInSr" },
    { name: "used" },
    { name: "action" },
    { name: "status" },
  ];

  const resendGift = async () => {
    try {
      setPending(true);
      if (!gift) return;
      const data = {
        name: gift.userFrom.fullname,
        phone: gift.userFrom.phone,
        point: gift.point,
        message: gift.message,
      };
      await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/gift`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(t("giftResendSuccessfully"));
      setOpenCard(false);
      setGift(null);
    } catch (error: any) {
      toast.error(t("errorResendGift"));
      setOpenCard(false);
      setGift(null);
      console.error(error);
      toast.error(error?.response?.data?.message || "There is an Error");
    } finally {
      setPending(false);
    }
  };
  return (
    <>
      <Table
        data={giftCards}
        count={giftCards.length}
        loading={loading}
        showDateFilter={false}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page)}
        onPageSizeChange={(size) => setPageSize(size)}
        headers={headers}
      >
        {giftCards?.map((card) => (
          <tr key={card.id} className="odd:bg-white even:bg-[#F0F2F5] border-b">
            <td scope="row" className="px-6 py-4 text-primary">
              {card.userFrom.fullname}
            </td>
            <td className="px-6 py-4 whitespace-nowrap  text-primary">
              {card.userTo?.fullname ?? "null"}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {card.point + " " + t("points")}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {card.paymentamount ?? card.point * 0.1}
              {" " + t("sr")}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {card.expird ? "true" : "false"}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <button
                type="button"
                onClick={() => {
                  setOpenCard(true);
                  setGift(card);
                }}
                className="text-primary"
              >
                {t("view")}
              </button>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {card.expird ? t("active") : t("notActive")}
            </td>
          </tr>
        ))}
      </Table>

      <Dialog open={openCard} onOpenChange={setOpenCard}>
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
              className="py-3 w-1/3 rounded-3xl text-sm bg-primary text-white"
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
    </>
  );
};

export default GiftCards;
