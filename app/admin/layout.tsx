import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import { AdminNav } from "@/components/admin/admin-nav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-white">
      <div className="border-b border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-4 text-white">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-white/20 bg-white/10 p-2">
              <ShieldCheck className="h-6 w-6 text-amber-300" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-white/70">
                Admin Console
              </p>
              <h1 className="text-xl font-semibold">Icep Design Management</h1>
            </div>
          </div>
          <Link href="/">
            <Button
              variant="outline"
              className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
            >
              ← Về Trang Chủ
            </Button>
          </Link>
        </div>
      </div>

      <AdminNav />

      <main className="mx-auto w-full max-w-7xl px-6 py-6">{children}</main>
    </div>
  );
}
