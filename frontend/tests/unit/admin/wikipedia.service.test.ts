import { publicAxios } from "@/libs/config/axios.config";
import WikipediaService from "@/modules/admin/authors/services/wikipedia.service";
import type { WikipediaResponse } from "@/modules/admin/authors/types/wikipedia.type";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";

// Mock axios config
vi.mock("@/libs/config/axios.config", () => {
  return {
    __esModule: true,
    publicAxios: {
      get: vi.fn(),
    },
  };
});

describe("WikipediaService - Tìm kiếm thông tin tác giả", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("TC-WIKI-001: Nên gọi API và trả về dữ liệu tác giả (WikipediaResponse) thành công", async () => {
    // Dữ liệu mock
    const mockWikipediaData: WikipediaResponse = {
      name: "Nguyễn Nhật Ánh",
      wikibaseItem: "Q12345",
      extract: "Nguyễn Nhật Ánh là một nhà văn...",
      urlImage: "https://example.com/image.jpg",
    };

    const mockResponse = {
      data: {
        success: true,
        data: mockWikipediaData,
        message: "Lấy dữ liệu thành công",
      },
    };

    (publicAxios.get as Mock).mockResolvedValue(mockResponse);

    // Thực thi
    const result = await WikipediaService.fetchAuthorData("Nguyễn Nhật Ánh");

    // Kiểm tra
    expect(publicAxios.get).toHaveBeenCalledWith("/api/v1/wikipedia", {
      params: { name: "Nguyễn Nhật Ánh" },
    });
    expect(publicAxios.get).toHaveBeenCalledTimes(1);
    expect(result.extract).toBe("Nguyễn Nhật Ánh là một nhà văn...");
    expect(result.urlImage).toBe("https://example.com/image.jpg");
  });

  it("TC-WIKI-002: Nên ném ra lỗi nếu API trả về success = false kèm thông báo lỗi", async () => {
    const mockResponse = {
      data: {
        success: false,
        message: "Không tìm thấy tác giả trên Wikipedia",
      },
    };

    (publicAxios.get as Mock).mockResolvedValue(mockResponse);

    await expect(WikipediaService.fetchAuthorData("Tác giả ảo ABC")).rejects.toThrow("Không tìm thấy tác giả trên Wikipedia");
  });

  it("TC-WIKI-003: Nên ném ra lỗi mặc định nếu API trả về success = false mà không có thông báo", async () => {
    const mockResponse = {
      data: {
        success: false,
        // Không có message
      },
    };

    (publicAxios.get as Mock).mockResolvedValue(mockResponse);

    await expect(WikipediaService.fetchAuthorData("Lỗi bí ẩn")).rejects.toThrow("Lỗi khi lấy thông tin từ wiki");
  });

  it("TC-WIKI-004: Nên ném ra lỗi mạng (Network Error) nếu axios sập hoặc mất kết nối", async () => {
    (publicAxios.get as Mock).mockRejectedValue(new Error("Network Error"));

    await expect(WikipediaService.fetchAuthorData("Test Mạng")).rejects.toThrow("Network Error");
  });
});
