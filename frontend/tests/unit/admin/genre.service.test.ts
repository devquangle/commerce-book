import { describe, it, expect, vi, afterEach } from 'vitest';
import GenreService from '@/modules/admin/genres/services/genre.service';
import { authAxios } from '@/libs/config/axios.config';

vi.mock('@/libs/config/axios.config', () => ({
  authAxios: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('GenreService', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('search', () => {
    it('should fetch genre data successfully without options', async () => {
      const mockData = {
        data: {
          success: true,
          data: { items: [{ id: 1, name: 'Genre A' }], total: 1 },
        },
      };
      (authAxios.get as any).mockResolvedValue(mockData);

      const result = await GenreService.search();

      expect(authAxios.get).toHaveBeenCalledWith('/api/v1/admin/genres/filter', { params: undefined });
      expect(result).toEqual(mockData.data.data);
    });

    it('should fetch genre data successfully with options', async () => {
      const mockData = {
        data: {
          success: true,
          data: { items: [{ id: 1, name: 'Genre A' }], total: 1 },
        },
      };
      const options = { q: 'Gen', page: 1 };
      (authAxios.get as any).mockResolvedValue(mockData);

      const result = await GenreService.search(options);

      expect(authAxios.get).toHaveBeenCalledWith('/api/v1/admin/genres/filter', { params: options });
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

      await expect(GenreService.search()).rejects.toThrow('Error fetching');
    });

    it('should throw default error when API returns success false without message', async () => {
      const mockData = {
        data: {
          success: false,
        },
      };
      (authAxios.get as any).mockResolvedValue(mockData);

      await expect(GenreService.search()).rejects.toThrow('Failed to fetch genre data');
    });
  });

  describe('create', () => {
    it('should create genre successfully', async () => {
      const mockRequest = { name: 'New Genre' };
      const mockResponse = { id: 2, ...mockRequest };
      const mockData = {
        data: {
          success: true,
          data: mockResponse,
        },
      };
      (authAxios.post as any).mockResolvedValue(mockData);

      const result = await GenreService.create(mockRequest as any);

      expect(authAxios.post).toHaveBeenCalledWith('/api/v1/admin/genres', mockRequest);
      expect(result).toEqual(mockResponse);
    });

    it('should throw error on create failure', async () => {
      const mockRequest = { name: 'New Genre' };
      const mockData = {
        data: {
          success: false,
          message: 'Creation failed',
        },
      };
      (authAxios.post as any).mockResolvedValue(mockData);

      await expect(GenreService.create(mockRequest as any)).rejects.toThrow('Creation failed');
    });

    it('should throw default error on create failure without message', async () => {
      const mockRequest = { name: 'New Genre' };
      const mockData = {
        data: {
          success: false,
        },
      };
      (authAxios.post as any).mockResolvedValue(mockData);

      await expect(GenreService.create(mockRequest as any)).rejects.toThrow('Failed to add genre');
    });
  });

  describe('update', () => {
    it('should update genre successfully', async () => {
      const id = 1;
      const mockRequest = { name: 'Updated Genre' };
      const mockResponse = { id, ...mockRequest };
      const mockData = {
        data: {
          success: true,
          data: mockResponse,
        },
      };
      (authAxios.put as any).mockResolvedValue(mockData);

      const result = await GenreService.update(id, mockRequest as any);

      expect(authAxios.put).toHaveBeenCalledWith(`/api/v1/admin/genres/${id}`, mockRequest);
      expect(result).toEqual(mockResponse);
    });

    it('should throw error on update failure', async () => {
      const id = 1;
      const mockRequest = { name: 'Updated Genre' };
      const mockData = {
        data: {
          success: false,
          message: 'Update failed',
        },
      };
      (authAxios.put as any).mockResolvedValue(mockData);

      await expect(GenreService.update(id, mockRequest as any)).rejects.toThrow('Update failed');
    });

    it('should throw default error on update failure without message', async () => {
      const id = 1;
      const mockRequest = { name: 'Updated Genre' };
      const mockData = {
        data: {
          success: false,
        },
      };
      (authAxios.put as any).mockResolvedValue(mockData);

      await expect(GenreService.update(id, mockRequest as any)).rejects.toThrow('Failed to update genre');
    });
  });

  describe('delete', () => {
    it('should delete genre successfully', async () => {
      const id = 1;
      const mockData = {
        data: {
          success: true,
        },
      };
      (authAxios.delete as any).mockResolvedValue(mockData);

      await GenreService.delete(id);

      expect(authAxios.delete).toHaveBeenCalledWith(`/api/v1/admin/genres/${id}`);
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

      await expect(GenreService.delete(id)).rejects.toThrow('Delete failed');
    });

    it('should throw default error on delete failure without message', async () => {
      const id = 1;
      const mockData = {
        data: {
          success: false,
        },
      };
      (authAxios.delete as any).mockResolvedValue(mockData);

      await expect(GenreService.delete(id)).rejects.toThrow('Failed to delete genre');
    });
  });
});
