"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LogoutButton({
  className,
  iconOnly = false,
}: {
  className?: string;
  iconOnly?: boolean;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      await fetch("/api/admin/logout", {
        method: "POST",
      });
    } finally {
      setIsLoading(false);
      router.replace("/admin/login");
      router.refresh();
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleLogout}
      disabled={isLoading}
      aria-label="Đăng xuất"
      className={
        className ||
        "border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
      }
    >
      <LogOut className={iconOnly ? "h-4 w-4" : "mr-2 h-4 w-4"} />
      {!iconOnly && (isLoading ? "Đang đăng xuất..." : "Đăng xuất")}
    </Button>
  );
}
