"use client";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { GiftCard, setGiftCards } from "@/redux/reducers/giftCardsReducers";
import Table, { TableHeader } from "../ui/Table";
import Pagination from "../ui/Pagination";
import DownloadButton from "../ui/DownloadButton";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import GiftCardDialog from "./GiftCardDialog";

const GiftCards = ({
  giftCards,
  count,
  totalPages,
}: {
  giftCards: GiftCard[];
  count: number;
  totalPages: number;
}) => {
  const t = useTranslations("giftCards");
  const [openCard, setOpenCard] = useState<boolean>(false);
  const [gift, setGift] = useState<GiftCard | null>(null);
  const giftCardsRedux = useAppSelector((s) => s.giftCards.giftCards);
  const dispatch = useAppDispatch();

  const headers: TableHeader[] = [
    { name: "sender" },
    { name: "received" },
    { name: "cardValue", sortable: true, key: "point" },
    { name: "cardValueInSr", sortable: true, key: "paymentamount" },
    { name: "used" },
    { name: "action" },
    { name: "status" },
  ];

  useEffect(() => {
    dispatch(setGiftCards(giftCards));
  }, [giftCards]);

  return (
    <>
      {gift && (
        <GiftCardDialog
          open={openCard}
          onOpenChange={() => {
            setOpenCard(false);
            setGift(null);
          }}
          gift={gift}
        />
      )}
      <Table
        headers={headers}
        pagination={
          <Pagination
            count={count}
            totalPages={totalPages}
            downloadButton={
              <DownloadButton<GiftCard>
                fields={[
                  "id",
                  "point",
                  "validTo",
                  "type",
                  "userFrom",
                  "userTo",
                ]}
                include={{
                  userFrom: { select: { name: true } },
                  userTo: { select: { name: true } },
                }}
                model="giftCard"
              />
            }
          />
        }
      >
        {!giftCardsRedux.length && (
          <tr className="odd:bg-white even:bg-primary/5 border-b">
            <td
              colSpan={headers.length}
              scope="row"
              className="px-6 py-4 text-center font-bold"
            >
              {t("no data yat")}
            </td>
          </tr>
        )}
        {giftCardsRedux?.map((card) => (
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
    </>
  );
};

export default GiftCards;
