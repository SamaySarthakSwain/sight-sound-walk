import { Skeleton } from "@/components/ui/skeleton";
import { AuroraBackground } from "@/components/ui/aurora-background";

export const PageLoadingSkeleton = () => {
  return (
    <div className="min-h-screen relative w-full overflow-hidden bg-background/50">
      <AuroraBackground />
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 flex flex-col gap-12">
        {/* Nav / Header Skeleton */}
        <div className="flex items-center justify-between w-full pb-8">
          <Skeleton className="h-8 w-32 md:w-48 bg-muted/30" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-24 rounded-full bg-muted/30 hidden md:block" />
            <Skeleton className="h-10 w-10 rounded-full bg-muted/30" />
            <Skeleton className="h-10 w-10 rounded-full bg-muted/30" />
          </div>
        </div>

        {/* Hero Area Skeleton */}
        <div className="flex flex-col items-center justify-center space-y-8 py-12 md:py-24 text-center">
          <Skeleton className="h-8 w-40 md:w-56 rounded-full bg-muted/30" />
          <Skeleton className="h-16 md:h-24 w-full max-w-4xl bg-muted/30" />
          <div className="space-y-3 w-full flex flex-col items-center">
            <Skeleton className="h-5 md:h-6 w-2/3 max-w-2xl bg-muted/30" />
            <Skeleton className="h-5 md:h-6 w-1/2 max-w-xl bg-muted/30" />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full justify-center">
            <Skeleton className="h-14 w-full sm:w-48 rounded-full bg-muted/30" />
            <Skeleton className="h-14 w-full sm:w-48 rounded-full bg-muted/30" />
          </div>
        </div>

        {/* Features / Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col space-y-4 p-6 rounded-3xl bg-muted/5 border border-border/10 backdrop-blur-md">
              <Skeleton className="h-52 w-full rounded-2xl bg-muted/20" />
              <div className="space-y-3 pt-4">
                <Skeleton className="h-6 w-3/4 bg-muted/30" />
                <Skeleton className="h-4 w-full bg-muted/20" />
                <Skeleton className="h-4 w-5/6 bg-muted/20" />
              </div>
              <div className="flex justify-between items-center pt-4">
                <Skeleton className="h-8 w-20 rounded-full bg-muted/30" />
                <Skeleton className="h-8 w-8 rounded-full bg-muted/30" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
