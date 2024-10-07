"use client";
import React from "react";
import { SparklesCore } from "../components/ui/sparkles";
import { motion } from "framer-motion"
import { TypewriterEffectSmoothDemo } from "./TypeWriter";

export function SparklesPreview() {
  return (
    <div className="w-full flex flex-col items-center jus overflow-hidden rounded-md ">
      <TypewriterEffectSmoothDemo />
      <motion.h1
      initial={{
        opacity: 0,
        y:0,
      }}
      animate={{
        opacity: 1,
        y:0,
      }}
      transition={{
        duration:3,
      }}
      className="md:text-7xl text-3xl lg:text-9xl font-bold text-center text-white relative z-20">
        Developer FullStack
      </motion.h1>
      <div className="w-[40rem] h-40 relative">
        {/* Gradients */}
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-violet-500 to-transparent h-[5px] w-1/4 blur-sm" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-violet-500 to-transparent h-px w-1/4" />

        {/* Core component */}
        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={1200}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />

        {/* Radial Gradient to prevent sharp edges */}
        <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
      </div>
    </div>
  );
}
