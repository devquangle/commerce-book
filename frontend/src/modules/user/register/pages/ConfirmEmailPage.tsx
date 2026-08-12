"use client";

import React, { useState } from 'react';
import { Button } from '@/components/common/Button';

const ConfirmEmailPage = () => {
  // Giả lập trạng thái error, trong thực tế có thể lấy từ URL hoặc API response
  const [error, setError] = useState<string | null>("JWT_INVALID");
  const [isLoading, setIsLoading] = useState(false);

  const handleResend = () => {
    setIsLoading(true);
    // TODO: Gọi API gửi lại email xác thực
    setTimeout(() => {
      setIsLoading(false);
      alert("Đã gửi lại email xác thực!");
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-800">
        {error === 'JWT_INVALID' ? (
          <>
            <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-500 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Liên kết không hợp lệ</h2>
            <p className="text-zinc-500 dark:text-zinc-400">
              Liên kết xác thực của bạn đã hết hạn hoặc không hợp lệ. Vui lòng yêu cầu gửi lại email xác thực mới để tiếp tục.
            </p>
            <div className="pt-4">
              <Button 
                onClick={handleResend} 
                variant="primary" 
                fullWidth 
                size="lg"
                isLoading={isLoading}
              >
                Gửi lại email xác thực
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-500 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Đang xác thực...</h2>
            <p className="text-zinc-500 dark:text-zinc-400">
              Vui lòng đợi trong giây lát, chúng tôi đang kiểm tra liên kết của bạn.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ConfirmEmailPage;