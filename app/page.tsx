import AboutMe from "@/components/AboutMe";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import ProjectsTree from "@/components/ProjectsTree";
import Solutions from "@/components/Solutions";
import InteractiveInterface from "@/components/InteractiveInterface";
import Gallery from "@/components/Gallery";
import { CosmicNav } from "@/components/ui/cosmic-nav";
import { navItems } from "@/data";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-black">
      <CosmicNav navItems={navItems} />
      
      <main className="w-full">
        <Hero />
        <AboutMe />
        <Experience />
        <ProjectsTree />
        <Solutions />
        <InteractiveInterface />
        <Gallery />
        <Footer />
      </main>
    </div>
  );
}
