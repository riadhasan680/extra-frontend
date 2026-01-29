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
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto max-w-6xl px-6">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
          How it works?
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm border border-gray-100"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                <step.icon className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                {step.title}
              </h3>
              <p className="text-gray-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
