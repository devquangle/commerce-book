export interface UploadImageItem {
  url: string;
  isThumbnail?: boolean;
  file?: File;
}

export const ensureThumbnail = <
  T extends { isThumbnail?: boolean | null; url?: string | null; file?: File | null }
>(
  imgs: T[]
): (T & { isThumbnail: boolean })[] => {
  if (!imgs || !Array.isArray(imgs) || imgs.length === 0) return [];

  const validImgs = imgs.filter((img): img is T => Boolean(img));
  if (validImgs.length === 0) return [];

  const cleanedImgs = validImgs.map((img) => {
    const newImg = { ...img } as T & { thumbnail?: unknown };
    delete newImg.thumbnail;
    return newImg;
  });

  const hasThumbnail = cleanedImgs.some((img) => img.isThumbnail === true);

  if (!hasThumbnail) {
    return cleanedImgs.map((img, idx) => ({
      ...img,
      isThumbnail: idx === 0,
    })) as (T & { isThumbnail: boolean })[];
  }

  let thumbnailFound = false;
  return cleanedImgs.map((img) => {
    const isThisThumb = img.isThumbnail === true && !thumbnailFound;
    if (isThisThumb) {
      thumbnailFound = true;
      return { ...img, isThumbnail: true };
    }
    return { ...img, isThumbnail: false };
  }) as (T & { isThumbnail: boolean })[];
};

export const DEFAULT_SAMPLE_IMAGES: UploadImageItem[] = ensureThumbnail([
  {
    url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80",
    isThumbnail: true,
  },
  {
    url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&auto=format&fit=crop&q=80",
    isThumbnail: false,
  },
]);
