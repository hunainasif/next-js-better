"use client";
import React from "react";
import { authClient } from "./auth-client";

export default function Log() {
  const handleLog = async () => {
    await authClient.signOut();
  };
  return (
    <div>
      <button onClick={handleLog}>Out</button>
      Log
    </div>
  );
}
