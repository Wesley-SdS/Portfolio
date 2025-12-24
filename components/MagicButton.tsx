import React from "react";

const MagicButton = ({
  title,
  icon,
  position,
  onClick,
  otherClasses,
  type = "button",
  disabled = false,
}: {
  title: string;
  icon: React.ReactNode;
  position: string;
  onClick?: () => void;
  otherClasses?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}) => {
  return (
    <button
      className={`relative inline-flex h-12 overflow-hidden rounded-xl p-[1px] focus:outline-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
      <span
        className={`inline-flex h-full w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-slate-900 dark:bg-black px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl ${otherClasses}`}
      >
        {position === "left" && icon}
        {title}
        {position === "right" && icon}
      </span>
    </button>
  );
};

export default MagicButton;
