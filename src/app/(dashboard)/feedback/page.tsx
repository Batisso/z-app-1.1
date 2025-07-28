"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle, User, Mail, MessageSquare, Tag, FileText, Bug, Zap, Settings, Plus } from "lucide-react";

interface FeedbackFormData {
  name: string;
  email: string;
  subject: string;
  feedbackType: string;
  comments: string;
}

const FeedbackPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FeedbackFormData>({
    name: "",
    email: "",
    subject: "",
    feedbackType: "",
    comments: ""
  });
  const [errors, setErrors] = useState<Partial<FeedbackFormData>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const feedbackTypes = [
    { value: "feature", label: "Feature Request", icon: Plus, color: "from-blue-500 to-cyan-500" },
    { value: "bug", label: "Bug Report", icon: Bug, color: "from-red-500 to-pink-500" },
    { value: "performance", label: "Performance", icon: Zap, color: "from-yellow-500 to-orange-500" },
    { value: "other", label: "Other", icon: Settings, color: "from-purple-500 to-indigo-500" }
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<FeedbackFormData> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.feedbackType) newErrors.feedbackType = "Please select a feedback type";
    if (!formData.comments.trim()) newErrors.comments = "Comments are required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setSubmitted(true);
        // Reset form after success
        setTimeout(() => {
          setFormData({
            name: '',
            email: '',
            subject: '',
            feedbackType: '',
            comments: ''
          });
          setSubmitted(false);
        }, 3000);
      } else {
        const error = await res.json();
        console.error('Submission error:', error);
        alert('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Submission exception:', error);
      alert('Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FeedbackFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-red-100/30 via-orange-100/30 to-yellow-100/30 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-orange-100/30 via-red-100/30 to-yellow-100/30 rounded-full blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-2xl"
        >
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 " />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent">
                Feedback
              </h1>
            </div>
            <p className=" text-lg max-w-lg mx-auto">
              We value your feedback! Help us improve by sharing your thoughts, suggestions, or reporting issues.
            </p>
          </motion.div>

          {/* Form Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
            className=" backdrop-blur-xl border border-gray-200/50 rounded-3xl shadow-xl shadow-gray-200/20 p-8 md:p-10"
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="text-center py-12"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center"
                  >
                    <CheckCircle className="w-10 h-10 " />
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-2xl font-bold text-gray-800 mb-3"
                  >
                    Thank You!
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-gray-600 text-lg"
                  >
                    Your feedback has been submitted successfully. We appreciate your input!
                  </motion.p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-6"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                >
                  {/* Name and Email Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name Field */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
                    >
                      <label className="block text-sm font-semibold mb-2">
                        <User className="w-4 h-4 inline mr-2" />
                        Name
                      </label>
                      <motion.div
                        className={`relative ${focusedField === 'name' ? 'scale-[1.02]' : ''}`}
                        transition={{ duration: 0.2 }}
                      >
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          onFocus={() => setFocusedField('name')}
                          onBlur={() => setFocusedField(null)}
                          className={`w-full px-4 py-3 border-2 rounded-xl bg-white/70 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-orange-100/50 ${
                            errors.name 
                              ? 'border-red-300 focus:border-red-400' 
                              : focusedField === 'name'
                                ? 'border-orange-400 shadow-lg shadow-orange-200/30'
                                : 'border-gray-200 hover:border-orange-300'
                          }`}
                          placeholder="Enter your full name"
                        />
                        {errors.name && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-sm mt-1"
                          >
                            {errors.name}
                          </motion.p>
                        )}
                      </motion.div>
                    </motion.div>

                    {/* Email Field */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
                    >
                      <label className="block text-sm font-semibold mb-2">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Email Address
                      </label>
                      <motion.div
                        className={`relative ${focusedField === 'email' ? 'scale-[1.02]' : ''}`}
                        transition={{ duration: 0.2 }}
                      >
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField(null)}
                          className={`w-full px-4 py-3 border-2 rounded-xl bg-white/70 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-orange-100/50 ${
                            errors.email 
                              ? 'border-red-300 focus:border-red-400' 
                              : focusedField === 'email'
                                ? 'border-orange-400 shadow-lg shadow-orange-200/30'
                                : 'border-gray-200 hover:border-orange-300'
                          }`}
                          placeholder="Enter your email address"
                        />
                        {errors.email && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-sm mt-1"
                          >
                            {errors.email}
                          </motion.p>
                        )}
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Subject Field */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 }}
                  >
                    <label className="block text-sm font-semibold mb-2">
                      <FileText className="w-4 h-4 inline mr-2" />
                      Subject
                    </label>
                    <motion.div
                      className={`relative ${focusedField === 'subject' ? 'scale-[1.02]' : ''}`}
                      transition={{ duration: 0.2 }}
                    >
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        onFocus={() => setFocusedField('subject')}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full px-4 py-3 border-2 rounded-xl bg-white/70 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-orange-100/50 ${
                          errors.subject 
                            ? 'border-red-300 focus:border-red-400' 
                            : focusedField === 'subject'
                              ? 'border-orange-400 shadow-lg shadow-orange-200/30'
                              : 'border-gray-200 hover:border-orange-300'
                        }`}
                        placeholder="Brief description of your feedback"
                      />
                      {errors.subject && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm mt-1"
                        >
                          {errors.subject}
                        </motion.p>
                      )}
                    </motion.div>
                  </motion.div>

                  {/* Feedback Type */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut", delay: 0.4 }}
                  >
                    <label className="block text-sm font-semibold mb-3">
                      <Tag className="w-4 h-4 inline mr-2" />
                      Feedback Type
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {feedbackTypes.map((type, index) => {
                        const IconComponent = type.icon;
                        const isSelected = formData.feedbackType === type.value;
                        
                        return (
                          <motion.button
                            key={type.value}
                            type="button"
                            onClick={() => handleInputChange('feedbackType', type.value)}
                            className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                              isSelected
                                ? 'border-transparent shadow-lg shadow-orange-200/50'
                                : 'border-gray-200 hover:border-orange-300 hover:shadow-md'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                          >
                            {isSelected && (
                              <motion.div
                                layoutId="selectedType"
                                className={`absolute inset-0 bg-gradient-to-r ${type.color} rounded-xl`}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                              />
                            )}
                            <div className={`relative z-10 flex flex-col items-center gap-2 ${
                              isSelected ? 'text-white' : 'text-gray-600'
                            }`}>
                              <IconComponent className="w-5 h-5" />
                              <span className="text-xs font-medium text-center">{type.label}</span>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                    {errors.feedbackType && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-2"
                      >
                        {errors.feedbackType}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Comments Field */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut", delay: 0.6 }}
                  >
                    <label className="block text-sm font-semibold mb-2">
                      <MessageSquare className="w-4 h-4 inline mr-2" />
                      Comments
                    </label>
                    <motion.div
                      className={`relative ${focusedField === 'comments' ? 'scale-[1.02]' : ''}`}
                      transition={{ duration: 0.2 }}
                    >
                      <textarea
                        value={formData.comments}
                        onChange={(e) => handleInputChange('comments', e.target.value)}
                        onFocus={() => setFocusedField('comments')}
                        onBlur={() => setFocusedField(null)}
                        rows={5}
                        className={`w-full px-4 py-3 border-2 rounded-xl bg-white/70 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-orange-100/50 resize-none ${
                          errors.comments 
                            ? 'border-red-300 focus:border-red-400' 
                            : focusedField === 'comments'
                              ? 'border-orange-400 shadow-lg shadow-orange-200/30'
                              : 'border-gray-200 hover:border-orange-300'
                        }`}
                        placeholder="Please provide detailed feedback, suggestions, or describe any issues you've encountered..."
                      />
                      {errors.comments && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm mt-1"
                        >
                          {errors.comments}
                        </motion.p>
                      )}
                    </motion.div>
                  </motion.div>

                  {/* Submit Button */}
                  <motion.div
                    className="pt-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut", delay: 0.7 }}
                  >
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 text-white font-semibold rounded-xl shadow-lg shadow-orange-200/50 hover:shadow-xl hover:shadow-orange-300/50 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                      whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Submit Feedback
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default FeedbackPage;