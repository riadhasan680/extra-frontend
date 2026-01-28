import { CheckCircle2 } from "lucide-react";

export function ReasonsSection() {
  const reasons = [
    {
      title: "Only Real Viewers",
      description:
        "We use real targeted advertisements to bring in actual human eyes on your stream. Xtra Life Marketing does not participate in bots of any sort, using those types of services will result in Twitch bans and/or Twitch Affiliate and Partner program rejections.",
    },
    {
      title: "Trackable Results",
      description:
        "All the websites we promote you on can be viewed from the analytics section of your Twitch account so you can see exactly where people are viewing your stream from and what results are coming from our promotion.",
    },
    {
      title: "Compliance with Twitch TOS",
      description:
        "Embedding is not only an approved method of promotion by Twitch, it is encouraged! Many tournaments and big Esports gaming events are promoted using embedding - more information on embedding compliance HERE: https://dev.twitch.tv/docs/embed",
    },
    {
      title: "Organic Growth",
      description:
        'As a result of using our promotion, your stream will have more viewers and will not only rank higher on your Twitch category but will give your stream a higher chance of hitting Twitch algorithm views such as the "Live channels we think you will like"',
    },
  ];

  return (
    <section className="py-20" style={{ backgroundColor: "#dad8f9" }}>
      <div className="container mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-16 md:grid-cols-2">
          {/* Left - Big Twitch Logo */}
          <div className="order-2 flex justify-center md:order-1">
            <div className="relative">
              {/* Outer glow rings - multiple layers */}
              <div className="absolute inset-0 scale-110 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 opacity-30 blur-3xl"></div>
              <div className="absolute inset-0 scale-105 rounded-full bg-gradient-to-br from-purple-300 to-pink-300 opacity-40 blur-2xl"></div>

              {/* Main circle with enhanced styling */}
              <div className="relative flex h-80 w-80 items-center justify-center rounded-full border-[14px] border-purple-400/80 bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 shadow-2xl">
                {/* Inner dark circle */}
                <div className="absolute inset-8 rounded-full bg-gray-900"></div>

                {/* Twitch logo */}
                <svg
                  className="relative z-10 h-48 w-48"
                  viewBox="0 0 256 268"
                  fill="#a78bfa"
                >
                  <path d="M17.458 0L0 46.556v186.201h63.983v34.934h34.931l34.898-34.934h52.36L256 162.954V0H17.458zm23.259 23.263H232.73v128.029l-40.739 40.741H128L93.113 226.92v-34.886H40.717V23.263zm64.008 116.405H128V69.844h-23.275v69.824zm63.997 0h23.27V69.844h-23.27v69.824z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Right - Reasons List */}
          <div className="order-1 space-y-6 md:order-2">
            <h2 className="mb-8 text-center text-3xl flex justify-center items-center font-normal text-gray-900 md:text-left md:text-4xl">
              Reasons that you absolutely need Xtra Marketing:
            </h2>

            {reasons.map((reason, index) => (
              <div
                key={index}
                className="flex items-start gap-4 rounded-xl bg-white/40 p-4 backdrop-blur-sm"
              >
                <div className="mt-1 shrink-0">
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h3 className="mb-2 font-bold text-gray-900">
                    {reason.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-700">
                    {reason.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GET 10% OFF Badge - Mobile */}
        <div className="mt-12 flex justify-center md:hidden">
          <div className="rotate-3 transform rounded-full bg-gradient-to-br from-pink-500 to-purple-600 px-8 py-4 text-lg font-bold text-white shadow-2xl">
            GET 10% OFF
          </div>
        </div>
      </div>
    </section>
  );
}
