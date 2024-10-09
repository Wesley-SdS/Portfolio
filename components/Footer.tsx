import React from "react";
import { socialIcons } from "@/data";
import MagicButton from "./MagicButton";
import { FaLocationCrosshairs } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer id="contact" className="w-full pb-10 pt-48 text-white">
      <section className="flex flex-col items-center">
        <h1 className="heading text-center lg:max-w-[40vw]">
          Ready to take <span className="text-purple">your</span> digital
          presence to the next level?
        </h1>
        <p className="my-5 text-center text-gray-300 md:mt-10">
          Reach out to me today and let's discuss how I can help you achieve
          your goals.
        </p>
        <a href="mailto:wesleysantos.0095@gmail.com">
          <MagicButton
            title="Let's get in touch"
            position="right"
            icon={<FaLocationCrosshairs />}
          />
        </a>
      </section>
      <div className="mt-16 flex flex-col items-center justify-between md:flex-row">
        <p className="text-sm font-light">© 2024 Portfolio Wesley Santos</p>
        <nav className="mt-6 flex items-center gap-6 md:mt-0">
          {socialIcons.map((info) => (
            <a
              key={info.id}
              href={info.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={info.img}
                alt={`${info.name} icon`}
                width={20}
                height={20}
              />
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
