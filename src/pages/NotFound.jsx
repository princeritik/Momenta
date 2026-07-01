import React from "react";
import { Link } from "react-router-dom";
import { Home, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-10 max-w-md w-full text-center">
        <div className="mx-auto w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center mb-6">
          <SearchX size={42} className="text-indigo-600" />
        </div>

        <h1 className="text-5xl font-extrabold text-gray-800 mb-3">
          404
        </h1>

        <h2 className="text-2xl font-bold text-gray-700 mb-3">
          Page not found
        </h2>

        <p className="text-gray-500 mb-8">
          The page you are looking for does not exist or may have been moved.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
        >
          <Home size={20} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}