import React, { useState } from "react";
import Logo from "../assets/finTrack_Logo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config/api.ts";
import { useAppDispatch } from "@/redux/hooks/reduxHooks.ts";
import { loginSucess } from "@/redux/features/auth/authSlice.ts";
import { toast } from "sonner";
import { Loader } from "lucide-react";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const API_URL = API_BASE_URL + "/auth/login";

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(API_URL, { email, password });
      if (res.status === 200) {
        dispatch(loginSucess({ user: res.data.user, token: res.data.token }));
        toast.success("Login successful! Redirecting to dashboard...");
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error("Login failed. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 sm:px-6 lg:px-8 font-sans antialiased selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Background Interactive Data Grid Layer */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#05FF9B 1px, transparent 1px), linear-gradient(90deg, #05FF9B 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      ></div>

      {/* Background Ambient Network Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Glassmorphic Container */}
      <div className="w-full max-w-md bg-zinc-950/40 backdrop-blur-3xl border-l border-t border-white/5 rounded-3xl p-8 shadow-[0_8px_48px_0_rgba(0,255,155,0.1)] relative overflow-hidden group z-10">
        {/* Luminous Core Logo Accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/50 via-teal-400 to-cyan-500/50 opacity-70"></div>

        {/* Header / Logo section */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center shadow-lg shadow-emerald-500/10 mb-4 transition-transform duration-300 hover:scale-105 overflow-hidden">
            <img
              src={Logo}
              alt="FinTrack Core Logo"
              className="w-10 h-10 object-contain opacity-90"
            />
          </div>
          {/* FIXED: Added text-xl for tiny screens, scaling smoothly to sm:text-2xl */}
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex flex-wrap items-center justify-center gap-x-1.5 whitespace-nowrap">
            Welcome to{" "}
            <span className="uppercase tracking-widest text-emerald-400">
              FinTrack
            </span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Don't lose control of your money
          </p>
        </div>

        {/* Authentication Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
              Email
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-500">
                <i className="fa-solid fa-user-gear text-xs"></i>
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="block w-full pl-10 pr-4 py-3.5 bg-black/40 border border-white/5 rounded-xl text-white placeholder-zinc-700 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition duration-200 text-sm font-medium"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Password
              </label>
              <a
                href="#forgot"
                className="text-[11px] font-medium text-teal-400 hover:text-emerald-300 transition duration-150"
              >
                Forgot password?
              </a>
            </div>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-500 z-10">
                <i className="fa-solid fa-lock text-xs"></i>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="block w-full pl-10 pr-12 py-3.5 bg-black/40 border border-white/5 rounded-xl text-white placeholder-zinc-700 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition duration-200 text-sm font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-emerald-500 hover:text-emerald-400 transition duration-150 z-10 bg-transparent border-0 cursor-pointer"
              >
                {/* Fixed utilizing FontAwesome icons directly instead of Lucide elements */}
                <i
                  className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"} text-sm`}
                ></i>
              </button>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            className="w-full mt-2 py-4 px-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 text-zinc-950 rounded-2xl font-bold text-sm tracking-wide active:scale-[0.99] transition-all duration-150 shadow-[0_8px_32px_0_rgba(5,255,155,0.2)]"
          >
            {loading ? (
              <Loader className="animate-spin text-zinc-950 mx-auto" size={20} />
            ) : "Log In"}
          </button>
        </form>

        {/* Footer Navigation Switch */}
        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-xs text-zinc-400">
            Not registered yet?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-teal-400 hover:text-emerald-300 font-medium transition duration-150"
            >
              Create an account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
