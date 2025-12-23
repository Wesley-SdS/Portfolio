"use client";

import dynamic from "next/dynamic";
import { CosmicNav } from "@/components/ui/cosmic-nav";
import { navItems } from "@/data";

// Critical above-the-fold components with SSR
const Hero = dynamic(() => import("@/components/Hero"), {
  ssr: true,
  loading: () => <div className="min-h-screen" />
});

const AboutMe = dynamic(() => import("@/components/AboutMe"), {
  ssr: true,
  loading: () => <div className="h-screen" />
});

// Important components with SSR
const Experience = dynamic(() => import("@/components/Experience"), {
  ssr: true,
  loading: () => <div className="h-96" />
});

const ProjectsTree = dynamic(() => import("@/components/ProjectsTree"), {
  ssr: true,
  loading: () => <div className="h-96" />
});

// Below-the-fold components without SSR
const Solutions = dynamic(() => import("@/components/Solutions"), {
  ssr: false,
  loading: () => <div className="h-96" />
});

const InteractiveInterface = dynamic(() => import("@/components/InteractiveInterface"), {
  ssr: false,
  loading: () => <div className="h-96" />
});

const Gallery = dynamic(() => import("@/components/Gallery"), {
  ssr: false,
  loading: () => <div className="h-96" />
});

const Footer = dynamic(() => import("@/components/Footer"), {
  ssr: true,
  loading: () => <div className="h-64" />
});

const ContactForm = dynamic(() => import("@/components/ContactForm"), {
  ssr: false,
  loading: () => <div className="h-96" />
});

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
        <section id="contact" className="py-20 deep-space-gradient">
          <div className="max-w-7xl mx-auto px-6 lg:px-20">
            <ContactForm />
          </div>
        </section>
        <Footer />
      </main>
    </div>
  );
}

