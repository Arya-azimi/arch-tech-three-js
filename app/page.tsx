import Hero from "@/components/sections/Hero";
import HorizontalGallery from "@/components/sections/HorizontalGallery";
import Studio from "@/components/sections/Studio";
import Footer from "@/components/layout/Footer";
import Process from "@/components/sections/Process";
import EstimateRequest from "@/components/sections/EstimateRequest";

/**
 * Arch Tech homepage — composes the award-style sections in scroll order:
 * immersive hero → pinned horizontal project gallery → editorial studio block
 * with parallax reveal → live 3D configurator → curtain-reveal CTA footer.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <EstimateRequest />
      <HorizontalGallery />
      <Studio />
      <Process />
      <Footer />
    </>
  );
}
