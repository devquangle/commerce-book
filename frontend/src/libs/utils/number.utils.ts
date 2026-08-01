/**
 * Tiện ích định dạng số sang tiền tệ VND an toàn, chống crash layout
 * @param value Số cần định dạng (có thể nhận vào undefined hoặc null)
 * @returns Chuỗi đã định dạng kèm chữ VND (Ví dụ: 1.000.000 VND)
 */
export function formatMoney(value: number | undefined | null): string {
   const vndFormatter = new Intl.NumberFormat("vi-VN", {
     style: "currency",
     currency: "VND",
   });
   return vndFormatter.format(value ?? 0);
}

/**
 * Định dạng số lượng dạng rút gọn (ví dụ: 1520 -> 1.5k)
 * @param value Số cần định dạng
 * @returns Chuỗi đã rút gọn
 */
export function formatCompactNumber(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) {
    return "0";
  }
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value).toLowerCase();
}