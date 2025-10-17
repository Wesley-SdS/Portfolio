"use client";
import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FiHome, FiUser, FiBriefcase, FiMail, FiSettings, FiFilter } from "react-icons/fi";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: React.ReactNode;
  }[];
  className?: string;
}) => {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useMotionValueEvent(scrollY, "change", (current) => {
    const scrollDirection = current - lastScrollY;

    if (current < 100) {
      setVisible(false);
    } else {
      setVisible(true);
    }

    setLastScrollY(current);
  });

  const icons = [<FiHome />, <FiUser />, <FiBriefcase />, <FiMail />, <FiSettings />, <FiFilter />];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.4 }}
          className={cn(
            "fixed inset-x-0 top-10 z-[5000] mx-auto flex max-w-fit items-center justify-center space-x-6 px-8 py-3 md:min-w-[70vw] lg:min-w-fit",
            className,
          )}
          style={{
            backdropFilter: "blur(10px) saturate(150%)",
            backgroundColor: "rgba(10, 14, 26, 0.85)",
            borderRadius: "16px",
            border: "1px solid rgba(99, 102, 241, 0.2)",
            boxShadow: "0px 8px 32px rgba(99, 102, 241, 0.15)",
          }}
        >
          {navItems.map((navItem, idx) => (
            <Link
              key={`link-${idx}`}
              href={navItem.link}
              className={cn(
                "group relative flex items-center space-x-3 p-2 text-slate-300 transition-all duration-300 ease-in-out hover:text-purple-400",
              )}
            >
              <span className="block text-lg">{icons[idx]}</span>

              <span className="text-sm font-medium">{navItem.name}</span>

              <span
                className="absolute bottom-0 left-0 h-[2px] w-0 bg-violet-500 transition-all duration-300 group-hover:w-full"
                style={{ borderRadius: "2px" }}
              />
            </Link>
          ))}
           <div className="flex justify-end  text-white"></div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
