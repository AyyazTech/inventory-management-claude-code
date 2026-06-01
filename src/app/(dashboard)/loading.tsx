export default function Loading() {
  return (
    <>
      <div className="sticky top-0 z-10 border-b border-line bg-canvas/85 px-8 py-5 backdrop-blur-sm">
        <div className="h-7 w-40 animate-pulse rounded bg-sunken" />
        <div className="mt-2 h-4 w-48 animate-pulse rounded bg-sunken" />
      </div>
      <div className="flex flex-col gap-6 px-8 py-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-lg border border-line bg-surface"
            />
          ))}
        </div>
        <div className="h-72 animate-pulse rounded-lg border border-line bg-surface" />
      </div>
    </>
  );
}
