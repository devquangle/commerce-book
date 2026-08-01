import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Book, BookOpen, Heart, Star, Sparkles, Feather, PenTool, Coffee, Monitor } from "lucide-react";

export const StorefrontMegaMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const categories = [
    { name: "Văn học", icon: Book, count: 1205, href: "/books?category=van-hoc" },
    { name: "Kỹ năng sống", icon: Heart, count: 854, href: "/books?category=ky-nang" },
    { name: "Kinh tế", icon: Star, count: 642, href: "/books?category=kinh-te" },
    { name: "Thiếu nhi", icon: Sparkles, count: 1530, href: "/books?category=thieu-nhi" },
    { name: "Công nghệ", icon: Monitor, count: 420, href: "/books?category=cong-nghe" },
  ];

  const authors = [
    { name: "Nguyễn Nhật Ánh", icon: Feather, count: 45, href: "/books?author=nguyen-nhat-anh" },
    { name: "Haruki Murakami", icon: PenTool, count: 28, href: "/books?author=haruki-murakami" },
    { name: "Higashino Keigo", icon: Coffee, count: 32, href: "/books?author=higashino-keigo" },
    { name: "Thích Nhất Hạnh", icon: Heart, count: 56, href: "/books?author=thich-nhat-hanh" },
    { name: "Paulo Coelho", icon: Sparkles, count: 15, href: "/books?author=paulo-coelho" },
  ];

  return (
    <div ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 text-sm font-semibold text-zinc-700 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none"
      >
        Danh mục
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-[68px] left-0 w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-50 overflow-hidden">
          <div className="grid grid-cols-4 divide-x divide-zinc-100 dark:divide-zinc-800">
            {/* Cột 1: Thể loại 1 */}
            <div className="p-6 md:p-8">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-4">
                Thể loại nổi bật
              </h3>
              <ul className="space-y-1">
                {categories.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 rounded-md bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="font-medium text-sm text-zinc-700 dark:text-zinc-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {item.name}
                          </span>
                        </div>
                        <span className="text-xs text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                          {item.count}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <Link to="/categories" className="inline-block mt-4 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                Xem tất cả thể loại &rarr;
              </Link>
            </div>

            {/* Cột 2: Tác giả */}
            <div className="p-6 md:p-8">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-4">
                Tác giả tiêu biểu
              </h3>
              <ul className="space-y-1">
                {authors.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 rounded-md bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400 group-hover:bg-pink-600 group-hover:text-white transition-colors">
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="font-medium text-sm text-zinc-700 dark:text-zinc-300 group-hover:text-pink-600 dark:group-hover:text-pink-400">
                            {item.name}
                          </span>
                        </div>
                        <span className="text-xs text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                          {item.count}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <Link to="/authors" className="inline-block mt-4 text-sm font-semibold text-pink-600 dark:text-pink-400 hover:underline">
                Khám phá tác giả &rarr;
              </Link>
            </div>

            {/* Cột 3: Nổi bật */}
            <div className="p-6 md:p-8">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-4">
                Bộ sưu tập
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/collections/best-seller" onClick={() => setIsOpen(false)} className="flex items-center gap-3 group">
                    <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center group-hover:bg-amber-100 dark:group-hover:bg-amber-900/30 transition-colors">
                      <Star className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400">Sách Bán Chạy</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">Top 100 tuần qua</p>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/collections/new-arrivals" onClick={() => setIsOpen(false)} className="flex items-center gap-3 group">
                    <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center group-hover:bg-green-100 dark:group-hover:bg-green-900/30 transition-colors">
                      <Sparkles className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400">Sách Mới Phát Hành</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">Cập nhật mỗi ngày</p>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/collections/award-winning" onClick={() => setIsOpen(false)} className="flex items-center gap-3 group">
                    <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 transition-colors">
                      <Book className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">Sách Đạt Giải</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">Tác phẩm kinh điển</p>
                    </div>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Cột 4: Banner */}
            <div className="p-6 md:p-8 bg-zinc-50 dark:bg-zinc-800/20 flex flex-col justify-center items-center text-center">
              <div className="w-full h-40 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mb-4 overflow-hidden relative group">
                {/* Fallback pattern if no image */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  <BookOpen className="w-10 h-10 text-white mb-2" />
                  <span className="font-bold text-white text-lg leading-tight">Sale Sách Mới<br/>Giảm 50%</span>
                </div>
                {/* You can replace this img with an actual banner url */}
                {/* <img src="banner-url" alt="Promo" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> */}
              </div>
              <h4 className="font-bold text-zinc-900 dark:text-white mb-2">Tháng Đọc Sách</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">Khám phá hàng ngàn tựa sách mới ra mắt tháng này với ưu đãi ngập tràn.</p>
              <Link
                to="/promotions"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
              >
                Xem ưu đãi ngay
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
