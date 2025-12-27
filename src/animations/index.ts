import type { Variants } from "framer-motion"

const transition = {
  type: "spring" as const,
  stiffness: 140,
  damping: 18,
  mass: 0.9,
}

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ...transition, stiffness: 120 },
  },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35, ease: "easeOut" } },
}

export const slideInRight: Variants = {
  hidden: { x: "100%", opacity: 0 },
  visible: { x: 0, opacity: 1, transition },
}

export const slideInLeft: Variants = {
  hidden: { x: -24, opacity: 0 },
  visible: { x: 0, opacity: 1, transition },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { ...transition, damping: 16 } },
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
}

export const drawerOverlay: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
}

export const drawerPanel: Variants = {
  hidden: { x: "100%", opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 170, damping: 20 },
  },
}

export const floatIn: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
}

export const zoomIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
}

export const rippleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
}

export const hoverFloat = {
  rest: { y: 0 },
  hover: { y: -6, transition: { duration: 0.25, ease: "easeOut" } },
}

export const pulse = {
  rest: { scale: 1 },
  hover: { scale: 1.04, transition: { duration: 0.2, ease: "easeOut" } },
}

export const animationPresets = {
  transition,
  fadeInUp,
  fadeIn,
  slideInRight,
  slideInLeft,
  scaleIn,
  staggerContainer,
  drawerOverlay,
  drawerPanel,
  floatIn,
  zoomIn,
  rippleIn,
  hoverFloat,
  pulse,
}

export type AnimationPresetKey = keyof typeof animationPresets
export default animationPresets
