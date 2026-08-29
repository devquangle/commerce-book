import { ArrowLeft, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AddressHeaderProps {
  title: string;
  mode?: "list" | "add" | "edit";
  onAddClick?: () => void;
  onBackClick?: () => void;
}

const AddressHeader = ({
  title,
  mode = "list",
  onAddClick,
  onBackClick,
}: AddressHeaderProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="flex items-center justify-between py-2 mb-4 border-b border-gray-100 dark:border-zinc-800">
      <div className="flex items-center gap-3">
        {(mode === "add" || mode === "edit" || !!onBackClick) && (
          <button
            onClick={handleBack}
            className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 dark:text-zinc-400 rounded-full transition-colors"
            title="Quay lại"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          {title}
        </h2>
      </div>

      {mode === "list" && (
        <button
          onClick={onAddClick}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Thêm mới</span>
        </button>
      )}
    </div>
  );
};

export default AddressHeader;