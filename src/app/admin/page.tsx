// Password-based admin login is removed.
// All doctor authentication is now OTP-based via /doctor/login.
import { redirect } from "next/navigation";

export default function AdminPage() {
  redirect("/doctor/login");
}
