"use client";

import { useState } from "react";
import { AdminNav } from "@/components/admin/admin-nav";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [isHoveringSidebar, setIsHoveringSidebar] = useState(false);
  const sidebarExpanded = !collapsed || isHoveringSidebar;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-white">
      <AdminNav
        collapsed={collapsed}
        expanded={sidebarExpanded}
        onToggle={() => setCollapsed((current) => !current)}
        onMouseEnter={() => setIsHoveringSidebar(true)}
        onMouseLeave={() => setIsHoveringSidebar(false)}
      />
      <main
        className={`min-h-screen min-w-0 transition-[padding] duration-300 ease-out ${
          sidebarExpanded ? "lg:pl-[292px]" : "lg:pl-[86px]"
        }`}
      >
        <div className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
