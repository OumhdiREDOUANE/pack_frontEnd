// app/category/loading.tsx
export default function LoadingCategory() {
  return (
    <div className="container mx-auto px-4">
      <div className="mb-8 animate-pulse">
        <div className="w-full h-[200px] bg-gray-200 rounded-md"></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col h-full bg-white shadow rounded-md overflow-hidden">
            <div className="w-full h-[225px] bg-gray-200 animate-pulse"></div>
            <div className="h-6 bg-gray-200 m-4 rounded"></div>
            <div className="h-10 bg-gray-300 m-4 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
