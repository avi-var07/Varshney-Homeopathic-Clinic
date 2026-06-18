"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  FiCalendar, FiFileText, FiUser, FiLogOut,
  FiHome, FiPackage, FiStar, FiSettings,
  FiUsers, FiBarChart2, FiEdit,
} from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const LOGO_URL = "https://res.cloudinary.com/dqunwksxz/image/upload/f_auto,q_auto/v1781270570/vhc-site/logo.png";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const PATIENT_NAV: NavItem[] = [
  { href: "/dashboard",               label: "Dashboard",           icon: FiHome },
  { href: "/dashboard#appointments",  label: "My Appointments",     icon: FiCalendar },
  { href: "/dashboard#history",       label: "Consultation History", icon: FiFileText },
  { href: "/dashboard#prescriptions", label: "Prescriptions",       icon: FiFileText },
  { href: "/reviews/submit",          label: "Leave a Review",      icon: FiStar },
  { href: "/dashboard#profile",       label: "Profile",             icon: FiUser },
];

const DOCTOR_NAV: NavItem[] = [
  { href: "/doctor",            label: "Dashboard",       icon: FiHome },
  { href: "/doctor#appointments", label: "Appointments",  icon: FiCalendar },
  { href: "/doctor#payments",   label: "Pending Payments", icon: FiBarChart2 },
  { href: "/doctor#prescriptions", label: "Prescriptions", icon: FiFileText },
  { href: "/doctor#delivery",   label: "Delivery Status", icon: FiPackage },
];

const ADMIN_NAV: NavItem[] = [
  { href: "/admin/dashboard",             label: "Dashboard",    icon: FiHome },
  { href: "/admin/dashboard#appointments", label: "Appointments", icon: FiCalendar },
  { href: "/admin/dashboard#blogs",        label: "Blog Posts",   icon: FiEdit },
  { href: "/admin/dashboard#reviews",      label: "Reviews",      icon: FiStar },
  { href: "/admin/dashboard#gallery",      label: "Gallery",      icon: FiUsers },
];

interface DashboardNavProps {
  role: "patient" | "doctor" | "admin";
  userName?: string;
  userEmail?: string;
}

export default function DashboardNav({ role, userName, userEmail }: DashboardNavProps) {
  const pathname = usePathname();
  const router   = useRouter();
  const { logout } = useAuth();

  const navItems = role === "doctor" ? DOCTOR_NAV : role === "admin" ? ADMIN_NAV : PATIENT_NAV;

  const handleLogout = async () => {
    if (role === "patient") {
      await logout();
    } else {
      await fetch("/api/auth/logout", { method: "POST" });
    }
    router.push("/");
  };

  const roleLabel = { patient: "Patient", doctor: "Doctor", admin: "Admin" }[role];
  const roleColor = {
    patient: "bg-green-100 text-green-700",
    doctor:  "bg-blue-100 text-blue-700",
    admin:   "bg-purple-100 text-purple-700",
  }[role];

  return (
    <aside className="w-64 bg-white border-r border-green-100 flex flex-col h-screen sticky top-0 shadow-soft flex-shrink-0">
      {/* Brand */}
      <div className="p-5 border-b border-green-100">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
            <Image src={LOGO_URL} alt="Varshney Homeopathic Clinic" fill className="object-contain" sizes="40px" />
          </div>
          <div>
            <p className="text-sm font-extrabold text-green-800 leading-none">Varshney</p>
            <p className="text-xs text-green-500 leading-tight mt-0.5">Homeopathic Clinic</p>
          </div>
        </Link>
      </div>

      {/* User card */}
      <div className="p-4 border-b border-green-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-gradient flex items-center justify-center text-white font-bold text-base flex-shrink-0">
            {(userName || "U").charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-green-900 text-sm leading-none truncate">{userName || "User"}</p>
            <p className="text-green-400 text-xs mt-0.5 truncate">{userEmail}</p>
            <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-semibold rounded-full ${roleColor}`}>
              {roleLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href.split("#")[0]);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "text-green-600 hover:bg-green-50 hover:text-green-800"
              }`}
            >
              <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-green-600" : "text-green-400"}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="p-3 border-t border-green-100 space-y-1">
        <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-green-600 hover:bg-green-50 transition-colors">
          <FiHome className="w-4 h-4 text-green-400 flex-shrink-0" />
          Visit Website
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <FiLogOut className="w-4 h-4 flex-shrink-0" />
          Logout
        </button>
      </div>
    </aside>
  );
}
