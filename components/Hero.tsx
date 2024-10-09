import React from "react";
import { Spotlight } from "./ui/Spotlight";
import { SparklesPreview } from "./SparklesPreview";
import MagicButton from "./MagicButton";
import { FaLocationCrosshairs } from "react-icons/fa6";

const Hero = () => {
  return (
    <section className="relative">
      <div className="relative">
        <Spotlight
          className="absolute -left-10 -top-40 h-screen md:-left-32 md:-top-20"
          fill="blue"
        />
        <Spotlight
          className="absolute left-full top-10 h-[80vh] w-[50vw]"
          fill="purple"
        />
        <Spotlight
          className="absolute left-80 top-28 h-[80vh] w-[50vw]"
          fill="white"
        />

        <div className="absolute -top-24 left-0 z-50 w-full">
          <img
            src="/footer-grid.svg"
            alt="grid"
            className="h-full w-full opacity-50"
          />
        </div>
      </div>

      <div className="relative z-10 my-20 flex justify-center">
        <div className="flex max-w-[89vw] flex-col items-center justify-center md:max-w-2xl lg:max-w-[60vw]">
          <SparklesPreview />
          <div className="">
            <a href="">
              <MagicButton
                icon={<FaLocationCrosshairs />}
                title="Show my Skills"
                position="right"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
