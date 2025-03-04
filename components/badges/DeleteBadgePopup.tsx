import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import axios from "axios";
import { useAppDispatch } from "@/hooks/redux";
import { Badge, deleteBadge } from "@/redux/reducers/badgesReducer";
import toast from "react-hot-toast";
import { LoadingIcon } from "../icons";
import { useAppContext } from "@/context/appContext";
import { useState } from "react";
const DeleteBadgePopup = ({
  openDelete,
  setOpenDelete,
  deleteBadgeId,
}: {
  openDelete: boolean;
  deleteBadgeId: Badge;
  setOpenDelete: (openDelete: boolean) => void;
}) => {
  const t = useTranslations("badges");
  const dispatch = useAppDispatch();
  const { token } = useAppContext();
  const [loading, setLoading] = useState<boolean>(false);

  const handleDeleteBadge = async () => {
    if (!deleteBadgeId) return;
    try {
      setLoading(true);
      await axios.delete(`/api/user-types/${deleteBadgeId.userType?.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await axios.delete(`/api/badges/${deleteBadgeId.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(deleteBadge(deleteBadgeId.id));
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
          <DialogTitle>{t("deleteBadge")}</DialogTitle>
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
            onClick={handleDeleteBadge}
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

export default DeleteBadgePopup;
