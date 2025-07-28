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

// Rich Text Content Types
type RichTextContent = 
  | { type: 'paragraph'; text: string }
  | { type: 'section'; title: string; text?: string; emoji?: string }
  | { type: 'list'; items: string[] }
  | { type: 'highlight'; text: string }
  | { type: 'quote'; text: string };

interface RichAnswer {
  type: 'rich';
  content: RichTextContent[];
}

// Rich Text Renderer Component
const RichTextRenderer: React.FC<{ content: RichTextContent[] }> = ({ content }) => {
  const renderText = (text: string) => {
    // Handle bold text with **text**
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-semibold text-gray-800">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="space-y-4">
      {content.map((item, index) => {
        switch (item.type) {
          case 'paragraph':
            return (
              <p key={index} className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed">
                {renderText(item.text)}
              </p>
            );
          
          case 'section':
            return (
              <div key={index} className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-4 border-l-4 border-orange-400">
                <h4 className="font-semibold text-gray-800 text-base sm:text-lg mb-2 flex items-center gap-2">
                  {item.emoji && <span className="text-xl">{item.emoji}</span>}
                  {item.title}
                </h4>
                {item.text && (
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                    {renderText(item.text)}
                  </p>
                )}
              </div>
            );
          
          case 'list':
            return (
              <ul key={index} className="space-y-2 ml-4">
                {item.items.map((listItem, listIndex) => (
                  <li key={listIndex} className="flex items-start gap-3 text-gray-600 text-sm sm:text-base leading-relaxed">
                    <span className="w-2 h-2 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full mt-2 flex-shrink-0"></span>
                    {renderText(listItem)}
                  </li>
                ))}
              </ul>
            );
          
          case 'highlight':
            return (
              <div key={index} className="bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50 rounded-xl p-4 border border-orange-200">
                <p className="text-gray-700 text-sm sm:text-base font-medium leading-relaxed">
                  {renderText(item.text)}
                </p>
              </div>
            );
          
          case 'quote':
            return (
              <blockquote key={index} className="border-l-4 border-orange-400 pl-4 italic text-gray-600 text-sm sm:text-base leading-relaxed">
                {renderText(item.text)}
              </blockquote>
            );
          
          default:
            return null;
        }
      })}
    </div>
  );
};

// FAQ Data with rich text content
const faqData = [
  // GENERAL
  {
    id: 1,
    category: "General",
    question: "What is Zadulis?",
    answer: {
      type: 'rich' as const,
      content: [
        {
          type: 'paragraph' as const,
          text: "Zadulis is the **Creative Operating System for the Orange Economy** — a next-generation super-app and exportable toolkit designed to **showcase, protect, and scale** authentic global cultural creativity."
        }
      ]
    }
  },
  {
    id: 2,
    category: "General",
    question: "Who can use Zadulis?",
    answer: {
      type: 'rich' as const,
      content: [
        {
          type: 'paragraph' as const,
          text: "Zadulis is for **cultural creators** (artists, designers, musicians, filmmakers), **diaspora communities**, **collectors & fans**, and **brands, agencies, and institutions** seeking verified cultural creativity."
        }
      ]
    }
  },
  {
    id: 3,
    category: "General",
    question: "Where is Zadulis based?",
    answer: {
      type: 'rich' as const,
      content: [
        {
          type: 'paragraph' as const,
          text: "Zadulis is globally positioned — with a focus on creators and communities across **Africa, Asia, Latin America, and the Diaspora**. Our team works remotely with hubs in NYC, London, and Accra."
        }
      ]
    }
  },
  {
    id: 4,
    category: "General",
    question: "Why is Zadulis different from other creative platforms?",
    answer: {
      type: 'rich' as const,
      content: [
        {
          type: 'paragraph' as const,
          text: "Most platforms extract value from creators — we help creators **own, protect, and grow** their cultural genius. We're not just a marketplace or social feed — we're a full **operating system** for cultural creativity."
        }
      ]
    }
  },
  {
    id: 5,
    category: "General",
    question: "How much does Zadulis cost to join?",
    answer: {
      type: 'rich' as const,
      content: [
        {
          type: 'paragraph' as const,
          text: "Joining is **free for creators** — we earn through fair commission on sales and premium services. Brands and institutions pay for API, SaaS tools, and premium listings."
        }
      ]
    }
  },

  // FOR CREATORS
  {
    id: 6,
    category: "For Creators",
    question: "How do I get started as a creator?",
    answer: {
      type: 'rich' as const,
      content: [
        {
          type: 'paragraph' as const,
          text: "Sign up for our early access waitlist at [your domain]. You'll get priority onboarding, early creator perks, and tools to protect and promote your work globally."
        }
      ]
    }
  },
  {
    id: 7,
    category: "For Creators",
    question: "What can I sell on Zadulis?",
    answer: {
      type: 'rich' as const,
      content: [
        {
          type: 'paragraph' as const,
          text: "Artworks, digital products, fashion, music, books, performances, virtual experiences, custom commissions — anything rooted in **authentic cultural creativity**."
        }
      ]
    }
  },
  {
    id: 8,
    category: "For Creators",
    question: "How do I protect my work?",
    answer: {
      type: 'rich' as const,
      content: [
        {
          type: 'paragraph' as const,
          text: "With **Z-TRACE**, your work gets fingerprinted and timestamped for **authorship verification** and **IP protection** — preventing misuse and proving provenance."
        }
      ]
    }
  },
  {
    id: 9,
    category: "For Creators",
    question: "Can I collaborate with other creators?",
    answer: {
      type: 'rich' as const,
      content: [
        {
          type: 'paragraph' as const,
          text: "Absolutely. Zadulis includes tools for **cross-cultural collaborations**, co-creations, and community projects — plus tools to manage shared rights and profits."
        }
      ]
    }
  },
  {
    id: 10,
    category: "For Creators",
    question: "How do I get paid?",
    answer: {
      type: 'rich' as const,
      content: [
        {
          type: 'paragraph' as const,
          text: "Payments are processed securely via trusted global payment partners. You'll receive commissions, sales, and bookings directly to your account in your preferred currency."
        }
      ]
    }
  },

  // FOR BRANDS & PARTNERS
  {
    id: 11,
    category: "For Brands & Partners",
    question: "What's in it for brands and agencies?",
    answer: {
      type: 'rich' as const,
      content: [
        {
          type: 'paragraph' as const,
          text: "Verified access to authentic creators worldwide. You can **discover**, **verify**, and **license** real cultural IP — minimizing PR risk, boosting brand credibility, and fueling authentic campaigns."
        }
      ]
    }
  },
  {
    id: 12,
    category: "For Brands & Partners",
    question: "How do I verify cultural content?",
    answer: {
      type: 'rich' as const,
      content: [
        {
          type: 'paragraph' as const,
          text: "Use **Z-TRACE** and **Zadulis Discover** to check the cultural origin, fingerprinted records, and community ownership — all via simple API or dashboard."
        }
      ]
    }
  },
  {
    id: 13,
    category: "For Brands & Partners",
    question: "Can brands sponsor or partner with Zadulis?",
    answer: {
      type: 'rich' as const,
      content: [
        {
          type: 'paragraph' as const,
          text: "Yes — we welcome **strategic partnerships**, cultural sponsorships, and co-branded Zadulis Experiences (pop-ups, festivals, exhibitions). Contact our partnerships team at [partnerships@zadulis.com]."
        }
      ]
    }
  },
  {
    id: 14,
    category: "For Brands & Partners",
    question: "Do you license your tools?",
    answer: {
      type: 'rich' as const,
      content: [
        {
          type: 'paragraph' as const,
          text: "Yes — our exportable tools (**Cultural Attribution as a Service**) are offered via SaaS and API for brands, AI companies, and institutions."
        }
      ]
    }
  },

  // SERVICES & TOOLS
  {
    id: 15,
    category: "Services & Tools",
    question: "What is Z-TRACE?",
    answer: {
      type: 'rich' as const,
      content: [
        {
          type: 'paragraph' as const,
          text: "Z-TRACE is Zadulis' proprietary **Cultural IP fingerprinting system**. It timestamps, records, and verifies the authorship of creative works — turning cultural creativity into a **traceable asset**."
        }
      ]
    }
  },
  {
    id: 16,
    category: "Services & Tools",
    question: "What is Zadulis Discover?",
    answer: {
      type: 'rich' as const,
      content: [
        {
          type: 'paragraph' as const,
          text: "Zadulis Discover is an **AI-powered cultural search engine** — it helps anyone find authentic creators, works, and cultural products globally."
        }
      ]
    }
  },
  {
    id: 17,
    category: "Services & Tools",
    question: "What are Zadulis Companions?",
    answer: {
      type: 'rich' as const,
      content: [
        {
          type: 'paragraph' as const,
          text: "Zadulis Companions are **AI-powered assistants** that help with trend forecasting, cross-cultural inspiration, and creative discovery — fueling brands and creators with real-time cultural intelligence."
        }
      ]
    }
  },
  {
    id: 18,
    category: "Services & Tools",
    question: "What is Cultural Attribution as a Service (CAaaS)?",
    answer: {
      type: 'rich' as const,
      content: [
        {
          type: 'paragraph' as const,
          text: "CAaaS means brands, agencies, and AI teams can verify, trace, and license cultural IP **fairly and transparently** — closing the loop between cultural originators and commercial users."
        }
      ]
    }
  },
  {
    id: 19,
    category: "Services & Tools",
    question: "Does Zadulis offer education?",
    answer: {
      type: 'rich' as const,
      content: [
        {
          type: 'paragraph' as const,
          text: "Yes! **Zadulis Learn** offers premium masterclasses, workshops, and mentorship programs to help the next generation of creators become **global legends**."
        }
      ]
    }
  },
  {
    id: 20,
    category: "Services & Tools",
    question: "Are there offline experiences?",
    answer: {
      type: 'rich' as const,
      content: [
        {
          type: 'paragraph' as const,
          text: "Yes! Through **Zadulis Drops & Experiences**, we host pop-ups, exhibitions, virtual museums, auctions, and cross-cultural festivals in cities worldwide."
        }
      ]
    }
  },

  // ABOUT ZADULIS
  {
    id: 21,
    category: "About Zadulis",
    question: "Who founded Zadulis?",
    answer: {
      type: 'rich' as const,
      content: [
        {
          type: 'paragraph' as const,
          text: "Zadulis was founded by a visionary rooted in cultural innovation, supported by a global team with deep expertise in creative tech, product design, AI, and cultural strategy."
        }
      ]
    }
  },
  {
    id: 22,
    category: "About Zadulis",
    question: "What does \"Orange Economy\" mean?",
    answer: {
      type: 'rich' as const,
      content: [
        {
          type: 'paragraph' as const,
          text: "The Orange Economy refers to the **global creative economy** — the industries that generate cultural, artistic, and creative value, fueling economic growth and social connection worldwide."
        }
      ]
    }
  },
  {
    id: 23,
    category: "About Zadulis",
    question: "What is Zadulis' mission?",
    answer: {
      type: 'rich' as const,
      content: [
        {
          type: 'paragraph' as const,
          text: "To transform authentic global creativity into a **globally traded asset class**, making culture a source of **wealth, pride, and belonging** for millions."
        }
      ]
    }
  },
  {
    id: 24,
    category: "About Zadulis",
    question: "What is Zadulis' vision?",
    answer: {
      type: 'rich' as const,
      content: [
        {
          type: 'paragraph' as const,
          text: "To build the **world's most powerful creative infrastructure** — where **authentic creativity** becomes the world's most valuable and verifiable currency."
        }
      ]
    }
  },

  // CONTACT & SUPPORT
  {
    id: 25,
    category: "Contact & Support",
    question: "How can I contact Zadulis?",
    answer: {
      type: 'rich' as const,
      content: [
        {
          type: 'list' as const,
          items: [
            "General inquiries: [hello@zadulis.com]",
            "Partnerships: [partnerships@zadulis.com]",
            "Creator onboarding: [creators@zadulis.com]",
            "Press & media: [press@zadulis.com]"
          ]
        }
      ]
    }
  },
  {
    id: 26,
    category: "Contact & Support",
    question: "Where can I follow Zadulis?",
    answer: {
      type: 'rich' as const,
      content: [
        {
          type: 'paragraph' as const,
          text: "Follow us on [Instagram], [LinkedIn], [Twitter], and [TikTok] for updates, creator stories, and global cultural moments."
        }
      ]
    }
  },
  {
    id: 27,
    category: "Contact & Support",
    question: "How do I report an issue or get help?",
    answer: {
      type: 'rich' as const,
      content: [
        {
          type: 'paragraph' as const,
          text: "Visit our **Help Center** at [your help URL] or email [support@zadulis.com] — our team will assist you promptly."
        }
      ]
    }
  },
  {
    id: 28,
    category: "Contact & Support",
    question: "Can I invest in Zadulis?",
    answer: {
      type: 'rich' as const,
      content: [
        {
          type: 'paragraph' as const,
          text: "We're currently raising our **pre-seed round** — if you'd like to be part of this cultural renaissance, please reach out at [invest@zadulis.com]."
        }
      ]
    }
  }
];

const categories = ["All", "General", "For Creators", "For Brands & Partners", "Services & Tools", "About Zadulis", "Contact & Support"];

interface FAQ {
  id: number;
  category: string;
  question: string;
  answer: RichAnswer;
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
      filtered = filtered.filter(faq => {
        const questionMatch = faq.question.toLowerCase().includes(searchTerm.toLowerCase());
        const answerMatch = faq.answer.content.some(content => {
          const richContent = content as RichTextContent; // Explicitly cast to RichTextContent
          switch (richContent.type) {
            case 'paragraph':
            case 'highlight':
            case 'quote':
              return richContent.text.toLowerCase().includes(searchTerm.toLowerCase());
            case 'section':
              return richContent.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     (richContent.text && richContent.text.toLowerCase().includes(searchTerm.toLowerCase()));
            case 'list':
              return richContent.items.some(item => item.toLowerCase().includes(searchTerm.toLowerCase()));
            default:
              return false;
          }
        });
        return questionMatch || answerMatch;
      });
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
                            <RichTextRenderer content={faq.answer.content} />
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