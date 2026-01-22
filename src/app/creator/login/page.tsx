"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { redirect } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await authClient.signIn.email(
        {
          email: credentials.email,
          password: credentials.password,
        },
        {
          onSuccess: (ctx) => {
            // Get user role and redirect
            const role = ctx.data.user.role;
            console.log("Login successful, role:", role);

            // Force a hard navigation to trigger middleware
            redirect(`${role}`);
          },
          onError: (ctx) => {
            setIsLoading(false);
            if (ctx.error.status === 403) {
              alert("Please verify your email address");
            } else {
              alert(ctx.error.message);
            }
          },
        },
      );
    } catch (error) {
      setIsLoading(false);
      console.error("Login error:", error);
      alert("An error occurred during login");
    }
  };

  const LoginwithGoogle = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/creator", // Will be redirected by middleware based on role
    });
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Welcome Back
        </h2>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              onChange={handleOnChange}
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="w-full border text-black border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              onChange={handleOnChange}
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full border border-gray-300 text-black rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          <div className="flex justify-between items-center text-sm">
            <Link href="/forgot" className="text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-shadow shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="my-6 text-center text-sm text-gray-500 font-medium">
          OR
        </div>

        <button
          onClick={LoginwithGoogle}
          type="button"
          className="w-full border border-gray-300 py-3 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-100 transition-shadow shadow-sm"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-6 h-6"
          />
          Continue with Google
        </button>

        <p className="mt-6 text-center text-gray-600 text-sm">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-blue-600 font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
