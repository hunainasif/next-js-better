"use client";
import React from "react";
import { authClient } from "./auth-client";

export default function Log() {
  const handleLog = async () => {
    try {
      console.log("Signing out...");
      await authClient.signOut();
      console.log("Sign out successful, redirecting to login...");

      // Force redirect to login page after signout
      window.location.href = "/login";
    } catch (error) {
      console.error("Sign out error:", error);
      // Still redirect even if there's an error
      window.location.href = "/login";
    }
  };
  return (
    <div>
      <button onClick={handleLog}>Out</button>
      Log
    </div>
  );
}
