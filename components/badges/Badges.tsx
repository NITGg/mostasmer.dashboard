"use client";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import ImageApi from "../ImageApi";
import { EyeIcon } from "lucide-react";
import { DeleteIcon, LoadingIcon, PluseCircelIcon } from "../icons";
import {
  deleteUser,
  Role,
  setUsers,
  User,
} from "@/redux/reducers/usersReducer";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useAppContext } from "@/context/appContext";
import AddUserForm from "@/components/users/AddUserForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import axios from "axios";
import Table from "../ui/Table";

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

  // State
  const [addUser, setAddUser] = useState<boolean>(false);
  const [deleteUserId, setDeleteUserId] = useState<User | null>(null);
  const [pending, setPending] = useState<boolean>(false);
  const [openDeleteUser, setOpenDeleteUser] = useState<boolean>(false);
  const [loading, setLoading] = useState(initialLoading);
  const [totalRecords, setTotalRecords] = useState(initialCount);
  const [currentItems, setCurrentItems] = useState<number>(0);

  // Get current pagination state from URL or defaults
  const currentPage = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('limit')) || 10;

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
      
      // Handle "All" case
      if (limit === 0) {
        url += 'limit=0&skip=0';
      } else {
        url += `limit=${limit}&skip=${skip}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;
      
      // Update the users in Redux store
      dispatch(setUsers(data.users));
      
      // Update local state
      setCurrentItems(data.users.length);
      setTotalRecords(data.count || data.total || initialCount); // Handle different API response formats
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      dispatch(setUsers(initialUsers));
      setCurrentItems(initialUsers?.length || 0);
      setTotalRecords(initialCount);

      // Only fetch if we don't have URL params
      if (!searchParams.has('page') || !searchParams.has('limit')) {
        await updatePaginationAndFetch(1, 10);
      } else {
        await fetchUsers(currentPage, pageSize);
      }
    };

    initializeData();
  }, []);

  // Function to update URL and fetch data
  const updatePaginationAndFetch = async (page: number, limit: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    params.set('limit', limit.toString());
    router.push(`${pathname}?${params.toString()}`);
    
    await fetchUsers(page, limit);
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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1>{t("users")}</h1>
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
        <Table
          loading={loading}
          data={useAppSelector((state) => state.users.users)}
          count={totalRecords}
          headers={headers}
          showDateFilter={false}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={(page) => updatePaginationAndFetch(page, pageSize)}
          onPageSizeChange={(size) => updatePaginationAndFetch(1, size)}
          showExport={true}
          bgColor="#02161e"
          currentItems={currentItems}
          initialData={initialUsers}
        >
          {useAppSelector((state) => state.users.users)?.map((user: User) => (
            <tr
              key={user.id}
              className="odd:bg-white even:bg-[#F0F2F5] border-b"
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
                {user.roles.map((role: Role) => (
                  <span key={role.id}>{role.name}</span>
                ))}
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-center">
                  <div className="flex gap-2 items-center">
                    <Link href={`${pathname}/${user.id}`}>
                      <EyeIcon className="size-6 text-primary" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteUserId(user);
                        setOpenDeleteUser(true);
                      }}
                    >
                      <DeleteIcon className="size-6 text-primary" />
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      )}
      {addUser && <AddUserForm handelClose={() => setAddUser(false)} />}
    </div>
  );
};

export default UsersRows;
