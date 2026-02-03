import Image from "next/image";
import { TrendingUp, Users } from "lucide-react";

export function DidYouKnowSection() {
  return (
    <section className="bg-gradient-to-b from-white to-green-50/30 py-20">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            Did you know?
          </h2>
          <p className="text-lg text-gray-600">
            The streaming industry is growing exponentially
          </p>
        </div>

        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* Left - Stats */}
          <div className="space-y-6">
            <div className="group rounded-2xl border-2 border-green-500 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  250M+ Visitors
                </h3>
              </div>
              <p className="leading-relaxed text-gray-700">
                In 2024, Twitch attracted over{" "}
                <span className="font-bold text-green-600">
                  250 million unique visitors
                </span>{" "}
                each month, that's <strong>5x more than in 2015</strong>
              </p>
            </div>

            <div className="group rounded-2xl border-2 border-green-500 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">20B+ Hours</h3>
              </div>
              <p className="leading-relaxed text-gray-700">
                Viewers on Twitch consumed more than{" "}
                <span className="font-bold text-green-600">
                  20 billion hours
                </span>{" "}
                of content in 2024
              </p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-green-50 to-green-100/50 p-6">
              <p className="mb-4 leading-relaxed text-gray-700">
                Despite new platforms making waves in the industry, Twitch is
                still where the majority lies and is the standard in building a
                live stream foundation.
              </p>

              <p className="text-lg font-bold text-green-700">
                What if there was a way to accelerate your Twitch channel growth
                using real advertising in a way that was compliant with Twitch
                terms of service?
              </p>
            </div>
          </div>

          {/* Right - Visual */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="flex aspect-square w-full max-w-md items-center justify-center rounded-3xl border-4 border-green-500 bg-gradient-to-br from-green-500 to-green-600 p-12 shadow-2xl">
                <div className="text-center text-white">
                  <div className="mb-6 text-8xl">📱</div>
                  <svg
                    className="mx-auto h-32 w-auto"
                    viewBox="0 0 256 268"
                    fill="white"
                  >
                    <path d="M17.458 0L0 46.556v186.201h63.983v34.934h34.931l34.898-34.934h52.36L256 162.954V0H17.458zm23.259 23.263H232.73v128.029l-40.739 40.741H128L93.113 226.92v-34.886H40.717V23.263zm64.008 116.405H128V69.844h-23.275v69.824zm63.997 0h23.27V69.844h-23.27v69.824z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
