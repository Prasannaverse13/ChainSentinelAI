import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  Home,
  Wallet,
  LayoutDashboard,
  History,
  FileCode,
  Bell,
  Settings,
  Cloud,
  HelpCircle,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/connect", icon: Wallet, label: "Connect Wallet" },
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/transactions", icon: History, label: "Transactions" },
  { href: "/contracts", icon: FileCode, label: "Smart Contracts" },
  { href: "/alerts", icon: Bell, label: "Alerts" },
  { href: "/settings", icon: Settings, label: "Settings" },
  { href: "/deployment", icon: Cloud, label: "Deployment" },
  { href: "/support", icon: HelpCircle, label: "Support" },
];

export function Navigation() {
  const [location, setLocation] = useLocation();

  const handleLogout = () => {
    // Clear any user state here if needed
    setLocation("/"); // Redirect to home page
  };

  return (
    <nav className="fixed left-0 top-0 bottom-0 w-64 bg-black/20 backdrop-blur-xl border-r border-blue-500/20 p-4">
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 mb-8 px-4">
          <span className="text-2xl font-bold cyber-glow bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
            ChainSentinel
          </span>
        </div>

        <div className="flex-1 space-y-2">
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-blue-100/80 hover:text-blue-100 transition-colors cursor-pointer",
                  "hover:bg-blue-500/10",
                  location === href && "bg-blue-500/20 text-blue-100"
                )}
              >
                <Icon className="h-5 w-5" />
                {label}
              </div>
            </Link>
          ))}
        </div>

        <div 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </div>
      </div>
    </nav>
  );
}