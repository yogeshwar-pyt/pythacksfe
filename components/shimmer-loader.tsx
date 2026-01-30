export function ShimmerLoader() {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 p-8">
      {/* Main shimmer card */}
      <div className="w-full max-w-md space-y-4">
        {/* Header shimmer */}
        <div className="h-8 w-3/4 animate-pulse rounded-lg bg-slate-200" />
        
        {/* Content rows */}
        <div className="space-y-3">
          <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-4/5 animate-pulse rounded bg-slate-200" />
        </div>

        {/* Stats shimmer */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="h-20 animate-pulse rounded-lg bg-slate-200" />
          <div className="h-20 animate-pulse rounded-lg bg-slate-200" />
        </div>

        {/* Additional content shimmer */}
        <div className="mt-6 space-y-3">
          <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
        </div>
      </div>

      {/* Loading text with pulse animation */}
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
        <p className="animate-pulse text-sm font-medium text-slate-600">
          Analyzing call data...
        </p>
      </div>
    </div>
  );
}
