import { useEffect, useRef, useState } from "react";
interface ProductDescriptionProps {
  description: string | null;
}

const ProductDescription = ({ description }: ProductDescriptionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [showButton, setShowButton] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    const node = contentRef.current;
    if (!node) return;

    const checkHeight = () => {
      if (!node) return;
      setContentHeight(node.scrollHeight);
      setShowButton(node.scrollHeight > 300);
    };

    // Initial check
    checkHeight();

    // Observe changes in size (e.g. window resize or images loading)
    const resizeObserver = new ResizeObserver(() => {
      checkHeight();
    });
    resizeObserver.observe(node);

    return () => {
      resizeObserver.disconnect();
    };
  }, [description]);

  return (
    <div className="card-custom">
      <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">Mô tả sản phẩm</h2>
      
      <div className="relative mt-2">
        <div 
          ref={contentRef}
          style={{
            maxHeight: isExpanded ? `${contentHeight}px` : '300px'
          }}
          className={`
            prose prose-sm md:prose-base tiptap max-w-none text-slate-600 leading-relaxed
            [&>div>*:first-child]:mt-0
            prose-p:mb-4 prose-a:text-blue-600 prose-img:rounded-xl prose-img:max-w-full
            prose-img:mx-auto prose-img:block prose-headings:font-bold prose-headings:text-slate-900 prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
            overflow-hidden transition-[max-height] duration-500 ease-in-out
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
          <div className="absolute bottom-0 left-0 right-0 h-28 bg-linear-to-t from-white via-white/80 to-transparent pointer-events-none transition-opacity duration-300" />
        )}
      </div>

      {/* Nút Xem thêm / Thu gọn */}
      {showButton && (
        <div className="mt-4 flex justify-center">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 font-medium text-sm hover:underline cursor-pointer"
          >
            {isExpanded ? 'Rút gọn' : 'Xem thêm'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductDescription;
