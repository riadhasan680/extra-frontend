import { Target, TrendingUp, Shield, Users } from "lucide-react";

export function GuaranteedResultsSection() {
  const features = [
    {
      icon: Target,
      title: "Targeted Embedding",
      description:
        "We embed your live stream into advertisement sections of popular gaming websites",
    },
    {
      icon: Users,
      title: "Real Live Viewers",
      description: "Bring actual human viewers into your Twitch streams",
    },
    {
      icon: TrendingUp,
      title: "Higher Rankings",
      description:
        "Increase your ranking on the Twitch category you're streaming under",
    },
    {
      icon: Shield,
      title: "Algorithm Boost",
      description:
        "Increased chance of triggering Twitch algorithmic views like 'recommended channels'",
    },
  ];

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            Guaranteed Results!
          </h2>
          <p className="text-lg text-gray-600">
            Real advertising that delivers measurable growth
          </p>
        </div>

        {/* Features Grid */}
        <div className="mb-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group flex flex-col items-center rounded-2xl border-2 border-gray-100 bg-white p-6 text-center transition-all duration-300 hover:border-green-500 hover:shadow-lg"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 transition-colors group-hover:bg-green-500 group-hover:text-white">
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-900">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="rounded-3xl bg-gradient-to-br from-green-50 to-green-100/50 p-8 md:p-12">
          <div className="mx-auto max-w-4xl space-y-6 text-center">
            <p className="text-lg leading-relaxed text-gray-700">
              We{" "}
              <strong className="text-green-700">embed your live stream</strong>{" "}
              into the advertisement sections of popular gaming websites to
              bring REAL live viewers into your Twitch streams and increase your
              ranking on the Twitch category you are streaming under.
            </p>

            <p className="leading-relaxed text-gray-700">
              This service will also allow increased chance of triggering Twitch
              algorithmic views such as{" "}
              <strong className="text-green-700">"recommended channels"</strong>{" "}
              or{" "}
              <strong className="text-green-700">
                "live viewers we think you'll like sections"
              </strong>
            </p>

            <div className="mt-8 rounded-2xl border-2 border-green-500 bg-white p-6 shadow-lg">
              <p className="text-lg font-bold text-gray-900">
                It's time to start working towards your Affiliate or Partner
                goals
              </p>
              <p className="mt-2 text-gray-700">
                Grow your Twitch channel and use real advertising to get more
                eyes on your stream
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
