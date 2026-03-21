import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import SanitaryPadAnimation from "./SanitaryPadAnimation";
import {
  LayoutDashboard, Heart, Salad, Dumbbell, Pill,
  BookHeart, Bell, SmilePlus, LogOut, Menu, X,
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/health-hub", label: "Health Hub", icon: Salad },
  { to: "/mood", label: "Mood & Support", icon: SmilePlus },
  { to: "/journal", label: "Journal", icon: BookHeart },
  { to: "/reminders", label: "Reminders", icon: Bell },
];

const AppNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-card/90 backdrop-blur-lg border-b-2 border-border shadow-sm">
      <div className="container max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/dashboard" className="flex items-center gap-2">
          <SanitaryPadAnimation size="sm" />
          <div>
            <h1 className="font-display text-lg font-extrabold text-primary leading-tight">Period Tracker</h1>
            <p className="text-[10px] font-body text-muted-foreground">Menstrual Health</p>
          </div>
        </NavLink>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-link flex items-center gap-1.5 ${isActive ? "active" : ""}`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </div>

        {/* User actions */}
        <div className="flex items-center gap-3">
          {user && (
            <span className="hidden sm:block text-sm font-semibold text-foreground">
              Hi, {user.name}! 👋
            </span>
          )}
          <button onClick={handleLogout} className="btn-fun py-2 px-4 text-xs flex items-center gap-1.5">
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
          <button className="md:hidden text-foreground" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 py-3 space-y-1 animate-slide-up">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => `nav-link flex items-center gap-2 w-full ${isActive ? "active" : ""}`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
};

export default AppNavbar;
