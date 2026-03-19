"use client";

import { useEffect, useState } from "react";
import { animate, useMotionValue, useTransform, motion } from "framer-motion";

interface NumberCounterProps {
  value: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
}

export function NumberCounter({ value, duration = 1, decimals = 1, suffix = "", prefix = "" }: NumberCounterProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => latest.toFixed(decimals));

  useEffect(() => {
    const controls = animate(count, value, { duration, ease: "easeOut" });
    return controls.stop;
  }, [value, count, duration]);

  return (
    <span className="tabular-nums">
      {prefix}<motion.span>{rounded}</motion.span>{suffix}
    </span>
  );
}
