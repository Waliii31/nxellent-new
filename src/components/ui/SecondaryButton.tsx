import React from "react";
import { useNavigate } from "react-router-dom";

type SecondaryButtonProps = {
  children: React.ReactNode;
  icon?: React.ReactNode;
  whereTo?: string;
  type?: "button" | "submit" | "reset";
  iconPosition?: "left" | "right";
  moreClasses?: string;
  disabled?: boolean; // ✅ added disabled prop
  onClick?: () => void;
};

export default function SecondaryButton({
  children,
  icon,
  whereTo,
  type = "button",
  iconPosition = "right",
  moreClasses = "",
  disabled = false, // ✅ default false
  onClick,
}: SecondaryButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (disabled) return;
    if (onClick) onClick();
    else if (whereTo) navigate(`/${whereTo}`);
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={`cursor-pointer px-7 py-4 rounded-[48px] bg-transparent border border-[#FD7EFF] shadow-[0_0_6px_rgba(0,0,0,0.15)] text-white text-sm font-medium flex items-center justify-center gap-2.5 transition-all duration-300
        hover:bg-[#121262]/60 hover:shadow-[0_0_10px_rgba(253,126,255,0.4)]
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:shadow-none
        ${moreClasses}`}
    >
      {icon && iconPosition === "left" && (
        <span className="urbanist flex items-center">{icon}</span>
      )}
      <span>{children}</span>
      {icon && iconPosition === "right" && (
        <span className="urbanist flex items-center">{icon}</span>
      )}
    </button>
  );
}

