"use client";

import { motion } from "framer-motion";
import SignUpForm from "@/components/ui/SignUpForm";


export default function SignUpPage() {
  return (
    <motion.main
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen flex items-center justify-center bg-black px-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-xl md:max-w-2xl bg-zinc-900 rounded-none md:rounded-2xl shadow-none"
      >
        <SignUpForm />
      </motion.div>
    </motion.main>
  );
}
