// app/posts/[slug]/_components/motion-div.tsx
"use client";

import { motion, MotionProps } from "framer-motion";
import * as React from "react";

export function MotionDiv({
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & MotionProps) {
  return (
    <motion.div {...rest}>
      {children}
    </motion.div>
  );
}
