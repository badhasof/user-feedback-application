export default function Loading() {
  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-neutral-700 border-t-blue-500 mx-auto mb-4"></div>
        <p className="text-neutral-500">Loading feedback portal...</p>
      </div>
    </div>
  );
}
