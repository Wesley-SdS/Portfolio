import AboutMe from "@/components/AboutMe";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import ProjectsTree from "@/components/ProjectsTree";
import Solutions from "@/components/Solutions";
import InteractiveInterface from "@/components/InteractiveInterface";
import Gallery from "@/components/Gallery";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { navItems } from "@/data";

export default function Home() {
  return (
    <main className="relative mx-auto flex flex-col items-center overflow-hidden bg-black w-full">
      <FloatingNav navItems={navItems} />
       
      <Hero />
      <AboutMe />
      <Experience />
      <ProjectsTree />
      <Solutions />
      <InteractiveInterface />
      <Gallery />
      <Footer />
    </main>
  );
}
