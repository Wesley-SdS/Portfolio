import React from "react";
import { workExperience } from "@/data";
import { Button } from "./ui/moving-border";

const Experience = () => {
  return (
    <section id="experience" className="w-full py-20">
      <h1 className="heading text-purple">
        <span className="text-purple-500">Experience</span>
      </h1>

      <div className="mt-12 grid w-full grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {workExperience.map((card) => (
          <Button
            key={card.id}
            borderRadius="1.75rem"
            duration={Math.floor(Math.random() * 10000) + 1000}
            style={{
              background: "rgb(0, 0, 0)",
              borderRadius: `calc(1.75rem * 0.96)`,
            }}
            className="text-white"
          >
            <div className="flex flex-col items-center gap-2 p-3 py-6 md:p-5 lg:p-10">
              <img
                src={card.thumbnail}
                alt={card.title}
                className="w-16 text-center"
              />
              <div className="text-center lg:mt-5">
                <h1 className="text-xl font-bold md:text-2xl">{card.title}</h1>
                <p className="mt-3 text-white-100">{card.desc}</p>
              </div>
            </div>
          </Button>
        ))}
      </div>
    </section>
  );
};

export default Experience;
