import { describe, it, expect, vi, afterEach } from 'vitest';
import SeriesService from '@/modules/admin/series/services/series.service';
import { authAxios } from '@/libs/config/axios.config';

vi.mock('@/libs/config/axios.config', () => ({
  authAxios: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('SeriesService', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('search', () => {
    it('should fetch series data successfully without options', async () => {
      const mockData = {
        data: {
          success: true,
          data: { items: [{ id: 1, name: 'Series A' }], total: 1 },
        },
      };
      (authAxios.get as any).mockResolvedValue(mockData);

      const result = await SeriesService.search();

      expect(authAxios.get).toHaveBeenCalledWith('/api/v1/admin/series/filter', { params: undefined });
      expect(result).toEqual(mockData.data.data);
    });

    it('should fetch series data successfully with options', async () => {
      const mockData = {
        data: {
          success: true,
          data: { items: [{ id: 1, name: 'Series A' }], total: 1 },
        },
      };
      const options = { q: 'Ser', page: 1 };
      (authAxios.get as any).mockResolvedValue(mockData);

      const result = await SeriesService.search(options);

      expect(authAxios.get).toHaveBeenCalledWith('/api/v1/admin/series/filter', { params: options });
      expect(result).toEqual(mockData.data.data);
    });

    it('should throw an error when API returns success false', async () => {
      const mockData = {
        data: {
          success: false,
          message: 'Error fetching',
        },
      };
      (authAxios.get as any).mockResolvedValue(mockData);

      await expect(SeriesService.search()).rejects.toThrow('Error fetching');
    });

    it('should throw default error when API returns success false without message', async () => {
      const mockData = {
        data: {
          success: false,
        },
      };
      (authAxios.get as any).mockResolvedValue(mockData);

      await expect(SeriesService.search()).rejects.toThrow('Failed to fetch series data');
    });
  });

  describe('create', () => {
    it('should create series successfully', async () => {
      const mockRequest = { name: 'New Series' };
      const mockResponse = { id: 2, ...mockRequest };
      const mockData = {
        data: {
          success: true,
          data: mockResponse,
        },
      };
      (authAxios.post as any).mockResolvedValue(mockData);

      const result = await SeriesService.create(mockRequest as any);

      expect(authAxios.post).toHaveBeenCalledWith('/api/v1/admin/series', mockRequest);
      expect(result).toEqual(mockResponse);
    });

    it('should throw error on create failure', async () => {
      const mockRequest = { name: 'New Series' };
      const mockData = {
        data: {
          success: false,
          message: 'Creation failed',
        },
      };
      (authAxios.post as any).mockResolvedValue(mockData);

      await expect(SeriesService.create(mockRequest as any)).rejects.toThrow('Creation failed');
    });

    it('should throw default error on create failure without message', async () => {
      const mockRequest = { name: 'New Series' };
      const mockData = {
        data: {
          success: false,
        },
      };
      (authAxios.post as any).mockResolvedValue(mockData);

      await expect(SeriesService.create(mockRequest as any)).rejects.toThrow('Failed to add series');
    });
  });

  describe('update', () => {
    it('should update series successfully', async () => {
      const id = 1;
      const mockRequest = { name: 'Updated Series' };
      const mockResponse = { id, ...mockRequest };
      const mockData = {
        data: {
          success: true,
          data: mockResponse,
        },
      };
      (authAxios.put as any).mockResolvedValue(mockData);

      const result = await SeriesService.update(id, mockRequest as any);

      expect(authAxios.put).toHaveBeenCalledWith(`/api/v1/admin/series/${id}`, mockRequest);
      expect(result).toEqual(mockResponse);
    });

    it('should throw error on update failure', async () => {
      const id = 1;
      const mockRequest = { name: 'Updated Series' };
      const mockData = {
        data: {
          success: false,
          message: 'Update failed',
        },
      };
      (authAxios.put as any).mockResolvedValue(mockData);

      await expect(SeriesService.update(id, mockRequest as any)).rejects.toThrow('Update failed');
    });

    it('should throw default error on update failure without message', async () => {
      const id = 1;
      const mockRequest = { name: 'Updated Series' };
      const mockData = {
        data: {
          success: false,
        },
      };
      (authAxios.put as any).mockResolvedValue(mockData);

      await expect(SeriesService.update(id, mockRequest as any)).rejects.toThrow('Failed to update series');
    });
  });

  describe('delete', () => {
    it('should delete series successfully', async () => {
      const id = 1;
      const mockData = {
        data: {
          success: true,
        },
      };
      (authAxios.delete as any).mockResolvedValue(mockData);

      await SeriesService.delete(id);

      expect(authAxios.delete).toHaveBeenCalledWith(`/api/v1/admin/series/${id}`);
    });

    it('should throw error on delete failure', async () => {
      const id = 1;
      const mockData = {
        data: {
          success: false,
          message: 'Delete failed',
        },
      };
      (authAxios.delete as any).mockResolvedValue(mockData);

      await expect(SeriesService.delete(id)).rejects.toThrow('Delete failed');
    });

    it('should throw default error on delete failure without message', async () => {
      const id = 1;
      const mockData = {
        data: {
          success: false,
        },
      };
      (authAxios.delete as any).mockResolvedValue(mockData);

      await expect(SeriesService.delete(id)).rejects.toThrow('Failed to delete series');
    });
  });
});
