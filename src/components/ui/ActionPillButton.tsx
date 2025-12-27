import React from "react"

type ActionPillButtonProps = {
  icon: React.ReactNode
  label: string
  onClick?: () => void | Promise<void>
}

const ActionPillButton: React.FC<ActionPillButtonProps> = ({ icon, label, onClick }) => {
  return (
    <button onClick={onClick} className="
      flex text-sm items-center justify-center
      w-full border-2 border-[#EC4899]/60
      p-3.5 rounded-full cursor-pointer
      hover:opacity-80 transition-all delay-75
      gap-2
    ">
      {icon}
      {label}
    </button>
  )
}

export default ActionPillButton
