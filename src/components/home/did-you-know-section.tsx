import Image from "next/image";

export function DidYouKnowSection() {
  return (
    <section className="py-20 bg-[#dad8f9]">
      <div className="container mx-auto max-w-6xl px-6">
        <h2 className="mb-12 text-center text-4xl font-bold text-gray-900">
          Did you know?
        </h2>

        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* Left - Image */}
          <div className="relative overflow-hidden rounded-2xl shadow-2xl">
            <div className="flex aspect-square items-center justify-center bg-gradient-to-br from-purple-600 to-purple-800 p-12">
              <div className="text-center text-white">
                <div className="mb-6 text-8xl">📱</div>
                <svg
                  className="mx-auto h-24 w-auto"
                  viewBox="0 0 256 268"
                  fill="white"
                >
                  <path d="M17.458 0L0 46.556v186.201h63.983v34.934h34.931l34.898-34.934h52.36L256 162.954V0H17.458zm23.259 23.263H232.73v128.029l-40.739 40.741H128L93.113 226.92v-34.886H40.717V23.263zm64.008 116.405H128V69.844h-23.275v69.824zm63.997 0h23.27V69.844h-23.27v69.824z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div className="space-y-6">
            <div className="rounded border-l-4 border-green-500 bg-green-50 p-4">
              <p className="font-semibold text-gray-800">
                ✅ In 2024, Twitch attracted over{" "}
                <span className="text-green-600">
                  250 million unique visitors
                </span>{" "}
                each month, that's <strong>5x more than in 2015</strong>
              </p>
            </div>

            <div className="rounded border-l-4 border-green-500 bg-green-50 p-4">
              <p className="font-semibold text-gray-800">
                ✅ Viewers on Twitch consumed more than{" "}
                <span className="text-green-600">20 billion hours</span> of
                content in 2024
              </p>
            </div>

            <p className="pt-4 leading-relaxed text-gray-700">
              Despite new platforms making waves in the industry, Twitch is
              still where the majority lies and is the standard in building a
              live stream foundation.
            </p>

            <p className="pt-4 text-xl font-bold text-purple-900">
              What if there was a way to accelerate your Twitch channel growth
              using real advertising in a way that was compliant with Twitch
              terms of service?
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
