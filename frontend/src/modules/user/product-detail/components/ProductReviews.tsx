import { useState } from "react";
import { Star } from "lucide-react";
import type { ProductReviewResponse } from "../types/product-review.type";

interface ProductReviewsProps {
  data: ProductReviewResponse;
}

const ProductReviews = ({data}:ProductReviewsProps) => {
   const [isExpanded, setIsExpanded] = useState(false);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const initialCommentsCount = 2; 
  
  const filteredComments = filterRating 
    ? (data.comments || []).filter(c => c.star === filterRating)
    : [...(data.comments || [])];

  const sortedComments = filteredComments.sort((a, b) => {
    const dateA = Date.parse(a.createdAt);
    const dateB = Date.parse(b.createdAt);
    
    // Sort by valid date if possible
    if (!isNaN(dateA) && !isNaN(dateB)) {
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    }
    
    // Fallback for mock strings ("2 ngày trước") using ID
    return sortOrder === 'newest' ? b.id - a.id : a.id - b.id;
  });

  const visibleComments = isExpanded ? sortedComments : sortedComments.slice(0, initialCommentsCount);
  const showButton = sortedComments.length > initialCommentsCount;

  return (
    <div className="card-custom mb-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Khách hàng đánh giá</h2>
      
      <div className="flex flex-col md:flex-row items-center gap-8 mb-10 p-6 bg-slate-50 rounded-2xl border border-slate-100">
        <div className="text-center">
          <div className="text-5xl font-black text-blue-600 mb-2">
            {data.rating}
          </div>
          <div className="flex text-amber-400 mb-1 justify-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={i < Math.floor(data.rating || 0) ? "fill-current" : "text-slate-200"}
                size={20}
              />
            ))}
          </div>
          <div className="text-sm text-slate-500">
            {data.reviewCount} đánh giá
          </div>
        </div>
        
        <div className="flex-1 w-full space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const detail = data.starDetail.find(d => d.start === star);
            const count = detail ? detail.count : 0;
            const percentage = (data.reviewCount && data.reviewCount > 0) ? (count / data.reviewCount) * 100 : 0;
            
            return (
              <div key={star} className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-600 w-12">
                  {star} sao
                </span>
                <div className="flex-1 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-xs text-slate-500 w-8">{count}</span>
              </div>
            );
          })}
        </div>
        
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <span className="text-sm font-semibold text-slate-700 mr-2">Lọc theo:</span>
        <button
          onClick={() => {
            setFilterRating(null);
            setIsExpanded(false);
          }}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
            filterRating === null 
              ? "bg-blue-50 border-blue-200 text-blue-600" 
              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          Tất cả
        </button>

        {/* Sort Buttons */}
        <div className="flex items-center gap-2 border-l border-slate-200 pl-3 ml-1 mr-1">
          <button
            onClick={() => {
              setSortOrder('newest');
              setIsExpanded(false);
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
              sortOrder === 'newest'
                ? "bg-blue-50 border-blue-200 text-blue-600" 
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            Mới nhất
          </button>
          <button
            onClick={() => {
              setSortOrder('oldest');
              setIsExpanded(false);
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
              sortOrder === 'oldest'
                ? "bg-blue-50 border-blue-200 text-blue-600" 
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            Cũ nhất
          </button>
        </div>

        <div className="border-l border-slate-200 pl-3 ml-1 flex flex-wrap gap-2">
          {[5, 4, 3, 2, 1].map(star => (
            <button
              key={star}
              onClick={() => {
                setFilterRating(star);
                setIsExpanded(false);
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                filterRating === star 
                  ? "bg-blue-50 border-blue-200 text-blue-600" 
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span>{star}</span>
              <Star size={14} className={filterRating === star ? "fill-blue-600 text-blue-600" : "fill-slate-400 text-slate-400"} />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {visibleComments.map((comment) => (
          <div key={comment.id} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
            <div className="flex justify-between mb-2">
              <div className="font-bold text-slate-900">{comment.fullName}</div>
              <div className="text-sm text-slate-400">{new Date(comment.createdAt).toLocaleDateString('vi-VN') || comment.createdAt}</div>
            </div>
            <div className="flex text-amber-400 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={i < comment.star ? "fill-current" : "text-slate-200"} size={14} />
              ))}
            </div>
            <p className="text-slate-600 mb-3">{comment.comment}</p>
            
            {/* Render Images */}
            {comment.images && comment.images.length > 0 && (
              <div className="flex gap-2 mb-4">
                {comment.images.map((img) => (
                  <div key={img.imageId} className="w-20 h-20 rounded-md overflow-hidden border border-slate-200">
                    <img src={img.urlImage} alt="review" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            {/* Render Reply */}
            {comment.reply && (
              <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-100 flex gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-slate-200">
                  {comment.reply.avatar ? (
                    <img src={comment.reply.avatar} alt={comment.reply.fullName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold text-sm">
                      {(comment.reply.fullName || 'S').charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-bold text-sm text-slate-900">{comment.reply.fullName || 'Phản hồi từ người bán'}</span>
                    <span className="text-xs text-slate-500">{new Date(comment.reply.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <p className="text-sm text-slate-600">{comment.reply.replyComment}</p>
                </div>
              </div>
            )}
          </div>
        ))}
        {sortedComments.length === 0 && (
          <p className="text-center text-slate-500 py-4">Chưa có đánh giá nào.</p>
        )}
      </div>
      
      {showButton && (
        <div className="mt-8 flex justify-center">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-8 py-2.5 text-blue-600 border border-blue-200 rounded-full font-semibold hover:bg-blue-50 transition-colors shadow-sm"
          >
            {isExpanded ? 'Thu gọn' : `Xem thêm ${sortedComments.length - initialCommentsCount} đánh giá`}
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductReviews