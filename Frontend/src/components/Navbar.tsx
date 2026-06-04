import React, { useState } from "react";
import Logo from "../assets/finTrack_Logo.png";
import {
  Menu,
  X,
  LayoutGrid,
  ArrowLeftRight,
  Wallet,
  FolderTree,
  Loader,
} from "lucide-react";
import { logout } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks/reduxHooks.ts";
import { toast } from "sonner";
import { useNavigate, useLocation, Link } from "react-router-dom";

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const location = useLocation();
  const activePath = location.pathname;
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const navigationLinks = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutGrid },
    { name: "Categories", path: "/categories", icon: FolderTree },
    { name: "Budgets", path: "/budgets", icon: Wallet },
    { name: "Transactions", path: "/transactions", icon: ArrowLeftRight },
  ];

  const handleLogout = () => {
    setLoading(true);
    try {
      dispatch(logout());
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="w-full bg-black/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-50 selection:bg-emerald-500/30 selection:text-emerald-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Side: Brand Logo and Text Alignment */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate("/dashboard")}>
            <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center shadow-md shadow-emerald-500/5 transition-transform duration-300 group-hover:scale-105 overflow-hidden">
              <img
                src={Logo}
                alt="FinTrack Logo"
                className="w-6 h-6 object-contain opacity-90"
              />
            </div>
            <span className="text-sm font-bold uppercase tracking-widest text-white transition duration-200 group-hover:text-emerald-400">
              FinTrack
            </span>
          </div>

          {/* Desktop Navigation Link Cluster */}
          <div className="hidden md:flex items-center gap-1.5">
            {navigationLinks.map((link) => {
              const isActive = activePath === link.path;
              const IconComponent = link.icon;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 ${
                    isActive
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(5,255,155,0.05)]"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02] border border-transparent"
                  }`}
                >
                  <IconComponent className="w-3.5 h-3.5" />
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right Side Actions: Auth Call to Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => handleLogout()}
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-zinc-950 text-xs font-bold rounded-xl tracking-wide shadow-md shadow-emerald-500/10 active:scale-[0.98] transition-all duration-150"
            >
              {loading ? (
                <Loader className="w-4 h-4 text-white animate-spin" size={20} />
              ) : (
                "Logout"
              )}
            </button>
          </div>

          {/* Mobile Breakpoint Menu Trigger Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white hover:bg-zinc-800 transition focus:outline-none flex items-center justify-center"
              aria-label="Toggle navigation stack menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-white block shrink-0 transition-transform duration-200" />
              ) : (
                <Menu className="w-5 h-5 text-white block shrink-0 transition-transform duration-200" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Layer Overlay Stack */}
      <div
        className={`md:hidden absolute top-16 left-0 w-full bg-zinc-950/95 backdrop-blur-2xl border-b border-white/5 transition-all duration-300 ease-in-out origin-top z-40 ${
          isMobileMenuOpen
            ? "opacity-100 scale-y-100 visible"
            : "opacity-0 scale-y-95 invisible h-0"
        }`}
      >
        <div className="px-4 pt-3 pb-6 space-y-2">
          {/* Mobile Specific App Navigation Nodes */}
          {navigationLinks.map((link) => {
            const isActive = activePath === link.path;
            const IconComponent = link.icon; 

            return (
              <Link
                key={link.path}
                to={link.path} // 5. Changed href to to
                onClick={() => setIsMobileMenuOpen(false)} // 6. Fixed: Close menu instead of logging out!
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition duration-150 ${
                  isActive
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/15"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02]"
                }`}
              >
                <IconComponent className="w-4 h-4 shrink-0" />
                {link.name}
              </Link>
            );
          })}

          <div className="h-[1px] bg-white/5 my-3"></div>

          {/* Mobile Profile Actions */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => handleLogout()}
              className="w-full py-3 text-center rounded-xl text-xs font-bold text-zinc-950 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 transition shadow-sm"
            >
              {loading ? (
                <Loader className="w-4 h-4 text-white animate-spin" size={20} />
              ) : (
                "Logout"
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
