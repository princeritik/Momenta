import React from "react";
import { Link } from "react-router-dom";

export default function EmptyState({
  icon,
  title,
  message,
  buttonText,
  buttonLink,
  onClick,
}) {
  return (
    <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-10 text-center">
      <div className="mx-auto mb-5 w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
        {icon}
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        {title}
      </h2>

      <p className="text-gray-500 mb-6">
        {message}
      </p>

      {buttonText &&
        (buttonLink ? (
          <Link
            to={buttonLink}
            className="inline-flex items-center justify-center bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition"
          >
            {buttonText}
          </Link>
        ) : (
          <button
            onClick={onClick}
            className="inline-flex items-center justify-center bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition"
          >
            {buttonText}
          </button>
        ))}
    </div>
  );
}