import React from "react";
import { Camera, Mail, Heart } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="mt-16 border-t bg-white">
      <div className="max-w-5xl mx-auto px-6 py-10 text-center">
        {/* Logo */}
        <div className="flex justify-center items-center gap-2">
          <div className="bg-indigo-600 text-white p-2 rounded-xl">
            <Camera size={22} />
          </div>

          <h2 className="text-2xl font-bold text-gray-800">
             Momenta
          </h2>
        </div>

        <div className="mt-3">
          <p className="text-gray-500 text-sm italic tracking-wide">
            Every moment matters.
          </p>
        </div>

        {/* Tech Stack */}
        <p className="mt-4 text-gray-500">
          Built with React • Redux Toolkit • Appwrite • Tailwind CSS
        </p>

        {/* Made By */}
        <div className="mt-4 flex justify-center items-center gap-2 text-gray-700">
          <span>Made with</span>

          <Heart
            size={18}
            className="text-red-500 fill-red-500"
          />

          <span className="font-semibold">
            by Prince Raj
          </span>
        </div>

        {/* Social Links */}
        <div className="mt-6 flex justify-center gap-5">
          <a
            href="https://github.com/princeritik"
            target="_blank"
            rel="noreferrer"
            className="p-3 rounded-full bg-gray-100 hover:bg-indigo-100 hover:text-indigo-600 transition"
          >
            <FaGithub size={20} />
          </a>

          <a
            href="https://www.linkedin.com/in/prince-raj-a39a2328a"
            target="_blank"
            rel="noreferrer"
            className="p-3 rounded-full bg-gray-100 hover:bg-indigo-100 hover:text-indigo-600 transition"
          >
            <FaLinkedin size={20} />
          </a>

          <a
            href="mailto:hritikraj66778@gmail.com"
            className="p-3 rounded-full bg-gray-100 hover:bg-indigo-100 hover:text-indigo-600 transition"
          >
            <Mail size={20} />
          </a>
        </div>

        {/* Copyright */}
        <p className="mt-8 text-sm text-gray-400">
          © {new Date().getFullYear()} MiniInsta. All rights reserved.
        </p>
      </div>
    </footer>
  );
}