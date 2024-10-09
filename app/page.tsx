import { CanvasRevealEffectDemo } from "@/components/CanvasRevealEffectDemo";
import Experience from "@/components/Experience";
import { FeaturesSectionDemo } from "@/components/FeaturesSectionDemo";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import { LayoutGridDemo } from "@/components/LayoutGridDemo";
import RecentProjects from "@/components/RecentProjects";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { navItems } from "@/data";
import Image from "next/image";

export default function Home() {
  return (
    <main className="relative mx-auto flex flex-col items-center justify-center overflow-hidden bg-black px-5 sm:px-10">
      <div className="w-full max-w-7xl">
        <FloatingNav navItems={navItems} />
        <Hero />
        <Experience />
        <RecentProjects />
        <FeaturesSectionDemo />
        <CanvasRevealEffectDemo />
        <LayoutGridDemo />
        <Footer />
      </div>
    </main>
  );
}
