"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";

import { Modal } from "@/components/common/Modal";
import { InputField } from "@/components/common/InputField";
import { TextAreaField } from "@/components/common/TextAreaField";
import { SelectBox } from "@/components/common/SelectBox";
import { Button } from "@/components/common/Button";
import SingleImageUpload from "@/components/common/SingleImageUpload";
import useDebounce from "@/libs/utils/useDebounce";
import { useWikipedia } from "../hooks/useWikipedia";
import { showSuccessToast, showErrorToast } from "@/libs/utils/toastUtil";
import UploadImageService from "@/services/upload-image.service";
import type { AuthorRequest, AuthorResponse } from "../types/author.type";

interface AuthorModalProps {
  isOpen: boolean;
  author: AuthorResponse | null;
  onClose: () => void;
  onSave: (authorData: AuthorRequest & { id?: number; file?: File | null }) => void;
}

const initAuthor: AuthorRequest = {
  name: "",
  urlImage: "",
  urlBio: "",
  extract: "",
  status: "ACTIVE",
};

const AuthorModalContent: React.FC<AuthorModalProps> = ({
  isOpen,
  author,
  onClose,
  onSave,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AuthorRequest>({
    defaultValues: author
      ? {
          name: author.name,
          urlImage: author.urlImage || "",
          urlBio: author.urlBio || "",
          extract: author.description || "",
          status: author.status || "ACTIVE",
        }
      : initAuthor,
  });

  const [file, setFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>(author?.urlImage || "");

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isOpen) {
      queryClient.cancelQueries({ queryKey: ["wiki-author"] });
    }
  }, [isOpen, queryClient]);

  const inputName = useWatch({ control, name: "name" });
  const debouncedName = useDebounce(inputName, 1200);

  const shouldFetchWiki = !author && isOpen && !!debouncedName?.trim();

  const { data: wikiData, isFetching: isWikiFetching } = useWikipedia(
    shouldFetchWiki ? debouncedName : "",
    isOpen
  );

  const handleSyncToForm = useCallback(() => {
    if (!wikiData) return;
    const currentValues = getValues();
    let updated = false;

    if (!currentValues.urlBio?.trim() && wikiData.urlBio) {
      setValue("urlBio", wikiData.urlBio);
      updated = true;
    }
    if (!currentValues.extract?.trim() && wikiData.extract) {
      setValue("extract", wikiData.extract);
      updated = true;
    }
    if (!avatarUrl?.trim() && wikiData.urlImage) {
      setValue("urlImage", wikiData.urlImage);
      setAvatarUrl(wikiData.urlImage);
      setFile(null);
      updated = true;
    }

    showSuccessToast(
      updated
        ? "Đã tự động điền các thông tin còn thiếu từ Wikipedia!"
        : "Các trường thông tin trên Form đã đầy đủ."
    );
  }, [wikiData, getValues, setValue, setAvatarUrl, setFile, avatarUrl]);

  const onSubmit = async (data: AuthorRequest) => {
    const finalData = { ...data, urlImage: avatarUrl };

    if (finalData.urlImage.includes("wikipedia")) {
      finalData.urlImage = wikiData?.urlImage || finalData.urlImage;
    }

    try {
      if (file) {
        finalData.urlImage = await UploadImageService.uploadFile(file);
      } else if (
        finalData.urlImage &&
        !finalData.urlImage.includes("wikipedia") &&
        !finalData.urlImage.startsWith("/") && // Không upload lại nếu là ảnh local của server mình
        !finalData.urlImage.includes("localhost")
      ) {
        finalData.urlImage = await UploadImageService.uploadImageUrl(finalData.urlImage);
      }
    } catch (error :unknown) {
      showErrorToast("Lỗi khi tải ảnh lên máy chủ!");
      return;
    }

    onSave({
      id: author?.id,
      ...finalData,
    });
  };

  const statusOptions = [
    { label: "Đang hoạt động", value: "ACTIVE" },
    { label: "Không hoạt động", value: "INACTIVE" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={author ? "Chỉnh sửa thông tin tác giả" : "Thêm tác giả mới"}
      size="lg"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <Button variant="secondary" onClick={onClose}>
            Hủy bỏ
          </Button>
          <Button type="submit" form="author-form" isLoading={isSubmitting}>
            {author ? "Cập nhật" : "Thêm mới"}
          </Button>
        </div>
      }
    >
      <form id="author-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-3">
        <div className="relative w-full">
          <InputField
            label="Tên tác giả"
            required
            placeholder="Nhập tên tác giả để tìm trên Wikipedia..."
            error={errors.name?.message}
            {...register("name", { required: "Vui lòng nhập tên tác giả" })}
          />
          {shouldFetchWiki && !!inputName?.trim() && isWikiFetching && (
            <div className="absolute right-3 top-9.5 z-10 animate-spin rounded-full h-4 w-4 border-2 border-indigo-500 border-t-transparent" />
          )}
        </div>

        {shouldFetchWiki && !!inputName?.trim() && wikiData && (
          <div className="mt-2 flex items-center justify-between p-2.5 bg-emerald-50 rounded-lg border border-emerald-100">
            <span className="text-xs text-emerald-700">
              Tìm thấy dữ liệu của{" "}
              <strong>{wikiData.name || debouncedName}</strong>!
            </span>
            <button
              type="button"
              onClick={handleSyncToForm}
              className="text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-md cursor-pointer transition-colors"
            >
              Đồng bộ vào Form
            </button>
          </div>
        )}

        {shouldFetchWiki && !wikiData && !isWikiFetching && (
          <div className="mt-2 p-2.5 bg-amber-50 rounded-lg border border-amber-100 text-xs text-amber-700">
            Không tìm thấy thông tin cho "<strong>{debouncedName}</strong>" trên Wikipedia.
          </div>
        )}

        {author && (
          <SelectBox
            label="Trạng thái"
            options={statusOptions}
            error={errors.status?.message}
            {...register("status")}
          />
        )}

        {/* Đã ẩn trường URL Tiểu sử (Bio Link) theo yêu cầu */}
        <input type="hidden" {...register("urlBio")} />

        <TextAreaField
          label="Tóm tắt / Tiểu sử"
          rows={5}
          placeholder="Nhập mô tả..."
          error={errors.extract?.message}
          {...register("extract")}
        />

        <SingleImageUpload
          file={file}
          setFile={setFile}
          avatarUrl={avatarUrl}
          setAvatarUrl={setAvatarUrl}
        />
      </form>
    </Modal>
  );
};

export const AuthorModal: React.FC<AuthorModalProps> = ({
  isOpen,
  author,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  return (
    <AuthorModalContent
      key={author ? `edit-${author.id}` : "new-author"}
      isOpen={isOpen}
      author={author}
      onClose={onClose}
      onSave={onSave}
    />
  );
};
