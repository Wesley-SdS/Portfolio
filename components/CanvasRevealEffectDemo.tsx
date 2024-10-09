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
            <div className="py-20 flex flex-col lg:flex-row items-center justify-center bg-black w-full gap-4 mx-auto px-8">


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
                        colors={[
                            [125, 211, 252],

                        ]}

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
            className="border group/canvas-card flex items-center justify-center border-white/[0.2]  max-w-sm w-full mx-auto p-4  h-[35rem] relative"
        >
            <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-white" />
            <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-white" />
            <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-white" />
            <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-white" />

            <AnimatePresence>
                {hovered && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="h-full w-full absolute inset-0"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative z-20">
                <div className="text-center group-hover/
                canvas-card:-translate-y-4 group-hover/canvas-card:opacity-0 transition duration-200 w-full  mx-auto flex items-center justify-center">
                    {icon}
                </div>
                <h2 className="dark:text-white text-sm opacity-0 group-hover/canvas-card:opacity-100 relative z-10  mt-4   group-hover/canvas-card:text-white group-hover/canvas-card:-translate-y-2 transition duration-200"
                    style={{ color: "E43CFF" }}
                >
                    {title}
                </h2>
                <p className="text-sm opacity-0 group-hover/canvas-card:opacity-100 relative z-10  mt-4   group-hover/canvas-card:text-white group-hover/canvas-card:-translate-y-2 transition duration-200" style={{ color: "#E4ECFF" }}>
                    {des}
                </p>
            </div>
        </div>
    );
};

const AceternityIcon = ({ order } : { order: string} ) => {
    return (
        <svg
            width="66"
            height="65"
            viewBox="0 0 66 65"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-purple dark:text-white group-hover/canvas-card:text-white "
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
