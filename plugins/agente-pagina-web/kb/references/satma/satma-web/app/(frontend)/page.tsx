// HeroParallax3D moved to /agencia — it now acts as the visual prelude
// to "Una agencia de personas que usa IA como herramienta", which lands
// the woman→robot reveal as a direct illustration of the headline.
import { HeroVideoScrollIntro } from "@/components/sections/hero-video-scroll-intro";
import { Hero } from "@/components/sections/hero";
import { Marquee } from "@/components/sections/marquee";
import { Manifiesto } from "@/components/sections/manifiesto";
import { Services } from "@/components/sections/services";
import { Industries } from "@/components/sections/industries";
// import { Brujeria } from "@/components/sections/brujeria"; // hidden — not yet ready for production
import { Cases } from "@/components/sections/cases";
import { Process } from "@/components/sections/process";
import { Testimonios } from "@/components/sections/testimonios";
import { CtaFinal } from "@/components/sections/cta-final";

export default function HomePage() {
  return (
    <>
      <HeroVideoScrollIntro />
      <Hero />
      <Marquee />
      <Manifiesto />
      {/* Testimonios temprano — social proof activa confianza antes
          de presentar tácticas (patrón Stripe/Linear). */}
      <Testimonios />
      <Services />
      <Industries />
      {/* <Brujeria /> — hidden until product is ready */}
      <Cases />
      <Process />
      <CtaFinal />
    </>
  );
}
