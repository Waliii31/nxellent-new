import React from "react";

export interface FieldPillProps {
  label: string;
  placeholder?: string;
  /** Optional controlled value */
  value?: string;
  /** Optional change handler */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Input type (text, password, email, etc.) */
  type?: string;
  /** Disabled state */
  disabled?: boolean;
}

const FieldPill: React.FC<FieldPillProps> = ({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  disabled = false,
}) => {
  return (
    <div className="text-left mt-5">
      <label className="block jakarta mb-2 text-white text-[16px] font-medium font-plus-jakarta-sans">
        {label}
      </label>

      <div
        className={[
          "flex items-center gap-3",
          "w-full h-12 rounded-full",
          "bg-[#3838381A] border-[0.1px] border-[#ffffff66]",
          "shadow-[0_0_6px_0_#00000026]",
        ].join(" ")}
      >
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="jakarta w-full h-full rounded-full px-4 bg-transparent outline-none text-[#A19DAF] placeholder:text-[#A19DAF] text-[14px] disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
    </div>
  );
};

export default FieldPill;
