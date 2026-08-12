import { describe, it, expect, vi, afterEach } from 'vitest';
import PublisherService from '@/modules/admin/publishers/services/publisher.service';
import { authAxios } from '@/libs/config/axios.config';
import type { PublisherRequest, PublisherFilterRequest } from '@/modules/admin/publishers/types/publisher.type';

vi.mock('@/libs/config/axios.config', () => ({
  authAxios: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('PublisherService', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('search', () => {
    it('should fetch publisher data successfully without options', async () => {
      const mockData = {
        data: {
          success: true,
          data: { items: [{ id: 1, name: 'Publisher A', slug: 'pub-a', status: 'ACTIVE' }], total: 1 },
        },
      };
      vi.mocked(authAxios.get).mockResolvedValue(mockData);

      const result = await PublisherService.search();

      expect(authAxios.get).toHaveBeenCalledWith('/api/v1/admin/publishers/filter', { params: undefined });
      expect(result).toEqual(mockData.data.data);
    });

    it('should fetch publisher data successfully with options', async () => {
      const mockData = {
        data: {
          success: true,
          data: { items: [{ id: 1, name: 'Publisher A', slug: 'pub-a', status: 'ACTIVE' }], total: 1 },
        },
      };
      const options: PublisherFilterRequest = { keyword: 'Pub', page: 1 };
      vi.mocked(authAxios.get).mockResolvedValue(mockData);

      const result = await PublisherService.search(options);

      expect(authAxios.get).toHaveBeenCalledWith('/api/v1/admin/publishers/filter', { params: options });
      expect(result).toEqual(mockData.data.data);
    });

    it('should throw an error when API returns success false', async () => {
      const mockData = {
        data: {
          success: false,
          message: 'Error fetching',
        },
      };
      vi.mocked(authAxios.get).mockResolvedValue(mockData);

      await expect(PublisherService.search()).rejects.toThrow('Error fetching');
    });

    it('should throw default error when API returns success false without message', async () => {
      const mockData = {
        data: {
          success: false,
        },
      };
      vi.mocked(authAxios.get).mockResolvedValue(mockData);

      await expect(PublisherService.search()).rejects.toThrow('Failed to fetch publisher data');
    });
  });

  describe('create', () => {
    it('should create publisher successfully', async () => {
      const mockRequest: PublisherRequest = { name: 'New Publisher', status: 'ACTIVE' };
      const mockResponse = { id: 2, slug: 'new-publisher', ...mockRequest };
      const mockData = {
        data: {
          success: true,
          data: mockResponse,
        },
      };
      vi.mocked(authAxios.post).mockResolvedValue(mockData);

      const result = await PublisherService.create(mockRequest);

      expect(authAxios.post).toHaveBeenCalledWith('/api/v1/admin/publishers', mockRequest);
      expect(result).toEqual(mockResponse);
    });

    it('should throw error on create failure', async () => {
      const mockRequest: PublisherRequest = { name: 'New Publisher', status: 'ACTIVE' };
      const mockData = {
        data: {
          success: false,
          message: 'Creation failed',
        },
      };
      vi.mocked(authAxios.post).mockResolvedValue(mockData);

      await expect(PublisherService.create(mockRequest)).rejects.toThrow('Creation failed');
    });

    it('should throw default error on create failure without message', async () => {
      const mockRequest: PublisherRequest = { name: 'New Publisher', status: 'ACTIVE' };
      const mockData = {
        data: {
          success: false,
        },
      };
      vi.mocked(authAxios.post).mockResolvedValue(mockData);

      await expect(PublisherService.create(mockRequest)).rejects.toThrow('Failed to add publisher');
    });
  });

  describe('update', () => {
    it('should update publisher successfully', async () => {
      const id = 1;
      const mockRequest: PublisherRequest = { name: 'Updated Publisher', status: 'INACTIVE' };
      const mockResponse = { id, slug: 'updated-publisher', ...mockRequest };
      const mockData = {
        data: {
          success: true,
          data: mockResponse,
        },
      };
      vi.mocked(authAxios.put).mockResolvedValue(mockData);

      const result = await PublisherService.update(id, mockRequest);

      expect(authAxios.put).toHaveBeenCalledWith(`/api/v1/admin/publishers/${id}`, mockRequest);
      expect(result).toEqual(mockResponse);
    });

    it('should throw error on update failure', async () => {
      const id = 1;
      const mockRequest: PublisherRequest = { name: 'Updated Publisher', status: 'ACTIVE' };
      const mockData = {
        data: {
          success: false,
          message: 'Update failed',
        },
      };
      vi.mocked(authAxios.put).mockResolvedValue(mockData);

      await expect(PublisherService.update(id, mockRequest)).rejects.toThrow('Update failed');
    });

    it('should throw default error on update failure without message', async () => {
      const id = 1;
      const mockRequest: PublisherRequest = { name: 'Updated Publisher', status: 'ACTIVE' };
      const mockData = {
        data: {
          success: false,
        },
      };
      vi.mocked(authAxios.put).mockResolvedValue(mockData);

      await expect(PublisherService.update(id, mockRequest)).rejects.toThrow('Failed to update publisher');
    });
  });

  describe('delete', () => {
    it('should delete publisher successfully', async () => {
      const id = 1;
      const mockData = {
        data: {
          success: true,
        },
      };
      vi.mocked(authAxios.delete).mockResolvedValue(mockData);

      await PublisherService.delete(id);

      expect(authAxios.delete).toHaveBeenCalledWith(`/api/v1/admin/publishers/${id}`);
    });

    it('should throw error on delete failure', async () => {
      const id = 1;
      const mockData = {
        data: {
          success: false,
          message: 'Delete failed',
        },
      };
      vi.mocked(authAxios.delete).mockResolvedValue(mockData);

      await expect(PublisherService.delete(id)).rejects.toThrow('Delete failed');
    });

    it('should throw default error on delete failure without message', async () => {
      const id = 1;
      const mockData = {
        data: {
          success: false,
        },
      };
      vi.mocked(authAxios.delete).mockResolvedValue(mockData);

      await expect(PublisherService.delete(id)).rejects.toThrow('Failed to delete publisher');
    });
  });
});
