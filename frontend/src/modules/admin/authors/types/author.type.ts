export type AuthorStatus = "ACTIVE" | "INACTIVE" | "DELETED";

export const getLabelAuthorStatus = (status: AuthorStatus) => {
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

export interface AuthorResponse {
  id: number;
  name: string;
  urlImage: string;
  description: string;
  urlBio: string;
  slug: string;
  status: AuthorStatus;
}

export interface AuthorRequest {
  name: string;
  urlImage: string;
  urlBio: string;
  extract: string;
  status: AuthorStatus;
}

export interface AuthorFilterRequest {
  keyword?: string;
  status?: AuthorStatus;
  page?: number;
  size?: number;
}

export interface AuthorProductResponse{
  id:number;
  name:string;
  slug:string;
}