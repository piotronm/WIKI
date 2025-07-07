// src/pages/UnauthorizedPage.tsx
import { Link } from 'react-router-dom';

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-4">
      <h1 className="text-4xl font-bold text-red-600 mb-4">403 - Unauthorized</h1>
      <p className="mb-6 text-gray-700">
        Sorry, you do not have permission to access this page.
      </p>
      <Link
        to="/"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
}
