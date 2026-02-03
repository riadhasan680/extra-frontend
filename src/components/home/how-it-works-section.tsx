import { MousePointerClick, User, TrendingUp } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      icon: MousePointerClick,
      title: "Choose Your Package",
      description: "Select the boost that fits your needs.",
    },
    {
      icon: User,
      title: "Enter Your Details",
      description: "Provide your Instagram username (no password needed).",
    },
    {
      icon: TrendingUp,
      title: "Watch You Grow",
      description: "Sit back as we deliver real engagement instantly!",
    },
  ];

  return (
    <section className="bg-gradient-to-b from-green-50/50 to-white py-20">
      <div className="container mx-auto max-w-6xl px-6">
        <h2 className="mb-4 text-center text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
          How it works?
        </h2>
        <p className="mb-12 text-center text-lg text-gray-600">
          Get started in three simple steps
        </p>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group relative flex flex-col items-center rounded-2xl border-2 border-gray-100 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:border-green-500 hover:shadow-xl"
            >
              {/* Step Number */}
              <div className="absolute -top-4 left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-green-500 text-sm font-bold text-white shadow-lg">
                {index + 1}
              </div>
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 transition-colors group-hover:bg-green-500 group-hover:text-white">
                <step.icon className="h-10 w-10" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                {step.title}
              </h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
