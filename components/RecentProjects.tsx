import React from 'react';
import { projects } from '@/data';
import { PinContainer } from './ui/3d-pin';

const RecentProjects = () => {
  return (
    <section id="projects" className="py-20">
      <h1 className='heading text-white'>
        <span className='text-purple'> Projects</span>
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-16 p-4 mt-10">
        {
          projects.map((item) => (
            <div className='flex flex-col items-center justify-center w-full' key={item.id}>
              <PinContainer
                title='google.com.br'
                href='#'
              >
                <div className="flex flex-col p-4 tracking-tight w-[20rem] h-[20rem]">
                  <h3 className="max-w-xs !pb-2 !m-0 font-bold text-slate-100">
                    {item.title}
                  </h3>
                  <div className="">
                    <span className="text-slate-500">
                      {item.desc}
                    </span>
                  </div>
                  <div className="flex flex-1 w-full rounded-lg mt-4">
                    <img
                      src={item.img}
                      alt='cover'
                      className='z-10 rounded-lg bg-cover'
                    />
                  </div>
                </div>
              </PinContainer>
            </div>
          ))
        }
      </div>
    </section>
  );
}

export default RecentProjects;
