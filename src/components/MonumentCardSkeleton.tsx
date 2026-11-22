import React from "react";

export const MonumentCardSkeleton = () => {
  return (
    <div className="w-full">
      <div className="relative rounded-3xl overflow-hidden glass-card p-0 border border-white/10 shadow-lg">
        {/* Subtle Shimmer Overlay */}
        <div className="relative h-48 sm:h-56 w-[calc(100%-1rem)] overflow-hidden mt-2 mx-2 rounded-2xl bg-muted/40 animate-pulse">
          {/* Skeleton Shimmer Wave */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/15 dark:via-white/5 to-transparent" />
          
          {/* Badge skeletons */}
          <div className="absolute top-3 left-3 h-6 w-20 rounded-full bg-white/20 backdrop-blur-md" />
          <div className="absolute top-3 right-3 h-6 w-16 rounded-full bg-white/15 backdrop-blur-md" />
          <div className="absolute bottom-3 left-3 h-5 w-24 rounded-full bg-black/30 backdrop-blur-md" />
          <div className="absolute bottom-3 right-3 h-5 w-28 rounded-full bg-primary/30 backdrop-blur-md" />
        </div>

        {/* Content Skeleton */}
        <div className="p-5 space-y-4">
          <div className="space-y-2">
            <div className="h-6 w-3/4 rounded-lg bg-muted/70 animate-pulse" />
            <div className="h-4 w-1/2 rounded-md bg-muted/40 animate-pulse flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-primary/40 shrink-0" />
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <div className="h-3.5 w-full rounded bg-muted/40 animate-pulse" />
            <div className="h-3.5 w-5/6 rounded bg-muted/40 animate-pulse" />
            <div className="h-3.5 w-2/3 rounded bg-muted/40 animate-pulse" />
          </div>

          {/* Action Buttons Skeleton */}
          <div className="flex gap-3 pt-2">
            <div className="flex-1 h-11 rounded-xl bg-muted/60 animate-pulse" />
            <div className="flex-[0.6] h-11 rounded-xl bg-muted/40 animate-pulse" />
          </div>

          {/* Secondary Buttons Skeleton */}
          <div className="flex gap-3">
            <div className="flex-1 h-10 rounded-xl bg-muted/40 animate-pulse" />
            <div className="flex-1 h-10 rounded-xl bg-muted/40 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const FlashSkeletonGrid = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <MonumentCardSkeleton key={i} />
      ))}
    </div>
  );
};

export default MonumentCardSkeleton;
