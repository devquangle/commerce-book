export interface GeminiBookMetaResponse {
  mainSummary: string;
  highlights: string[] | [];
  artisticValue: string[] | [];
  targetAudience: string[] | [];
  authorsBookMetas: AuthorsBookMeta[] | [];
}

export interface AuthorsBookMeta {
  name: string;
  bio: string;
}

export interface BookMetaRequest {
  name: string;
  authors: string[];
}
