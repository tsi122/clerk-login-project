"use client";

import { useSignUp, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

export default function SignUpForm() {
  const { isLoaded, signUp } = useSignUp();
  const { setActive } = useClerk();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setError("");

    try {
      await signUp.create({ identifier: email, password });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      const result = await signUp.attemptEmailAddressVerification({
        code: "000000", // Placeholder
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Sign up failed.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex min-h-screen flex-col md:flex-row bg-white dark:bg-black"
    >
      {/* Left side - illustration */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center bg-gray-100 dark:bg-zinc-900">
        <img
          src="/illustration.svg"
          alt="Sign Up Illustration"
          className="w-3/4 h-auto object-contain"
        />
      </div>

      {/* Right side - form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <h2 className="text-2xl md:text-3xl font-semibold mb-1 text-black dark:text-white">
            Create Your Account
          </h2>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mb-6">
            Sign up with your email and password below.
          </p>

          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block mb-1 font-medium text-gray-700 dark:text-gray-300"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-700 dark:bg-zinc-900 dark:text-white px-4 py-3 text-sm rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-1 font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-700 dark:bg-zinc-900 dark:text-white px-4 py-3 text-sm rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-700 hover:bg-slate-800 text-white py-2 rounded-md font-semibold transition-colors"
            >
              Sign Up
            </button>
          </form>

          <p className="text-sm text-center mt-6 text-gray-700 dark:text-gray-300">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-slate-600 underline hover:text-slate-800 dark:text-slate-300 dark:hover:text-white font-medium transition"
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
