export type PublisherStatus = "ACTIVE" | "INACTIVE" | "DELETED";

export const getLabelPublisherStatus = (status: PublisherStatus) => {
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

export interface PublisherResponse {
  id: number;
  name: string;
  slug: string;
  status: PublisherStatus;
}

export interface PublisherRequest {
  name: string;
  status: PublisherStatus;
}

export interface PublisherFilterRequest {
  keyword?: string;
  status?: PublisherStatus;
  page?: number;
  size?: number;
}

export interface PublisherProductResponse {
  id: number;
  name: string;
  slug: string;
  bookCount: number;
}
