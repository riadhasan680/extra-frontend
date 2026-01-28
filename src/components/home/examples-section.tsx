export function ExamplesSection() {
  return (
    <section className="py-20" style={{ backgroundColor: "#dad8f9" }}>
      <div className="container mx-auto max-w-6xl px-6">
        <h2 className="mb-6 text-center text-4xl font-bold text-gray-900">
          Here are a few examples of our current partnered websites
        </h2>
        <p className="mx-auto mb-12 max-w-3xl text-center text-lg text-gray-600">
          where you can see examples of our advertisements at any time:
        </p>

        {/* Website Examples Grid */}
        <div className="mb-16 grid gap-8 md:grid-cols-3">
          {[
            {
              name: "GameSpot",
              url: "gamespot.com",
              description: "Leading gaming news and reviews",
            },
            {
              name: "IGN",
              url: "ign.com",
              description: "Entertainment and gaming media",
            },
            {
              name: "Polygon",
              url: "polygon.com",
              description: "Gaming culture and community",
            },
          ].map((site, index) => (
            <div
              key={index}
              className="rounded-xl border border-purple-100 bg-white p-6 shadow-lg transition-shadow hover:shadow-xl"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-xl font-bold text-white">
                {site.name.charAt(0)}
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                {site.name}
              </h3>
              <p className="mb-3 font-medium text-purple-600">{site.url}</p>
              <p className="text-sm text-gray-600">{site.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h3 className="mb-8 text-3xl font-bold text-gray-900 md:text-4xl">
            So What Are You Waiting For❔
          </h3>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600">
            Start growing your Twitch channel today with real, compliant
            advertising that actually works.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="#products"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:from-purple-700 hover:to-purple-800 hover:shadow-xl"
            >
              View Our Packages
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-xl border-2 border-purple-600 bg-white px-8 py-4 text-lg font-bold text-purple-700 shadow-lg transition-all hover:bg-purple-50"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
