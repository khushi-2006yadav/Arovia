import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  LayoutDashboard,
  Clock,
  Pill,
  Settings as SettingsIcon,
  FileText,
  Bell,
  ChevronDown,
  LogOut,
} from "lucide-react";
import logo from "../../assets/logo1.png";
import { useArovia } from "../../context";
import "./dashboard.css";
const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  { label: "Report Timeline", icon: Clock, to: "/dashboard/timeline" },
  { label: "Medicines", icon: Pill, to: "/dashboard/medicines" },
  { label: "My Records", icon: FileText, to: "/dashboard/records" },
  { label: "Settings", icon: SettingsIcon, to: "/dashboard/settings" },
];

function DashboardLayout() {
  const navigate = useNavigate();
  const { user, signOut } = useArovia();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user) navigate("/login", { replace: true });
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="dash-shell dash-shell-drawer">
      <header className="dash-topbar">
        <div className="dash-topbar-left">
          <button
            className="dash-menu-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} strokeWidth={2} />
          </button>

          <NavLink to="/dashboard" className="dash-brand dash-brand-inline">
            <img src={logo} alt="Arovia logo" className="dash-brand-logo" />
            <div>
              <div className="dash-brand-name">AROVIA</div>
              <div className="dash-brand-tag">Understand. Track. Care.</div>
            </div>
          </NavLink>
        </div>

        <div className="dash-topbar-right">
          <button className="dash-bell" aria-label="Notifications">
            <Bell size={18} strokeWidth={2} />
            <span className="dash-bell-dot" />
          </button>
          <div className="dash-user-chip">
            <span className="dash-avatar">{(user.name || "U").charAt(0)}</span>
            <span>{user.name}</span>
            <ChevronDown size={14} strokeWidth={2} />
          </div>
        </div>
      </header>

      {/* Backdrop */}
      {sidebarOpen && (
        <div className="dash-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Drawer sidebar */}
      <aside
        className={
          "dash-sidebar dash-sidebar-drawer" + (sidebarOpen ? " open" : "")
        }
      >
        <div className="dash-drawer-head">
          <span>Menu</span>
          <button
            className="dash-drawer-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        <nav className="dash-nav">
          {navItems.map(({ label, icon: Icon, to }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                "dash-nav-item" + (isActive ? " active" : "")
              }
            >
              <Icon size={18} strokeWidth={2} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <button
          className="dash-logout"
          onClick={() => {
            setSidebarOpen(false);
            signOut();
            navigate("/login", { replace: true });
          }}
        >
          <LogOut size={18} strokeWidth={2} />
          <span>Log Out</span>
        </button>
      </aside>

      <main className="dash-content dash-content-full">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
