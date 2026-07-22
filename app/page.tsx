import Hero from "@/components/sections/Hero";
import HorizontalGallery from "@/components/sections/HorizontalGallery";
import Studio from "@/components/sections/Studio";
import Footer from "@/components/layout/Footer";

/**
 * Arch Tech homepage — composes the award-style sections in scroll order:
 * immersive hero → pinned horizontal project gallery → editorial studio block
 * with parallax reveal → live 3D configurator → curtain-reveal CTA footer.
 */
export default function Home() {
  return (
    <main>
      <Hero />
      <HorizontalGallery />
      <Studio />
      <Footer />
    </main>
  );
}
