import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-black text-slate-800 mb-4 select-none">404</div>
        <h1 className="text-2xl font-bold text-white mb-3">Page not found</h1>
        <p className="text-slate-400 mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved. 
          It might have been a worship pad that went out of key.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/marketplace"
            className="px-6 py-3 bg-slate-800 border border-white/10 hover:border-white/20 text-white rounded-xl font-bold transition-colors"
          >
            Browse Market
          </Link>
        </div>
      </div>
    </div>
  );
}
