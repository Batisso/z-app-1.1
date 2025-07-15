"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, Mail, MessageCircle, HelpCircle } from "lucide-react";

// Shimmer Grid Component with Circles, Red-Orange-Yellow Gradient, Maximum Opacity, and Glowing Animation
const ShimmerGrid: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  // Circle patterns with maximum opacity red-orange-yellow gradient colors
  const redCirclePattern = `radial-gradient(circle at center, rgba(220, 38, 38, 0.15) 2px, transparent 2.5px)`;
  const orangeCirclePattern = `radial-gradient(circle at center, rgba(251, 146, 60, 0.12) 2px, transparent 2.5px)`;
  const yellowCirclePattern = `radial-gradient(circle at center, rgba(250, 204, 21, 0.1) 2px, transparent 2.5px)`;

  return (
    <motion.div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `
          ${redCirclePattern},
          ${orangeCirclePattern},
          ${yellowCirclePattern}
        `,
        backgroundSize: '40px 40px, 60px 60px, 80px 80px',
        backgroundPosition: '0 0, 20px 20px, 40px 40px',
        backgroundRepeat: 'repeat',
        zIndex: 1,
        minHeight: '100%',
        height: '100%',
      }}
      animate={{
        opacity: [0.8, 1, 0.8],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {/* Animated glow overlay */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            ${redCirclePattern},
            ${orangeCirclePattern},
            ${yellowCirclePattern}
          `,
          backgroundSize: '40px 40px, 60px 60px, 80px 80px',
          backgroundPosition: '0 0, 20px 20px, 40px 40px',
          backgroundRepeat: 'repeat',
          filter: 'blur(1px)',
          minHeight: '100%',
          height: '100%',
        }}
        animate={{
          opacity: [0, 0.6, 0],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

      {/* Shimmer effect that follows mouse with red-orange-yellow gradient */}
      <motion.div
        className="fixed pointer-events-none"
        style={{
          left: mousePosition.x - 250,
          top: mousePosition.y - 250,
          width: 500,
          height: 500,
          background: `radial-gradient(circle, 
            rgba(220, 38, 38, 0.4) 0%, 
            rgba(251, 146, 60, 0.3) 25%, 
            rgba(250, 204, 21, 0.2) 50%, 
            rgba(255, 215, 0, 0.1) 75%, 
            transparent 100%
          )`,
          borderRadius: '50%',
          filter: 'blur(3px)',
          transition: 'all 0.2s ease-out',
          zIndex: 2,
          maskImage: `
            ${redCirclePattern},
            ${orangeCirclePattern},
            ${yellowCirclePattern}
          `,
          maskSize: '40px 40px, 60px 60px, 80px 80px',
          maskPosition: '0 0, 20px 20px, 40px 40px',
          maskRepeat: 'repeat',
          WebkitMaskImage: `
            ${redCirclePattern},
            ${orangeCirclePattern},
            ${yellowCirclePattern}
          `,
          WebkitMaskSize: '40px 40px, 60px 60px, 80px 80px',
          WebkitMaskPosition: '0 0, 20px 20px, 40px 40px',
          WebkitMaskRepeat: 'repeat',
        }}
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Additional pulsing glow effect */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at center, rgba(220, 38, 38, 0.08) 3px, transparent 4px),
            radial-gradient(circle at center, rgba(251, 146, 60, 0.06) 3px, transparent 4px),
            radial-gradient(circle at center, rgba(250, 204, 21, 0.05) 3px, transparent 4px)
          `,
          backgroundSize: '80px 80px, 120px 120px, 160px 160px',
          backgroundPosition: '10px 10px, 40px 40px, 80px 80px',
          backgroundRepeat: 'repeat',
          filter: 'blur(2px)',
          minHeight: '100%',
          height: '100%',
        }}
        animate={{
          opacity: [0, 0.5, 0],
          backgroundPosition: [
            '10px 10px, 40px 40px, 80px 80px',
            '15px 15px, 45px 45px, 85px 85px',
            '10px 10px, 40px 40px, 80px 80px'
          ],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
    </motion.div>
  );
};

// FAQ Data with categories
const faqData = [
  {
    id: 1,
    category: "General",
    question: "What is this platform about?",
    answer: "This platform allows creators to share their knowledge, grow their audience, and earn rewards by publishing content. We provide a comprehensive ecosystem for content creators to monetize their expertise and connect with their audience."
  },
  {
    id: 2,
    category: "General",
    question: "Who can use this platform?",
    answer: "Anyone with valuable knowledge, skills, or expertise can use our platform. Whether you're an educator, artist, entrepreneur, or professional in any field, you can share your content and build your audience here."
  },
  {
    id: 3,
    category: "Services",
    question: "What services do you offer?",
    answer: "We offer content hosting, audience analytics, monetization tools, marketing support, community building features, and comprehensive creator resources to help you succeed."
  },
  {
    id: 4,
    category: "Services",
    question: "Do you provide marketing support?",
    answer: "Yes! We provide marketing tools, SEO optimization, social media integration, and promotional opportunities to help increase your content's visibility and reach."
  },
  {
    id: 5,
    category: "Process",
    question: "How do I become a creator?",
    answer: "Simply visit the Become a Creator page, fill out the application form with your details, upload your portfolio, and our team will review your application within 2-3 business days."
  },
  {
    id: 6,
    category: "Process",
    question: "Is there a fee to join as a creator?",
    answer: "No, joining as a creator is completely free! We believe in supporting creators and only take a small commission from your earnings to maintain and improve the platform."
  },
  {
    id: 7,
    category: "Process",
    question: "How long does the approval process take?",
    answer: "The approval process typically takes 2-3 business days. Our team carefully reviews each application to ensure quality and authenticity. You'll receive an email notification once your application is processed."
  },
  {
    id: 8,
    category: "Portfolio & Experience",
    question: "What should I include in my portfolio?",
    answer: "Include your best work samples, testimonials, certifications, and any relevant experience. Quality over quantity - showcase 8-12 of your strongest pieces that demonstrate your expertise and style."
  },
  {
    id: 9,
    category: "Portfolio & Experience",
    question: "Do I need professional experience to join?",
    answer: "While professional experience is valuable, it's not mandatory. We welcome passionate individuals with unique skills, fresh perspectives, and the drive to create quality content."
  },
  {
    id: 10,
    category: "Portfolio & Experience",
    question: "Can I update my portfolio after joining?",
    answer: "Absolutely! You can update your portfolio, add new work samples, and modify your profile information at any time through your creator dashboard."
  },
  {
    id: 11,
    category: "Contact & Collaboration",
    question: "How can I contact support?",
    answer: "You can reach out to our support team via the contact form, email us directly, or use the live chat feature available on the website. We typically respond within 24 hours."
  },
  {
    id: 12,
    category: "Contact & Collaboration",
    question: "Do you offer collaboration opportunities?",
    answer: "Yes! We facilitate collaborations between creators, brand partnerships, and cross-promotional opportunities. Check your creator dashboard for available collaboration requests."
  },
  {
    id: 13,
    category: "Contact & Collaboration",
    question: "How do I connect with other creators?",
    answer: "Use our creator community features, join discussion forums, participate in virtual events, and explore the collaboration board to connect with like-minded creators."
  }
];

const categories = ["All", "General", "Services", "Process", "Portfolio & Experience", "Contact & Collaboration"];

interface FAQ {
  id: number;
  category: string;
  question: string;
  answer: string;
}

const FaqsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>(faqData);

  // Filter FAQs based on search term and category
  useEffect(() => {
    let filtered = faqData;

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(faq => faq.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredFaqs(filtered);
  }, [searchTerm, selectedCategory]);

  const toggleExpanded = (id: number) => {
    setExpandedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="relative min-h-screen">
      {/* Shimmer Grid Background with Circles and Glowing Animation */}
      <ShimmerGrid />

      {/* Main Content */}
      <div className="relative z-10 pt-4 sm:pt-6 md:pt-8 lg:pt-12 pb-8 sm:pb-12 md:pb-16 lg:pb-20 px-2 sm:px-4 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-6xl mx-auto"
        >
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
                <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent tracking-tight">
                FAQs
              </h1>
            </div>
            <p className="text-gray-600 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed px-4">
              Find answers to commonly asked questions about our platform, services, and creator program
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-6 sm:mb-8 md:mb-10"
          >
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search FAQs..."
                className="w-full pl-12 pr-6 py-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-full focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-100/50 transition-all duration-300 placeholder-gray-400 text-sm sm:text-base shadow-lg shadow-gray-200/20"
              />
            </div>
          </motion.div>

          {/* Category Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-8 sm:mb-10 md:mb-12"
          >
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-all duration-300 backdrop-blur-sm border ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white border-transparent shadow-lg shadow-orange-200/50"
                      : "bg-white/70 text-gray-700 border-gray-200 hover:bg-white/90 hover:border-orange-300 hover:shadow-md"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </motion.div>

          {/* FAQ Items */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="space-y-4 sm:space-y-6 mb-12 sm:mb-16 md:mb-20"
          >
            {filteredFaqs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 sm:py-16"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
                  <Search className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-600 mb-2">No FAQs found</h3>
                <p className="text-gray-500">Try adjusting your search or category filter</p>
              </motion.div>
            ) : (
              filteredFaqs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl sm:rounded-3xl shadow-lg shadow-gray-200/20 overflow-hidden"
                >
                  <button
                    onClick={() => toggleExpanded(faq.id)}
                    className="w-full px-4 sm:px-6 md:px-8 py-4 sm:py-6 text-left flex items-center justify-between hover:bg-white/50 transition-all duration-300 group"
                  >
                    <div className="flex-1 pr-4">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-700 rounded-full">
                          {faq.category}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 group-hover:text-orange-600 transition-colors duration-200">
                        {faq.question}
                      </h3>
                    </div>
                    <motion.div
                      animate={{ rotate: expandedItems.includes(faq.id) ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="flex-shrink-0"
                    >
                      <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-orange-500 transition-colors duration-200" />
                    </motion.div>
                  </button>
                  
                  <AnimatePresence>
                    {expandedItems.includes(faq.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 pt-0">
                          <div className="border-t border-gray-100 pt-4 sm:pt-6">
                            <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            )}
          </motion.div>

          {/* Bottom Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-center"
          >
            <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl sm:rounded-3xl shadow-xl shadow-gray-200/20 p-6 sm:p-8 md:p-10 max-w-2xl mx-auto">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-full bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
                Didn't find an answer?
              </h3>
              
              <p className="text-gray-600 text-base sm:text-lg md:text-xl mb-6 sm:mb-8 leading-relaxed">
                Our team is just an email away and ready to answer your questions.
              </p>
              
              <motion.button
                className="inline-flex items-center gap-3 px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 text-white font-semibold rounded-full shadow-lg shadow-orange-200/50 hover:shadow-xl hover:shadow-orange-300/50 transition-all duration-300 text-sm sm:text-base md:text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                Contact Us
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default FaqsPage;