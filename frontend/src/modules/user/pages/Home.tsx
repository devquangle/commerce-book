import { Link } from "react-router-dom";
import { ArrowRight, Star, ShoppingCart, Heart, TrendingUp, BookOpen, Clock, Award } from "lucide-react";
import Container from "@/components/common/Container";

// --- Mock Data ---
const featuredBooks = [
  { id: 1, title: "Nhà Giả Kim", author: "Paulo Coelho", price: 85000, oldPrice: 100000, rating: 4.8, cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop" },
  { id: 2, title: "Đắc Nhân Tâm", author: "Dale Carnegie", price: 95000, oldPrice: 120000, rating: 4.9, cover: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=600&auto=format&fit=crop" },
  { id: 3, title: "Sapiens: Lược Sử Loài Người", author: "Yuval Noah Harari", price: 150000, oldPrice: 200000, rating: 4.9, cover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600&auto=format&fit=crop" },
  { id: 4, title: "Cây Cam Ngọt Của Tôi", author: "José Mauro de Vasconcelos", price: 75000, rating: 4.7, cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop" },
  { id: 5, title: "Muôn Kiếp Nhân Sinh", author: "Nguyên Phong", price: 120000, oldPrice: 150000, rating: 4.6, cover: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?q=80&w=600&auto=format&fit=crop" },
];

const categories = [
  { id: "van-hoc", name: "Văn học", icon: BookOpen, color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
  { id: "kinh-te", name: "Kinh tế", icon: TrendingUp, color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" },
  { id: "ky-nang", name: "Kỹ năng sống", icon: Award, color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" },
  { id: "thieu-nhi", name: "Thiếu nhi", icon: Star, color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" },
  { id: "lich-su", name: "Lịch sử", icon: Clock, color: "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400" },
];

// --- Components ---
interface BookData {
  id: number;
  title: string;
  author: string;
  price: number;
  oldPrice?: number;
  rating: number;
  cover: string;
}

const BookCard = ({ book }: { book: BookData }) => (
  <div className="group flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
    <div className="relative aspect-3/4 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
      <img
        src={book.cover}
        alt={book.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      {book.oldPrice && (
        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
          -{Math.round((1 - book.price / book.oldPrice) * 100)}%
        </div>
      )}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm rounded-full text-zinc-600 dark:text-zinc-300 hover:text-red-500 dark:hover:text-red-400 shadow-sm transition-colors">
          <Heart className="w-4 h-4" />
        </button>
      </div>
    </div>
    
    <div className="p-4 flex flex-col flex-1">
      <h3 className="font-bold text-zinc-900 dark:text-white line-clamp-1 mb-1">
        <Link to={`/books/${book.id}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          {book.title}
        </Link>
      </h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">{book.author}</p>
      
      <div className="flex items-center gap-1 mb-4 mt-auto">
        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{book.rating}</span>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <span className="font-bold text-lg text-blue-600 dark:text-blue-400">
            {book.price.toLocaleString("vi-VN")}đ
          </span>
          {book.oldPrice && (
            <span className="text-xs text-zinc-400 line-through ml-2">
              {book.oldPrice.toLocaleString("vi-VN")}đ
            </span>
          )}
        </div>
        <button className="p-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-full hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 transition-colors">
          <ShoppingCart className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
);

// --- Main Page ---
const Home = () => {
  return (
    <Container className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-zinc-900">
        {/* Placeholder for Hero Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop" 
            alt="Library" 
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-900/80 to-transparent"></div>
        </div>
        
        <div className="relative px-6 py-20 sm:px-12 sm:py-28 lg:px-20 max-w-3xl">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 text-blue-300 font-semibold text-sm mb-6 border border-blue-500/30">
            #ĐọcSáchMỗiNgày
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight">
            Thế giới tri thức <br className="hidden sm:block" /> nằm trong tay bạn.
          </h1>
          <p className="text-lg text-zinc-300 mb-8 max-w-xl leading-relaxed">
            Khám phá hàng ngàn tựa sách từ văn học kinh điển đến kỹ năng sống. Ưu đãi đến 50% cho các đầu sách mới nhất trong tháng này.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/books" className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2">
              Khám phá ngay <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/promotions" className="px-6 py-3 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 backdrop-blur-md transition-colors">
              Xem ưu đãi
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Danh mục yêu thích</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link key={cat.id} to={`/books?category=${cat.id}`} className="group flex flex-col items-center justify-center p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg transition-all">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${cat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Books */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Sách Bán Chạy</h2>
          <Link to="/books?sort=bestseller" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
            Xem tất cả <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {featuredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>
      
      {/* Promo Banner */}
      <section className="rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 sm:p-12 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8 shadow-xl">
        <div className="max-w-xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Mở Khóa Tương Lai Qua Từng Trang Sách</h2>
          <p className="text-blue-100 text-lg mb-6">Đăng ký thành viên BookShop ngay hôm nay để nhận mã giảm giá 50.000đ cho đơn hàng đầu tiên.</p>
          <button className="px-8 py-3 bg-white text-blue-700 font-bold rounded-xl hover:bg-zinc-100 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
            Đăng ký ngay
          </button>
        </div>
        <div className="hidden lg:block">
          {/* Decorative element for banner */}
          <BookOpen className="w-32 h-32 text-white/20 -rotate-12" />
        </div>
      </section>

      {/* New Arrivals */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Sách Mới Phát Hành</h2>
          <Link to="/books?sort=new" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
            Xem tất cả <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {/* Reusing featured books mock data for demonstration */}
          {[...featuredBooks].reverse().map((book) => (
            <BookCard key={`new-${book.id}`} book={book} />
          ))}
        </div>
      </section>
    </Container>
  );
};

export default Home;
