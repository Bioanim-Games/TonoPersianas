export function ProductCardSkeleton() {
  return (
    <article
      aria-hidden="true"
      className="flex flex-col overflow-hidden rounded-2xl border border-[#DFD3C0] bg-[#FCF9F4] shadow-[0_12px_30px_rgba(28,24,21,0.07)] dark:border-stone-800/90 dark:bg-[#25201C] dark:shadow-[0_14px_35px_rgba(0,0,0,0.35)]"
    >
      {/* Blind Visual Showcase Frame Skeleton */}
      <div className="relative h-64 w-full animate-pulse overflow-hidden bg-[#E6DCCA] dark:bg-stone-800/80">
        <div className="absolute top-3.5 right-3.5 left-3.5 flex items-center justify-between gap-2">
          <span className="h-6 w-28 rounded-full bg-stone-900/20 dark:bg-stone-950/60" />
          <span className="h-5 w-20 rounded-full bg-[#D6C3A5]/45 dark:bg-stone-700/60" />
        </div>
        <div className="absolute right-4 bottom-3 left-4 flex items-center justify-between">
          <span className="h-4 w-36 rounded bg-stone-900/20 dark:bg-stone-950/60" />
          <span className="h-5 w-20 rounded bg-stone-900/25 dark:bg-stone-950/60" />
        </div>
      </div>

      {/* Dual-Theme Card Body Skeleton */}
      <div className="flex flex-1 flex-col justify-between p-6 text-left">
        <div>
          <div className="h-7 w-4/5 animate-pulse rounded-md bg-[#E4D9C6] dark:bg-stone-800" />
          <div className="mt-3 h-4 w-11/12 animate-pulse rounded bg-[#ECE2D2] dark:bg-stone-800/75" />
          <div className="mt-3.5 space-y-2">
            <div className="h-3.5 w-full animate-pulse rounded bg-[#EFE7D9] dark:bg-stone-800/60" />
            <div className="h-3.5 w-11/12 animate-pulse rounded bg-[#EFE7D9] dark:bg-stone-800/60" />
            <div className="h-3.5 w-3/4 animate-pulse rounded bg-[#EFE7D9] dark:bg-stone-800/60" />
          </div>
        </div>

        <div className="mt-6 border-t border-[#E5DAC8] pt-4 dark:border-stone-800">
          <div className="flex items-end justify-between gap-3">
            <div className="space-y-1.5">
              <div className="h-3 w-24 animate-pulse rounded bg-[#EAE0D0] dark:bg-stone-800/70" />
              <div className="h-4 w-32 animate-pulse rounded bg-[#E2D6C3] dark:bg-stone-800" />
            </div>
            <div className="space-y-1.5 text-right">
              <div className="ml-auto h-3 w-20 animate-pulse rounded bg-[#EAE0D0] dark:bg-stone-800/70" />
              <div className="ml-auto h-6 w-24 animate-pulse rounded bg-[#E2D6C3] dark:bg-stone-800" />
            </div>
          </div>

          <div className="mt-4 h-[42px] w-full animate-pulse rounded-xl bg-[#DFD2BE] dark:bg-stone-800/90" />
        </div>
      </div>
    </article>
  )
}
