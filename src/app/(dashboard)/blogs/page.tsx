"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, User, ArrowRight, Clock } from "lucide-react";

// Blog data
const blogPosts = [
  {
    id: 1,
    title: "The Ultimate Guide to Building Your Creator Brand in 2024",
    description: "Discover the essential strategies, tools, and mindset shifts that successful creators use to build authentic, profitable brands that stand out in today's competitive digital landscape.",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=250&fit=crop&crop=center",
    category: "Strategy",
    author: "Sarah Johnson",
    date: "2024-12-15",
    readTime: "8 min read",
    tags: ["Branding", "Creator Economy"]
  },
  {
    id: 2,
    title: "How to Get Started as a Creator",
    description: "A comprehensive step-by-step guide to launching your creator journey on our platform and building your first audience.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop&crop=center",
    category: "Getting Started",
    author: "Jane Doe",
    date: "2024-12-10",
    readTime: "5 min read",
    tags: ["Beginner", "Tutorial"]
  },
  {
    id: 3,
    title: "Maximizing Your Audience Engagement",
    description: "Tips and tricks for building a loyal following and increasing your reach across different platforms.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop&crop=center",
    category: "Growth",
    author: "John Smith",
    date: "2024-12-08",
    readTime: "6 min read",
    tags: ["Engagement", "Growth"]
  },
  {
    id: 4,
    title: "Monetization Strategies for Creators",
    description: "Explore different ways to earn rewards and monetize your content effectively in today's creator economy.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop&crop=center",
    category: "Monetization",
    author: "Alex Lee",
    date: "2024-12-05",
    readTime: "7 min read",
    tags: ["Revenue", "Strategy"]
  },
  {
    id: 5,
    title: "Content Creation Tools Every Creator Needs",
    description: "A curated list of essential tools and software that will streamline your content creation workflow.",
    image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=250&fit=crop&crop=center",
    category: "Tools",
    author: "Emily Chen",
    date: "2024-12-03",
    readTime: "4 min read",
    tags: ["Tools", "Productivity"]
  },
  {
    id: 6,
    title: "Building Community Around Your Content",
    description: "Learn how to foster meaningful connections with your audience and create a thriving community.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop&crop=center",
    category: "Community",
    author: "Michael Rodriguez",
    date: "2024-12-01",
    readTime: "6 min read",
    tags: ["Community", "Engagement"]
  },
  {
    id: 7,
    title: "The Psychology of Viral Content",
    description: "Understanding what makes content shareable and how to apply psychological principles to your creations.",
    image: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=400&h=250&fit=crop&crop=center",
    category: "Strategy",
    author: "Dr. Lisa Park",
    date: "2024-11-28",
    readTime: "9 min read",
    tags: ["Psychology", "Viral"]
  },
  {
    id: 8,
    title: "Collaborating with Other Creators",
    description: "How to find, approach, and successfully collaborate with fellow creators to grow your reach.",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=250&fit=crop&crop=center",
    category: "Collaboration",
    author: "David Kim",
    date: "2024-11-25",
    readTime: "5 min read",
    tags: ["Collaboration", "Networking"]
  },
  {
    id: 9,
    title: "Analytics That Matter for Creators",
    description: "Focus on the metrics that actually drive growth and success in your creator journey.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop&crop=center",
    category: "Analytics",
    author: "Rachel Green",
    date: "2024-11-22",
    readTime: "7 min read",
    tags: ["Analytics", "Growth"]
  },
  {
    id: 10,
    title: "Staying Consistent in Content Creation",
    description: "Practical strategies to maintain consistency and avoid burnout while creating quality content.",
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=250&fit=crop&crop=center",
    category: "Productivity",
    author: "Tom Wilson",
    date: "2024-11-20",
    readTime: "6 min read",
    tags: ["Consistency", "Productivity"]
  }
];

interface BlogPost {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
}

const BlogsPage: React.FC = () => {
  const [visiblePosts, setVisiblePosts] = useState(6);
  const [isLoading, setIsLoading] = useState(false);

  const loadMorePosts = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisiblePosts(prev => Math.min(prev + 3, blogPosts.length));
      setIsLoading(false);
    }, 500);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="relative min-h-screen">
      {/* Enhanced Floating Animation Styles */}
      <style jsx>{`
        @keyframes smooth-float-1 {
          0% { 
            transform: translateY(-50%) translateX(0px) rotate(0deg) scale(1);
          }
          25% { 
            transform: translateY(-55%) translateX(-20px) rotate(-4deg) scale(1.08);
          }
          50% { 
            transform: translateY(-45%) translateX(0px) rotate(0deg) scale(1);
          }
          75% { 
            transform: translateY(-50%) translateX(20px) rotate(4deg) scale(1.08);
          }
          100% { 
            transform: translateY(-50%) translateX(0px) rotate(0deg) scale(1);
          }
        }

        @keyframes smooth-float-2 {
          0% { 
            transform: translateY(-50%) translateX(0px) rotate(0deg) scale(1);
          }
          25% { 
            transform: translateY(-45%) translateX(20px) rotate(4deg) scale(1.08);
          }
          50% { 
            transform: translateY(-55%) translateX(0px) rotate(0deg) scale(1);
          }
          75% { 
            transform: translateY(-50%) translateX(-20px) rotate(-4deg) scale(1.08);
          }
          100% { 
            transform: translateY(-50%) translateX(0px) rotate(0deg) scale(1);
          }
        }

        @keyframes vertical-drift-1 {
          0% { 
            transform: translateY(-50%) translateX(0px);
          }
          33% { 
            transform: translateY(-65%) translateX(-15px);
          }
          66% { 
            transform: translateY(-35%) translateX(15px);
          }
          100% { 
            transform: translateY(-50%) translateX(0px);
          }
        }

        @keyframes vertical-drift-2 {
          0% { 
            transform: translateY(-50%) translateX(0px);
          }
          33% { 
            transform: translateY(-35%) translateX(15px);
          }
          66% { 
            transform: translateY(-65%) translateX(-15px);
          }
          100% { 
            transform: translateY(-50%) translateX(0px);
          }
        }

        @keyframes enhanced-glow {
          0% {
            box-shadow: 
              0 0 15px rgba(255, 51, 0, 0.7), 
              0 0 30px rgba(255, 140, 0, 0.5),
              0 0 45px rgba(255, 215, 0, 0.3);
          }
          50% {
            box-shadow: 
              0 0 25px rgba(255, 140, 0, 0.9), 
              0 0 50px rgba(255, 51, 0, 0.7),
              0 0 75px rgba(255, 215, 0, 0.5);
          }
          100% {
            box-shadow: 
              0 0 15px rgba(255, 51, 0, 0.7), 
              0 0 30px rgba(255, 140, 0, 0.5),
              0 0 45px rgba(255, 215, 0, 0.3);
          }
        }

        .floating-image-1 {
          animation: 
            smooth-float-1 8s ease-in-out infinite,
            vertical-drift-1 12s ease-in-out infinite,
            enhanced-glow 4s ease-in-out infinite;
          will-change: transform, box-shadow;
          animation-delay: 0s, 2s, 0s;
        }

        .floating-image-2 {
          animation: 
            smooth-float-2 8s ease-in-out infinite,
            vertical-drift-2 12s ease-in-out infinite,
            enhanced-glow 4s ease-in-out infinite;
          will-change: transform, box-shadow;
          animation-delay: 1s, 0s, 1s;
        }

        .hero-button-size {
          font-weight: 200;
          letter-spacing: 0.025em;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          margin-left: auto;
          margin-right: auto;
        }

        @media (max-width: 480px) {
          .hero-button-size {
            padding: 4px 12px;
            font-size: 12px;
            min-width: 70px;
            height: 28px;
          }
        }

        @media (min-width: 481px) and (max-width: 640px) {
          .hero-button-size {
            padding: 5px 14px;
            font-size: 13px;
            min-width: 80px;
            height: 30px;
          }
        }

        @media (min-width: 641px) and (max-width: 768px) {
          .hero-button-size {
            padding: 6px 20px;
            font-size: 14px;
            min-width: 100px;
            height: 32px;
          }
        }

        @media (min-width: 769px) {
          .hero-button-size {
            padding: 7px 22px;
            font-size: 14px;
            min-width: 110px;
            height: 34px;
          }
        }

        @media (min-width: 1024px) {
          .hero-button-size {
            padding: 8px 24px;
            font-size: 15px;
            min-width: 120px;
            height: 36px;
          }
        }

        @media (min-width: 1280px) {
          .hero-button-size {
            padding: 9px 26px;
            font-size: 15px;
            min-width: 130px;
            height: 36px;
          }
        }
      `}</style>

      {/* Hero Section with Animated Background */}
      <div className="relative bg-cover bg-center h-60 rounded-lg overflow-hidden mb-8">
        {/* Enhanced Floating Images with Smooth Animations */}
        <div className="absolute -left-2 top-1/2 w-45 h-45 rounded-full overflow-hidden shadow-9xl floating-image-1">
          <img src="https://us-west-2.graphassets.com/cmbfqm0kn1bab07n13z3ygjxo/output=format:jpg/resize=width:830/cmbmtgz88zkfc07lpaorfkiol" alt="Floating decoration" className="w-full h-full object-cover" />
        </div>
        <div className="absolute -right-2 top-1/2 w-45 h-45 rounded-full overflow-hidden shadow-9xl floating-image-2">
          <img src="https://us-west-2.graphassets.com/cmbfqm0kn1bab07n13z3ygjxo/output=format:jpg/resize=width:830/cmbmtgz8nzkfi07lpfxewxjnm" alt="Floating decoration" className="w-full h-full object-cover" />
        </div>
        
        {/* Background Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-red-900/70 to-orange-900/60 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-2xl sm:text-2xl md:text-2xl lg:text-4xl font-bold mb-2">DISCOVER INSIGHTS FROM TOP CREATORS</h1>
            <p className="text-sm sm:text-lg mb-4">Read the latest articles, tips, and strategies from industry experts and successful creators.</p>
            <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
              <button className="bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-full hover:from-red-600 hover:to-orange-700 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl relative group border-2 border-transparent hover:border-red-400 hero-button-size mx-5">
                <div className="absolute inset-0 rounded-full bg-red-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
                <div className="absolute inset-0 rounded-full bg-red-400 opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-300"></div>
                <div className="absolute -inset-[2px] rounded-full bg-gradient-to-r from-red-400 to-orange-500 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300"></div>
                <div className="relative z-10 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                  <p className='font-medium'>Start Reading</p>
                </div>
              </button>
              
              <button className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-full hover:from-yellow-600 hover:to-amber-700 transition-all duration-500 flex items-center shadow-lg hover:shadow-xl relative group border-2 border-transparent hover:border-orange-200 hero-button-size">
                <div className="absolute inset-0 rounded-full bg-orange-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
                <div className="absolute inset-0 rounded-full bg-orange-400 opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500"></div>
                <div className="absolute -inset-[2px] rounded-full bg-gradient-to-r from-orange-400 to-amber-500 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500"></div>
                <div className="absolute -inset-[3px] rounded-full bg-gradient-to-r from-orange-400 to-amber-500 opacity-0 group-hover:opacity-70 blur-md transition-opacity duration-500"></div>
                <div className="absolute -inset-[4px] rounded-full bg-gradient-to-r from-orange-400 to-amber-500 opacity-0 group-hover:opacity-40 blur-lg transition-opacity duration-500"></div>
                <div className="relative z-10 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                  </svg>
                  <p className='font-medium'>Write for Us</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-4 sm:pt-6 md:pt-8 lg:pt-12 pb-8 sm:pb-12 md:pb-16 lg:pb-20 px-2 sm:px-4 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-7xl mx-auto"
        >
          {/* Blog Posts Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent mb-4">
                Latest Articles
              </h2>
              <p className="text-gray-600 text-base sm:text-lg">
                Stay updated with the latest insights and strategies
              </p>
            </div>

            {/* Blog Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
              {blogPosts.slice(0, visiblePosts).map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl sm:rounded-3xl shadow-lg shadow-gray-200/20 overflow-hidden group hover:shadow-xl hover:shadow-gray-300/30 transition-all duration-300"
                >
                  {/* Post Image */}
                  <div className="relative h-48 sm:h-56 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium rounded-full">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="p-4 sm:p-6">
                    <div className="flex items-center gap-3 mb-3 text-xs sm:text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(post.date)}
                      </div>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 group-hover:text-orange-600 transition-colors duration-200 line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4 line-clamp-3">
                      {post.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 2).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-700 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </div>

                    <motion.button
                      className="mt-4 w-full py-2 sm:py-3 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white font-medium rounded-full hover:shadow-lg hover:shadow-orange-200/50 transition-all duration-300 text-sm sm:text-base"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Read More
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Load More Button */}
            {visiblePosts < blogPosts.length && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-center"
              >
                <motion.button
                  onClick={loadMorePosts}
                  disabled={isLoading}
                  className="inline-flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 text-white font-semibold rounded-full shadow-lg shadow-orange-200/50 hover:shadow-xl hover:shadow-orange-300/50 transition-all duration-300 text-base sm:text-lg disabled:opacity-70 disabled:cursor-not-allowed"
                  whileHover={{ scale: isLoading ? 1 : 1.05 }}
                  whileTap={{ scale: isLoading ? 1 : 0.95 }}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Loading...
                    </>
                  ) : (
                    <>
                      Load More Posts
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogsPage;