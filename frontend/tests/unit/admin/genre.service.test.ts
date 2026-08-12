import { describe, it, expect, vi, afterEach } from 'vitest';
import GenreService from '@/modules/admin/genres/services/genre.service';
import { authAxios } from '@/libs/config/axios.config';
import type { GenreRequest, GenreFilterRequest } from '@/modules/admin/genres/types/genre.type';

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
          data: { items: [{ id: 1, name: 'Genre A', slug: 'genre-a', status: 'ACTIVE' }], total: 1 },
        },
      };
      vi.mocked(authAxios.get).mockResolvedValue(mockData);

      const result = await GenreService.search();

      expect(authAxios.get).toHaveBeenCalledWith('/api/v1/admin/genres/filter', { params: undefined });
      expect(result).toEqual(mockData.data.data);
    });

    it('should fetch genre data successfully with options', async () => {
      const mockData = {
        data: {
          success: true,
          data: { items: [{ id: 1, name: 'Genre A', slug: 'genre-a', status: 'ACTIVE' }], total: 1 },
        },
      };
      const options: GenreFilterRequest = { keyword: 'Gen', page: 1 };
      vi.mocked(authAxios.get).mockResolvedValue(mockData);

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
      vi.mocked(authAxios.get).mockResolvedValue(mockData);

      await expect(GenreService.search()).rejects.toThrow('Error fetching');
    });

    it('should throw default error when API returns success false without message', async () => {
      const mockData = {
        data: {
          success: false,
        },
      };
      vi.mocked(authAxios.get).mockResolvedValue(mockData);

      await expect(GenreService.search()).rejects.toThrow('Failed to fetch genre data');
    });
  });

  describe('create', () => {
    it('should create genre successfully', async () => {
      const mockRequest: GenreRequest = { name: 'New Genre', status: 'ACTIVE' };
      const mockResponse = { id: 2, slug: 'new-genre', ...mockRequest };
      const mockData = {
        data: {
          success: true,
          data: mockResponse,
        },
      };
      vi.mocked(authAxios.post).mockResolvedValue(mockData);

      const result = await GenreService.create(mockRequest);

      expect(authAxios.post).toHaveBeenCalledWith('/api/v1/admin/genres', mockRequest);
      expect(result).toEqual(mockResponse);
    });

    it('should throw error on create failure', async () => {
      const mockRequest: GenreRequest = { name: 'New Genre', status: 'ACTIVE' };
      const mockData = {
        data: {
          success: false,
          message: 'Creation failed',
        },
      };
      vi.mocked(authAxios.post).mockResolvedValue(mockData);

      await expect(GenreService.create(mockRequest)).rejects.toThrow('Creation failed');
    });

    it('should throw default error on create failure without message', async () => {
      const mockRequest: GenreRequest = { name: 'New Genre', status: 'ACTIVE' };
      const mockData = {
        data: {
          success: false,
        },
      };
      vi.mocked(authAxios.post).mockResolvedValue(mockData);

      await expect(GenreService.create(mockRequest)).rejects.toThrow('Failed to add genre');
    });
  });

  describe('update', () => {
    it('should update genre successfully', async () => {
      const id = 1;
      const mockRequest: GenreRequest = { name: 'Updated Genre', status: 'INACTIVE' };
      const mockResponse = { id, slug: 'updated-genre', ...mockRequest };
      const mockData = {
        data: {
          success: true,
          data: mockResponse,
        },
      };
      vi.mocked(authAxios.put).mockResolvedValue(mockData);

      const result = await GenreService.update(id, mockRequest);

      expect(authAxios.put).toHaveBeenCalledWith(`/api/v1/admin/genres/${id}`, mockRequest);
      expect(result).toEqual(mockResponse);
    });

    it('should throw error on update failure', async () => {
      const id = 1;
      const mockRequest: GenreRequest = { name: 'Updated Genre', status: 'ACTIVE' };
      const mockData = {
        data: {
          success: false,
          message: 'Update failed',
        },
      };
      vi.mocked(authAxios.put).mockResolvedValue(mockData);

      await expect(GenreService.update(id, mockRequest)).rejects.toThrow('Update failed');
    });

    it('should throw default error on update failure without message', async () => {
      const id = 1;
      const mockRequest: GenreRequest = { name: 'Updated Genre', status: 'ACTIVE' };
      const mockData = {
        data: {
          success: false,
        },
      };
      vi.mocked(authAxios.put).mockResolvedValue(mockData);

      await expect(GenreService.update(id, mockRequest)).rejects.toThrow('Failed to update genre');
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
      vi.mocked(authAxios.delete).mockResolvedValue(mockData);

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
      vi.mocked(authAxios.delete).mockResolvedValue(mockData);

      await expect(GenreService.delete(id)).rejects.toThrow('Delete failed');
    });

    it('should throw default error on delete failure without message', async () => {
      const id = 1;
      const mockData = {
        data: {
          success: false,
        },
      };
      vi.mocked(authAxios.delete).mockResolvedValue(mockData);

      await expect(GenreService.delete(id)).rejects.toThrow('Failed to delete genre');
    });
  });
});
