import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&q=80"
          alt="Gaming Background"
          fill
          className="object-cover"
          priority
        />
        {/* Purple Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/70 via-purple-700/90 to-purple-900/95"></div>

        {/* Diagonal Overlay Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto max-w-7xl px-6 pt-32 pb-20">
        <div className="grid min-h-[calc(100vh-8rem)] items-center gap-12 lg:grid-cols-2">
          {/* Left Side - Logo */}
          <div className="flex flex-col items-center space-y-8 lg:items-start">
            {/* Xtra Marketing Logo */}
            <div className="text-center lg:text-left">
              <Image
                src="https://xtralifemarketing.com/cdn/shop/files/logo_x70.png?v=1614342404"
                alt="Xtra Marketing"
                width={200}
                height={100}
                className="mb-8"
              />
            </div>

            {/* Twitch Logo */}
            <div className="rounded-2xl border border-purple-400/30 bg-purple-600/30 px-8 py-6 backdrop-blur-sm">
              <svg className="h-16 w-auto" viewBox="0 0 256 268" fill="none">
                <path
                  d="M17.458 0L0 46.556v186.201h63.983v34.934h34.931l34.898-34.934h52.36L256 162.954V0H17.458zm23.259 23.263H232.73v128.029l-40.739 40.741H128L93.113 226.92v-34.886H40.717V23.263zm64.008 116.405H128V69.844h-23.275v69.824zm63.997 0h23.27V69.844h-23.27v69.824z"
                  fill="#9146FF"
                />
              </svg>
            </div>

            {/* Twitch Icon */}
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-purple-500 text-xl font-bold text-white">
                ♀
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="space-y-8 text-center text-white lg:text-left">
            <h1 className="text-5xl leading-tight font-extrabold lg:text-7xl">
              TWITCH STREAM
              <br />
              PROMOTION
            </h1>

            <p className="text-2xl leading-relaxed font-light text-purple-100 lg:text-3xl">
              Accelerate your Twitch
              <br />
              Channel Growth
            </p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce">
        <div className="flex h-12 w-8 items-start justify-center rounded-full border-2 border-white/30 p-2">
          <div className="h-2 w-2 rounded-full bg-white"></div>
        </div>
      </div>

      {/* GET 10% OFF Badge */}
      <div className="absolute right-8 bottom-8 z-10 hidden lg:block">
        <div className="rotate-12 transform rounded-full bg-gradient-to-br from-pink-500 to-purple-600 px-6 py-3 text-sm font-bold text-white shadow-2xl">
          GET 10% OFF
        </div>
      </div>
    </section>
  );
}
