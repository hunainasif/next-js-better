"use client";
import { authClient } from "@/lib/auth-client";
import React from "react";

export default function RegisterClient() {
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault(); // ✅ prevent page reload
    const { data: newUser, error } = await authClient.admin.createUser({
      email: email, // required
      password: "some-secure-password", // required
      name: name, // required
      role: "client",
      data: { customField: "customValue" },
    });
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Create Account</h2>
        <p className="text-gray-600 mb-6 text-center">
          Enter your name and email
        </p>

        <form className="space-y-4">
          <input
            onChange={(e) => {
              setName(e.target.value);
            }}
            type="text"
            placeholder="Full Name"
            required
            className="w-full px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            type="email"
            placeholder="Email Address"
            required
            className="w-full px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleCreateClient}
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
