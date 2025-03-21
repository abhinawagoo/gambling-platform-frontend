// src/pages/auth/login.js
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function LoginPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { redirect } = router.query;

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push(redirect || "/dashboard");
    }
  }, [user, router, redirect]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-md">
          <LoginForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}
