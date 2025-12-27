import { motion } from "framer-motion";
import type { JSX, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: keyof JSX.IntrinsicElements;
}

const ScrollReveal = ({
  children,
  className,
  delay = 0,
  as = "div",
}: ScrollRevealProps) => {
  const Component = (motion as Record<string, any>)[as] ?? motion.div;
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
    >
      {children}
    </Component>
  );
};

export default ScrollReveal;
