export type GenreStatus = "ACTIVE" | "INACTIVE" | "DELETED";

export const getLabelGenreStatus = (status: GenreStatus) => {
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

export interface GenreResponse {
  id: number;
  name: string;
  slug: string;
  status: GenreStatus;
}

export interface GenreRequest {
  name: string;
  status: GenreStatus;
}

export interface GenreFilterRequest {
  keyword?: string;
  status?: GenreStatus;
  page?: number;
  size?: number;
}

export interface GenreProductResponse {
  id: number;
  name: string;
  slug: string;
  bookCount: number;
}
