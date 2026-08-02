export const PublisherSkeleton = () => {
  return (
    <div className="card-custom overflow-hidden flex flex-col mb-6 animate-pulse">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-zinc-600 dark:text-zinc-300">
          <thead className="bg-zinc-50 dark:bg-zinc-800/40 text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400 tracking-wider">
            <tr>
              <th className="px-4 py-4 w-14 text-center">STT</th>
              <th className="px-6 py-4 w-[75%]">Tên nhà xuất bản</th>
              <th className="px-6 py-4 w-[15%]">Trạng thái</th>
              <th className="px-6 py-4 text-right w-24"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <tr key={i}>
                <td className="px-4 py-4 text-center font-medium text-zinc-400 dark:text-zinc-500 text-xs">
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-4 mx-auto"></div>
                </td>
                <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700 shrink-0"></div>
                    <div className="flex-1 flex flex-col gap-1.5">
                      <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-32"></div>
                      <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-20"></div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="h-6 bg-zinc-200 dark:bg-zinc-700 rounded-lg w-24"></div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end">
                    <div className="w-8 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-700"></div>
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

export const PublisherMobileSkeleton = () => {
  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3 shadow-sm animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700 shrink-0"></div>
          <div className="flex-1 flex flex-col gap-1.5">
            <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-24"></div>
            <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-16"></div>
          </div>
        </div>
        <div className="h-5 bg-zinc-200 dark:bg-zinc-700 rounded-lg w-20"></div>
      </div>
      <div className="pt-2">
        <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-full mb-1"></div>
        <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4"></div>
      </div>
      <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-end gap-2">
        <div className="h-8 bg-zinc-200 dark:bg-zinc-700 rounded-xl flex-1"></div>
        <div className="w-8 h-8 bg-zinc-200 dark:bg-zinc-700 rounded-xl"></div>
      </div>
    </div>
  );
};
