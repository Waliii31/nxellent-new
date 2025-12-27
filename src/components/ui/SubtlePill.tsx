const SubtlePill: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <span
    className={`text-xs text-[#090123] font-semibold px-4 py-1 inter bg-[#FD7EFF] rounded-full border border-[#FD7EFF] ${className}`}
  >
    {children}
  </span>
);

export default SubtlePill;