import React from "react";
import { projects } from "@/data";
import { PinContainer } from "./ui/3d-pin";

const RecentProjects = () => {
  return (
    <section id="projects" className="py-20">
      <h1 className="heading text-white">
        <span className="text-purple"> Projects</span>
      </h1>
      <div className="mt-10 grid grid-cols-1 gap-16 p-4 sm:grid-cols-2 md:grid-cols-3">
        {projects.map((item) => (
          <div
            className="flex w-full flex-col items-center justify-center"
            key={item.id}
          >
            <PinContainer
              title="/ui.aceternity.com"
              href="https://twitter.com/mannupaaji"
            >
              <div className="flex h-[20rem] w-[20rem] flex-col p-4 tracking-tight">
                <h3 className="!m-0 max-w-xs !pb-2 font-bold text-slate-100">
                  {item.title}
                </h3>
                <div className="">
                  <span className="text-slate-500">{item.desc}</span>
                </div>
                <div className="mt-4 flex w-full flex-1 rounded-lg">
                  <img
                    src={item.img}
                    alt="cover"
                    className="z-10 rounded-lg bg-cover"
                  />
                </div>
              </div>
            </PinContainer>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecentProjects;
