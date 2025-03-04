"use client";
import { UserNotification } from "@/app/[locale]/users/[id]/UserNotificationsData";
import { EditIcon } from "@/components/icons";
import DownloadButton from "@/components/ui/DownloadButton";
import Pagination from "@/components/ui/Pagination";
import Table, { TableHeader } from "@/components/ui/Table";
import { DateToText } from "@/lib/DateToText";
import { useTranslations } from "next-intl";
import React from "react";

const UserNotifications = ({
  userNotifications,
  totalUserNotifications,
  totalPages,
}: {
  userNotifications: UserNotification[];
  totalUserNotifications: number;
  totalPages: number;
}) => {
  const t = useTranslations("Tablecomponent");

  const headers: TableHeader[] = [
    { name: "createdAt", sortable: true, key: "createdAt" },
    { name: "brandName" },
    { name: "action", className: "text-center" },
  ];
  return (
    <Table
      headers={headers}
      bgColor
      pagination={
        <Pagination
          bgColor
          count={totalUserNotifications}
          totalPages={totalPages}
          downloadButton={
            <DownloadButton<UserNotification>
              model="order"
              fields={["id", "brand", "createdAt", "totalPrice", "user"]}
              filters={{ userId: userNotifications[0].userId }}
              include={{
                brand: { select: { name: true } },
                user: { select: { fullname: true } },
              }}
            />
          }
        />
      }
    >
      {!userNotifications.length && (
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
      {userNotifications?.map((notification: UserNotification) => (
        <tr
          key={notification.id}
          className={"odd:bg-white even:bg-[#F0F2F5]  border-b"}
        >
          <td className="px-6 py-4 whitespace-nowrap">
            {DateToText(notification.createdAt)}
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            {notification.brand.name}
          </td>
          <td className="px-6 py-4">
            <div className="flex gap-2 items-center">
              <button
                type="button"
                className="text-primary hover:text-gray-700 transition-colors"
              >
                <EditIcon className="size-4" />
              </button>
            </div>
          </td>
        </tr>
      ))}
    </Table>
  );
};

export default UserNotifications;
