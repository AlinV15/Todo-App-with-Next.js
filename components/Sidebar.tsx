"use client";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Sidebar() {
  
  const [isOpen, setIsOpen] = useState(false);

  // Toggle sidebar visibility
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Sidebar for larger screens */}
      <header
        className={`w-64 h-screen bg-zinc-800 text-white p-4 flex flex-col items-center space-y-6 fixed top-0 left-0 md:relative md:w-64 transition-transform md:transform-none z-50 ${
          isOpen ? "transform-none" : "transform -translate-x-full"
        }`}
      >
        {/* Logo */}
        <div>
          <Link href="/">
            <Image
              src="/logo.png"
              height={50}
              width={50}
              alt="Logo"
              className="rounded-full border-black border-2"
            />
          </Link>
        </div>

        {/* Navigație */}
        <nav className="flex flex-col space-y-2 w-full">
          <ul className="flex flex-col space-y-2">
            <li>
              <Link
                href="/TodoPage"
                className="hover:bg-zinc-700 p-2 rounded w-full block text-center"
              >
                To do List
              </Link>
            </li>
            <li>
              <Link
                href="/kanban"
                className="hover:bg-zinc-700 p-2 rounded w-full block text-center"
              >
                Kanban
              </Link>
            </li>
          </ul>
        </nav>

        {/* Butonul de user jos */}
        <div className="mt-auto">
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      {/* Mobile Hamburger Menu Button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-5 left-5 z-50 p-2 bg-zinc-800 text-white rounded-md"
      >
        {isOpen ? "Close" : "Menu"}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
        />
      )}
    </>
  );
}
