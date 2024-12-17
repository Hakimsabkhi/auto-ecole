"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { pageUrls } from "@/lib/pages";

import { usePathname } from "next/navigation";

const AdminNav = () => {

  const pathname = usePathname();
  
  // Track the current active path
  const [selectedPath, setSelectedPath] = useState<string>(pathname);

  // Update selected path on pathname change
  useEffect(() => {
    setSelectedPath(pathname);
  }, [pathname]);

  return (
    <nav className="bg-gray-800 w-[100%] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href={"/admin"}>
            <p className="text-white font-bold text-xl cursor-pointer">
              Dashboard
            </p>
            </Link>
          </div>
          <div className="hidden md:flex md:items-center">
            <div className="ml-10 flex items-baseline space-x-4">
              {pageUrls.map((item) => (
                <Link key={item.name} href={item.path}>
                  <p
                    // Highlight the active link based on selectedPath
                    className={`text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                      selectedPath === item.path ? "bg-gray-700" : ""
                    }`}
                  >
                    {item.name}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNav;
