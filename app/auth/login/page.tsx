"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../component/header";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (res.ok) {
        router.push("/main/events");
      } else {
        const data = await res.json();
        alert(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Connection error. Please check the console for details.");
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />

      <section className="relative h-screen flex items-center justify-center overflow-hidden -translate-y-8">
        <div className="w-full max-w-lg p-10 bg-white border border-[#95A6D3] rounded-2xl shadow-sm">
          <h2 className="text-3xl font-medium text-center text-[#4A5682] mb-8">
            Log in
          </h2>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Bind input to state
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring focus:ring-[#95A6D3]"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Bind input to state
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring focus:ring-[#95A6D3]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full text-lg font-medium text-white cursor-pointer hover:bg-[#7a8cba] transition-colors"
              style={{ backgroundColor: "#95A6D3" }}
            >
              Log In
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
