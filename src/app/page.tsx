"use client";

import { MotionConfig } from "framer-motion";
import NeuralArcade from "./neural-arcade/NeuralArcade";

export default function Home() {
  return (
    <MotionConfig reducedMotion="user">
      <NeuralArcade />
    </MotionConfig>
  );
}
