"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, User } from "lucide-react";

export default function AdminLoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectTarget = useMemo(() => {
    const next = searchParams.get("next");
    if (!next || !next.startsWith("/admin")) {
      return "/admin/project";
    }
    if (next === "/admin" || next === "/admin/login") {
      return "/admin/project";
    }
    return next;
  }, [searchParams]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    setLoading(false);

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      setError(payload?.error || "Đăng nhập thất bại. Vui lòng thử lại.");
      return;
    }

    router.replace(redirectTarget);
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-white to-slate-50 px-4 py-8">
      <div className="mx-auto mt-12 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="mb-6 space-y-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Admin Login
          </p>
          <h1 className="text-2xl font-bold text-slate-900">
            Đăng nhập quản trị
          </h1>
          <p className="text-sm text-slate-600">
            Vui lòng đăng nhập để truy cập các trang quản lý.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block space-y-1">
            <span className="text-sm font-medium text-slate-700">
              Tài khoản
            </span>
            <div className="flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2">
              <User className="h-4 w-4 text-slate-500" />
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full border-none bg-transparent text-sm outline-none"
                type="text"
                name="username"
                autoComplete="username"
                required
              />
            </div>
          </label>

          <label className="block space-y-1">
            <span className="text-sm font-medium text-slate-700">Mật khẩu</span>
            <div className="flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2">
              <Lock className="h-4 w-4 text-slate-500" />
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full border-none bg-transparent text-sm outline-none"
                type="password"
                name="password"
                autoComplete="current-password"
                required
              />
            </div>
          </label>

          {error ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
}
