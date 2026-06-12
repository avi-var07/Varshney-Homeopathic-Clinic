"use client";

import { useAuth } from "@/context/AuthContext";
import LoginModal from "@/components/LoginModal";

export default function AuthGate() {
  const { showLogin } = useAuth();
  if (!showLogin) return null;
  return <LoginModal />;
}
