import type { Transition, Variants } from "framer-motion";

export const EHB_MOTION: Transition = {
  duration: 0.28,
  ease: "easeInOut",
};

export const sectionFadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: EHB_MOTION },
};

export const staggerList: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.03,
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};

export const itemFade: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.22, ease: "easeInOut" } },
};

