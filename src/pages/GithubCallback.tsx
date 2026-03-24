// src/pages/GithubCallback.tsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch } from "../app/store";
import { setCredentials } from "../features/auth/authSlice";
import { api } from "../services/api";
import type { User } from "../types/auth";

const GithubCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const tokenFromQuery =
      searchParams.get("token") || searchParams.get("access_token");

    if (!tokenFromQuery) {
      setError("Missing token in callback URL");
      return;
    }

    const handleGithubLogin = async () => {
      try {
        // Save token so axios interceptor can use it
        localStorage.setItem("nx_token", tokenFromQuery);

        // Fetch full user profile
        const res = await api.get<User>("/users/profile");

        dispatch(
          setCredentials({
            access_token: tokenFromQuery,
            user: res.data,
          })
        );

        navigate("/", { replace: true });
      } catch {
        setError("GitHub login failed, please try again.");
      }
    };

    void handleGithubLogin();
  }, [searchParams, dispatch, navigate]);

  return (
    <section className="w-full min-h-svh flex items-center justify-center bg-[#000124] text-white">
      <div className="text-center space-y-3">
        <h1 className="text-2xl font-semibold">Connecting your GitHub…</h1>
        <p className="text-white/70 text-sm max-w-md mx-auto">
          Please wait while we complete your sign-in.
        </p>
        {error && <p className="text-red-400 mt-4">{error}</p>}
      </div>
    </section>
  );
};

export default GithubCallback;
