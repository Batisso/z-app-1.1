"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Camera, Send, User, Mail, MapPin, Globe, FileText, ChevronDown, Search, Loader2, CheckCircle, AlertCircle, Heart, Star, Sparkles } from "lucide-react";

// Complete list of all countries in the world
const allCountries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
  "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
  "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
  "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic",
  "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
  "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
  "Haiti", "Honduras", "Hungary",
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast",
  "Jamaica", "Japan", "Jordan",
  "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan",
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
  "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
  "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway",
  "Oman",
  "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
  "Qatar",
  "Romania", "Russia", "Rwanda",
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
  "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
  "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
  "Yemen",
  "Zambia", "Zimbabwe"
];

// Type definitions
interface SearchableDropdownProps {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  gradientColors: string;
}

interface FormData {
  name: string;
  email: string;
  countryOrigin: string;
  basedIn: string;
  bio: string;
  images: File[];
}

// Custom Searchable Dropdown Component
const SearchableDropdown: React.FC<SearchableDropdownProps> = ({ 
  label, 
  icon, 
  value, 
  onChange, 
  options, 
  placeholder, 
  gradientColors 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="space-y-3 sm:space-y-4"
    >
      <label className="flex items-center gap-2 text-gray-800 font-medium text-sm sm:text-base md:text-lg">
        <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-r ${gradientColors} flex items-center justify-center`}>
          {icon}
        </div>
        {label}
      </label>
      
      <div ref={dropdownRef} className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-full focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-100/50 transition-all duration-300 text-left text-sm sm:text-base md:text-lg flex items-center justify-between group hover:border-orange-300"
        >
          <span className={value ? "text-gray-900" : "text-gray-400"}>
            {value || placeholder}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-orange-400 transition-colors duration-200" />
          </motion.div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-3xl shadow-2xl shadow-gray-200/20 max-h-64 overflow-hidden"
            >
              {/* Search Input */}
              <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100/50 p-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    placeholder="Type to search countries..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50/50 border border-gray-200 rounded-full focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100/50 transition-all duration-200 text-sm placeholder-gray-400"
                    autoFocus
                  />
                </div>
              </div>

              {/* Options List */}
              <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {filteredOptions.length === 0 ? (
                  <div className="px-4 py-6 text-center text-gray-400 text-sm">
                    No countries found
                  </div>
                ) : (
                  <div className="py-2">
                    {filteredOptions.map((option, index) => (
                      <motion.button
                        key={option}
                        type="button"
                        onClick={() => handleSelect(option)}
                        className="w-full text-left px-4 py-2.5 hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 transition-all duration-200 text-gray-800 text-sm border-b border-gray-50/50 last:border-b-0 group"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.1, delay: index * 0.02 }}
                      >
                        <span className="group-hover:text-orange-600 transition-colors duration-200">
                          {option}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// Spinning Globe Component
const SpinningGlobe: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globeRef = useRef<any>(null);

  useEffect(() => {
    let phi = 0;
    
    const initGlobe = async () => {
      if (canvasRef.current) {
        try {
          const createGlobe = (await import('cobe')).default;
          
          globeRef.current = createGlobe(canvasRef.current, {
            devicePixelRatio: 2,
            width: 1600,
            height: 1600,
            phi: 0,
            theta: 0.3,
            dark: 0,
            diffuse: 1.5,
            mapSamples: 16000,
            mapBrightness: 8,
            baseColor: [0.8, 0.4, 0.2],
            markerColor: [1, 0.6, 0],
            glowColor: [1, 0.8, 0.4],
            markers: [
              { location: [37.7595, -122.4367], size: 0.05 },
              { location: [40.7128, -74.006], size: 0.07 },
              { location: [51.5074, -0.1278], size: 0.06 },
              { location: [35.6762, 139.6503], size: 0.06 },
              { location: [-33.8688, 151.2093], size: 0.06 },
              { location: [55.7558, 37.6176], size: 0.06 },
              { location: [28.6139, 77.2090], size: 0.06 },
              { location: [39.9042, 116.4074], size: 0.06 },
              { location: [-22.9068, -43.1729], size: 0.05 },
              { location: [19.4326, -99.1332], size: 0.05 },
              { location: [30.0444, 31.2357], size: 0.05 },
              { location: [-26.2041, 28.0473], size: 0.05 },
            ],
            onRender: (state: any) => {
              state.phi = phi;
              phi += 0.003;
            },
          });
        } catch (error) {
          console.log('Cobe library not available, using fallback globe');
          if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
              const animate = () => {
                const size = Math.min(window.innerWidth * 0.9, 800);
                ctx.clearRect(0, 0, size, size);
                ctx.save();
                ctx.translate(size/2, size/2);
                ctx.rotate(phi);
                
                const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size/2.2);
                gradient.addColorStop(0, 'rgba(255, 165, 0, 0.4)');
                gradient.addColorStop(0.5, 'rgba(255, 69, 0, 0.3)');
                gradient.addColorStop(1, 'rgba(255, 215, 0, 0.2)');
                
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(0, 0, size/2.2, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.strokeStyle = 'rgba(255, 140, 0, 0.2)';
                ctx.lineWidth = 2;
                
                for (let i = 0; i < 12; i++) {
                  ctx.beginPath();
                  ctx.ellipse(0, 0, size/2.2, (size/2.2) * Math.cos(i * Math.PI / 6), i * Math.PI / 6, 0, Math.PI * 2);
                  ctx.stroke();
                }
                
                for (let i = 1; i < 6; i++) {
                  ctx.beginPath();
                  const radius = (size/2.2) * Math.sin(i * Math.PI / 6);
                  const y = (size/2.2) * Math.cos(i * Math.PI / 6);
                  ctx.ellipse(0, y, radius, radius * 0.3, 0, 0, Math.PI * 2);
                  ctx.stroke();
                  ctx.ellipse(0, -y, radius, radius * 0.3, 0, 0, Math.PI * 2);
                  ctx.stroke();
                }
                
                ctx.restore();
                phi += 0.003;
                requestAnimationFrame(animate);
              };
              animate();
            }
          }
        }
      }
    };

    initGlobe();

    return () => {
      if (globeRef.current) {
        globeRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      <div className="relative flex items-center justify-center w-full h-full">
        <canvas
          ref={canvasRef}
          width={800}
          height={800}
          style={{
            width: "min(90vw, 800px)",
            height: "min(90vw, 800px)",
            maxWidth: "100%",
            aspectRatio: 1,
          }}
          className="opacity-50"
        />
      </div>
    </div>
  );
};

// Thank You Card Component
const ThankYouCard: React.FC<{ isVisible: boolean; onClose: () => void; userName: string }> = ({ 
  isVisible, 
  onClose, 
  userName 
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* Thank You Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ 
                type: "spring", 
                damping: 25, 
                stiffness: 300,
                duration: 0.6 
              }}
              className="relative bg-white/95 backdrop-blur-xl rounded-3xl p-8 sm:p-10 md:p-12 max-w-md sm:max-w-lg w-full mx-4 shadow-2xl border border-gray-200/50 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Animated Background Elements */}
              <div className="absolute inset-0 overflow-hidden">
                <motion.div
                  className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-orange-200/30 to-yellow-200/30 rounded-full blur-2xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div
                  className="absolute -bottom-10 -left-10 w-24 h-24 bg-gradient-to-br from-red-200/30 to-orange-200/30 rounded-full blur-2xl"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [360, 180, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                />
              </div>

              {/* Close Button */}
              <motion.button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200 z-10"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-4 h-4 text-gray-600" />
              </motion.button>

              {/* Content */}
              <div className="relative z-10 text-center">
                {/* Animated Icons */}
                <div className="flex justify-center items-center gap-2 mb-6">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", damping: 15 }}
                    className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center"
                  >
                    <CheckCircle className="w-6 h-6 text-white" />
                  </motion.div>
                  
                  <motion.div
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.4, type: "spring", damping: 15 }}
                    className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center"
                  >
                    <Heart className="w-5 h-5 text-white" />
                  </motion.div>
                  
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.6, type: "spring", damping: 15 }}
                    className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
                  >
                    <Star className="w-4 h-4 text-white" />
                  </motion.div>
                </div>

                {/* Main Message */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4"
                >
                  Thank You, {userName}! 🎉
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-gray-700 text-base sm:text-lg leading-relaxed mb-6"
                >
                  Your creator application has been submitted successfully! We're excited to review your portfolio and will get back to you within 3-5 business days.
                </motion.p>

                {/* Floating Sparkles */}
                <div className="relative mb-6">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute"
                      style={{
                        left: `${20 + (i * 12)}%`,
                        top: `${10 + (i % 2) * 20}px`,
                      }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ 
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                        y: [0, -20, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3,
                        ease: "easeInOut"
                      }}
                    >
                      <Sparkles className="w-4 h-4 text-yellow-500" />
                    </motion.div>
                  ))}
                </div>

                {/* Next Steps */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-4 sm:p-6 mb-6"
                >
                  <h3 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">What happens next?</h3>
                  <ul className="text-left text-gray-600 text-xs sm:text-sm space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      Our team will review your application
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      We'll send you an email with the decision
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      If approved, you'll get access to creator tools
                    </li>
                  </ul>
                </motion.div>

                {/* Action Button */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  onClick={onClose}
                  className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Continue Exploring
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const Page: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    countryOrigin: "",
    basedIn: "",
    bio: "",
    images: []
  });

  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showThankYouCard, setShowThankYouCard] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;
    
    const newImages = Array.from(files).slice(0, 12 - formData.images.length);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      // Prepare the data for Airtable with separate fields
      const airtableData: {
        fields: {
          "Name": string;
          "Email": string;
          "Country of Origin": string;
          "Currently Based In": string;
          "Bio": string;
          "Portfolio Images": Array<{ filename: string; url: string }>;
        };
      } = {
        fields: {
          "Name": formData.name,
          "Email": formData.email,
          "Country of Origin": formData.countryOrigin,
          "Currently Based In": formData.basedIn,
          "Bio": formData.bio,
          "Portfolio Images": []
        }
      };

      // Handle image uploads to Airtable
      if (formData.images.length > 0) {
        const imageAttachments = await Promise.all(
          formData.images.map(async (image) => {
            // Convert image to base64 for Airtable
            const base64 = await new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.readAsDataURL(image);
            });

            return {
              filename: image.name,
              url: base64
            };
          })
        );
        airtableData.fields["Portfolio Images"] = imageAttachments;
      }

      // Send to Airtable
      const response = await fetch('/api/airtable-creator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(airtableData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        // Show thank you card
        setShowThankYouCard(true);
        // Reset form after a delay
        setTimeout(() => {
          setFormData({
            name: "",
            email: "",
            countryOrigin: "",
            basedIn: "",
            bio: "",
            images: []
          });
          setSubmitStatus('idle');
        }, 3000);
      } else {
        throw new Error('Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Clean Background with Subtle Gradient */}
      <div className="fixed inset-0 bg-gradient-to-br"></div>
      
      {/* Subtle Floating Elements */}
      <motion.div
        className="fixed top-10 sm:top-20 left-4 sm:left-20 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-gradient-to-r from-red-100/20 via-orange-100/20 to-yellow-100/20 rounded-full blur-3xl"
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="fixed bottom-10 sm:bottom-20 right-4 sm:right-20 w-24 sm:w-32 md:w-48 h-24 sm:h-32 md:h-48 bg-gradient-to-r from-orange-100/20 via-red-100/20 to-yellow-100/20 rounded-full blur-3xl"
        animate={{
          x: [0, -25, 0],
          y: [0, 25, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />

      {/* Main Content - Moved higher up */}
      <div className="relative z-10 pt-2 sm:pt-4 md:pt-6 lg:pt-8 pb-8 sm:pb-12 md:pb-16 lg:pb-20 px-2 sm:px-4 md:px-6 lg:px-8 min-h-[120vh]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-7xl mx-auto"
        >
          <div className="relative  backdrop-blur-xl border border-gray-200/60 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl shadow-gray-400/70 p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 overflow-hidden min-h-[95vh] sm:min-h-[88vh]">
            <SpinningGlobe />
            
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative text-center mb-6 sm:mb-8 md:mb-10 z-10"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent mb-3 sm:mb-4 md:mb-6 tracking-tight">
                Become A Zadulis Creator
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed px-4">
                Join our community of talented creators and share your unique perspective with the world
              </p>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="relative space-y-6 sm:space-y-8 md:space-y-10 z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10">
                {/* Name Field */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="space-y-3 sm:space-y-4"
                >
                  <label className="flex items-center gap-2 font-medium text-sm sm:text-base md:text-lg">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
                      <User className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </div>
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-full focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-100/50 transition-all duration-300 placeholder-gray-500 text-sm sm:text-base md:text-lg hover:border-orange-300"
                    placeholder="Enter your full name"
                    required
                  />
                </motion.div>

                {/* Email Field */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="space-y-3 sm:space-y-4"
                >
                  <label className="flex items-center gap-2  font-medium text-sm sm:text-base md:text-lg">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center">
                      <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 " />
                    </div>
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-full focus:border-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-100/50 transition-all duration-300 placeholder-gray-400 text-sm sm:text-base md:text-lg hover:border-yellow-300"
                    placeholder="Enter your email"
                    required
                  />
                </motion.div>

                {/* Country Origin - Custom Searchable Dropdown */}
                <SearchableDropdown
                  label="Country of Origin"
                  icon={<Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                  value={formData.countryOrigin}
                  onChange={(value: string) => setFormData(prev => ({ ...prev, countryOrigin: value }))}
                  options={allCountries}
                  placeholder="Select your country of origin"
                  gradientColors="from-red-500 to-yellow-500"
                />

                {/* Based In - Custom Searchable Dropdown */}
                <SearchableDropdown
                  label="Currently Based In"
                  icon={<MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                  value={formData.basedIn}
                  onChange={(value: string) => setFormData(prev => ({ ...prev, basedIn: value }))}
                  options={allCountries}
                  placeholder="Select where you're based"
                  gradientColors="from-orange-500 to-red-500"
                />
              </div>

              {/* Bio Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="space-y-3 sm:space-y-4"
              >
                <label className="flex items-center gap-2  font-medium text-sm sm:text-base md:text-lg">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                    <FileText className="w-3 h-3 sm:w-3.5 sm:h-3.5 " />
                  </div>
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-3xl focus:border-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-100/50 transition-all duration-300 placeholder-gray-400 resize-none text-sm sm:text-base md:text-lg hover:border-yellow-300"
                  placeholder="Tell us about yourself, your interests, and what you'd like to create..."
                  required
                />
              </motion.div>

              {/* Image Upload */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="space-y-4 sm:space-y-6"
              >
                <label className="flex items-center gap-2 font-medium text-sm sm:text-base md:text-lg">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-r from-red-500 to-yellow-500 flex items-center justify-center">
                    <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </div>
                  Portfolio Images (Up to 12)
                </label>
                
                <div
                  className={`relative border-2 border-dashed rounded-3xl p-6 sm:p-8 md:p-10 text-center transition-all duration-300 backdrop-blur-sm ${
                    dragActive
                      ? "border-orange-400 bg-orange-50/50 scale-105"
                      : "border-gray-300 hover:border-orange-300 bg-white/60 hover:bg-orange-50/30"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleImageUpload(e.target.files)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={formData.images.length >= 12}
                  />
                  <motion.div 
                    className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 mx-auto mb-4 sm:mb-6 rounded-full bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Upload className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
                  </motion.div>
                  <p className="text-gray-700 mb-3 font-medium text-sm sm:text-base md:text-lg">
                    {formData.images.length >= 12
                      ? "Maximum 12 images reached"
                      : "Drag and drop images here, or click to select"}
                  </p>
                  <p className="text-xs sm:text-sm md:text-base text-gray-500">
                    {formData.images.length}/12 images uploaded
                  </p>
                </div>

                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
                    {formData.images.map((image, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="relative group"
                      >
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-24 sm:h-28 md:h-32 object-cover rounded-2xl border border-gray-200 group-hover:shadow-lg transition-all duration-300"
                        />
                        <motion.button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="pt-6 sm:pt-8 md:pt-10 pb-6"
              >
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full sm:w-auto mx-auto flex items-center justify-center gap-3 sm:gap-4 px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 font-semibold rounded-full shadow-lg transition-all duration-300 text-base sm:text-lg md:text-xl ${
                    submitStatus === 'success'
                      ? 'bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 shadow-green-200/50'
                      : submitStatus === 'error'
                      ? 'bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 shadow-red-200/50'
                      : isSubmitting
                      ? 'bg-gradient-to-r from-gray-600 via-slate-600 to-gray-600 shadow-gray-200/50 cursor-not-allowed'
                      : 'bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 shadow-orange-200/50 hover:shadow-xl hover:shadow-orange-300/50'
                  } text-white`}
                  whileHover={!isSubmitting ? { scale: 1.05 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.95 } : {}}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                      Processing...
                    </>
                  ) : submitStatus === 'success' ? (
                    <>
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                      Application Submitted!
                    </>
                  ) : submitStatus === 'error' ? (
                    <>
                      <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                      Submission Failed - Try Again
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 sm:w-6 sm:h-6" />
                      Submit Application
                    </>
                  )}
                </motion.button>

                {/* Status Messages */}
                <AnimatePresence>
                  {submitStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-4 text-center"
                    >
                      <p className="text-green-600 font-medium text-sm sm:text-base">
                        🎉 Thank you! Your creator application has been submitted successfully. We'll review it and get back to you soon!
                      </p>
                    </motion.div>
                  )}
                  
                  {submitStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-4 text-center"
                    >
                      <p className="text-red-600 font-medium text-sm sm:text-base">
                        ❌ Something went wrong. Please check your connection and try again.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </form>
          </div>
        </motion.div>
      </div>

      {/* Thank You Card Popup */}
      <ThankYouCard 
        isVisible={showThankYouCard} 
        onClose={() => setShowThankYouCard(false)} 
        userName={formData.name || "Creator"} 
      />
    </div>
  );
};

export default Page;