import React, { useState } from "react";
import Logo from "../assets/finTrack_Logo.png";
import { useNavigate } from "react-router-dom";
import { api } from "@/config/api";
import { toast } from "sonner";
import { Eye, EyeOff, Loader } from "lucide-react";

const Signup: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/register", { name, email, password });
      if (res.data.success) {
        toast.success("You have registered Successfully")
        toast.success("Login into your account")
        navigate("/login")
      }
    } catch (error) {
      toast.error("Failed to create your account");
    }
    finally{
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
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Glassmorphic Container */}
      <div className="w-full max-w-md bg-zinc-950/40 backdrop-blur-3xl border-l border-t border-white/5 rounded-3xl p-8 shadow-[0_8px_48px_0_rgba(0,195,255,0.1)] relative overflow-hidden group z-10">
        {/* Luminous Core Logo Accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500/50 via-emerald-400 to-teal-500/50 opacity-70"></div>

        {/* Header / Logo section */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center shadow-lg shadow-teal-500/10 mb-4 transition-transform duration-300 hover:scale-105 overflow-hidden">
            <img
              src={Logo}
              alt="FinTrack Core Logo"
              className="w-10 h-10 object-contain opacity-90"
            />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex gap-2 items-center">
            Join{" "}
            <span className="text-2xl font-bold uppercase tracking-widest text-emerald-400">
              FinTrack
            </span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Deploy modern metrics to master your cash flow
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Operator Moniker (Name) Field */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
              Name
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-500">
                <i className="fa-solid fa-microchip text-xs"></i>
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="block w-full pl-10 pr-4 py-3.5 bg-black/40 border border-white/5 rounded-xl text-white placeholder-zinc-700 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition duration-200 text-sm font-medium"
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
              Email
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-500">
                <i className="fa-solid fa-satellite-dish text-xs"></i>
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
            <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-500 z-10">
                <i className="fa-solid fa-lock text-xs"></i>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                className="block w-full pl-10 pr-12 py-3.5 bg-black/40 border border-white/5 rounded-xl text-white placeholder-zinc-700 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition duration-200 text-sm font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-emerald-500 hover:text-emerald-400 transition duration-150 z-10 bg-transparent border-0 cursor-pointer"
              >
                {showPassword ? <Eye /> : <EyeOff />}
              </button>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            className="w-full mt-3 py-4 px-4 bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-600 hover:from-cyan-600 hover:to-emerald-700 text-zinc-950 rounded-2xl font-bold text-sm tracking-wide active:scale-[0.99] transition-all duration-150 shadow-[0_8px_32px_0_rgba(0,195,255,0.2)]"
          >
            {loading ? (
              <Loader className="animate-spin text-zinc-950 mx-auto" size={20} />
            ) : "Create Your Account"}
          </button>
        </form>

        {/* Footer Navigation Switch */}
        <div className="mt-6 pt-5 border-t border-white/5 text-center">
          <p className="text-xs text-zinc-400">
            Already registered?{" "}
            <button
              onClick={() => navigate("/login")}
              className="font-semibold text-cyan-400 hover:text-cyan-300 transition duration-150 ml-1"
            >
              Login to your account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
