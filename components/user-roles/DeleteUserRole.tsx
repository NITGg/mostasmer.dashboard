import { useAppDispatch } from "@/hooks/redux";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useAppContext } from "@/context/appContext";
import { useTranslations } from "next-intl";
import { useState } from "react";
import axios from "axios";
import { LoadingIcon } from "../icons";
import toast from "react-hot-toast";
import { deleteRole } from "@/redux/reducers/userRolesReducer";

const DeleteUserRole = ({
  openDelete,
  setOpenDelete,
  deleteRoleId,
}: {
  openDelete: boolean;
  deleteRoleId: number;
  setOpenDelete: (openDelete: boolean) => void;
}) => {
  const t = useTranslations("userRoles");
  const dispatch = useAppDispatch();
  const { token } = useAppContext();
  const [loading, setLoading] = useState<boolean>(false);
  const handleDeleteRole = async () => {
    if (!deleteRoleId) return;
    try {
      setLoading(true);
      await axios.delete(`/api/roles/${deleteRoleId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(deleteRole(deleteRoleId));
      setOpenDelete(false);
      toast.success(t("successDelete"));
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "There is an Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={openDelete} onOpenChange={setOpenDelete}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("deleteRole")}</DialogTitle>
          <DialogDescription>{t("deleteMessage")}</DialogDescription>
        </DialogHeader>
        <div className="flex gap-2">
          <button
            onClick={() => setOpenDelete(false)}
            className="px-3 py-2 rounded-md border"
          >
            {t("cancel")}
          </button>
          <button
            onClick={handleDeleteRole}
            className="px-3 py-2 rounded-md bg-red-500 text-white"
          >
            {loading ? (
              <LoadingIcon className="size-5 animate-spin" />
            ) : (
              t("delete")
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteUserRole;
