import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { HeroSection } from "@/components/home/hero-section";
import { IntroSection } from "@/components/home/intro-section";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { DidYouKnowSection } from "@/components/home/did-you-know-section";
import { GuaranteedResultsSection } from "@/components/home/guaranteed-results-section";
import { ReasonsSection } from "@/components/home/reasons-section";
import { ProductSection } from "@/components/home/product-section";
import { VideoSection } from "@/components/home/video-section";
import { ExamplesSection } from "@/components/home/examples-section";
import { CtaProductSection } from "@/components/home/cta-product-section";
import { storeService } from "@/services/store.service";

export default async function HomePage() {
  let products: any[] = [];
  try {
    products = await storeService.getProducts();
  } catch (error) {
    console.error("Failed to fetch products on server", error);
  }

  const mainProduct = products.length > 0 ? products[0] : null;
  const ctaProduct = products.length > 1 ? products[1] : (products.length > 0 ? products[0] : null);

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      <main>
        <HeroSection />
        <IntroSection />
        <HowItWorksSection />
        <DidYouKnowSection />
        <GuaranteedResultsSection />
        <ReasonsSection />
        <ProductSection initialProduct={mainProduct} />
        <VideoSection />
        <ExamplesSection />
        <CtaProductSection initialProduct={ctaProduct} />
      </main>

      <SiteFooter />
    </div>
  );
}
