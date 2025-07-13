"use client";

import { motion } from "framer-motion";
import { useSignIn, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function LoginForm() {
  const { signIn, isLoaded } = useSignIn();
  const { setActive } = useClerk();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleOAuthLogin = async (provider: "google" | "github") => {
    if (!isLoaded) return;

    try {
      await signIn.authenticateWithRedirect({
        strategy: `oauth_${provider}`,
        redirectUrl: "/dashboard",
      });
    } catch (err: any) {
      console.error("OAuth login failed:", err);
      setError("OAuth login failed.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isLoaded) return;

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.errors?.[0]?.message || "Login failed.");
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
          alt="Login Illustration"
          className="w-3/4 h-auto object-contain"
        />
      </div>

      {/* Right side - form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <h2 className="text-2xl md:text-3xl font-semibold mb-1 text-black dark:text-white">
            Welcome Back
          </h2>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mb-6">
            Enter your credentials to sign in to your account.
          </p>

          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

          {/* Email/password form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block mb-1 font-medium text-gray-700 dark:text-gray-300"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-700 dark:bg-zinc-900 dark:text-white px-4 py-3 text-sm rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
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
                type="password"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-700 dark:bg-zinc-900 dark:text-white px-4 py-3 text-sm rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="flex w-full items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <input type="checkbox" className="accent-indigo-500" />
                Remember me
              </label>
              <a
                href="/forgot-password"
                className="text-slate-600 underline hover:text-slate-800 dark:text-slate-400 dark:hover:text-white font-medium transition"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-700 text-white py-2 rounded-md hover:bg-slate-800 transition-colors font-semibold"
            >
              Login
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 border-t border-gray-200 dark:border-gray-700 relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white dark:bg-black px-2 text-sm text-gray-400">
              Or continue with
            </span>
          </div>

          {/* Social icons */}
          <div className="flex gap-4 justify-center mt-6">
            <button
              onClick={() => handleOAuthLogin("google")}
              aria-label="Continue with Google"
              className="w-12 h-12 flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
            >
              <FcGoogle className="w-6 h-6" />
            </button>

            <button
              onClick={() => handleOAuthLogin("github")}
              aria-label="Continue with GitHub"
              className="w-12 h-12 flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
            >
              <FaGithub className="w-6 h-6 text-black dark:text-white" />
            </button>
          </div>

          <p className="text-sm text-center mt-6 text-gray-700 dark:text-gray-300">
            Don’t have an account?{" "}
            <a
              href="/sign-up"
              className="text-slate-600 underline hover:text-slate-800 dark:text-slate-300 dark:hover:text-white font-medium transition"
            >
              Create one
            </a>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
