import { Suspense } from "react";
import AdminLoginClient from "@/components/admin/admin-login-client";

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Đang tải...
        </div>
      }
    >
      <AdminLoginClient />
    </Suspense>
  );
}
