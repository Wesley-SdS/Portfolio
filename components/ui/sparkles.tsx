"use client";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { motion, useAnimation } from "framer-motion";

type Sparkle = {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
};

type ParticlesProps = {
  id?: string;
  className?: string;
  background?: string;
  particleSize?: number;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  particleDensity?: number;
};

export const SparklesCore = (props: ParticlesProps) => {
  const {
    id,
    className,
    background,
    minSize = 1,
    maxSize = 3,
    speed = 4,
    particleColor = "#ffffff",
    particleDensity = 120,
  } = props;

  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  useEffect(() => {
    if (!containerRef.current) return;

    const generateSparkles = () => {
      const newSparkles: Sparkle[] = [];
      const containerWidth = containerRef.current?.offsetWidth || 800;
      const containerHeight = containerRef.current?.offsetHeight || 600;

      for (let i = 0; i < particleDensity; i++) {
        newSparkles.push({
          id: i,
          x: Math.random() * containerWidth,
          y: Math.random() * containerHeight,
          size: Math.random() * (maxSize - minSize) + minSize,
          duration: Math.random() * 2 + speed,
          delay: Math.random() * 2,
        });
      }
      return newSparkles;
    };

    setSparkles(generateSparkles());
    controls.start({
      opacity: 1,
      transition: {
        duration: 1,
      },
    });

    const handleResize = () => {
      setSparkles(generateSparkles());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [particleDensity, minSize, maxSize, speed, controls]);

  return (
    <motion.div
      ref={containerRef}
      animate={controls}
      className={cn("opacity-0 relative overflow-hidden", className)}
      style={{ background }}
    >
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute rounded-full"
          style={{
            left: sparkle.x,
            top: sparkle.y,
            width: sparkle.size,
            height: sparkle.size,
            backgroundColor: particleColor,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: sparkle.duration,
            delay: sparkle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </motion.div>
  );
};