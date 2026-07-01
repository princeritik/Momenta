import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  House,
  Images,
  SquarePlus,
  LogOut,
  Menu,
  X,
  Camera,
  UserCircle
} from "lucide-react";
import { logout } from "../store/authSlice.js";
import authentication from "../appwrite/Auth.js"
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { getErrorMessage } from "../utility/ErrorMessage.js";

export default function Header() {
  const [open, setOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:translate-x-1
    ${isActive
      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg scale-[1.02]"
      : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
    }`;
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await authentication.logout()
      dispatch(logout())
      navigate("/login")
      toast.success("Logged out");
    } catch (error) {
      toast.error(getErrorMessage(error, "Logout failed."));
    }
  }

  return (
    <>
      {/* Mobile Top Navbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-b px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <Menu size={26} />
        </button>

        <div className="flex items-center gap-2">
          <Camera className="text-indigo-600" size={24} />
          <h1 className="text-xl font-bold text-gray-800">Momenta</h1>
        </div>

        <div className="w-10" />
      </div>

      {/* Mobile Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="md:hidden fixed inset-0 bg-black/40 z-40"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 z-50
          h-screen w-80 bg-white border-r shadow-sm
          flex flex-col px-6 py-8 
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 text-white p-2 rounded-xl">
              <Camera size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
               Momenta
            </h1>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <X size={24} />
          </button>
        </div>

        {/* Links */}
        <nav className="flex flex-col gap-4">
          <NavLink
            to="/"
            end
            onClick={() => setOpen(false)}
            className={navLinkClass}
          >
            <House size={24} />
            Home
          </NavLink>

          <NavLink
            to="/myposts"
            onClick={() => setOpen(false)}
            className={navLinkClass}
          >
            <Images size={22} />
            My Posts
          </NavLink>

          <NavLink
            to="/AddPost"
            onClick={() => setOpen(false)}
            className={navLinkClass}
          >
            <SquarePlus size={22} />
            Add Post
          </NavLink>
          <NavLink
            to="/profile"
            onClick={() => setOpen(false)}
            className={navLinkClass}
          >
            <UserCircle size={24} />
            Profile
          </NavLink>
        </nav>

        {/* Logout */}
        <button
          className="mt-auto flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-500 hover:bg-red-50 transition"
          onClick={handleLogout}
        >
          <LogOut size={22} />
          Logout
        </button>
      </aside>
    </>
  );
}