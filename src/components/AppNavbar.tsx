import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import SanitaryPadAnimation from "./SanitaryPadAnimation";
import {
  Home, Activity, Salad, SmilePlus,
  BookHeart, Bell, LogOut, Menu, X,
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/cycle-insights", label: "Cycle Insights", icon: Activity },
  { to: "/health-hub", label: "Health Hub", icon: Salad },
  { to: "/mood", label: "Mood & Mind", icon: SmilePlus },
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
    <nav className="sticky top-0 z-50 border-b-2 border-border/50"
      style={{
        background: "linear-gradient(135deg, hsla(340,80%,97%,0.85), hsla(270,60%,96%,0.85), hsla(200,60%,97%,0.85))",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <div className="container max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
        <NavLink to="/dashboard" className="flex items-center gap-2 group">
          <SanitaryPadAnimation size="sm" />
          <div>
            <h1 className="font-display text-lg font-extrabold text-primary leading-tight group-hover:scale-105 transition-transform">
              Period Tracker
            </h1>
            <p className="text-[10px] font-body text-muted-foreground">Menstrual Health Companion</p>
          </div>
        </NavLink>

        <div className="hidden lg:flex items-center gap-0.5">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-300 group
                ${isActive
                  ? "text-primary bg-primary/10 shadow-sm"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                }`
              }
            >
              <Icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              <span>{label}</span>
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary rounded-full transition-all duration-300 group-hover:w-3/4" />
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <span className="hidden sm:flex items-center gap-1 text-sm font-semibold text-foreground">
              <span className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-xs font-bold">
                {user.name?.[0] || "?"}
              </span>
              <span className="hidden md:inline">{user.name}</span>
            </span>
          )}
          <button onClick={handleLogout} className="btn-fun py-2 px-4 text-xs flex items-center gap-1.5">
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
          <button className="lg:hidden text-foreground" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t border-border/50 px-4 py-3 space-y-1 animate-slide-up"
          style={{ background: "hsla(0,0%,100%,0.9)", backdropFilter: "blur(12px)" }}
        >
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                ${isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary hover:bg-primary/5"}`
              }
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
