import { CheckCircle2 } from "lucide-react";

export function ReasonsSection() {
  const reasons = [
    {
      title: "Only Real Viewers",
      description:
        "We use real targeted advertisements to bring in actual human eyes on your stream. Stream Lifter does not participate in bots of any sort, using those types of services will result in Twitch bans and/or Twitch Affiliate and Partner program rejections.",
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
    <section className="bg-white py-20">
      <div className="container mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="mb-6 inline-flex items-center justify-center">
            <svg className="h-20 w-20" viewBox="0 0 256 268" fill="#22c55e">
              <path d="M17.458 0L0 46.556v186.201h63.983v34.934h34.931l34.898-34.934h52.36L256 162.954V0H17.458zm23.259 23.263H232.73v128.029l-40.739 40.741H128L93.113 226.92v-34.886H40.717V23.263zm64.008 116.405H128V69.844h-23.275v69.824zm63.997 0h23.27V69.844h-23.27v69.824z" />
            </svg>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 md:text-5xl">
            Why Choose Stream Lifter?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            The smart choice for authentic Twitch growth
          </p>
        </div>

        {/* Reasons Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="group rounded-2xl border-2 border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:border-green-500 hover:shadow-lg"
            >
              <div className="mb-4 flex items-start gap-4">
                <div className="shrink-0">
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  {reason.title}
                </h3>
              </div>
              <p className="leading-relaxed text-gray-600">
                {reason.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-green-50 to-green-100 p-8 text-center">
          <div className="mx-auto max-w-3xl">
            <p className="text-lg font-semibold text-gray-900">
              Ready to accelerate your Twitch growth with real, compliant
              promotion?
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-green-500 px-6 py-3 text-sm font-bold text-white shadow-lg">
              <span>GET 10% OFF</span>
              <span className="text-xl">→</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
