import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";

import { authAxios } from "@/libs/config/axios.config";
import type { AuthorFilterRequest, AuthorRequest } from "@/modules/admin/authors/types/author.type";
import AuthorService from "@/modules/admin/authors/services/author.service";

// Mock thư viện axios để không gọi API thật trong lúc test
vi.mock("@/libs/config/axios.config", () => {
  return {
    __esModule: true,
    authAxios: {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    },
  };
});

describe("AuthorService - Dịch vụ quản lý tác giả", () => {
  beforeEach(() => {
    // Xóa sạch trạng thái của các mock function trước mỗi test case
    vi.clearAllMocks();
  });

  describe("Hàm search() - Tìm kiếm và phân trang tác giả", () => {
    it("TC-AUTHOR-001: Nên gọi API lấy danh sách tác giả thành công và trả về dữ liệu Pagination", async () => {
      // Chuẩn bị dữ liệu giả mạo (Mock data)
      const mockParams: AuthorFilterRequest = { keyword: "Nam Cao", page: 1, size: 10 };
      const mockResponse = {
        data: {
          success: true,
          data: {
            items: [{ id: 1, name: "Nam Cao", status: "ACTIVE" }],
            totalItems: 1,
            totalPages: 1,
          },
          message: "Thành công",
        },
      };

      // Cài đặt mock trả về mockResponse khi gọi axios.get
      (authAxios.get as Mock).mockResolvedValue(mockResponse);

      // Thực thi
      const result = await AuthorService.search(mockParams);

      // Kiểm tra kết quả
      expect(authAxios.get).toHaveBeenCalledWith("/api/v1/admin/authors/filter", { params: mockParams });
      expect(authAxios.get).toHaveBeenCalledTimes(1);
      expect(result.items.length).toBe(1);
      expect(result.items[0].name).toBe("Nam Cao");
    });

    it("TC-AUTHOR-002: Nên ném ra lỗi nếu API trả về success = false", async () => {
      const mockResponse = {
        data: {
          success: false,
          message: "Lỗi hệ thống",
        },
      };
      (authAxios.get as Mock).mockResolvedValue(mockResponse);

      await expect(AuthorService.search()).rejects.toThrow("Lỗi hệ thống");
    });

    it("TC-AUTHOR-003: Nên ném ra lỗi mặc định nếu API trả về success = false nhưng không có message", async () => {
      const mockResponse = {
        data: {
          success: false,
          // Không có trường message
        },
      };
      (authAxios.get as Mock).mockResolvedValue(mockResponse);

      await expect(AuthorService.search()).rejects.toThrow("Failed to fetch author data");
    });

    it("TC-AUTHOR-010: Nên gọi API lấy danh sách thành công ngay cả khi không truyền tham số option", async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            items: [],
            totalItems: 0,
            totalPages: 0,
          },
        },
      };
      (authAxios.get as Mock).mockResolvedValue(mockResponse);

      const result = await AuthorService.search();

      expect(authAxios.get).toHaveBeenCalledWith("/api/v1/admin/authors/filter", { params: undefined });
      expect(result.items.length).toBe(0);
    });

    it("TC-AUTHOR-011: Nên ném ra lỗi (Network Error) nếu axios bị lỗi kết nối hoặc reject", async () => {
      (authAxios.get as Mock).mockRejectedValue(new Error("Network Error"));

      await expect(AuthorService.search()).rejects.toThrow("Network Error");
    });
  });

  describe("Hàm create() - Thêm mới tác giả", () => {
    const mockRequest: AuthorRequest = { name: "Nguyễn Nhật Ánh", urlBio: "bio", urlImage: "img", status: "ACTIVE", extract: "Tóm tắt tiểu sử" };

    it("TC-AUTHOR-004: Nên gọi API tạo tác giả thành công và trả về dữ liệu tác giả mới", async () => {
      const mockResponse = {
        data: {
          success: true,
          data: { id: 2, ...mockRequest },
          message: "Tạo thành công",
        },
      };
      (authAxios.post as Mock).mockResolvedValue(mockResponse);

      const result = await AuthorService.create(mockRequest);

      expect(authAxios.post).toHaveBeenCalledWith("/api/v1/admin/authors", mockRequest);
      expect(result.id).toBe(2);
      expect(result.name).toBe("Nguyễn Nhật Ánh");
    });

    it("TC-AUTHOR-005: Nên ném ra lỗi nếu API tạo thất bại (success = false)", async () => {
      const mockResponse = {
        data: {
          success: false,
          message: "Tên tác giả đã tồn tại",
        },
      };
      (authAxios.post as Mock).mockResolvedValue(mockResponse);

      await expect(AuthorService.create(mockRequest)).rejects.toThrow("Tên tác giả đã tồn tại");
    });

    it("TC-AUTHOR-012: Nên ném ra lỗi (Network Error) nếu axios POST gặp sự cố mạng", async () => {
      (authAxios.post as Mock).mockRejectedValue(new Error("Timeout"));

      await expect(AuthorService.create(mockRequest)).rejects.toThrow("Timeout");
    });

    it("TC-AUTHOR-013: Nên ném ra lỗi mặc định nếu API báo lỗi tạo thất bại nhưng không gửi kèm message", async () => {
      const mockResponse = {
        data: {
          success: false,
        },
      };
      (authAxios.post as Mock).mockResolvedValue(mockResponse);

      await expect(AuthorService.create(mockRequest)).rejects.toThrow("Failed to add author");
    });
  });

  describe("Hàm update() - Cập nhật thông tin tác giả", () => {
    const mockRequest: AuthorRequest = { name: "Nguyễn Du", urlBio: "truyen kieu", urlImage: "img", status: "ACTIVE", extract: "Tóm tắt tiểu sử" };
    const authorId = 5;

    it("TC-AUTHOR-006: Nên gọi API cập nhật tác giả thành công và trả về dữ liệu tác giả đã Cập nhật", async () => {
      const mockResponse = {
        data: {
          success: true,
          data: { id: authorId, ...mockRequest },
        },
      };
      (authAxios.put as Mock).mockResolvedValue(mockResponse);

      const result = await AuthorService.update(authorId, mockRequest);

      expect(authAxios.put).toHaveBeenCalledWith(`/api/v1/admin/authors/${authorId}`, mockRequest);
      expect(result.name).toBe("Nguyễn Du");
    });

    it("TC-AUTHOR-007: Nên ném ra lỗi nếu cập nhật thất bại", async () => {
      const mockResponse = {
        data: {
          success: false,
          message: "Lỗi dữ liệu đầu vào",
        },
      };
      (authAxios.put as Mock).mockResolvedValue(mockResponse);

      await expect(AuthorService.update(authorId, mockRequest)).rejects.toThrow("Lỗi dữ liệu đầu vào");
    });

    it("TC-AUTHOR-014: Nên ném ra lỗi mạng nếu axios PUT gặp lỗi ngoại lệ", async () => {
      (authAxios.put as Mock).mockRejectedValue(new Error("Server Internal Error"));

      await expect(AuthorService.update(authorId, mockRequest)).rejects.toThrow("Server Internal Error");
    });
  });

  describe("Hàm delete() - Xóa tác giả", () => {
    const authorId = 99;

    it("TC-AUTHOR-008: Nên gọi API xóa tác giả thành công", async () => {
      const mockResponse = {
        data: {
          success: true,
          message: "Xóa thành công",
        },
      };
      (authAxios.delete as Mock).mockResolvedValue(mockResponse);

      // Vì hàm trả về void, nó sẽ không ném lỗi nếu thành công
      await expect(AuthorService.delete(authorId)).resolves.not.toThrow();
      expect(authAxios.delete).toHaveBeenCalledWith(`/api/v1/admin/authors/${authorId}`);
    });

    it("TC-AUTHOR-009: Nên ném ra lỗi nếu API xóa báo thất bại", async () => {
      const mockResponse = {
        data: {
          success: false,
          message: "Không thể xóa tác giả vì đang có sách",
        },
      };
      (authAxios.delete as Mock).mockResolvedValue(mockResponse);

      await expect(AuthorService.delete(authorId)).rejects.toThrow("Không thể xóa tác giả vì đang có sách");
    });

    it("TC-AUTHOR-015: Nên ném ra lỗi mặc định nếu API xóa thất bại mà không có thông báo", async () => {
      const mockResponse = {
        data: {
          success: false,
        },
      };
      (authAxios.delete as Mock).mockResolvedValue(mockResponse);

      await expect(AuthorService.delete(authorId)).rejects.toThrow("Failed to delete author");
    });

    it("TC-AUTHOR-016: Nên ném ra lỗi nếu axios DELETE gặp sự cố đường truyền", async () => {
      (authAxios.delete as Mock).mockRejectedValue(new Error("ECONNREFUSED"));

      await expect(AuthorService.delete(authorId)).rejects.toThrow("ECONNREFUSED");
    });
  });
});
