export type SeriesStatus = "ACTIVE" | "INACTIVE" | "DELETED";

export const getLabelSeriesStatus = (status: SeriesStatus) => {
  switch (status) {
    case "ACTIVE":
      return "Đang hoạt động";
    case "INACTIVE":
      return "Ngừng hoạt động";
    case "DELETED":
      return "Đã xóa";
    default:
      return status;
  }
};

export interface SeriesResponse {
  id: number;
  name: string;
  slug: string;
  status: SeriesStatus;
}

export interface SeriesRequest {
  name: string;
  status: SeriesStatus;
}

export interface SeriesFilterRequest {
  keyword?: string;
  status?: SeriesStatus;
  page?: number;
  size?: number;
}

export interface SeriesProductResponse {
  id: number;
  name: string;
  slug: string;
}