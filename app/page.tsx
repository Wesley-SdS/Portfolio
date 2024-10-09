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
    <main className="relative bg-black flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5">
      <div className="max-w-7xl w-full">
        <FloatingNav navItems={navItems}/>
        <Hero />
        <Experience/>
        <RecentProjects />
        <FeaturesSectionDemo />
        <CanvasRevealEffectDemo />
        <LayoutGridDemo />
        <Footer />
      </div>
    </main>
  );
}
