import { useEffect, useRef, useState } from "react";
interface ProductDescriptionProps {
  description: string | null;
}
const ProductDescription = ({ description }: ProductDescriptionProps) => {
     const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const node = contentRef.current;
    if (!node) return;

    // Cho phép thời gian DOM render HTML xong
    const checkHeight = () => {
      const shouldShow = node.scrollHeight > 300;
      if (shouldShow !== showButton) {
        setShowButton(shouldShow);
      }
    };

    const rafId = window.requestAnimationFrame(checkHeight);
    
    // Fallback timer just in case images in HTML load later
    const timeoutId = setTimeout(checkHeight, 500);

    return () => {
      window.cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
    };
  }, [description, showButton]);

  return  <div className="card-custom">
      <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-6">Mô tả sản phẩm</h2>
      
      <div className="relative">
        <div 
          ref={contentRef}
          className={`
            prose prose-sm md:prose-base tiptap max-w-none text-slate-600 leading-relaxed
            prose-p:mb-4 prose-a:text-blue-600 prose-img:rounded-xl prose-img:max-w-full
            prose-img:mx-auto prose-img:block
            overflow-hidden transition-all duration-300
            ${!isExpanded ? 'max-h-75' : ''}
          `}
        >
          {description ? (
            <div dangerouslySetInnerHTML={{ __html: description }} />
          ) : (
            <p className="text-slate-500 italic">Chưa có mô tả cho sản phẩm này.</p>
          )}
        </div>
        
        {/* Lớp phủ mờ (Fade out gradient) khi chưa mở rộng */}
        {!isExpanded && showButton && (
          <div className="absolute bottom-0 left-0 right-0 h-28 bg-linear-to-t from-white via-white/80 to-transparent pointer-events-none" />
        )}
      </div>

      {/* Nút Xem thêm / Thu gọn */}
      {showButton && (
        <div className="mt-8 flex justify-center">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-8 py-2 text-sm font-semibold text-blue-600 border border-blue-200 rounded-full hover:bg-blue-50 hover:border-blue-300 transition-colors shadow-sm"
          >
            {isExpanded ? 'Thu gọn' : 'Xem thêm'}
          </button>
        </div>
      )}
    </div>
};

export default ProductDescription;
