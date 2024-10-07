import React from 'react'
import { PinContainer } from './ui/3d-pin'

const RecentProjects = () => {
  return (
    <section id="projects" className="py-20">
      <h1 className='heading text-white'>
        <span className='text-purple'> Projects</span>
      </h1>
      <div className="">
        {
          projects.map((item) => (
            <div className='flex items-center justify-center p-4 gap-16 mt-10'
              key={item.id}
            >
              <PinContainer
                title='@'
                href='#'
              >
                <div className="flex basis-full flex-col p-4 tracking sm:basis-1/2 w-[~20rem] h-[20rem]">
                  <h3 className="max-w-xs !pb-2 !m-0 font-bold text-slate-100">{item.title}</h3>
                </div>
                <span className='text-slate-500'></span>
              </PinContainer>
            </div>
          ))
        }

      </div>
    </section>
  )
}

export default RecentProjects