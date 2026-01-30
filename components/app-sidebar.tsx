"use client";

import { Play, Search, UserPlus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-20 flex-col items-center border-r border-slate-200 bg-white py-6 dark:border-slate-800 dark:bg-slate-900">
      {/* Logo */}
      <Link href="/ao-dashboard" className="mb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <g fill="#ffffff" clipPath="url(#a)">
              <path d="M0 0h4v24H0zM20 0h5v24h-5zM15 17h5v7h-5z"/>
              <path d="m28.287 10.135-7.645-8.919C20.105.568 19.278 0 18.328 0H-.393c-1.653 0-2.52 1.095-2.686 2.676L-4.98 21.324C-5.187 22.744-3.74 24-2.253 24H4.69L6.674 8.432c.041-.486.124-.77.413-1.013.29-.243.62-.365 1.033-.365.29 0 .496.04.703.162l9.215 3.608c.538.203.91.69.91 1.257 0 .568-.372 1.054-.91 1.257l-7.48 3.243c-1.033.608-1.405 1.054-1.735 2.433L8.244 24h8.844c1.24 0 1.694-.608 2.314-1.216l8.885-8.92c.95-1.094.95-2.634 0-3.729"/>
            </g>
            <defs>
              <clipPath id="a">
                <rect width="24" height="24" fill="#fff" rx="12"/>
              </clipPath>
            </defs>
          </svg>
        </div>
      </Link>

      {/* Navigation Icons */}
      <nav className="flex-1">
        <ul className="flex flex-col items-center gap-6">
          <li>
            <button className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700">
              <Search className="h-6 w-6" />
            </button>
          </li>
          <li>
            <button className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700">
              <UserPlus className="h-6 w-6" />
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
