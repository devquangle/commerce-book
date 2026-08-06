import { FileText, Lightbulb } from "lucide-react";
import { TextAreaField } from "@/components/common/TextAreaField";

export const StoreDescription = () => {
  return (
    <div className="card-custom">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center shrink-0">
          <FileText size={17} className="text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <h2 className="text-base font-bold text-zinc-900 dark:text-white">Mô tả cửa hàng</h2>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
            Giới thiệu về cửa hàng để khách hàng hiểu hơn
          </p>
        </div>
      </div>

      <TextAreaField
        label="Nội dung mô tả"
        placeholder="VD: Chúng tôi chuyên cung cấp sách giáo dục, văn học, thiếu nhi với chất lượng đảm bảo..."
        rows={6}
        defaultValue="Sách Tuổi Thơ là cửa hàng sách uy tín, chuyên cung cấp các đầu sách chất lượng dành cho mọi lứa tuổi. Với hơn 5 năm hoạt động, chúng tôi tự hào mang đến trải nghiệm mua sách tốt nhất cho độc giả Việt Nam."
        hint="Tối đa 1000 ký tự. Nên mô tả ngắn gọn, rõ ràng về sản phẩm và dịch vụ của bạn."
      />

      {/* Tips */}
      <div className="mt-4 flex items-start gap-2.5 bg-amber-50 dark:bg-amber-500/10 rounded-xl px-4 py-3 border border-amber-100 dark:border-amber-500/20">
        <Lightbulb size={13} className="shrink-0 mt-0.5 text-amber-500" />
        <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
          Mô tả tốt giúp tăng 40% lượt tìm kiếm tự nhiên. Hãy đề cập đến các loại sách bạn bán, đối tượng khách hàng và những điểm khác biệt của cửa hàng.
        </p>
      </div>
    </div>
  );
};