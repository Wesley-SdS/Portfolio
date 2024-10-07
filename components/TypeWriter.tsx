"use client";
import { TypewriterEffectSmooth } from "../components/ui/typewriter-effect";
export function TypewriterEffectSmoothDemo() {
  const words = [
    {
      text: "Full-stack",
    },
    {
      text: "developer",
    },
    {
      text: "modern",
    },
    {
      text: "interfaces",
    },
    {
      text: "with",
    },
    {
      text: "powerful",
    },
    {
      text: "code",
    },
    {
      text: "Code. Design. Innovate.",
      className: "text-violet-500 ",
    },
  ];
  return (
    <div className="flex flex-col items-center justify-center">
     
      <TypewriterEffectSmooth words={words} />
     
   
    </div>
  );
}
