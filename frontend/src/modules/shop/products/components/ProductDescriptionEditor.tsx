import { useEditor, ReactNodeViewRenderer } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Document from "@tiptap/extension-document";
import Image from "@tiptap/extension-image";
import { BulletList, ListItem, OrderedList } from "@tiptap/extension-list";
import Paragraph from "@tiptap/extension-paragraph";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Text from "@tiptap/extension-text";

import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";

import React, { useCallback, useEffect, useRef, useState } from "react";
import ProductDescriptionToolbar from "./ProductDescriptionToolbar";
import ProductDescriptionView from "./ProductDescriptionView";

import UploadImageService from "@/services/cloudinary/services/cloudinary.service";
import { showErrorToast } from "@/libs/utils/toastUtil";
import { Loader2, Sparkles, Check, Copy } from "lucide-react";
import ResizableImageNodeView from "./ResizableImageNodeView";

type Props = {
  value: string;
  onChange: (val: string) => void;
  bookName?: string;
  authorNames?: string;
  disabled?: boolean;
  showTools?: boolean;
};

const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      class: {
        default: "mx-auto",
        parseHTML: (el) => el.getAttribute("class"),
        renderHTML: (attrs) => (attrs.class ? { class: attrs.class } : {}),
      },
      style: {
        default: "width: 100%; max-width: 100%; height: auto;",
        parseHTML: (el) => el.getAttribute("style"),
        renderHTML: (attrs) => (attrs.style ? { style: attrs.style } : {}),
      },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageNodeView);
  },
});

const ProductDescriptionEditor = ({
  value,
  onChange,
  bookName,
  authorNames,
  disabled = false,
  showTools = true,
}: Props) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [activeTab, setActiveTab] = useState<"guidelines" | "ai-prompt">("guidelines");
  const [copied, setCopied] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    editable: !disabled,
    extensions: [
      StarterKit.configure({
        link: { openOnClick: false },
        document: false,
        paragraph: false,
        text: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),

      Document,
      CustomImage,

      BulletList,
      OrderedList,
      ListItem,
      Paragraph,

      TextStyle,
      Color,
      Highlight,
      Text,

      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),

      Placeholder.configure({
        placeholder: "Nhập mô tả sản phẩm...",
      }),

      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value || "",
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value || "", {
        emitUpdate: false,
      });
    }
  }, [editor, value]);

  const handleImage = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!editor) return;
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.size > 1048576) {
        showErrorToast("Chỉ chấp nhận hình ảnh có kích thước dưới 1MB!");
        e.target.value = "";
        return;
      }

      e.target.value = "";

      const blobUrl = URL.createObjectURL(file);
      editor
        .chain()
        .focus()
        .setImage({ src: blobUrl })
        .updateAttributes("image", {
          class: "block mx-auto opacity-50",
          style: "width: 60%; max-width: 100%; height: auto;",
        })
        .run();

      setIsUploadingImage(true);
      try {
        const uploadedUrl = await UploadImageService.uploadFile(file);

        const currentHtml = editor.getHTML();
        const updatedHtml = currentHtml.replace(blobUrl, uploadedUrl);
        editor.commands.setContent(updatedHtml, { emitUpdate: false });
        onChange(updatedHtml);

        URL.revokeObjectURL(blobUrl);
      } catch {
        const currentHtml = editor.getHTML();
        const cleaned = currentHtml.replace(
          new RegExp(`<img[^>]*src="${blobUrl}"[^>]*/?>`, "g"),
          ""
        );
        editor.commands.setContent(cleaned, { emitUpdate: false });
        onChange(cleaned);
        URL.revokeObjectURL(blobUrl);
        showErrorToast("Upload ảnh thất bại. Vui lòng thử lại.");
      } finally {
        setIsUploadingImage(false);
      }
    },
    [editor, onChange]
  );

  const bookTitle = bookName || "Tên sách";
  const bookAuthors = authorNames || "Tên tác giả";

  const aiPrompt = `Tôi có cuốn sách tên là "${bookTitle}", tác giả là "${bookAuthors}".
Hãy viết cho tôi nội dung mô tả sách chi tiết theo cấu trúc HTML chuẩn:
- Nội dung chính (H2): Tóm tắt cốt truyện hoặc chủ đề cuốn sách ngắn gọn, hấp dẫn.
- Điểm nổi bật (H2): 3-5 ý chính về điểm nổi bật của sách (dùng thẻ <ul> và <li>).
- Giá trị nghệ thuật (H2): 3-5 ý về phong cách viết, nghệ thuật độc đáo của tác phẩm (dùng thẻ <ul> và <li>).
- Đối tượng độc giả (H2): Nhóm độc giả phù hợp (dùng thẻ <ul> và <li>).
- Về tác giả (H2): Giới thiệu tác giả nổi bật với cú pháp <strong>Tên tác giả:</strong> mô tả.

Yêu cầu: Sử dụng thẻ <h2> cho các đề mục, giọng văn chuyên nghiệp, thuyết phục.`;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(aiPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!editor) return null;

  return (
    <div className="space-y-4">
      <div className="overflow-hidden relative bg-white dark:bg-zinc-900 rounded-lg border border-slate-200 dark:border-zinc-800 p-2 shadow-sm">
        <ProductDescriptionToolbar
          editor={editor}
          onPickImage={() => fileRef.current?.click()}
        />
        <input
          ref={fileRef}
          type="file"
          hidden
          accept="image/*"
          onChange={handleImage}
          disabled={isUploadingImage}
        />

        {isUploadingImage && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 dark:bg-zinc-900/60 backdrop-blur-[1px] rounded-xl pointer-events-none">
            <div className="flex items-center gap-2 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 shadow-md rounded-xl px-4 py-2.5 text-sm text-slate-700 dark:text-zinc-200 font-medium">
              <Loader2 size={16} className="animate-spin text-indigo-500" />
              Đang tải ảnh lên...
            </div>
          </div>
        )}

        <ProductDescriptionView editor={editor} />
      </div>

      {showTools && (
        <div className="card-custom space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-200 dark:border-zinc-800 pb-3 gap-3">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-violet-600 animate-pulse" />
              <h3 className="font-bold text-slate-800 dark:text-zinc-200 text-sm tracking-wide uppercase">
                Công cụ hỗ trợ mô tả sách
              </h3>
            </div>
            <div className="flex bg-slate-200/60 dark:bg-zinc-800 p-0.5 rounded-lg self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setActiveTab("guidelines")}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
                  activeTab === "guidelines"
                    ? "bg-white dark:bg-zinc-900 text-slate-800 dark:text-white shadow-sm"
                    : "text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-white"
                }`}
              >
                Tiêu chuẩn SEO
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("ai-prompt")}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
                  activeTab === "ai-prompt"
                    ? "bg-white dark:bg-zinc-900 text-slate-800 dark:text-white shadow-sm"
                    : "text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-white"
                }`}
              >
                Tạo Prompt AI
              </button>
            </div>
          </div>

          {activeTab === "guidelines" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
              <div className="space-y-2.5">
                <div className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-bold">
                    1
                  </span>
                  <div>
                    <strong className="text-slate-800 dark:text-zinc-200">
                      Tiêu đề phụ:
                    </strong>{" "}
                    Sử dụng thẻ <code>H2</code> cho các đề mục chính (
                    <em>
                      Nội dung chính, Điểm nổi bật, Giá trị nghệ thuật, Đối tượng
                      độc giả, Về tác giả
                    </em>
                    ).
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-bold">
                    2
                  </span>
                  <div>
                    <strong className="text-slate-800 dark:text-zinc-200">
                      Đoạn văn ngắn gọn:
                    </strong>{" "}
                    Mỗi đoạn chỉ nên từ 3-5 câu để độc giả không bị mỏi mắt và dễ
                    theo dõi cốt truyện/chủ đề.
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-bold">
                    3
                  </span>
                  <div>
                    <strong className="text-slate-800 dark:text-zinc-200">
                      Danh sách:
                    </strong>{" "}
                    Sử dụng Bullet list (dấu chấm tròn) cho phần{" "}
                    <em>Điểm nổi bật</em>, <em>Giá trị nghệ thuật</em> hoặc{" "}
                    <em>Đối tượng độc giả</em> để thông tin trực quan hơn.
                  </div>
                </div>
              </div>
              <div className="space-y-2.5">
                <div className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-bold">
                    4
                  </span>
                  <div>
                    <strong className="text-slate-800 dark:text-zinc-200">
                      Giọng văn:
                    </strong>{" "}
                    Khách quan, lôi cuốn, thuyết phục độc giả và tránh các lỗi
                    chính tả.
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-normal">
                Copy prompt mẫu bên dưới và dán vào AI của bạn (như ChatGPT/Gemini)
                để tự động viết một bản mô tả sách chuẩn cấu trúc SEO.
              </p>
              <div className="relative">
                <textarea
                  readOnly
                  value={aiPrompt}
                  rows={6}
                  className="w-full text-xs font-mono text-slate-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl p-3.5 pr-12 focus:outline-none resize-none leading-relaxed shadow-inner"
                />
                <button
                  type="button"
                  onClick={handleCopyPrompt}
                  className={`absolute top-2.5 right-2.5 p-2 rounded-lg border transition cursor-pointer ${
                    copied
                      ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-700 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400"
                  }`}
                  title="Copy prompt"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-slate-500 dark:text-zinc-400 bg-violet-50/50 dark:bg-violet-950/20 border border-violet-100/50 dark:border-violet-900/50 rounded-lg p-2.5">
                <span>
                  <strong>Tên sách:</strong> {bookTitle}
                </span>
                <span>•</span>
                <span>
                  <strong>Tác giả:</strong> {bookAuthors}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductDescriptionEditor;