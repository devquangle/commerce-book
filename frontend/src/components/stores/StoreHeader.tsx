interface StoreHeaderProps {
  totalStores?: number;
  pendingStores?: number;
}

export const StoreHeader: React.FC<StoreHeaderProps> = () => {
  return (
    <div className="card-custom flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
          Quản lý cửa hàng
        </h1>
        <p className="body-text text-zinc-500 dark:text-zinc-400 mt-0.5">
          Kiểm tra hồ sơ định danh eKYC, đối soát tài khoản ngân hàng và kiểm duyệt gian hàng trên sàn.
        </p>
      </div>
    </div>
  );
};
