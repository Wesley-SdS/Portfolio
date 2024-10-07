import React from 'react';
import { projects } from '@/data';

const RecentProjects = () => {
  return (
    <section id="projects" className="py-20">
      <h1 className='heading text-white'>
        <span className='text-purple'> Projects</span>
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 mt-10">
        {
          projects.map((item) => (
            <div className='flex flex-col items-center' key={item.id}>
              <div className="flex flex-col p-4 tracking w-full h-full bg-gray-800 rounded-lg">
                <h3 className="max-w-xs pb-2 m-0 font-bold text-slate-100 text-center">{item.title}</h3>
                <span className='text-slate-500'></span>
                <div className="">
                  <span className="text-slate-500 text-center">
                    {item.desc}
                  </span>
                </div>
                <div className="flex flex-1 w-full rounded-lg mt-4">
                  <img
                    src={item.img}
                    alt='cover'
                    className='w-full h-auto object-cover rounded-lg'
                  />
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </section>
  );
}

export default RecentProjects;
