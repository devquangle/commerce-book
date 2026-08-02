import React, { useEffect } from "react";

interface LoadingProps {
  inline?: boolean;
  className?: string;
  message?: string;
  subMessage?: string;
}

const Spinner: React.FC<LoadingProps> = ({
  inline = false,
  className = "",
  message = "Đang tải...",
  subMessage = "Vui lòng chờ trong giây lát...",
}) => {
  useEffect(() => {
    if (inline) return;

    // Block scrolling on the body
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    
    // Prevent layout shift by calculating scrollbar width
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      // Restore scrolling and padding
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [inline]);

  if (inline) {
    return (
      <div className={`flex items-center justify-center p-4 w-full ${className}`}>
        <div className="relative w-8 h-8 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-slate-100 dark:border-slate-800"></div>
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-600 border-r-indigo-600 animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 z-9999 flex items-center justify-center bg-slate-950/40 backdrop-blur-md transition-opacity duration-300 ${className}`}>
      {/* Glass card container */}
      <div className="relative flex flex-col items-center justify-center p-8 bg-white/95 dark:bg-slate-900/95 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800/60 max-w-[280px] w-full mx-4 transition-transform duration-300 scale-100">
        
        {/* Animated Spinner Spinner Container */}
        <div className="relative w-16 h-16 mb-4 flex items-center justify-center">
          {/* Outer glowing ripple */}
          <div className="absolute inset-0 rounded-full bg-indigo-500/10 animate-ping duration-[1.5s]"></div>
          
          {/* Outer spinning gradient ring */}
          <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-slate-800"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 border-r-indigo-600 animate-spin"></div>
          
          {/* Inner reverse spinning ring */}
          <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-indigo-400 border-l-indigo-400 animate-[spin_1.5s_linear_infinite_reverse]"></div>
        </div>

        {/* Text */}
        <div className="text-center">
          <h3 className="text-slate-800 dark:text-slate-100 font-semibold text-base mb-1 tracking-wide">
            {message}
          </h3>
          {subMessage && (
            <p className="text-slate-500 dark:text-slate-400 text-xs animate-pulse">
              {subMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Spinner;