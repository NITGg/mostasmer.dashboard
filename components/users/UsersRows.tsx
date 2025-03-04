"use client";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import ImageApi from "../ImageApi";
import {
  DeleteIcon,
  LoadingIcon,
  PluseCircelIcon,
  EyeIcon,
  Rstoreicon,
} from "@/components/icons";

import {
  deleteUser,
  setUsers,
  updateUser,
  User,
  setUsersCount,
} from "@/redux/reducers/usersReducer";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useAppContext } from "@/context/appContext";
import AddUserForm from "./AddUserForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import axios from "axios";
import Table, { TableHeader } from "@/components/ui/Table";
import clsx from "clsx";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import Pagination from "../ui/Pagination";
import { DateToText } from "@/lib/DateToText";
import DownloadButton from "../ui/DownloadButton";
import { UserRole } from "@/redux/reducers/userRolesReducer";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface RoleStats {
  name: string;
  count: number;
}

const UsersRows = ({
  users,
  count,
  totalPages,
  roleStats: initialRoleStats,
}: {
  users: User[];
  count: number;
  totalPages: number;
  roleStats?: RoleStats[];
}) => {
  const t = useTranslations("user");
  const pathname = usePathname();
  const { token } = useAppContext();
  const dispatch = useAppDispatch();

  const [addUser, setAddUser] = useState<boolean>(false);
  const [deleteUserId, setDeleteUserId] = useState<User | null>(null);
  const [pending, setPending] = useState<boolean>(false);
  const [openDeleteUser, setOpenDeleteUser] = useState<boolean>(false);
  const [chartType, setChartType] = useState<"bar" | "pie">("bar");
  const [roleStats, setRoleStats] = useState<RoleStats[]>([]);

  const headers: TableHeader[] = [
    { name: "image" },
    { name: "fullName", sortable: true, key: "fullname" },
    { name: "email" },
    { name: "mobile" },
    { name: "type" },
    { name: "createdAt", sortable: true, key: "createdAt" },
    { name: "action", className: "text-center" },
  ];

  const handleDelete = async () => {
    if (!deleteUserId) return;
    try {
      setPending(true);
      await axios.delete(`/api/user/${deleteUserId.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(deleteUser(deleteUserId.id));
      setOpenDeleteUser(false);
      toast.success(t("successDelete"));
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "There is an Error");
    } finally {
      setPending(false);
    }
  };

  const handelRestore = async (id: string) => {
    try {
      setPending(true);
      const { data } = await axios.put(
        `/api/user/${id}`,
        { isDeleted: false },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(updateUser(data.user));
      toast.success(t("successRestore"));
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "There is an Error");
    } finally {
      setPending(false);
    }
  };

  // Get the total count from Redux
  // const totalCount = useAppSelector((state) => state.users.count);
  const usersRedux = useAppSelector((state) => state.users.users);

  // Update the useEffect
  useEffect(() => {
    // Set users and count in redux
    // if (!loading) {
    dispatch(setUsers(users));
    dispatch(setUsersCount(count));
    // }
  }, []);

  useEffect(() => {
    // Set role stats if available in props
    if (initialRoleStats) {
      setRoleStats(initialRoleStats);
    }
  }, [initialRoleStats]);

  const getChartData = () => {
    const labels = roleStats.map((stat) => stat.name);
    const data = roleStats.map((stat) => stat.count);
    const colors = [
      "rgba(255, 99, 132, 0.8)",
      "rgba(54, 162, 235, 0.8)",
      "rgba(255, 206, 86, 0.8)",
      "rgba(75, 192, 192, 0.8)",
      "rgba(153, 102, 255, 0.8)",
    ];

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: colors,
          borderColor: colors.map((color) => color.replace("0.8", "1")),
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: t("userRoleDistribution"),
      },
    },
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold capitalize">{t("users")}</h1>
        <button
          onClick={() => setAddUser(!addUser)}
          className="px-5 py-2 bg-primary rounded-md text-white font-medium"
        >
          <div className="flex gap-3">
            <PluseCircelIcon className="size-6" />
            <div className="flex-1">{t("addUser")}</div>
          </div>
        </button>
      </div>
      <Dialog open={openDeleteUser} onOpenChange={setOpenDeleteUser}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("delete")}</DialogTitle>
            <DialogDescription>{t("deleteMessage")}</DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setOpenDeleteUser(false);
                setDeleteUserId(null);
              }}
              className="px-3 py-2 rounded-md border"
            >
              {t("cancel")}
            </button>
            <button
              onClick={handleDelete}
              className="px-3 py-2 rounded-md bg-red-500 text-white"
              disabled={pending}
            >
              {pending ? (
                <LoadingIcon className="size-5 animate-spin" />
              ) : (
                t("delete")
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>
      {!addUser && (
        <>
          <Table
            headers={headers}
            pagination={
              <Pagination
                count={count}
                totalPages={totalPages}
                downloadButton={
                  <DownloadButton
                    model="user"
                    fields={["id", "fullname", "email", "createdAt"]}
                  />
                }
              />
            }
          >
            {!usersRedux.length && (
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
            {usersRedux?.map((user: User) => (
              <tr
                key={user.id}
                className={clsx(
                  "odd:bg-white even:bg-[#F0F2F5]  border-b",
                  user.isDeleted && "!text-red-500 font-bold"
                )}
              >
                <td className="px-3 py-2">
                  <div className="size-12">
                    <ImageApi
                      src={user.imageUrl ?? "/imgs/notfound.png"}
                      alt="Avatar"
                      className="size-full rounded-full object-cover border-2"
                      width={200}
                      height={200}
                    />
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">{user.fullname}</td>
                <td className="px-3 py-2 whitespace-nowrap">{user.email}</td>
                <td className="px-3 py-2 whitespace-nowrap">{user.phone}</td>
                <td className={"px-3 py-2 whitespace-nowrap"}>
                  <ul className="list-disc pl-5">
                    {user.roles.map((role: UserRole) => (
                      <li
                        className={clsx(
                          role.name === "admin" && "text-yellow-500",
                          role.name === "brand representative" &&
                            "text-blue-500",
                          user.isDeleted && "!text-red-500 font-bold",
                          "text-primary text-sm"
                        )}
                        key={role.id}
                      >
                        {role.name}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {DateToText(user.createdAt ?? "")}
                </td>
                <td className="px-3 py-2">
                  <div className="flex justify-center">
                    <div className="flex gap-2 items-center">
                      {user.isDeleted ? (
                        <button
                          onClick={() => handelRestore(user.id)}
                          className="flex gap-2 justify-center hover:opacity-85 active:scale-95 transition-all"
                        >
                          {pending && (
                            <LoadingIcon className="size-5 animate-spin" />
                          )}
                          {!pending && (
                            <Rstoreicon className="size-5 !text-red-500 font-bold" />
                          )}
                        </button>
                      ) : (
                        <>
                          <Link
                            className="hover:opacity-85 active:scale-95 transition-all"
                            href={`${pathname}/${user.id}`}
                          >
                            <EyeIcon className="size-6 text-primary" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => {
                              setDeleteUserId(user);
                              setOpenDeleteUser(true);
                            }}
                            className="hover:opacity-85 active:scale-95 transition-all"
                          >
                            <DeleteIcon className="size-6 text-primary" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </Table>

          {/* Add records count display */}
          {/* <div className="text-sm text-gray-500 text-right">
            {loading ? (
              <LoadingIcon className="animate-spin size-4 inline mr-2" />
            ) : total > 0 ? (
              <span>
                {t("showing")} {start} - {end} {t("of")} {total} {t("records")}
              </span>
            ) : (
              <span>{t("noRecords")}</span>
            )}
          </div> */}
        </>
      )}
      {addUser && <AddUserForm handelClose={() => setAddUser(false)} />}

      {/* Charts Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{t("roleStatistics")}</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setChartType("bar")}
              className={clsx(
                "px-4 py-2 rounded-md transition-colors",
                chartType === "bar"
                  ? "bg-primary text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              )}
            >
              {t("barChart")}
            </button>
            <button
              onClick={() => setChartType("pie")}
              className={clsx(
                "px-4 py-2 rounded-md transition-colors",
                chartType === "pie"
                  ? "bg-primary text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              )}
            >
              {t("pieChart")}
            </button>
          </div>
        </div>

        <div className="h-[400px] w-full">
          {roleStats.length > 0 ? (
            chartType === "bar" ? (
              <Bar
                data={getChartData()}
                options={{
                  ...chartOptions,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        stepSize: 1,
                      },
                    },
                  },
                }}
              />
            ) : (
              <Pie
                data={getChartData()}
                options={{
                  ...chartOptions,
                  maintainAspectRatio: false,
                }}
              />
            )
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">{t("noDataAvailable")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersRows;
