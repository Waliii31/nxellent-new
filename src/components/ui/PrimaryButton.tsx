import React from "react";
import { useNavigate } from "react-router-dom";

type PrimaryButtonProps = {
  children: React.ReactNode;
  icon?: React.ReactNode;
  whereTo?: string;
  type?: "button" | "submit" | "reset";
  iconPosition?: "left" | "right";
  moreClasses?: string;
  disabled?: boolean; // ✅ added prop
  onClick?: () => void;
};

export default function PrimaryButton({
  children,
  icon,
  whereTo,
  type = "button",
  iconPosition = "right",
  moreClasses = "",
  disabled = false, // ✅ default false
  onClick,
}: PrimaryButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (disabled) return;
    if (onClick) onClick();
    else if (whereTo !== undefined) navigate(`/${whereTo}`);
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={`cursor-pointer px-10 py-4 rounded-[58px] bg-linear-to-r from-[#FFC857] via-[#FF8A3C] to-[#FF0040] text-[#333333] text-sm font-medium flex items-center justify-center gap-2.5 transition-all duration-300
        hover:opacity-90 hover:shadow-[0_0_10px_rgba(255,0,64,0.35)]
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none
        ${moreClasses}`}
    >
      {icon && iconPosition === "left" && (
        <span className="flex items-center">{icon}</span>
      )}
      <span>{children}</span>
      {icon && iconPosition === "right" && (
        <span className="flex items-center">{icon}</span>
      )}
    </button>
  );
}
