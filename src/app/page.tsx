import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold text-blue-900 mb-4">
            Microsite CMS
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Multi-tenant CMS for Health Sector Landing Pages
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/api/auth/signin"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/api/health"
              className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              API Health
            </Link>
          </div>
        </header>

        <main className="max-w-4xl mx-auto">
          <section className="mb-12 bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              🚀 Features
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="mr-2">✅</span>
                <span><strong>Multi-tenant Architecture:</strong> Host multiple sites on different domains</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✅</span>
                <span><strong>Drag-and-Drop Editor:</strong> Block-based content editing with react-page</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✅</span>
                <span><strong>Authentication & RBAC:</strong> NextAuth with role-based access control</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✅</span>
                <span><strong>Media Management:</strong> Image upload with WebP conversion and thumbnails</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✅</span>
                <span><strong>SSR/ISR:</strong> Server-side rendering with incremental regeneration</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✅</span>
                <span><strong>Security:</strong> Content sanitization, XSS protection, antivirus hooks</span>
              </li>
            </ul>
          </section>

          <section className="mb-12 bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              📚 Getting Started
            </h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-lg mb-2">1. Set up the database</h3>
                <pre className="bg-gray-100 p-3 rounded overflow-x-auto text-sm">
                  npm run prisma:generate{'\n'}
                  npm run prisma:migrate{'\n'}
                  npm run db:seed
                </pre>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">2. Login with demo credentials</h3>
                <ul className="list-disc list-inside ml-4">
                  <li><strong>Super Admin:</strong> admin@example.com / admin123</li>
                  <li><strong>Editor:</strong> editor@example.com / editor123</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">3. Explore the API</h3>
                <ul className="list-disc list-inside ml-4">
                  <li>GET /api/health - Health check</li>
                  <li>GET /api/pages - List pages</li>
                  <li>POST /api/pages - Create page</li>
                  <li>POST /api/media/upload - Upload media</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              🛠️ Tech Stack
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded">
                <div className="font-semibold text-blue-900">Next.js 15</div>
                <div className="text-sm text-gray-600">App Router</div>
              </div>
              <div className="p-4 bg-blue-50 rounded">
                <div className="font-semibold text-blue-900">PostgreSQL</div>
                <div className="text-sm text-gray-600">Prisma ORM</div>
              </div>
              <div className="p-4 bg-blue-50 rounded">
                <div className="font-semibold text-blue-900">NextAuth</div>
                <div className="text-sm text-gray-600">Authentication</div>
              </div>
              <div className="p-4 bg-blue-50 rounded">
                <div className="font-semibold text-blue-900">react-page</div>
                <div className="text-sm text-gray-600">Page Editor</div>
              </div>
              <div className="p-4 bg-blue-50 rounded">
                <div className="font-semibold text-blue-900">Sharp</div>
                <div className="text-sm text-gray-600">Image Processing</div>
              </div>
              <div className="p-4 bg-blue-50 rounded">
                <div className="font-semibold text-blue-900">Tailwind CSS</div>
                <div className="text-sm text-gray-600">Styling</div>
              </div>
            </div>
          </section>
        </main>

        <footer className="text-center mt-16 text-gray-600">
          <p>Built with ❤️ for the health sector</p>
        </footer>
      </div>
    </div>
  );
}
