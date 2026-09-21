export const StoreSkeleton = () => {
  return (
    <div className="card-custom overflow-hidden flex flex-col mb-6 animate-pulse p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-zinc-50 dark:bg-zinc-800/40 uppercase font-semibold text-zinc-500 dark:text-zinc-400 text-xs tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Cửa hàng</th>
              <th className="py-3.5 px-4">Chủ sở hữu</th>
              <th className="py-3.5 px-4">Tài khoản thụ hưởng</th>
              <th className="py-3.5 px-4">Trạng thái</th>
              <th className="py-3.5 px-4">Ngày đăng ký</th>
              <th className="py-3.5 px-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i}>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-zinc-200 dark:bg-zinc-700 shrink-0"></div>
                    <div className="flex flex-col gap-1.5">
                      <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-28"></div>
                      <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-16"></div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex flex-col gap-1.5">
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-24"></div>
                    <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-20"></div>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex flex-col gap-1.5">
                    <div className="h-3.5 bg-zinc-200 dark:bg-zinc-700 rounded w-28"></div>
                    <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-20"></div>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="h-6 bg-zinc-200 dark:bg-zinc-700 rounded-lg w-20"></div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="h-3.5 bg-zinc-200 dark:bg-zinc-700 rounded w-24"></div>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex justify-end gap-1.5">
                    <div className="w-7 h-7 bg-zinc-200 dark:bg-zinc-700 rounded-lg"></div>
                    <div className="w-7 h-7 bg-zinc-200 dark:bg-zinc-700 rounded-lg"></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const StoreMobileSkeleton = () => {
  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3 shadow-sm animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-zinc-200 dark:bg-zinc-700 shrink-0"></div>
          <div className="flex flex-col gap-1.5">
            <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-28"></div>
            <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-16"></div>
          </div>
        </div>
        <div className="h-5 bg-zinc-200 dark:bg-zinc-700 rounded-lg w-20"></div>
      </div>
      <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl space-y-2">
        <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4"></div>
        <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2"></div>
      </div>
      <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-2">
        <div className="h-7 bg-zinc-200 dark:bg-zinc-700 rounded-lg w-20"></div>
        <div className="h-7 bg-zinc-200 dark:bg-zinc-700 rounded-lg w-16"></div>
      </div>
    </div>
  );
};
