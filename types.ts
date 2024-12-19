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
  gradient: string;
}

interface Stats {
  value: string;
  label: string;
  prefix?: string;
  suffix?: string;
}
