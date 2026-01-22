"use client";
import { authClient } from "@/lib/auth-client";
import React from "react";

export default function Forgot() {
  const [email, setEmail] = React.useState("");
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault(); // ✅ prevent page reload

    const { data, error } = await authClient.requestPasswordReset({
      email,
      redirectTo: "http://localhost:3000/creator/reset",
    });
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
        <p className="text-gray-600 mb-6 text-center">
          Enter your email to reset your password
        </p>
        <form className="space-y-4">
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            required
            className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleForgotPassword}
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Send Reset Link
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
