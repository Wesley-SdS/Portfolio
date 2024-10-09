"use client";
import React from "react";

import { AnimatePresence, motion } from "framer-motion";
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect";

export function CanvasRevealEffectDemo() {
  return (
    <section id="approach" className="w-full py-20">
      <h1 className="heading text-white">
        My <span className="text-purple">UI Approach</span>
      </h1>
      <div className="mx-auto flex w-full flex-col items-center justify-center gap-4 bg-black px-8 py-20 lg:flex-row">
        <Card
          title="Unmanaged"
          icon={<AceternityIcon order="UI 1" />}
          des="Advanced users system"
        >
          <CanvasRevealEffect
            animationSpeed={5.1}
            containerClassName="bg-teal-500 overflow-hidden"
          />
        </Card>
        <Card
          title="lorem"
          icon={<AceternityIcon order="UI 2" />}
          des="lorem lorem"
        >
          <CanvasRevealEffect
            animationSpeed={5.1}
            containerClassName="bg-pink-900 overflow-hidden"
            colors={[
              [255, 166, 158],
              [221, 255, 247],
            ]}
            dotSize={2}
          />
        </Card>
        <Card
          title="lorem"
          icon={<AceternityIcon order="UI 3" />}
          des="lorem lorem"
        >
          <CanvasRevealEffect
            animationSpeed={5.1}
            containerClassName="bg-sky-600 overflow-hidden"
            colors={[[125, 211, 252]]}
          />
        </Card>
      </div>
    </section>
  );
}

const Card = ({
  title,
  icon,
  children,
  des,
}: {
  title: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
  des: string;
}) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group/canvas-card relative mx-auto flex h-[35rem] w-full max-w-sm items-center justify-center border border-white/[0.2] p-4"
    >
      <Icon className="absolute -left-3 -top-3 h-6 w-6 text-white dark:text-white" />
      <Icon className="absolute -bottom-3 -left-3 h-6 w-6 text-white dark:text-white" />
      <Icon className="absolute -right-3 -top-3 h-6 w-6 text-white dark:text-white" />
      <Icon className="absolute -bottom-3 -right-3 h-6 w-6 text-white dark:text-white" />

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 h-full w-full"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-20">
        <div className="group-hover/ canvas-card:-translate-y-4 mx-auto flex w-full items-center justify-center text-center transition duration-200 group-hover/canvas-card:opacity-0">
          {icon}
        </div>
        <h2
          className="relative z-10 mt-4 text-sm opacity-0 transition duration-200 group-hover/canvas-card:-translate-y-2 group-hover/canvas-card:text-white group-hover/canvas-card:opacity-100 dark:text-white"
          style={{ color: "E43CFF" }}
        >
          {title}
        </h2>
        <p
          className="relative z-10 mt-4 text-sm opacity-0 transition duration-200 group-hover/canvas-card:-translate-y-2 group-hover/canvas-card:text-white group-hover/canvas-card:opacity-100"
          style={{ color: "#E4ECFF" }}
        >
          {des}
        </p>
      </div>
    </div>
  );
};

const AceternityIcon = ({ order }: { order: string }) => {
  return (
    <svg
      width="66"
      height="65"
      viewBox="0 0 66 65"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-10 w-10 text-purple group-hover/canvas-card:text-white dark:text-white"
    >
      <path
        d="M8 8.05571C8 8.05571 54.9009 18.1782 57.8687 30.062C60.8365 41.9458 9.05432 57.4696 9.05432 57.4696"
        stroke="currentColor"
        strokeWidth="15"
        strokeMiterlimit="3.86874"
        strokeLinecap="round"
        style={{ mixBlendMode: "darken" }}
      />
    </svg>
  );
};

export const Icon = ({ className, ...rest }: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
      {...rest}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
};
