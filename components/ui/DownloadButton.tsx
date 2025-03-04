import useClickOutside from "@/hooks/useClickOutSide";
import { useAppContext } from "@/context/appContext";
import { Download } from "lucide-react";
import { useTranslations } from "next-intl";
import axios from "axios";
import { useState } from "react";
import { LoadingIcon } from "../icons";

interface DownloadButtonProps<T = any> {
  model: string;
  fields: Array<keyof T | string>; // Allow both known and arbitrary field names
  filters?: Partial<Record<keyof T, any>>;
  showExport?: boolean;
  limit?: number;
  include?: Record<string, any>;
}

const DownloadButton = <T = any,>({
  model,
  fields,
  filters = {},
  showExport = true,
  limit = 0,
  include,
}: DownloadButtonProps<T>) => {
  const t = useTranslations("pagination");
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<"PDF" | "CSV">("PDF");
  const [isLoading, setIsLoading] = useState(false);

  const exportMenuRef = useClickOutside(() => setIsExportOpen(false));
  const { token } = useAppContext();

  const handleDownload = async (format: "pdf" | "csv") => {
    try {
      setIsLoading(true);
      setSelectedFormat(format.toUpperCase() as "PDF" | "CSV");
      setIsExportOpen(false);

      const response = await axios.post(
        // `${process.env.NEXT_PUBLIC_BASE_URL11}/api/download`,
        `/api/download`,
        {
          fileType: format.toLowerCase(),
          model,
          fields,
          filters,
          limit,
          include,
        },
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const blob = new Blob([response.data], {
        type: format === "csv" ? "text/csv" : "application/pdf",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      const contentDisposition = response.headers["content-disposition"];
      const fileName = contentDisposition
        ? contentDisposition.split("filename=")[1].replace(/"/g, "")
        : `${model}-${Date.now()}.${format}`;

      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!showExport) return null;

  return (
    <div className="flex items-center gap-2 font-semibold">
      <span>{t("downloads")}</span>
      <div ref={exportMenuRef} className="relative">
        <button
          onClick={() => setIsExportOpen(!isExportOpen)}
          disabled={isLoading}
          className={`flex items-center gap-2 px-3 py-1 rounded border border-[#2ab09c] text-[#2ab09c] hover:bg-[#2ab09c]/10 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? (
            <LoadingIcon className="size-5 animate-spin" />
          ) : (
            <Download className="size-5" />
          )}
          {selectedFormat}
        </button>

        {isExportOpen && (
          <div className="absolute bottom-full left-0 mb-2 w-48 bg-white rounded-lg shadow-lg border z-50">
            {["PDF", "CSV"].map((format) => (
              <button
                key={format}
                onClick={() =>
                  handleDownload(format.toLowerCase() as "pdf" | "csv")
                }
                disabled={isLoading}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {format}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadButton;
