export const ProductSkeleton = () => {
  return (
    <div className="card-custom overflow-hidden flex flex-col animate-pulse">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left table-fixed min-w-255">
          <thead className="bg-slate-50/50 border-b border-slate-200">
            <tr className="text-slate-500">
              <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider w-12 text-center">
                STT
              </th>
              <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider w-70">
                Thông tin sản phẩm 
              </th>
              <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider w-[15%]">
                Giá nhập
              </th>
              <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider w-[15%]">
                Giá bán
              </th>
              <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider w-[12%] text-center">
                Tồn kho
              </th>
              <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider w-[20%]">
                Trạng thái
              </th>
              <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider text-right w-14">
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <tr key={i}>
                <td className="py-4 px-4 text-center">
                  <div className="h-4 bg-slate-200 rounded w-4 mx-auto"></div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-3 items-center">
                    <div className="w-15 h-21.5 rounded-xl bg-slate-200 shrink-0"></div>
                    <div className="flex-1 flex flex-col gap-1.5">
                      <div className="flex flex-col gap-1">
                        <div className="h-3.5 bg-slate-200 rounded w-full"></div>
                      
                      </div>
                      <div className="h-2.5 bg-slate-200 rounded w-20 mt-1"></div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="h-4 bg-slate-200 rounded w-20"></div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex flex-col gap-1.5">
                    <div className="h-4 bg-slate-200 rounded w-20"></div>
                    <div className="h-3 bg-slate-200 rounded w-10"></div>
                  </div>
                </td>
                <td className="py-4 px-4 text-center">
                  <div className="h-4 bg-slate-200 rounded w-8 mx-auto"></div>
                </td>
                <td className="py-4 px-4">
                  <div className="h-6 bg-slate-200 rounded-full w-24"></div>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="flex justify-end">
                    <div className="w-8 h-8 rounded-lg bg-slate-200"></div>
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

export const ProductMobileSkeleton = () => {
  return (
    <div className="card-custom flex flex-col gap-3 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-15 h-21.5 rounded-xl bg-slate-200 shrink-0"></div>
        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          <div className="flex flex-col gap-1">
            <div className="h-3.5 bg-slate-200 rounded w-full"></div>
            <div className="h-3.5 bg-slate-200 rounded w-3/4"></div>
          </div>
          <div className="h-2.5 bg-slate-200 rounded w-20 mt-1"></div>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-1">
        <div className="h-4 bg-slate-200 rounded w-24"></div>
        <div className="w-8 h-8 rounded-lg bg-slate-200"></div>
      </div>
    </div>
  );
};
