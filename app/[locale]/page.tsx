import { setRequestLocale } from "next-intl/server";
import { Hero, StackMarquee, ProjectStage, Numbers, Products, OrbitaLab, Leadership, Services, Process, Contact } from "@/components/home";

/**
 * Home (v3spec §2) — server component. Section order is the contract:
 * hero in orbit + stack marquee → proof (stage, numbers, products, Órbita live) →
 * person and credentials (about & experience) → offer (services, process) →
 * double close (contact: Órbita call + quote).
 * Header, Footer, skip link and the Órbita widget live in the locale layout.
 * Each section file under components/home/ is owned by one agent (docs/REDESIGN.md).
 */
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <Hero />
      <StackMarquee />
      <ProjectStage />
      <Numbers />
      <Products />
      <OrbitaLab />
      <Leadership />
      <Services />
      <Process />
      <Contact />
    </>
  );
}
