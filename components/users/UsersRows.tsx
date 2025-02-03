"use client";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
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
import AddUserForm from "./AddUserForm";
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
  loading,
  users,
  count,
}: {
  loading: boolean;
  users: User[];
  count: any;
}) => {
  const t = useTranslations("user");
  const pathname = usePathname();

  const headers = [
    { name: "image" },
    { name: "fullName" },
    { name: "email" },
    { name: "mobile" },
    { name: "type" },
    { name: "action", className: "text-center" },
  ];

  const { token } = useAppContext();
  const [addUser, setAddUser] = useState<boolean>(false);
  const [deleteUserId, setDeleteUserId] = useState<User | null>(null);
  const [pending, setPending] = useState<boolean>(false);
  const [openDeleteUser, setOpenDeleteUser] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const usersRedux = useAppSelector((state) => state.users.users);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setUsers(users));
  }, []);

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
      setPending(false);
    } catch (error: any) {
      setPending(false);
      setOpenDeleteUser(false);
      console.error(error);
      toast.error(error?.response?.data?.message || "There is an Error");
    }
  };

  return (
    <div className="flex flex-col gap-6 ">
      <div className="flex justify-between items-center">
        <h1>{t("users")}</h1>
        <button
          onClick={() => {
            setAddUser(!addUser);
          }}
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
          data={users}
          count={users.length}
          headers={headers}
          showDateFilter={false}          
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
          onPageSizeChange={(size) => setPageSize(size)}
        >
          {(usersRedux?.length ? usersRedux : users)?.map((user: User) => (
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
