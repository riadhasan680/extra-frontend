export function VideoSection() {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto max-w-6xl px-6">
        <h2 className="mb-12 text-center text-4xl font-bold text-gray-900">
          See How It Works
        </h2>

        <div className="relative overflow-hidden rounded-2xl shadow-2xl">
          {/* Video Container */}
          <div className="relative aspect-video bg-black">
            {/* YouTube Embed */}
            <iframe
              className="absolute inset-0 h-full w-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Xtra Life Marketing - A Closer Look"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>

            {/* Overlay with Play Button (optional - shown before video loads) */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900/50 to-purple-900/50 opacity-0 transition-opacity hover:opacity-100">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-600 shadow-2xl">
                <svg
                  className="ml-1 h-10 w-10 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Video Info Bar */}
          <div className="flex items-center justify-between bg-gray-900 px-6 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
                <span className="text-sm font-bold">XL</span>
              </div>
              <div>
                <p className="text-sm font-semibold">
                  Xtra Life Marketing - A Closer Look
                </p>
              </div>
            </div>
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm transition-colors hover:text-purple-300"
            >
              <span>Watch on</span>
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-600">
            Watch our detailed walkthrough to see exactly how we embed your
            stream into high-traffic gaming websites and help you grow your
            Twitch channel organically.
          </p>
        </div>
      </div>
    </section>
  );
}
