export interface ProductReviewResponse {
  rating?: number;
  reviewCount?: number;
  starDetail: StarDetail[];
  comments: CommentResponse[];
}

export interface StarDetail {
  start: number; // 1-5
  count: number;
}

export interface CommentImage {
  imageId: number;
  urlImage: string;
}

export interface ReplyComment {
  id: number;
  replyComment: string;
  avatar?: string;
  fullName?: string;
  createdAt: string;
}

export interface CommentResponse {
  id: number;
  fullName: string;// nguoi danh gia
  star: number; // 1-5
  comment: string;
  createdAt: string;
  images: CommentImage[];
  reply?: ReplyComment | null;
}
