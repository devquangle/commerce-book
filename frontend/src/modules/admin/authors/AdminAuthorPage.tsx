import React, { useState, useEffect } from "react";
import { AuthorHeader } from "./components/AuthorHeader";
import { AuthorFilter } from "./components/AuthorFilter";
import { AuthorTable } from "./components/AuthorTable";
import { AuthorMobileCard } from "./components/AuthorMobileCard";
import { AuthorSkeleton, AuthorMobileSkeleton } from "./components/AuthorSkeleton";
import { AuthorModal } from "./components/AuthorModal";
import type { AuthorResponse, AuthorFilterState, AuthorRequest } from "./types/author.type";

const MOCK_AUTHORS: AuthorResponse[] = [
  {
    id: 1,
    name: "Tô Hoài",
    slug: "to-hoai",
    urlImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Tohoai.jpg/220px-Tohoai.jpg",
    description: "Nhà văn nổi tiếng với Dế Mèn phiêu lưu ký.",
    urlBio: "https://vi.wikipedia.org/wiki/T%C3%B4_Ho%C3%A0i",
    status: "ACTIVE"
  },
  {
    id: 2,
    name: "Nam Cao",
    slug: "nam-cao",
    urlImage: "",
    description: "Nhà văn hiện thực xuất sắc của thế kỷ 20.",
    urlBio: "https://vi.wikipedia.org/wiki/Nam_Cao",
    status: "INACTIVE"
  },
  {
    id: 3,
    name: "Vũ Trọng Phụng",
    slug: "vu-trong-phung",
    urlImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Vu-trong-phung-2.jpg/220px-Vu-trong-phung-2.jpg",
    description: "Ông vua phóng sự đất Bắc.",
    urlBio: "https://vi.wikipedia.org/wiki/V%C5%A9_Tr%E1%BB%8Dng_Ph%E1%BB%A5ng",
    status: "ACTIVE"
  },
  {
    id: 4,
    name: "Nguyễn Nhật Ánh",
    slug: "nguyen-nhat-anh",
    urlImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Nguyen_Nhat_Anh_2016.jpg/220px-Nguyen_Nhat_Anh_2016.jpg",
    description: "Nhà văn viết cho thiếu nhi nổi tiếng.",
    urlBio: "https://vi.wikipedia.org/wiki/Nguy%E1%BB%85n_Nh%E1%BA%ADt_%C3%81nh",
    status: "ACTIVE"
  },
  {
    id: 5,
    name: "Xuân Diệu",
    slug: "xuan-dieu",
    urlImage: "",
    description: "Ông hoàng thơ tình Việt Nam.",
    urlBio: "https://vi.wikipedia.org/wiki/Xu%C3%A2n_Di%E1%BB%87u",
    status: "DELETED"
  }
];

const AdminAuthorPage = () => {
  const [authors, setAuthors] = useState<AuthorResponse[]>(MOCK_AUTHORS);
  const [filterState, setFilterState] = useState<AuthorFilterState>({ page: 1, size: 10 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<AuthorResponse | null>(null);

  const handleFilterChange = (updatedState: Partial<AuthorFilterState>) => {
    setFilterState((prev) => ({ ...prev, ...updatedState, page: 1 }));
  };

  const handleResetFilter = () => {
    setFilterState({ page: 1, size: 10 });
  };

  const handlePageChange = (page: number) => {
    setFilterState((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (size: number) => {
    setFilterState((prev) => ({ ...prev, size, page: 1 }));
  };

  const handleAddAuthor = () => {
    setSelectedAuthor(null);
    setIsModalOpen(true);
  };

  const handleEditAuthor = (author: AuthorResponse) => {
    setSelectedAuthor(author);
    setIsModalOpen(true);
  };

  const handleDeleteAuthor = (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tác giả này?")) {
      setAuthors(authors.map(a => a.id === id ? { ...a, status: "DELETED" } : a));
    }
  };

  const handleSaveAuthor = (authorData: AuthorRequest & { id?: number }) => {
    if (authorData.id) {
      setAuthors(authors.map(a => a.id === authorData.id ? { 
        ...a, 
        name: authorData.name,
        urlImage: authorData.urlImage,
        description: authorData.extract,
        urlBio: authorData.urlBio,
        status: authorData.status
      } : a));
    } else {
      const newAuthor: AuthorResponse = {
        id: Date.now(),
        name: authorData.name,
        slug: authorData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        urlImage: authorData.urlImage,
        description: authorData.extract,
        urlBio: authorData.urlBio,
        status: authorData.status
      };
      setAuthors([newAuthor, ...authors]);
    }
    setIsModalOpen(false);
  };

  const [isLoading, setIsLoading] = useState(true);

  // Filter mock data (simulate API)
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [filterState]);

  const filteredAuthors = authors.filter(a => {
    if (filterState.keyword && !a.name.toLowerCase().includes(filterState.keyword.toLowerCase())) return false;
    if (filterState.status && a.status !== filterState.status) return false;
    return true;
  });

  const paginatedAuthors = filteredAuthors.slice(
    ((filterState.page || 1) - 1) * (filterState.size || 10),
    (filterState.page || 1) * (filterState.size || 10)
  );

  return (
    <div className="flex flex-col gap-6 w-full  min-h-full pb-6">
      <AuthorHeader onAddAuthor={handleAddAuthor} />
      
      <AuthorFilter 
        filterState={filterState} 
        onChange={handleFilterChange} 
        onReset={handleResetFilter} 
      />
      
      {isLoading ? (
        <>
          <div className="hidden md:block">
            <AuthorSkeleton />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
            <AuthorMobileSkeleton />
            <AuthorMobileSkeleton />
            <AuthorMobileSkeleton />
          </div>
        </>
      ) : (
        <>
          <AuthorTable 
            authors={paginatedAuthors}
            page={filterState.page}
            pageSize={filterState.size}
            totalElements={filteredAuthors.length}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onEdit={handleEditAuthor}
            onDelete={handleDeleteAuthor}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
            {paginatedAuthors.map((author) => (
              <AuthorMobileCard
                key={author.id}
                author={author}
                onEdit={handleEditAuthor}
                onDelete={handleDeleteAuthor}
              />
            ))}
            {paginatedAuthors.length === 0 && (
              <div className="col-span-full py-12 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-zinc-500">
                Không tìm thấy tác giả phù hợp
              </div>
            )}
          </div>
        </>
      )}

      {isModalOpen && (
        <AuthorModal
          isOpen={isModalOpen}
          author={selectedAuthor}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveAuthor}
        />
      )}
    </div>
  );
};

export default AdminAuthorPage;
