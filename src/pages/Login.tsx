// src/pages/Login.tsx
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Github, ArrowLeft } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { login, startGithubOAuth } from "../services/authService";
import type { AuthResponseDto } from "../types/auth";
import { useAppDispatch } from "../app/store";
import { setCredentials } from "../features/auth/authSlice";

const Login = () => {
  const [showPwd, setShowPwd] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const from =
    (location.state as { from?: string } | undefined)?.from || "/";

  const mutation = useMutation<AuthResponseDto, unknown, { email: string; password: string }>({
    mutationFn: (payload) => login(payload),
    onSuccess: (data) => {
      dispatch(setCredentials(data));
      navigate(from, { replace: true });
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error?.response?.data?.message || "Login failed");
    },
  });

  const loading = mutation.isPending;

  return (
    <section
      style={{
        background: "url(/auth-bg.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="w-full min-h-svh flex flex-col px-4 py-16"
    >
      {/* Back Button — floating top-left */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 group flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-[#FD7EFF]/30 transition-all duration-300 cursor-pointer z-10"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
        <span className="text-sm font-medium hidden sm:inline">Back</span>
      </button>

      <div className="flex-1 flex items-center justify-center">
      <div className="w-full max-w-[680px] mx-auto text-center">
        {/* Heading */}
        <h1 className="anybody text-white font-semibold text-[32px] sm:text-[40px] md:text-[48px] leading-[60px] font-[anybody ]">
          Welcome Back
        </h1>

        {/* Subheading */}
        <p className="alexandria mt-2 text-white/90 text-[16px] sm:text-[18px] md:text-[20px] leading-[100%] tracking-[-0.02em] font-[Alexandria]">
          Sign in to your NXELLENT account
        </p>

        {/* Auth Card */}
        <div
          className={[
            "mx-auto mt-8 sm:mt-10",
            "w-full max-w-[500px] rounded-2xl border",
            "bg-[#000124]",
            "shadow-[0_0_40px_0_#A855F733]",
            "border-[#2A2355]",
            "pt-6 sm:pt-7 pb-6 sm:pb-7 px-5 sm:px-8",
            "relative",
          ].join(" ")}
          style={{
            borderTop: "1px solid #A855F733",
            boxShadow: "0px 0px 40px 0px #A855F733",
            background:
              "linear-gradient(135deg, rgba(0, 0, 0, 0) 0%, rgba(168, 85, 247, 0.15) 50%, rgba(0, 0, 0, 0) 100%)",
            backgroundColor: "#000124",
          }}
        >
          {/* Logo inside card */}
          <Link
            to="/"
            className="flex justify-center mb-6 hover:opacity-80 transition-opacity duration-200"
          >
            <img src="/Nxellent-logos/desktop_logo_SVG_160x50.svg" alt="Nxellent Logo" className="h-10 w-auto object-contain" />
          </Link>

          <form className="space-y-5">
            {/* Email */}
            <div className="text-left">
              <label className="block mb-2 jakarta text-white text-[16px] font-medium font-['Plus Jakarta Sans']">
                Email
              </label>
              <div
                className={[
                  "flex items-center gap-3",
                  "w-full  h-12 rounded-full",
                  "bg-[#3838381A] border-[0.1px] border-[#ffffff66]",
                  "shadow-[0_0_6px_0_#00000026]",
                ].join(" ")}
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  className="w-full px-4 h-full jakarta rounded-full outline-none text-[#A19DAF] placeholder:text-[#A19DAF] border-white text-[14px] bg-transparent"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div className="text-left">
              <label className="block mb-2 jakarta text-white text-[16px] font-medium font-['Plus Jakarta Sans']">
                Password
              </label>

              <div
                className={[
                  "flex items-center gap-3",
                  "w-full  h-12 rounded-full px-4",
                  "bg-[#3838381A] border-[0.1px] border-[#ffffff66]",
                  "shadow-[0_0_6px_0_#00000026]",
                ].join(" ")}
              >
                <input
                  type={showPwd ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full jakarta bg-transparent h-full outline-none text-white placeholder:text-white/60 text-[14px]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                {/* Eye toggle */}
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  aria-label={showPwd ? "Hide password" : "Show password"}
                  title={showPwd ? "Hide password" : "Show password"}
                  className="p-1 rounded-md text-white/80 hover:text-white cursor-pointer"
                >
                  {showPwd ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>

              <div className="mt-2">
                <a
                  href="mailto:support@nxellent.com?subject=Password%20reset"
                  className="jakarta text-[#FD7EFF] text-[14px] font-normal font-['Plus Jakarta Sans']"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            {/* Sign In Button */}
            <div className="text-left">
              {error && <div className="text-red-400 mb-2">{error}</div>}
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  mutation.mutate({ email, password });
                }}
                disabled={loading}
                className={[
                  "w-full h-12 cursor-pointer",
                  "rounded-[72px]",
                  "text-[16px] font-medium",
                  "bg-[linear-gradient(90deg,#FFC857_0%,#FF8A3C_35%,#FF3EC4_80%,#FF0040_100%)]",
                  "text-[#333333]",
                  "shadow-[0_0_10px_rgba(255,0,64,0.35)]",
                  "transition-all duration-300",
                  "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none",
                ].join(" ")}
                style={{
                  border: "1px solid",
                  borderImage:
                    "linear-gradient(94.22deg, rgba(26,26,26,0.6) 1.22%, rgba(26,26,26,0.6) 1.22%, rgba(26,26,26,0) 90.07%, rgba(26,26,26,0) 90.07%) 1",
                }}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </div>
          </form>

          {/* Divider line */}
          <div className="my-5 w-full  mx-auto h-px bg-white/10" />

          {/* Continue with */}
          <p className="alexandria text-white/80 text-[14px] font-normal font-['Plus Jakarta Sans']">
            Or continue with
          </p>

          {/* Social buttons (GitHub + Google) */}
          <div className="mt-3 flex justify-center item">
            {/* GitHub */}
            <button
              type="button"
              title="GitHub"
              onClick={() => startGithubOAuth()}
              style={{
                boxShadow: "0px 0px 6px 0px #00000026",
                border: "0.5px solid #FD7EFF",
              }}
              className={[
                "w-full h-10 rounded-[48px] px-7 py-6",
                "text-white text-lg font-semibold jakarta bg-black/20 cursor-pointer",
                "flex items-center justify-center",
              ].join(" ")}
            >
              GitHub <Github className="ml-2" size={18} />
            </button>
          </div>

          {/* Footer text */}
          <div className="mt-5 text-[14px] font-normal font-['Plus Jakarta Sans']">
            <span className="urbanist text-white">Don’t have an account? </span>
            <Link to="/auth/signup" className="text-[#FD7EFF]">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};

export default Login;
