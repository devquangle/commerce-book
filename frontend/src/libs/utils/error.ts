import axios from "axios";

/**
 * Lấy thông báo lỗi từ bất kỳ error nào
 * @param error Lỗi ném ra (AxiosError hoặc Error)
 * @returns message dạng string
 */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    if (data && typeof data === "object") {
      // Nếu backend trả về map các field bị lỗi validation trong `data.data`
      if (
        "data" in data &&
        data.data &&
        typeof data.data === "object" &&
        !Array.isArray(data.data)
      ) {
        const fieldErrors = Object.entries(data.data as Record<string, unknown>)
          .map(([field, msg]) => `${field}: ${msg}`)
          .join("; ");
        if (fieldErrors) {
          return `${data.message || "Dữ liệu không hợp lệ"} (${fieldErrors})`;
        }
      }

      if ("message" in data && typeof (data as { message?: unknown }).message === "string") {
        return (data as { message: string }).message;
      }
    }
    return error.response?.statusText || "Đã xảy ra lỗi từ server";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Đã xảy ra lỗi không xác định";
}