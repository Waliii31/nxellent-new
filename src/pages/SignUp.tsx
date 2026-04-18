// src/pages/SignUp.tsx
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Github, ArrowLeft } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { register, startGithubOAuth } from "../services/authService";
import { useAppDispatch } from "../app/store";
import { setCredentials } from "../features/auth/authSlice";
import type { AuthResponseDto, RegisterDto } from "../types/auth";

const SignUp = () => {
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const from =
    (location.state as { from?: string } | undefined)?.from ||
    "/projects/my-projects";

  const mutation = useMutation<AuthResponseDto, unknown, RegisterDto>({
    mutationFn: (payload) => register(payload),
    onSuccess(data) {
      dispatch(setCredentials(data));
      navigate(from, { replace: true });
    },
    onError(err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error?.response?.data?.message || "Registration failed");
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
          Create Account
        </h1>

        {/* Subheading */}
        <p className="alexandria mt-2 text-white/90 text-[16px] sm:text-[18px] md:text-[20px] leading-[100%] tracking-[-0.02em] font-[Alexandria]">
          Start your code security journey
        </p>

        {/* Auth Card (matches Login) */}
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
            {/* Full name */}
            <div className="text-left">
              <label className="block jakarta mb-2 text-white text-[16px] font-medium font-['Plus Jakarta Sans']">
                Full name
              </label>
              <div
                className={[
                  "flex items=center gap-3",
                  "w-full  h-12 rounded-full",
                  "bg-[#3838381A] border-[0.1px] border-[#ffffff66]",
                  "shadow-[0_0_6px_0_#00000026]",
                ].join(" ")}
              >
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="jakarta rounded-full px-4 w-full bg-transparent outline-none text-[#A19DAF] placeholder:text-[#A19DAF] text-[14px]"
                />
              </div>
            </div>

            {/* Email */}
            <div className="text-left">
              <label className="block jakarta mb-2 text-white text-[16px] font-medium font-['Plus Jakarta Sans']">
                Email
              </label>
              <div
                className={[
                  "flex items=center gap-3",
                  "w-full  h-12 rounded-full",
                  "bg-[#3838381A] border-[0.1px] border-[#ffffff66]",
                  "shadow-[0_0_6px_0_#00000026]",
                ].join(" ")}
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  className="jakarta w-full rounded-full px-4 bg-transparent outline-none text-[#A19DAF] placeholder:text-[#A19DAF] text-[14px]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div className="text-left">
              <label className="block jakarta mb-2 text-white text-[16px] font-medium font-['Plus Jakarta Sans']">
                Password
              </label>
              <div
                className={[
                  "flex items=center gap-3",
                  "w-full  h-12 rounded-full pe-4",
                  "bg-[#3838381A] border-[0.1px] border-[#ffffff66]",
                  "shadow-[0_0_6px_0_#00000026]",
                ].join(" ")}
              >
                <input
                  type={showPwd ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="new-password"
                  className="w-full jakarta rounded-full px-4 bg-transparent outline-none text-white placeholder:text-white/60 text-[14px]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
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
            </div>

            {/* Confirm Password */}
            <div className="text-left">
              <label className="block jakarta mb-2 text-white text-[16px] font-medium font-['Plus Jakarta Sans']">
                Confirm Password
              </label>
              <div
                className={[
                  "flex items-center gap-3",
                  "w-full  h-12 rounded-full pe-4",
                  "bg-[#3838381A] border-[0.1px] border-[#ffffff66]",
                  "shadow-[0_0_6px_0_#00000026]",
                ].join(" ")}
              >
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  className="w-full jakarta rounded-full px-4 bg-transparent outline-none text-white placeholder:text-white/60 text-[14px]"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((s) => !s)}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                  title={showConfirm ? "Hide password" : "Show password"}
                  className="p-1 rounded-md text-white/80 hover:text-white cursor-pointer"
                >
                  {showConfirm ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>

              {/* Company */}
              <div className="text-left mt-5">
                <label className="block jakarta mb-2 text-white text-[16px] font-medium font-['Plus Jakarta Sans']">
                  Company
                </label>
                <div
                  className={[
                    "flex items=center gap-3",
                    "w-full  h-12 rounded-full",
                    "bg-[#3838381A] border-[0.1px] border-[#ffffff66]",
                    "shadow-[0_0_6px_0_#00000026]",
                  ].join(" ")}
                >
                  <input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Company"
                    className="jakarta w-full rounded-full px-4 bg-transparent outline-none text-[#A19DAF] placeholder:text-[#A19DAF] text-[14px]"
                  />
                </div>
              </div>

              {/* Terms & Privacy */}
              <div className="mt-5 space-y-3 text-[14px] font-['Plus Jakarta Sans'] text-white flex flex-col">
                <label className="flex jakarta items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="
                      appearance-none jakarta h-5 w-5 rounded-md
                      bg-[#FFC2C8] border border-[#FFC2C8]
                      relative cursor-pointer shrink-0
                      checked:before:content-['✓'] checked:before:text-[#000124]
                      checked:before:text-[13px] checked:before:absolute checked:before:inset-0
                      checked:before:flex checked:before:items-center checked:before:justify-center
                      transition-all duration-200
                    "
                  />
                  <span>
                    I agree to the{" "}
                    <a
                      href="https://nxellent.com/terms"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#FD7EFF] jakarta hover:text-[#FF9CFF] transition-colors duration-200"
                    >
                      Terms of Service
                    </a>
                  </span>
                </label>

                <label className="flex jakarta items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="
                      appearance-none jakarta h-5 w-5 rounded-md
                      bg-[#FFC2C8] border border-[#FFC2C8]
                      relative cursor-pointer shrink-0
                      checked:before:content-['✓'] checked:before:text-[#000124]
                      checked:before:text-[13px] checked:before:absolute checked:before:inset-0
                      checked:before:flex checked:before:items-center checked:before:justify-center
                      transition-all duration-200
                    "
                  />
                  <span>
                    I agree to the{" "}
                    <a
                      href="https://nxellent.com/privacy"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#FD7EFF] jakarta hover:text-[#FF9CFF] transition-colors duration-200"
                    >
                      Privacy Policy
                    </a>
                  </span>
                </label>
              </div>
            </div>

            {error && <div className="text-red-400">{error}</div>}

            <div>
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  if (!email || !password)
                    return setError("Email and password are required");
                  if (password !== confirm)
                    return setError("Passwords do not match");

                  if (!name)
                    return setError("Full name is required");

                  mutation.mutate({
                    email,
                    password,
                    role: "founder",
                    profile: { name, company },
                  });
                }}
                disabled={loading}
                className={[
                  "w-full h-12 rounded-[72px] cursor-pointer",
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
                {loading ? "Creating..." : "Create Account"}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="my-5 w-full  mx-auto h-px bg-white/10" />

          {/* Continue with */}
          <p className="alexandria text-white/80 text-[14px] font-normal font-['Plus Jakarta Sans']">
            Or continue with
          </p>

          {/* Social Buttons — GitHub + Google */}
          <div className="mt-3 justify-center items-center flex">
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

          {/* Footer */}
          <div className="mt-5 text-[14px] font-normal font-['Plus Jakarta Sans']">
            <span className="urbanist text-white">Already have an account? </span>
            <Link to="/auth/login" className="text-[#FD7EFF]">
              Login
            </Link>
          </div>
        </div>
      </div >
      </div>
    </section >
  );
};

export default SignUp;
