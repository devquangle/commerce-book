/**
 * Định dạng ngày tháng thành chuỗi theo cấu trúc MM/DD/YYYY.
 * Hỗ trợ tùy biến dấu phân tách (mặc định là "/").
 *
 * @param date Đối tượng Date, chuỗi ngày hoặc timestamp cần định dạng.
 * @param separator Dấu phân cách giữa ngày, tháng và năm (mặc định là "/").
 * @returns Chuỗi ngày đã định dạng, hoặc chuỗi rỗng nếu ngày không hợp lệ.
 *
 * @example
 * formatToMMDDYYYY(new Date()) => "07/01/2026"
 * formatToMMDDYYYY("2026-07-01", "//") => "07//01//2026"
 */
export function formatToMMDDYYYY(
  date: Date | string | number | null | undefined,
  separator: string = "/"
): string {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${month}${separator}${day}${separator}${year}`;
}

/**
 * Định dạng ngày tháng thành chuỗi theo cấu trúc DD/MM/YYYY.
 * Hỗ trợ tùy biến dấu phân tách (mặc định là "/").
 *
 * @param date Đối tượng Date, chuỗi ngày hoặc timestamp cần định dạng.
 * @param separator Dấu phân cách giữa ngày, tháng và năm (mặc định là "/").
 * @returns Chuỗi ngày đã định dạng, hoặc chuỗi rỗng nếu ngày không hợp lệ.
 *
 * @example
 * formatToDDMMYYYY(new Date()) => "01/07/2026"
 * formatToDDMMYYYY("2026-07-01", "/") => "01/07/2026"
 */
export function formatToDDMMYYYY(
  date: Date | string | number | null | undefined,
  separator: string = "/"
): string {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}${separator}${month}${separator}${year}`;
}
