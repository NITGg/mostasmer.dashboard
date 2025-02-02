"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAppContext } from "@/context/appContext";
import { useAppDispatch } from "@/hooks/redux";
import { deleteUser } from "@/redux/reducers/usersReducer";
import axios from "axios";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const DeleteUser = ({ userId }: { userId: any }) => {
  const [open, setOpen] = useState(false);
  const local = useLocale();
  const router = useRouter();
  const { token } = useAppContext();
  const dispatch = useAppDispatch();

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`/api/user/${userId.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(deleteUser(userId));
      setOpen(false);
      router.refresh();
      router.push(`/${local}/users`);
      toast.success("You delete account");
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "There is an Error");
    }
  };
  return (
    <div className="p-container">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            onClick={() => {
              setOpen(true);
            }}
            className="py-2 px-10 rounded-md bg-red-500 text-white"
          >
            Delete Account
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              Do you want to delete this account?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button className="text-red-500" onClick={handleDeleteAccount}>
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeleteUser;
