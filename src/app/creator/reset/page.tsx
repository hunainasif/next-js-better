"use client";

import { authClient } from "@/lib/auth-client";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implement password reset logic here
    if (!token) {
      throw new Error("No token provided");
    }

    const { data, error } = await authClient.resetPassword({
      newPassword: password,
      token,
    });
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
        <p className="text-gray-600 mb-6 text-center">
          Enter your new password below
        </p>
        <form className="space-y-4">
          <input
            type="password"
            onChange={(e: any) => setPassword(e.target.value)}
            placeholder="New Password"
            required
            className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleResetPassword}
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Reset Password
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-700">
          Remembered your password?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default function Reset() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
