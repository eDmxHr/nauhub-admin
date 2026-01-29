"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "@/lib/icons";
import { useUserStore } from "@/stores/user-store";
import { Checkbox } from "@/components/ui/checkbox";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useUserStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await login({ email: formData.email, password: formData.password });
      // Redirect to dashboard home after successful login
      router.push("/");
    } catch (err) {
      // Error is already handled in the store
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#0b0b0b]">
        {/* ================= BACKGROUND ================= */}
        <div className="absolute inset-0">
          {/* Base gradient */}
          <div className="absolute inset-0 bg-linear-to-br from-[#f15025] via-[#f15025] to-black opacity-50" />

          {/* Orange glow */}
          <div
            className="absolute inset-0"
            style={{
              background: `
          radial-gradient(circle at 25% 30%, rgba(241, 80, 37, 0.45), transparent 55%),
          radial-gradient(circle at 75% 70%, rgba(241, 80, 37, 0.25), transparent 60%)
        `,
            }}
          />

          {/* Cinematic wave overlays */}
          <svg
            className="absolute bottom-0 left-0 w-full h-[45%]"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              d="M0,120 C220,80 440,160 660,130 880,100 1100,140 1320,110 L1320,400 L0,400 Z"
              fill="rgba(0,0,0,0.30)"
            />
            <path
              d="M0,160 C260,120 520,200 780,160 1040,130 1300,180 1560,150 L1560,400 L0,400 Z"
              fill="rgba(0,0,0,0.2)"
            />
          </svg>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="relative z-10 flex flex-col justify-between p-14 text-white">
          {/* Header label */}
          <div>
            <p className="text-xs tracking-[0.35em] uppercase text-white/80">
              Content Management
            </p>

            <div className="mt-3 flex items-center gap-3">
              <div className="h-0.75 w-14 bg-white/90" />
              <div className="h-0.75 w-6 bg-[#f15025]" />
            </div>
          </div>

          {/* Main content */}
          <div className="space-y-6">
            <h1 className="text-6xl font-serif leading-[1.05] drop-shadow-[0_8px_24px_rgba(0,0,0,0.6)]">
              Manage Your
              <br />
              <span className="relative inline-block">
                <span className="text-white">Streaming</span>
                <span className="absolute left-0 -bottom-1 h-0.75 w-full bg-[#f15025]" />
              </span>
              <br />
              Universe
            </h1>

            <p className="text-lg text-white/90 max-w-md leading-relaxed">
              Control movies, tv shows, anime, and documentaries from a single
              powerful platform built for modern streaming ecosystems.
            </p>
          </div>

          {/* Footer accent */}
          <div className="flex items-center gap-3 text-white/70">
            <div className="h-px flex-1 bg-white/20" />
            <span className="text-xs tracking-widest">
              STREAM · SCALE · CONTROL
            </span>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Logo/Brand */}
          <div className="flex items-center justify-center gap-3">
            <Image
              src="/logo.png"
              alt="NauHub Logo"
              width={80}
              height={80}
              className="object-contain"
            />
            <span className="text-xl font-semibold text-black">
              Nauhub Admin
            </span>
          </div>

          {/* Welcome Section */}
          <div className="space-y-2">
            <h2 className="text-4xl font-serif text-center">Welcome Back</h2>
            <p className="text-gray-600">
              Enter your email and password to access your account
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                disabled={isLoading}
                className="h-12 text-gray-800"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  disabled={isLoading}
                  className="h-12 text-gray-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, rememberMe: checked as boolean })
                  }
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  Remember me
                </label>
              </div>
              <button
                type="button"
                className="text-sm text-gray-700 hover:text-gray-900"
              >
                Forgot Password
              </button>
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-black hover:bg-gray-800 text-white rounded-lg text-base font-medium"
              disabled={isLoading || !formData.email || !formData.password}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
