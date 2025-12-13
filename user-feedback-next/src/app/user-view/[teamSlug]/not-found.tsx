import Link from "next/link";

export default function TeamNotFound() {
  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-neutral-100 mb-4">Team Not Found</h1>
        <p className="text-neutral-500 mb-8">
          The feedback portal you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-500 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
