"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Brain, FileText, Settings, Sparkles, ArrowRight, Book, Target, Zap, Users, Globe, Lightbulb, Cpu } from 'lucide-react';
import QuizDialog from '@/components/trail';

const LandingPage: React.FC = () => {
  // Sample Data
  const features: Feature[] = [
    {
      icon: Brain,
      title: "Neural Learning Engine",
      description: "Advanced AI algorithms adapt to your unique cognitive patterns",
      gradient: "from-blue-600 to-indigo-600"
    },
    {
      icon: Target,
      title: "Precision Targeting",
      description: "Generate questions that focus on your knowledge gaps",
      gradient: "from-indigo-600 to-purple-600"
    },
    {
      icon: Cpu,
      title: "AI Processing",
      description: "Process complex documents in seconds with our neural engine",
      gradient: "from-purple-600 to-pink-600"
    },
    {
      icon: Sparkles,
      title: "Smart Generation",
      description: "Create engaging quizzes from any topic instantly",
      gradient: "from-pink-600 to-red-600"
    }
  ];

  const testimonials: Testimonial[] = [
    {
      quote: "This platform revolutionized how I prepare for exams. The AI-generated questions are incredibly relevant.",
      author: "Yaswanth Baratam",
      role: "CS Student",
      image: "/api/placeholder/50/50"
    },
    {
      quote: "As a professor, this tool saves me hours of quiz preparation time while maintaining quality.",
      author: "Dr. James Wilson",
      role: "University Professor",
      image: "/api/placeholder/50/50"
    },
    {
      quote: "The adaptive learning system helped me identify and fill knowledge gaps effectively.",
      author: "Dhanunjay Burada",
      role: "Software Engineer",
      image: "/api/placeholder/50/50"
    }
  ];

  const pricing: PricingTier[] = [
    {
      name: "Starter",
      price: "Free",
      features: ["5 Quizzes/month", "Basic AI Generation", "PDF Upload", "Standard Support"]
    },
    {
      name: "Pro (Recommended)",
      price: "$29/mo",
      features: ["Unlimited Quizzes", "Advanced AI", "Priority Support", "Analytics Dashboard"],
      highlighted: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      features: ["Custom Integration", "Dedicated Support", "API Access", "Custom Branding"]
    }
  ];

  const stats = [
    { value: "500K+", label: "Active Users" },
    { value: "1M+", label: "Quizzes Generated" },
    { value: "98%", label: "Success Rate" },
    { value: "24/7", label: "AI Support" }
  ];

  // Scroll Progress
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Animation Variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  // Interactive Demo State
  const [demoText, setDemoText] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);

  // Background Canvas Effect
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: any[] = [];
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5
      });
    }

    function animate() {
      requestAnimationFrame(animate);
      if (ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        if (canvas) {
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        particles.forEach(particle => {
          particle.x += particle.speedX;
          particle.y += particle.speedY;

          if (canvas && (particle.x < 0 || particle.x > canvas.width)) particle.speedX *= -1;
          if (canvas && (particle.y < 0 || particle.y > canvas.height)) particle.speedY *= -1;

          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(148, 0, 255, 0.1)';
          ctx.fill();
        });
      }
    }

    animate();
  }, []);

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* Background Effect */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 -z-10"
        // style={{ filter: 'blur(4px)' }}
      />

      {/* Scroll Progress */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transform origin-left z-50"
        style={{ scaleX }}
      />

      {/* Navigation */}
      <nav className="fixed w-full py-4 z-40 bg-black/50 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-2"
              {...fadeInUp}
            >
              <Brain className="w-8 h-8 text-indigo-500" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
                MindMesh
              </span>
            </motion.div>
            
            <div className="hidden md:flex space-x-8">
              {['Features', 'Pricing', 'About'].map((item) => (
                <motion.button
                  key={item}
                  className="text-gray-300 hover:text-white transition-colors relative group"
                  {...fadeInUp}
                >
                  {item}
                  <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform" />
                </motion.button>
              ))}
            </div>

            <motion.button
              className="px-6 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 pt-32">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <motion.h1
            className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
            {...fadeInUp}
          >
            Transform Your Learning with AI-Powered Quizzes
          </motion.h1>
          <motion.p
            className="text-xl text-gray-400"
            {...fadeInUp}
            transition={{ delay: 0.2 }}
          >
            Upload content or enter topics to generate intelligent quizzes that adapt to your learning style
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="relative p-6 rounded-2xl bg-gradient-to-b from-gray-900 to-black border border-gray-800 hover:border-gray-700 group"
              whileHover={{ scale: 1.05, rotateY: 10 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-20 transition-opacity rounded-2xl`} />
              <feature.icon className="w-12 h-12 mb-4 text-indigo-500" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", delay: index * 0.1 }}
            >
              <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
                {stat.value}
              </div>
              <div className="text-gray-400 mt-2">{stat.label}</div>
            </motion.div>
          ))}
        </div> */}

        <QuizDialog />

        {/* Pricing */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-12">Pricing Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricing.map((tier, index) => (
              <motion.div
                key={index}
                className={`
                  relative p-6 rounded-2xl bg-gradient-to-b from-gray-900 to-black
                  border ${tier.highlighted ? 'border-indigo-500' : 'border-gray-800'}
                `}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="text-xl font-semibold mb-2">{tier.name}</h3>
                <div className="text-3xl font-bold mb-4">{tier.price}</div>
                <ul className="space-y-2">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <Sparkles className="w-4 h-4 mr-2 text-indigo-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <motion.button
                  className={`
                    w-full py-2 rounded-lg mt-6
                    ${tier.highlighted
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500'
                      : 'bg-gray-800 hover:bg-gray-700'}
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get Started
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-12">What Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="p-6 rounded-2xl bg-gradient-to-b from-gray-900 to-black border border-gray-800"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <p className="text-gray-300 mb-4">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <div className="font-semibold">{testimonial.author}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          {[
            {
              question: "How does the AI quiz generation work?",
              answer: "Our advanced AI analyzes your content or topic, identifies key concepts, and generates relevant questions. It adapts to different difficulty levels and question types."
            },
            {
              question: "Can I customize the generated quizzes?",
              answer: "Yes! You can modify question types, difficulty levels, and even edit individual questions to perfectly match your needs."
            },
            {
              question: "What file formats are supported for upload?",
              answer: "We currently support PDF documents. More formats will be added soon."
            }
          ].map((faq, index) => (
            <motion.div
              key={index}
              className="mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="bg-gray-900 rounded-xl p-6 hover:bg-gray-800 transition-colors cursor-pointer">
                <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-400">{faq.answer}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Final CTA */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-gray-400 mb-8">
              Join thousands of students and educators who are already using our platform to create engaging quizzes and enhance learning.
            </p>
            <motion.button
              className="px-8 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Free
            </motion.button>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-800 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Features</li>
                <li>Pricing</li>
                <li>Use Cases</li>
                <li>Updates</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>About</li>
                <li>Blog</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Documentation</li>
                <li>Help Center</li>
                <li>API</li>
                <li>Status</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Privacy</li>
                <li>Terms</li>
                <li>Security</li>
                <li>Cookies</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-800">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Brain className="w-6 h-6 text-indigo-500" />
              <span className="font-bold">MindMesh</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2024 MindMesh. All rights reserved.
            </div>
          </div>
        </footer>
      </main>

      {/* Fixed Chat Button */}
      <motion.button
        className="fixed bottom-8 right-8 p-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Users className="w-6 h-6" />
      </motion.button>
    </div>
  );
};

export default LandingPage;