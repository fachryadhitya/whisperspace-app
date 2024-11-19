import {
  Shield,
  Users,
  Clock,
  MessageCircle,
  Heart,
  Brain,
} from "lucide-react";

export function Features() {
  return (
    <div className="py-24 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Why Choose WhisperSpace?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We've created a unique platform that prioritizes your emotional
            well-being while maintaining your privacy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-card hover:shadow-lg transition-shadow"
            >
              <feature.icon className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    icon: Shield,
    title: "Complete Anonymity",
    description:
      "Express yourself freely without revealing your identity. No registration or personal information required.",
  },
  {
    icon: Users,
    title: "Small Group Dynamics",
    description:
      "Intimate groups of up to 5 people ensure meaningful connections and focused support.",
  },
  {
    icon: Brain,
    title: "Smart Matching",
    description:
      "Our algorithm connects you with people who share similar experiences and can offer relevant support.",
  },
  {
    icon: Clock,
    title: "Time-Limited Sessions",
    description:
      "Fresh starts with rotating group sessions help maintain privacy and encourage authentic sharing.",
  },
  {
    icon: MessageCircle,
    title: "Real-time Support",
    description:
      "Instant messaging allows for immediate emotional support when you need it most.",
  },
  {
    icon: Heart,
    title: "Safe Environment",
    description:
      "Active moderation and community guidelines ensure a respectful and supportive atmosphere.",
  },
];