import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a14] flex flex-col items-center justify-center px-4">
      <div className="max-w-3xl w-full text-center">
        <div className="flex items-center justify-center mb-8">
          <span className="text-purple-500 text-2xl md:text-3xl mr-2">
            {`<`}
          </span>
          <h1 className="text-7xl md:text-9xl font-bold text-white">404</h1>
          <span className="text-purple-500 text-2xl md:text-3xl ml-2">
            {`/>`}
          </span>
        </div>

        {/* Decorative line */}
        <div className="w-24 h-1 bg-purple-500 mx-auto mb-8"></div>

        {/* Error message */}
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Page Not Found
        </h2>

        <p className="text-gray-400 mb-12 max-w-lg mx-auto">
          {`The page you're looking for doesn't exist or has been moved to another
          location.`}
        </p>

        {/* Navigation options */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md transition-colors"
          >
            <Home size={18} />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-16 text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Subham Kumar</p>
      </div>
    </div>
  );
}
