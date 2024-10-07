import React from 'react';
import { Spotlight } from './ui/Spotlight';
import { SparklesPreview } from './SparklesPreview';
import MagicButton from './MagicButton';
import { FaLocationCrosshairs } from 'react-icons/fa6';

const Hero = () => {
  return (
    <section className=" relative">
      <div className="relative">
        <Spotlight
          className="absolute -top-40 -left-10 md:-left-32 md:-top-20 h-screen"
          fill="blue"
        />
        <Spotlight
          className="absolute h-[80vh] w-[50vw] top-10 left-full"
          fill="purple"
        />
        <Spotlight
          className="absolute top-28 left-80 h-[80vh] w-[50vw]"
          fill="white"
        />

<div className="w-full absolute left-0 -top-24  z-50">
  <img
    src="/footer-grid.svg"
    alt="grid"
    className="w-full h-full opacity-50"  
  />

</div>


      </div>

      <div className="flex justify-center relative my-20 z-10">
        <div className="max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center justify-center">
          <SparklesPreview />
         <div className=''>
          <a href="">
          <MagicButton
          icon={<FaLocationCrosshairs />}
          title='Show my Skills'
          position='right'
          />
          </a>
         </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
