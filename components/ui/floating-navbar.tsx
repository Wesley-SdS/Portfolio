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
import { FiHome, FiUser, FiBriefcase, FiMail } from "react-icons/fi";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: JSX.Element;
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

  const icons = [<FiHome />, <FiUser />, <FiBriefcase />, <FiMail />];

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
            backgroundColor: "rgba(17, 17, 17, 0.85)",
            borderRadius: "12px",
            border: "1px solid rgba(88, 24, 127, 0.25)",
            boxShadow: "0px 4px 15px rgba(88, 24, 127, 0.1)",
          }}
        >
          {navItems.map((navItem, idx) => (
            <Link
              key={`link-${idx}`}
              href={navItem.link}
              className={cn(
                "group relative flex items-center space-x-3 p-2 text-neutral-50 transition-all duration-300 ease-in-out hover:text-neutral-200",
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};
