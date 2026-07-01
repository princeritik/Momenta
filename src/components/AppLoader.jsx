import React from "react";
import { Camera } from "lucide-react";

export default function AppLoader() {
  return (
    <div className="fixed inset-0 bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-5 w-20 h-20 rounded-3xl bg-indigo-600 text-white flex items-center justify-center shadow-lg animate-pulse">
          <Camera size={40} />
        </div>

        <h2 className="text-2xl font-bold text-gray-800">
          Momenta
        </h2>

        <p className="text-gray-500 mt-2">
          Loading your feed...
        </p>

        <div className="mt-6 flex justify-center gap-2">
          <div className="w-3 h-3 rounded-full bg-indigo-600 animate-bounce" />
          <div
            className="w-3 h-3 rounded-full bg-indigo-600 animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="w-3 h-3 rounded-full bg-indigo-600 animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
}