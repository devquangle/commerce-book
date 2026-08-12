const AddressSkeleton = () => {
  return (
    <div className="p-4 rounded-xl border border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 animate-pulse">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="h-5 bg-gray-200 dark:bg-zinc-800 rounded w-24"></div>
          <span className="text-gray-200 dark:text-zinc-800">|</span>
          <div className="h-5 bg-gray-200 dark:bg-zinc-800 rounded w-28"></div>
        </div>
      </div>

      <div className="mb-4">
        <div className="w-full">
          <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-2/3"></div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-zinc-800/50">
        <div className="h-7 bg-gray-200 dark:bg-zinc-800 rounded-lg w-32"></div>
        <div className="flex gap-1">
          <div className="w-8 h-8 bg-gray-200 dark:bg-zinc-800 rounded-xl"></div>
          <div className="w-8 h-8 bg-gray-200 dark:bg-zinc-800 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
};

export default AddressSkeleton;