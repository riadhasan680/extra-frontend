import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function ProductSection() {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto max-w-7xl px-6">
        {/* Main Product */}
        <div className="mb-20 grid items-center gap-16 md:grid-cols-2">
          {/* Left - Product Image */}
          <div className="relative flex justify-center py-8">
            <div className="group perspective-1000 relative h-80 w-64">
              {/* CSS 3D Box Mockup */}
              <div className="transform-style-3d relative h-full w-full transition-transform duration-500 group-hover:rotate-y-12">
                {/* Front Face */}
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-lg border border-purple-400/30 bg-gradient-to-br from-purple-600 to-purple-800 p-6 text-white shadow-2xl backface-hidden">
                  <div className="mb-4 text-xs font-bold tracking-widest opacity-80">
                    XTRA MARKETING
                  </div>
                  <h3 className="mb-2 text-center text-3xl leading-tight font-black">
                    TWITCH STREAM
                  </h3>
                  <h3 className="mb-6 text-center text-3xl leading-tight font-black text-purple-200">
                    PROMOTION
                  </h3>
                  <div className="rounded bg-white/90 px-4 py-2 text-center text-xs font-bold text-purple-900 shadow-lg">
                    EMBEDDED
                    <br />
                    ADVERTISING
                  </div>
                  <div className="absolute bottom-4 text-[10px] opacity-60">
                    Box Mockup
                  </div>
                </div>

                {/* Side Face (Depth) */}
                <div className="absolute top-0 right-0 flex h-full w-12 origin-right translate-x-12 -translate-z-[1px] rotate-y-90 transform items-center justify-center overflow-hidden rounded-r-lg bg-purple-900 brightness-75">
                  <span className="-rotate-90 transform text-xs font-bold tracking-widest whitespace-nowrap text-white opacity-50">
                    TWITCH PROMO
                  </span>
                </div>

                {/* Shadow */}
                <div className="absolute right-4 -bottom-8 left-4 h-4 rounded-[100%] bg-black/20 blur-xl"></div>
              </div>
            </div>
          </div>

          {/* Right - Product Details */}
          <div className="space-y-4">
            <h2 className="text-3xl leading-tight font-normal text-[#1a1a1a] md:text-[34px]">
              Twitch Stream Promotion
              <br />
              - Embedding (30% OFF
              <br />
              NEW CUSTOMER
              <br />
              DISCOUNT)
            </h2>

            {/* Price */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-[20px] font-bold text-[#1a1a1a] line-through decoration-gray-400 decoration-2 opacity-60">
                $69.90
              </span>
              <span className="text-[20px] font-bold text-[#b02484]">
                $39.95
              </span>
            </div>

            <div className="my-6 h-px w-full bg-gray-200"></div>

            {/* Day Options */}
            <div>
              <p className="mb-2 text-sm font-normal text-[#4a4a4a]">Day</p>
              <div className="flex gap-3">
                <button className="rounded bg-[#9c2a8c] px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#852277]">
                  3 Streams
                </button>
                <button className="rounded border border-[#e5e7eb] bg-white px-6 py-2.5 text-sm font-bold text-[#9c2a8c] shadow-sm transition-colors hover:border-[#9c2a8c]">
                  7 Streams
                </button>
              </div>
            </div>

            {/* Buy Button */}
            <div className="space-y-4 pt-4">
              <Link href="/cart">
                <Button className="h-12 w-full rounded bg-[#9c2a8c] text-[15px] font-bold text-white shadow transition-all hover:bg-[#852277]">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Buy It Now
                </Button>
              </Link>

              {/* Full Details Link */}
              <Link
                href="#details"
                className="flex inline-block items-center text-sm text-[#3d4246] underline decoration-gray-300 underline-offset-4 hover:text-[#9c2a8c]"
              >
                Full details <span className="ml-1 text-xs">➜</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Partner Websites Examples */}
        <div className="mb-20 rounded bg-[#f8f9fa] p-12 text-center">
          <h3 className="mb-2 text-xl font-bold text-[#1a1a1a] md:text-2xl">
            Here are a few examples of our current
          </h3>
          <h3 className="mb-8 text-xl font-normal text-[#1a1a1a] md:text-2xl">
            partnered websites where you can see examples of our advertisements
            at any time:
          </h3>

          <div className="mx-auto mb-8 flex max-w-lg flex-col items-center gap-4">
            <a
              href="#"
              className="border-b-2 border-black pb-0.5 font-bold text-black transition-colors hover:border-[#9c2a8c] hover:text-[#9c2a8c]"
            >
              https://www.thedoublekill.com/
            </a>
            <a
              href="#"
              className="border-b-2 border-black pb-0.5 font-bold text-black transition-colors hover:border-[#9c2a8c] hover:text-[#9c2a8c]"
            >
              https://pcgametrends.org/
            </a>
            <a
              href="#"
              className="border-b-2 border-black pb-0.5 font-bold text-black transition-colors hover:border-[#9c2a8c] hover:text-[#9c2a8c]"
            >
              https://www.gamingnews24.net/
            </a>
          </div>

          <p className="mx-auto max-w-3xl text-sm leading-relaxed text-[#4a4a4a] italic">
            This promotion is 100% compliant with Twitch TOS, we have many
            partner clients and have done tournament work for Esports and Gaming
            organizations and have never had an issue with a suspension or ban
            to date.
          </p>
        </div>

        {/* FAQ Section */}
        <div className="mb-20 space-y-8">
          <div className="mb-10 text-center">
            <h3 className="inline-block border-b-2 border-black pb-1 text-xl font-bold text-[#1a1a1a] italic">
              Frequently Asked Questions:
            </h3>
          </div>

          <div className="mx-auto max-w-4xl space-y-12 text-center">
            {/* FAQ 1 */}
            <div>
              <h4 className="mb-4 flex items-center justify-center gap-2 text-lg font-bold text-[#1a1a1a]">
                👉 How many viewers will I get?
              </h4>
              <p className="text-[15px] leading-7 text-[#4a4a4a]">
                It is normal to see viewer count fluctuation given the methods
                we promote you. The viewership will depend on a lot of factors
                such as time of day, category you are streaming, website traffic
                etc.{" "}
                <span className="font-bold">
                  On average most clients will see an increase in 10-20 viewers
                  throughout the stream.
                </span>
              </p>
            </div>

            {/* FAQ 2 */}
            <div>
              <h4 className="mb-4 flex items-center justify-center gap-2 text-lg font-bold text-[#1a1a1a]">
                Some suggestions from us to ensure best results 👇👇 :
              </h4>
              <div className="space-y-6 text-[15px] leading-7 text-[#4a4a4a]">
                <p>
                  <span className="font-bold text-black">
                    Turn off follower only chat
                  </span>{" "}
                  - This will undoubtedly discourage engagement from new
                  viewers. There are some people who will want to engage with
                  your stream before they decide to follow
                </p>
                <p>
                  <span className="font-bold text-black">
                    Turn off mature audience filter
                  </span>{" "}
                  - With this filter on you are avoiding being put on Twitch
                  categories such as the "live channels we think you will like"
                  section and others as well. The people viewing your
                  advertisements will also have to click an extra time to get
                  into your channel which is an extra objection we want to
                  overcome if possible. If your channel truly needs the mature
                  audience filter we understand though.
                </p>
                <p>
                  <span className="font-bold text-black">
                    Consider a less saturated game
                  </span>{" "}
                  - The whole basis behind our promotion strategy involves
                  raising your Twitch category ranking which will happen no
                  matter what category you are playing under. A game where you
                  can rank close to the top of the list will most likely yield
                  the best results, just something to keep in mind if you are at
                  early stages of community growth and struggling to get your
                  regulars.
                </p>
              </div>
            </div>

            {/* FAQ 3 */}
            <div>
              <h4 className="mb-4 flex items-center justify-center gap-2 text-lg font-bold text-[#1a1a1a]">
                Avoid restarts whenever possible
              </h4>
              <p className="text-[15px] leading-7 text-[#4a4a4a]">
                - The most expensive part of running your ads is when your
                stream first goes live as our software has to find viewers that
                will stop scrolling for a bit, when your stream goes offline so
                will your ads and anyone viewing from an embed is going to be
                dropped as well. For best results and length of promotion time
                try to stream continuously
              </p>
              <p className="mt-6 text-[15px] leading-7 font-bold text-black">
                These suggestions above are simply just that, suggestions.
                Ultimately it is your channel and your choice what to do, these
                are just things we see help ensure the best results from
                utilization of our promotion!
              </p>
            </div>
          </div>
        </div>

        {/* Second Product - UNLIMITED (Purple BG Section now moved to CTA section file as requested earlier, keeping here just in case user wants structure kept but modified design) */}
        {/* We moved the unlimited product to `cta-product-section.tsx` in previous steps. Assuming this file focuses on the first product as per screenshot context. */}
      </div>
    </section>
  );
}
