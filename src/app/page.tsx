import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { HeroSection } from "@/components/home/hero-section";
import { IntroSection } from "@/components/home/intro-section";
import { DidYouKnowSection } from "@/components/home/did-you-know-section";
import { GuaranteedResultsSection } from "@/components/home/guaranteed-results-section";
import { ReasonsSection } from "@/components/home/reasons-section";
import { ProductSection } from "@/components/home/product-section";
import { VideoSection } from "@/components/home/video-section";
import { ExamplesSection } from "@/components/home/examples-section";
import { CtaProductSection } from "@/components/home/cta-product-section";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      <main>
        <HeroSection />
        <IntroSection />
        <DidYouKnowSection />
        <GuaranteedResultsSection />
        <ReasonsSection />
        <ProductSection />
        <VideoSection />
        <ExamplesSection />
        <CtaProductSection />
      </main>

      <SiteFooter />
    </div>
  );
}
