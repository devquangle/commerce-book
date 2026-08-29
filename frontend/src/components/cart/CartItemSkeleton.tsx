import React from "react";

interface CartItemSkeletonProps {
  itemCount?: number;
  showControls?: boolean;
}

const CartItemSkeleton: React.FC<CartItemSkeletonProps> = ({
  itemCount = 2,
  showControls = true,
}) => {
  return (
    <div className="card-custom p-0! overflow-hidden text-gray-700">
      {/* Shop Header Skeleton */}
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
        {showControls && (
          <div className="w-6 flex justify-center shrink-0">
            <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
          </div>
        )}
        <div className="flex items-center gap-2 pl-2 md:pl-4">
          {/* Store icon placeholder */}
          <div className="w-4.5 h-4.5 bg-gray-200 rounded animate-pulse shrink-0" />
          {/* Shop name */}
          <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Items List Skeleton */}
      <div className="flex flex-col">
        {Array.from({ length: itemCount }).map((_, index) => (
          <SingleItemSkeleton
            key={index}
            showControls={showControls}
            isLast={index === itemCount - 1}
          />
        ))}
      </div>

      {/* Footer Skeleton - only when controls are hidden */}
      {!showControls && (
        <div className="flex flex-col items-start gap-2 p-3 border-t border-gray-200 bg-gray-50">
          <div className="w-40 h-4 bg-gray-200 rounded animate-pulse" />
          <div className="w-52 h-4 bg-gray-200 rounded animate-pulse" />
        </div>
      )}
    </div>
  );
};

// Skeleton cho tung san pham
const SingleItemSkeleton: React.FC<{
  showControls: boolean;
  isLast: boolean;
}> = ({ showControls, isLast }) => {
  return (
    <div
      className={`flex items-start md:items-center p-4 ${
        !isLast ? "border-b border-gray-100" : ""
      }`}
    >
      {/* Checkbox Skeleton */}
      {showControls && (
        <div className="w-6 flex justify-center shrink-0 mt-1 md:mt-0">
          <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
        </div>
      )}

      {/* Column 1: San pham */}
      <div className="grow pl-4 flex items-start gap-4 min-w-0">
        {/* Image */}
        <div className="w-20 h-28 shrink-0 bg-gray-200 rounded-md animate-pulse" />

        <div className="flex flex-col min-w-0 gap-2 w-full">
          {/* Product name */}
          <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse" />
          <div className="w-1/2 h-4 bg-gray-200 rounded animate-pulse" />

          {/* Meta info */}
          <div className="mt-1 space-y-1.5">
            <div className="w-40 h-3 bg-gray-200 rounded animate-pulse" />
            <div className="w-32 h-3 bg-gray-200 rounded animate-pulse" />
            <div className="w-36 h-3 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Expand button */}
          <div className="w-20 h-3 bg-gray-200 rounded animate-pulse mt-1" />
        </div>
      </div>

      {/* Column 2: Don gia */}
      <div className="w-32 hidden md:flex flex-col items-center gap-1">
        <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
        <div className="w-16 h-3 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Column 3: So luong */}
      <div className="w-32 flex justify-center">
        <div className="w-24 h-8 bg-gray-200 rounded-md animate-pulse" />
      </div>

      {/* Column 4: So tien */}
      <div className="w-32 hidden md:flex justify-end pr-4">
        <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Column 5: Thao tac */}
      {showControls && (
        <div className="w-12 flex justify-center">
          <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
        </div>
      )}
    </div>
  );
};

export default CartItemSkeleton;
