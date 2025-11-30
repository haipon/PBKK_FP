"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../component/header";

export default function Register() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // Matching password with the retype part
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        alert("Account created! Please log in.");
        router.push("/auth/login");
      } else {
        const data = await res.json();
        alert(data.error || "Signup failed");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      alert("Connection error.");
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />

      <section className="relative h-screen flex items-center justify-center overflow-hidden -translate-y-8">
        <div className="w-full max-w-lg p-10 bg-white border border-[#95A6D3] rounded-2xl shadow-sm">
          <h2 className="text-3xl font-medium text-center text-[#4A5682] mb-8">
            Sign Up
          </h2>

          <form onSubmit={handleSignup} className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring focus:ring-[#95A6D3]"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring focus:ring-[#95A6D3]"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring focus:ring-[#95A6D3]"
              />
            </div>

            {/* Re-type password */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Password Confirmation
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring focus:ring-[#95A6D3]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full text-lg font-medium text-white cursor-pointer hover:bg-[#7a8cba] transition-colors"
              style={{ backgroundColor: "#95A6D3" }}
            >
              Sign Up
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
