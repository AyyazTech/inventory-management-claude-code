export default function Loading() {
  return (
    <>
      <div className="sticky top-0 z-10 border-b border-line bg-canvas/85 px-8 py-5 backdrop-blur-sm">
        <div className="h-7 w-32 animate-pulse rounded bg-sunken" />
        <div className="mt-2 h-4 w-52 animate-pulse rounded bg-sunken" />
      </div>
      <div className="px-8 py-6">
        <div className="overflow-hidden rounded-lg border border-line bg-surface shadow-sm">
          <div className="h-11 bg-sunken" />
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-4 border-t border-line px-4 py-3.5"
            >
              <div className="h-4 w-48 animate-pulse rounded bg-sunken" />
              <div className="h-7 w-40 animate-pulse rounded bg-sunken" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
