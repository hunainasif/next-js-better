"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";

export default function Register() {
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      // Just sign up the user - verification email will be sent automatically
      const { data, error } = await authClient.signUp.email(
        {
          name: credentials.name,
          email: credentials.email,
          password: credentials.password,
        },
        {
          callbackURL: `${process.env.NEXT_PUBLIC_API_URL}/creator/login`,
          onSuccess: (ctx) => {
            // Handle success - verification email already sent automatically
            console.log("Signup successful, verification email sent");
          },
          onError: (ctx) => {
            console.log("Registration error:", ctx.error);
            alert(ctx.error.message);
          },
        },
      );

      return data;
    } catch (error) {
      throw new Error(error as any);
    }
  };
  const handleOnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-900 text-center mb-6">
          Create an account
        </h2>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              onChange={handleOnChange}
              name="name"
              type="text"
              placeholder="John Doe"
              className="w-full border border-gray-300 text-gray-900 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              onChange={handleOnChange}
              name="email"
              type="email"
              placeholder="you@example.com"
              className="w-full border border-gray-300 text-gray-900 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              onChange={handleOnChange}
              name="password"
              type="password"
              placeholder="••••••••"
              className="w-full border border-gray-300 text-gray-900 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
            onClick={handleLogin}
          >
            Register
          </button>
        </form>

        <div className="my-5 text-center text-sm text-gray-500">OR</div>

        <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition">
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Sign up with Google
        </button>
      </div>
    </div>
  );
}
