"use client";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import ImageApi from "../ImageApi";
// import { EyeIcon } from "lucide-react";
import { DeleteIcon, LoadingIcon, PluseCircelIcon,EyeIcon,Rstoreicon } from "@/components/icons";

import {
  deleteUser,
  Role,
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
import Table from "@/components/ui/Table";
// import { ArrowPathIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

const UsersRows = ({
  loading: initialLoading,
  users: initialUsers,
  count: initialCount,
}: {
  loading: boolean;
  users: User[];
  count: number;
}) => {
  const t = useTranslations("user");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { token } = useAppContext();
  const dispatch = useAppDispatch();

  const [addUser, setAddUser] = useState<boolean>(false);
  const [deleteUserId, setDeleteUserId] = useState<User | null>(null);
  const [pending, setPending] = useState<boolean>(false);
  const [openDeleteUser, setOpenDeleteUser] = useState<boolean>(false);
  const [loading, setLoading] = useState(initialLoading);
  const [totalRecords, setTotalRecords] = useState(initialCount);
  const [currentItems, setCurrentItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Get current pagination state from URL or defaults
  const currentPage = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("limit")) || 10;

  const headers = [
    { name: "image" },
    { name: "fullName" },
    { name: "email" },
    { name: "mobile" },
    { name: "type" },
    { name: "action", className: "text-center" },
  ];

  // Fetch users with pagination
  const fetchUsers = async (page: number, limit: number) => {
    try {
      setLoading(true);
      const skip = (page - 1) * limit;

      let url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/user?`;

      // Handle "All" case and pagination
      if (limit === 0) {
        url += "limit=0&skip=0";
      } else {
        url += `limit=${limit}&skip=${skip}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;

      // Update states with correct data from API response
      dispatch(setUsers(data.users));
      setCurrentItems(data.users.length);
      
      // Update total count from API response
      const totalUsers = data.totalUsers || initialCount;
      setTotalRecords(totalUsers);
      dispatch(setUsersCount(totalUsers));

      // Update total pages from API response
      const apiTotalPages = data.totalPages || Math.ceil(totalUsers / limit);
      setTotalPages(apiTotalPages);

      return { 
        users: data.users, 
        total: totalUsers,
        totalPages: apiTotalPages 
      };
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Initialize data with proper pagination
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Set initial data
        dispatch(setUsers(initialUsers));
        setCurrentItems(initialUsers?.length || 0);
        setTotalRecords(initialCount);
        dispatch(setUsersCount(initialCount));

        // Get page and limit from URL or use defaults
        const page = Number(searchParams.get("page")) || 1;
        const limit = Number(searchParams.get("limit")) || 10;

        // Calculate initial total pages
        const initialTotalPages = limit === 0 ? 1 : Math.ceil(initialCount / limit);
        setTotalPages(initialTotalPages);

        // Fetch data with current pagination
        if (!searchParams.has("page") || !searchParams.has("limit")) {
          // If no URL params, start with first page
          await updatePaginationAndFetch(1, 10);
        } else {
          // Otherwise use URL params
          await fetchUsers(page, limit);
        }
      } catch (error) {
        console.error("Error initializing data:", error);
      }
    };

    initializeData();
  }, []);

  // Update pagination and fetch new data
  const updatePaginationAndFetch = async (page: number, limit: number) => {
    try {
      // Update URL parameters
      const params = new URLSearchParams(searchParams);
      params.set("page", page.toString());
      params.set("limit", limit.toString());
      router.push(`${pathname}?${params.toString()}`);

      // Fetch data with new pagination
      const result = await fetchUsers(page, limit);
      
      if (result) {
        // Update total pages
        const newTotalPages = limit === 0 ? 1 : Math.ceil(result.total / limit);
        setTotalPages(newTotalPages);
      }
    } catch (error) {
      console.error("Error updating pagination:", error);
      toast.error("Failed to update page");
    }
  };

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

      // Refresh the current page after deletion
      fetchUsers(currentPage, pageSize);
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
  const totalCount = useAppSelector((state) => state.users.count);
  const users = useAppSelector((state) => state.users.users);

  // Add this function to calculate the range of items being displayed
  const calculateRange = () => {
    if (!totalRecords || totalRecords === 0) return { start: 0, end: 0, total: 0 };
    
    if (pageSize === 0) { // When showing all records
      return {
        start: 1,
        end: totalRecords,
        total: totalRecords
      };
    }

    const start = ((currentPage - 1) * pageSize) + 1;
    const end = Math.min(currentPage * pageSize, totalRecords);
    
    return {
      start: totalRecords > 0 ? start : 0,
      end,
      total: totalRecords
    };
  };

  const { start, end, total } = calculateRange();

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
            loading={loading}
            data={users}
            count={totalRecords}
            headers={headers}
            showDateFilter={false}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={(page) => updatePaginationAndFetch(page, pageSize)}
            onPageSizeChange={(size) => updatePaginationAndFetch(1, size)}
            showExport={true}
            bgColor="#02161e"
            // Remove currentItems and initialData props as they are not defined in TableProps
            // totalPages is also not defined in TableProps, so it should be removed
          >
            {users?.map((user: User) => (
              <tr
                key={user.id}
                className={clsx(
                  "odd:bg-white even:bg-[#F0F2F5]  border-b",
                  user.isDeleted && "text-red-500 font-bold"
                )}
              >
                <td scope="row" className="px-6 py-4">
                  <div className="size-16">
                    <ImageApi
                      src={user.imageUrl ?? "/imgs/notfound.png"}
                      alt="Avatar"
                      className="size-full rounded-full object-cover border-2"
                      width={200}
                      height={200}
                    />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{user.fullname}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                <ul className="list-disc pl-5">
                    {user.roles.map((role: Role) => {
                      if (role.name === 'customer') {
                        return <li className="text-primary font-sm" key={role.id}>{role.name} </li>;
                      }
                      if (role.name === 'brand representative') {
                        return <li className="text-blue-500" key={role.id}>{role.name} </li>;
                      }
                      else{
                        return <li key={role.id}>{role.name}</li>;
                      }
                    })}
                  </ul>

                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <div className="flex gap-2 items-center">
                      {user.isDeleted ? (
                        <button
                          onClick={() => handelRestore(user.id)}
                          className="flex gap-2 justify-center text-primary hover:opacity-85 active:scale-95 transition-all"
                        >
                          {pending ? (
                            <LoadingIcon className="size-5 animate-spin" />
                          ) : (
                            <>
                              <Rstoreicon className="size-5" />

      {/* {t("restoreUser")} */}
                            </>

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
                            {/* <DeleteIcon className="size-6  absolute left-1/2 transform -translate-x-1/2 bottom-full mb-1 hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2" /> */}
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
          <div className="text-sm text-gray-500 text-right">
            {loading ? (
              <LoadingIcon className="animate-spin size-4 inline mr-2" />
            ) : total > 0 ? (
              <span>
                {t('showing')} {start} - {end} {t('of')} {total} {t('records')}
              </span>
            ) : (
              <span>{t('noRecords')}</span>
            )}
          </div>
        </>
      )}
      {addUser && <AddUserForm handelClose={() => setAddUser(false)} />}
    </div>
  );
};

export default UsersRows;
