import { StaticImageData } from "next/image";

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
  gradient: string;
}

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  image: StaticImageData;
}

interface PricingTier {
  name: string;
  price: string;
  features: string[];
  highlighted?: boolean;
}

interface Settings {
  numQuestions: number;
  questionType: string;
  difficulty: string;
}

interface SessionObject {
  id: string | null | undefined;
  email: string | null | undefined;
  image: string | null | undefined;
  name: string | null | undefined;
}

export type { Feature, Testimonial, PricingTier, Settings, SessionObject };