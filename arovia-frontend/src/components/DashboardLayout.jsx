import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Pill,
  Sparkles,
  Clock,
  UserRound,
  LogOut,
  Menu,
  X,
  Search,
} from "lucide-react";
import logo from "../assets/logo1.png";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/records", label: "My Records", icon: FileText },
  { to: "/medicines", label: "Medicines", icon: Pill },
  { to: "/insights", label: "Insights", icon: Sparkles },
  { to: "/timeline", label: "Health Timeline", icon: Clock },
  { to: "/profile", label: "Profile", icon: UserRound },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="app-shell">
      <aside className={`app-sidebar ${menuOpen ? "open" : ""}`}>
        <div className="app-sidebar-brand">
          <img src={logo} alt="Arovia logo" />
          <div>
            <div className="name">AROVIA</div>
            <div className="tag">Understand. Track. Care.</div>
          </div>
          <button className="app-sidebar-close" onClick={() => setMenuOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <nav className="app-sidebar-nav">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `app-sidebar-item ${isActive ? "active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              <Icon size={17} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <button className="app-sidebar-logout" onClick={handleLogout}>
          <LogOut size={16} />
          <span>Log Out</span>
        </button>
      </aside>

      {menuOpen && <div className="app-sidebar-backdrop" onClick={() => setMenuOpen(false)} />}

      <div className="app-main">
        <header className="app-topbar">
          <button className="app-topbar-burger" onClick={() => setMenuOpen(true)}>
            <Menu size={20} />
          </button>

          <div className="app-topbar-search">
            <Search size={15} />
            <span>Search reports, medicines, or insights…</span>
          </div>

          <div className="app-topbar-user" onClick={() => setUserMenuOpen((v) => !v)}>
            <span className="app-avatar-dot" />
            <span className="app-topbar-username">{user?.name?.split(" ")[0] || "Account"}</span>
            <span className="chev">▾</span>
            {userMenuOpen && (
              <div className="app-user-dropdown" onMouseLeave={() => setUserMenuOpen(false)}>
                <NavLink to="/profile">View Profile</NavLink>
                <button onClick={handleLogout}>Log Out</button>
              </div>
            )}
          </div>
        </header>

        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
