export function GuaranteedResultsSection() {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto max-w-6xl px-6">
        <h2 className="mb-12 text-center text-4xl font-bold text-gray-900">
          Guaranteed Results!
        </h2>

        <div className="mb-16 grid items-center gap-12 md:grid-cols-2">
          {/* Left - Content */}
          <div className="space-y-6">
            <p className="text-lg leading-relaxed text-gray-700">
              We <strong>Embed your live stream</strong> into the advertisement
              sections of popular gaming websites to bring REAL live viewers
              into your Twitch streams and increase your ranking on the Twitch
              category you are streaming under.
            </p>

            <p className="leading-relaxed text-gray-700">
              This service will also allow increased chance of triggering Twitch
              algorithmic views such as <strong>"recommended channels"</strong>{" "}
              or <strong>"live viewers we think you'll like sections"</strong>
            </p>

            <p className="leading-relaxed text-gray-700">
              It's time to start working towards your Affiliate or Partner goals
              and grow your Twitch channel and use real advertising to get more
              eyes on your stream
            </p>
          </div>

          {/* Right - Twitch Icons Grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex aspect-square transform items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800 p-6 shadow-xl transition-transform duration-300 hover:scale-105"
                >
                  <svg
                    className="h-full w-full"
                    viewBox="0 0 256 268"
                    fill="white"
                  >
                    <path d="M17.458 0L0 46.556v186.201h63.983v34.934h34.931l34.898-34.934h52.36L256 162.954V0H17.458zm23.259 23.263H232.73v128.029l-40.739 40.741H128L93.113 226.92v-34.886H40.717V23.263zm64.008 116.405H128V69.844h-23.275v69.824zm63.997 0h23.27V69.844h-23.27v69.824z" />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 shadow-sm">
          <p className="text-center text-lg leading-relaxed text-gray-700">
            <strong>
              It's time to start working towards your Affiliate or Partner goals
            </strong>{" "}
            and grow your Twitch channel and use real advertising to get more
            eyes on your stream
          </p>
        </div>
      </div>
    </section>
  );
}
