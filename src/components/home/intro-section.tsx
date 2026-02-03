export function IntroSection() {
  return (
    <section className="bg-gradient-to-b from-green-50/30 to-white py-16">
      <div className="container mx-auto max-w-4xl px-6">
        <div className="prose prose-lg max-w-none text-center">
          <p className="mb-6 text-lg leading-relaxed text-gray-700">
            <strong>Are a Twitch streamer,</strong> you definitely know the
            feeling of doubt when you look up to your live dashboard only to
            find one live viewer in your stream.
          </p>
          <p className="text-lg leading-relaxed text-gray-700">
            Or maybe you have a few more followers under your belt and a few
            more live viewers but you stream day after day and that live viewer
            count stays the same,{" "}
            <strong className="text-green-600">
              you can't seem to get any more new traffic to your channel.
            </strong>
          </p>
        </div>
      </div>
    </section>
  );
}
