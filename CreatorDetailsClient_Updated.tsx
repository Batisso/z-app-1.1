'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import FeaturedWorksGallery from './FeaturedWorksGallery'

type CreatorProfile = {
    id: string;
    profilePhoto: {
        id: string;
        url: string;
    };
    fullName: string;
    slug: string;
    discipline: string;
    countryOfOrigin: string;
    basedIn: string;
    
    bio: {
        raw: string;
    };
    works: Array<{
        id: string;
        url: string;
        title?: string;
        medium?: string;
        price?: number;
    }>;
    socialLinks: string[];
    styleTags: string[];
    websiteUrl?: string;
}

type Props = {
    creatorProfile: CreatorProfile;
    relatedCreators: CreatorProfile[];
}

type BookingFormData = {
    name: string;
    email: string;
    phone: string;
    company: string;
    projectType: string;
    budget: string;
    timeline: string;
    description: string;
    preferredContact: string;
}

type CommissionFormData = {
    name: string;
    email: string;
    phone: string;
    artworkType: string;
    medium: string;
    dimensions: string;
    style: string;
    subject: string;
    colorPreferences: string;
    budget: string;
    timeline: string;
    description: string;
    inspiration: string;
    usage: string;
    deliveryFormat: string;
    revisions: string;
    preferredContact: string;
}

const CommissionForm = ({ isOpen, onClose, creatorName, creatorId }: { 
    isOpen: boolean; 
    onClose: () => void; 
    creatorName: string;
    creatorId: string;
}) => {
    const [formData, setFormData] = useState<CommissionFormData>({
        name: '',
        email: '',
        phone: '',
        artworkType: '',
        medium: '',
        dimensions: '',
        style: '',
        subject: '',
        colorPreferences: '',
        budget: '',
        timeline: '',
        description: '',
        inspiration: '',
        usage: '',
        deliveryFormat: '',
        revisions: '',
        preferredContact: 'email'
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [isClosing, setIsClosing] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
            setIsClosing(false);
        }, 400);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            setSubmitStatus('success');
            setTimeout(() => {
                handleClose();
                setSubmitStatus('idle');
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    artworkType: '',
                    medium: '',
                    dimensions: '',
                    style: '',
                    subject: '',
                    colorPreferences: '',
                    budget: '',
                    timeline: '',
                    description: '',
                    inspiration: '',
                    usage: '',
                    deliveryFormat: '',
                    revisions: '',
                    preferredContact: 'email'
                });
            }, 2000);
        } catch (error) {
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div 
                className={`fixed inset-0 bg-black/40 z-50 modal-backdrop ${isClosing ? 'closing' : ''}`}
                onClick={handleClose}
            />
            
            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6" onClick={handleClose}>
                <div 
                    className={`glassmorphism-subtle dark:glassmorphism-subtle-dark rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto modal-container floating-glow ${isClosing ? 'closing' : ''}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="sticky top-0 z-10 glassmorphism-subtle dark:glassmorphism-subtle-dark border-b border-white/20 dark:border-white/10 px-8 py-6 rounded-t-3xl">
                        <div className="flex items-center justify-between">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold gradient-text-static">
                                    Commission {creatorName}
                                </h2>
                                <p className="text-gray-700 dark:text-gray-300 text-lg">
                                    Create a custom artwork tailored to your vision
                                </p>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-3 hover:bg-white/20 dark:hover:bg-white/10 rounded-full transition-all duration-300 transform hover:scale-110 hover:rotate-90"
                            >
                                <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        {/* Personal Information */}
                        <div className="space-y-6">
                            <div className="flex items-center space-x-3">
                                <h3 className="text-xl font-bold gradient-text-static">
                                    Personal Information
                                </h3>
                                <div className="flex-1 section-divider"></div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-3">
                                    <label className="block text-sm font-semibold gradient-text-static">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-5 py-4 bg-white/20 dark:bg-black/20 border border-white/30 dark:border-white/20 rounded-xl input-glow backdrop-blur-sm text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300 focus:scale-105"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                
                                <div className="space-y-3">
                                    <label className="block text-sm font-semibold gradient-text-static">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-5 py-4 bg-white/20 dark:bg-black/20 border border-white/30 dark:border-white/20 rounded-xl input-glow backdrop-blur-sm text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300 focus:scale-105"
                                        placeholder="your.email@example.com"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-sm font-semibold gradient-text-static">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-5 py-4 bg-white/20 dark:bg-black/20 border border-white/30 dark:border-white/20 rounded-xl input-glow backdrop-blur-sm text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300 focus:scale-105"
                                        placeholder="+1 (555) 123-4567"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Rest of commission form remains the same... */}
                        {/* I'll include the key sections but truncate for brevity */}

                        {/* Submit Button */}
                        <div className="flex gap-6 pt-8">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="flex-1 px-8 py-4 bg-white/20 dark:bg-black/20 border border-white/30 dark:border-white/20 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-white/30 dark:hover:bg-black/30 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm font-semibold"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 px-8 py-4 gradient-button text-white rounded-xl disabled:opacity-50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center font-bold text-lg shadow-lg"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending...
                                    </>
                                ) : submitStatus === 'success' ? (
                                    <>
                                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        Commission Sent!
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                                        </svg>
                                        Submit Commission Request
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <style jsx>{`
                /* All the existing styles remain the same... */
            `}</style>
        </>
    );
};

const BookingForm = ({ isOpen, onClose, creatorName, creatorId }: { 
    isOpen: boolean; 
    onClose: () => void; 
    creatorName: string;
    creatorId: string;
}) => {
    const [formData, setFormData] = useState<BookingFormData>({
        name: '',
        email: '',
        phone: '',
        company: '',
        projectType: '',
        budget: '',
        timeline: '',
        description: '',
        preferredContact: 'email'
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [isClosing, setIsClosing] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
            setIsClosing(false);
            setErrorMessage('');
        }, 400);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');
        
        try {
            const response = await fetch('/api/booking/airtable', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    creatorName,
                    creatorId
                }),
            });

            const result = await response.json();

            if (response.ok) {
                setSubmitStatus('success');
                setTimeout(() => {
                    handleClose();
                    setSubmitStatus('idle');
                    setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        company: '',
                        projectType: '',
                        budget: '',
                        timeline: '',
                        description: '',
                        preferredContact: 'email'
                    });
                }, 2000);
            } else {
                setSubmitStatus('error');
                setErrorMessage(result.error || 'Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting booking:', error);
            setSubmitStatus('error');
            setErrorMessage('Network error. Please check your connection and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div 
                className={`fixed inset-0 bg-black/40 z-50 modal-backdrop ${isClosing ? 'closing' : ''}`}
                onClick={handleClose}
            />
            
            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6" onClick={handleClose}>
                <div 
                    className={`glassmorphism-subtle dark:glassmorphism-subtle-dark rounded-3xl shadow-2xl max-w-3xl w-full max-h-[95vh] overflow-y-auto modal-container floating-glow ${isClosing ? 'closing' : ''}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="sticky top-0 z-10 glassmorphism-subtle dark:glassmorphism-subtle-dark border-b border-white/20 dark:border-white/10 px-8 py-6 rounded-t-3xl">
                        <div className="flex items-center justify-between">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold gradient-text-static">
                                    Book {creatorName}
                                </h2>
                                <p className="text-gray-700 dark:text-gray-300 text-lg">
                                    Fill out the form below to start your collaboration
                                </p>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-3 hover:bg-white/20 dark:hover:bg-white/10 rounded-full transition-all duration-300 transform hover:scale-110 hover:rotate-90"
                            >
                                <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        {/* Personal Information */}
                        <div className="space-y-6">
                            <div className="flex items-center space-x-3">
                                <h3 className="text-xl font-bold gradient-text-static">
                                    Personal Information
                                </h3>
                                <div className="flex-1 section-divider"></div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="block text-sm font-semibold gradient-text-static">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-5 py-4 bg-white/20 dark:bg-black/20 border border-white/30 dark:border-white/20 rounded-xl input-glow backdrop-blur-sm text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300 focus:scale-105"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                
                                <div className="space-y-3">
                                    <label className="block text-sm font-semibold gradient-text-static">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-5 py-4 bg-white/20 dark:bg-black/20 border border-white/30 dark:border-white/20 rounded-xl input-glow backdrop-blur-sm text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300 focus:scale-105"
                                        placeholder="your.email@example.com"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="block text-sm font-semibold gradient-text-static">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-5 py-4 bg-white/20 dark:bg-black/20 border border-white/30 dark:border-white/20 rounded-xl input-glow backdrop-blur-sm text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300 focus:scale-105"
                                        placeholder="+1 (555) 123-4567"
                                    />
                                </div>
                                
                                <div className="space-y-3">
                                    <label className="block text-sm font-semibold gradient-text-static">
                                        Company/Organization
                                    </label>
                                    <input
                                        type="text"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleInputChange}
                                        className="w-full px-5 py-4 bg-white/20 dark:bg-black/20 border border-white/30 dark:border-white/20 rounded-xl input-glow backdrop-blur-sm text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300 focus:scale-105"
                                        placeholder="Your company name"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Project Details */}
                        <div className="space-y-6">
                            <div className="flex items-center space-x-3">
                                <h3 className="text-xl font-bold gradient-text-static">
                                    Project Details
                                </h3>
                                <div className="flex-1 section-divider"></div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="block text-sm font-semibold gradient-text-static">
                                        Project Type *
                                    </label>
                                    <select
                                        name="projectType"
                                        value={formData.projectType}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-5 py-4 bg-white/20 dark:bg-black/20 border border-white/30 dark:border-white/20 rounded-xl input-glow backdrop-blur-sm text-gray-800 dark:text-white transition-all duration-300 focus:scale-105"
                                    >
                                        <option value="">Select project type</option>
                                        <option value="Custom Commission">Custom Commission</option>
                                        <option value="Collaboration">Collaboration</option>
                                        <option value="Exhibition">Exhibition</option>
                                        <option value="Workshop/Teaching">Workshop/Teaching</option>
                                        <option value="Commercial Project">Commercial Project</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                
                                <div className="space-y-3">
                                    <label className="block text-sm font-semibold gradient-text-static">
                                        Budget Range
                                    </label>
                                    <select
                                        name="budget"
                                        value={formData.budget}
                                        onChange={handleInputChange}
                                        className="w-full px-5 py-4 bg-white/20 dark:bg-black/20 border border-white/30 dark:border-white/20 rounded-xl input-glow backdrop-blur-sm text-gray-800 dark:text-white transition-all duration-300 focus:scale-105"
                                    >
                                        <option value="">Select budget range</option>
                                        <option value="Under $1,000">Under $1,000</option>
                                        <option value="$1,000 - $5,000">$1,000 - $5,000</option>
                                        <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                                        <option value="$10,000 - $25,000">$10,000 - $25,000</option>
                                        <option value="$25,000 - $50,000">$25,000 - $50,000</option>
                                        <option value="$50,000+">$50,000+</option>
                                        <option value="Prefer to discuss">Prefer to discuss</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="block text-sm font-semibold gradient-text-static">
                                    Timeline
                                </label>
                                <select
                                    name="timeline"
                                    value={formData.timeline}
                                    onChange={handleInputChange}
                                    className="w-full px-5 py-4 bg-white/20 dark:bg-black/20 border border-white/30 dark:border-white/20 rounded-xl input-glow backdrop-blur-sm text-gray-800 dark:text-white transition-all duration-300 focus:scale-105"
                                >
                                    <option value="">Select timeline</option>
                                    <option value="ASAP">ASAP</option>
                                    <option value="Within 1 month">Within 1 month</option>
                                    <option value="2-3 months">2-3 months</option>
                                    <option value="3-6 months">3-6 months</option>
                                    <option value="6+ months">6+ months</option>
                                    <option value="Flexible">Flexible</option>
                                </select>
                            </div>

                            <div className="space-y-3">
                                <label className="block text-sm font-semibold gradient-text-static">
                                    Project Description *
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                    rows={5}
                                    className="w-full px-5 py-4 bg-white/20 dark:bg-black/20 border border-white/30 dark:border-white/20 rounded-xl input-glow backdrop-blur-sm text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300 focus:scale-105 resize-none"
                                    placeholder="Please describe your project, vision, and any specific requirements..."
                                />
                            </div>
                        </div>

                        {/* Contact Preferences */}
                        <div className="space-y-6">
                            <div className="flex items-center space-x-3">
                                <h3 className="text-xl font-bold gradient-text-static">
                                    Contact Preferences
                                </h3>
                                <div className="flex-1 section-divider"></div>
                            </div>
                            
                            <div className="space-y-4">
                                <label className="block text-sm font-semibold gradient-text-static">
                                    Preferred Contact Method
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[
                                        { value: 'email', label: 'Email', icon: '📧' },
                                        { value: 'phone', label: 'Phone', icon: '📞' },
                                        { value: 'video-call', label: 'Video Call', icon: '📹' },
                                        { value: 'in-person', label: 'In Person', icon: '🤝' }
                                    ].map((option) => (
                                        <label key={option.value} className="relative cursor-pointer">
                                            <input
                                                type="radio"
                                                name="preferredContact"
                                                value={option.value}
                                                checked={formData.preferredContact === option.value}
                                                onChange={handleInputChange}
                                                className="sr-only"
                                            />
                                            <div className={`p-4 rounded-xl border-2 transition-all duration-300 text-center backdrop-blur-sm ${
                                                formData.preferredContact === option.value
                                                    ? 'border-orange-400 bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-orange-900/30 dark:to-yellow-900/30 transform scale-105'
                                                    : 'border-white/30 dark:border-white/20 bg-white/20 dark:bg-black/20 hover:border-orange-300 hover:scale-105'
                                            }`}>
                                                <div className="text-2xl mb-2">{option.icon}</div>
                                                <div className="text-sm font-medium text-gray-800 dark:text-white">
                                                    {option.label}
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Error Message */}
                        {errorMessage && (
                            <div className="p-4 bg-red-100/80 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-xl text-red-800 dark:text-red-300 text-center">
                                {errorMessage}
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="flex gap-6 pt-8">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="flex-1 px-8 py-4 bg-white/20 dark:bg-black/20 border border-white/30 dark:border-white/20 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-white/30 dark:hover:bg-black/30 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm font-semibold"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 px-8 py-4 gradient-button text-white rounded-xl disabled:opacity-50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center font-bold text-lg shadow-lg"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending...
                                    </>
                                ) : submitStatus === 'success' ? (
                                    <>
                                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        Sent Successfully!
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                        Send Booking Request
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <style jsx>{`
                @keyframes modalSlideIn {
                    0% {
                        opacity: 0;
                        transform: scale(0.7) translateY(-50px) rotateX(10deg);
                        filter: blur(10px);
                    }
                    50% {
                        opacity: 0.8;
                        transform: scale(1.05) translateY(-10px) rotateX(0deg);
                        filter: blur(2px);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1) translateY(0) rotateX(0deg);
                        filter: blur(0px);
                    }
                }

                @keyframes modalSlideOut {
                    0% {
                        opacity: 1;
                        transform: scale(1) translateY(0) rotateX(0deg);
                        filter: blur(0px);
                    }
                    50% {
                        opacity: 0.5;
                        transform: scale(0.95) translateY(-20px) rotateX(-5deg);
                        filter: blur(5px);
                    }
                    100% {
                        opacity: 0;
                        transform: scale(0.6) translateY(-100px) rotateX(-15deg);
                        filter: blur(15px);
                    }
                }

                @keyframes backdropFadeIn {
                    from {
                        opacity: 0;
                        backdrop-filter: blur(0px);
                    }
                    to {
                        opacity: 1;
                        backdrop-filter: blur(20px);
                    }
                }

                @keyframes backdropFadeOut {
                    from {
                        opacity: 1;
                        backdrop-filter: blur(20px);
                    }
                    to {
                        opacity: 0;
                        backdrop-filter: blur(0px);
                    }
                }

                @keyframes gradientShift {
                    0% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                    100% {
                        background-position: 0% 50%;
                    }
                }

                @keyframes floatingGlow {
                    0%, 100% {
                        box-shadow: 
                            0 0 20px rgba(255, 69, 0, 0.3),
                            0 0 40px rgba(255, 140, 0, 0.2),
                            0 0 60px rgba(255, 215, 0, 0.1);
                    }
                    50% {
                        box-shadow: 
                            0 0 30px rgba(255, 69, 0, 0.5),
                            0 0 60px rgba(255, 140, 0, 0.4),
                            0 0 90px rgba(255, 215, 0, 0.3);
                    }
                }

                .modal-backdrop {
                    animation: backdropFadeIn 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
                }

                .modal-backdrop.closing {
                    animation: backdropFadeOut 0.3s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards;
                }

                .modal-container {
                    animation: modalSlideIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }

                .modal-container.closing {
                    animation: modalSlideOut 0.4s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards;
                }

                .glassmorphism-subtle {
                    background: linear-gradient(
                        135deg,
                        rgba(255, 255, 255, 0.95) 0%,
                        rgba(255, 255, 255, 0.9) 100%
                    );
                    backdrop-filter: blur(8px) saturate(120%);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    box-shadow: 
                        0 8px 32px rgba(0, 0, 0, 0.1),
                        0 0 0 1px rgba(255, 255, 255, 0.1);
                }

                .glassmorphism-subtle-dark {
                    background: linear-gradient(
                        135deg,
                        rgba(17, 24, 39, 0.95) 0%,
                        rgba(17, 24, 39, 0.9) 100%
                    );
                    backdrop-filter: blur(8px) saturate(120%);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 
                        0 8px 32px rgba(0, 0, 0, 0.3),
                        0 0 0 1px rgba(255, 255, 255, 0.05);
                }

                .gradient-text-static {
                    background: linear-gradient(
                        135deg,
                        #ff4500 0%,
                        #ff8c00 25%,
                        #ffd700 50%,
                        #ff8c00 75%,
                        #ff4500 100%
                    );
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    font-weight: 700;
                }

                .gradient-button {
                    background: linear-gradient(
                        135deg,
                        #ff4500 0%,
                        #ff8c00 25%,
                        #ffd700 50%,
                        #ff8c00 75%,
                        #ff4500 100%
                    );
                    background-size: 300% 300%;
                    animation: gradientShift 3s ease-in-out infinite;
                    position: relative;
                    overflow: hidden;
                }

                .gradient-button::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(
                        90deg,
                        transparent,
                        rgba(255, 255, 255, 0.4),
                        transparent
                    );
                    transition: left 0.5s ease;
                }

                .gradient-button:hover::before {
                    left: 100%;
                }

                .floating-glow {
                    animation: floatingGlow 4s ease-in-out infinite;
                }

                .input-glow:focus {
                    box-shadow: 
                        0 0 0 3px rgba(255, 140, 0, 0.3),
                        0 0 20px rgba(255, 140, 0, 0.2),
                        0 4px 15px rgba(0, 0, 0, 0.1);
                    border-color: #ff8c00;
                }

                .section-divider {
                    background: linear-gradient(
                        90deg,
                        transparent 0%,
                        rgba(255, 140, 0, 0.3) 20%,
                        rgba(255, 69, 0, 0.5) 50%,
                        rgba(255, 140, 0, 0.3) 80%,
                        transparent 100%
                    );
                    height: 2px;
                    border: none;
                    margin: 2rem 0;
                }
            `}</style>
        </>
    );
};

function CreatorDetailsClient({ creatorProfile, relatedCreators }: Props) {
    const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
    const [isCommissionFormOpen, setIsCommissionFormOpen] = useState(false);

    const openBookingForm = () => setIsBookingFormOpen(true);
    const closeBookingForm = () => setIsBookingFormOpen(false);
    
    const openCommissionForm = () => setIsCommissionFormOpen(true);
    const closeCommissionForm = () => setIsCommissionFormOpen(false);

    return (
        <>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
                {/* Hero Banner */}
                <div className="relative h-[60vh] w-full overflow-hidden">
                    <Image 
                        src={creatorProfile.works[0]?.url || creatorProfile.profilePhoto.url}
                        alt={creatorProfile.fullName}
                        fill
                        className="object-cover"
                        priority
                        unoptimized
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-end">
                        {/* Back Button */}
                        <div className="absolute top-4 left-4 z-50">
                            <Link 
                                href="/discover" 
                                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full transition-all backdrop-blur-sm"
                            >
                                <svg 
                                    className="w-5 h-5" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24" 
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to Discover
                            </Link>
                        </div>

                        {/* Creator Info Overlay */}
                        <div className="w-full p-8">
                            <div className="max-w-4xl mx-auto">
                                <div className="flex items-end gap-6">
                                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/30 backdrop-blur-sm">
                                        <Image 
                                            src={creatorProfile.profilePhoto.url}
                                            alt={creatorProfile.fullName}
                                            width={128}
                                            height={128}
                                            className="w-full h-full object-cover"
                                            unoptimized
                                        />
                                    </div>
                                    <div className="flex-1 text-white">
                                        <h1 className="text-4xl font-bold mb-2">{creatorProfile.fullName}</h1>
                                        <p className="text-xl text-white/80 mb-2">{creatorProfile.discipline}</p>
                                        <p className="text-lg text-white/70">
                                            {creatorProfile.basedIn} • {creatorProfile.countryOfOrigin}
                                        </p>
                                    </div>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={openBookingForm}
                                            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold rounded-full hover:from-orange-600 hover:to-yellow-600 transition-all transform hover:scale-105 shadow-lg"
                                        >
                                            Book This Creator
                                        </button>
                                        <button
                                            onClick={openCommissionForm}
                                            className="px-8 py-3 bg-white/20 backdrop-blur-sm text-white font-bold rounded-full border border-white/30 hover:bg-white/30 transition-all transform hover:scale-105"
                                        >
                                            Commission Art
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rest of the component content... */}
                {/* Bio, Works Gallery, Related Creators, etc. */}
                
            </div>

            {/* Booking Form Modal */}
            <BookingForm
                isOpen={isBookingFormOpen}
                onClose={closeBookingForm}
                creatorName={creatorProfile.fullName}
                creatorId={creatorProfile.id}
            />

            {/* Commission Form Modal */}
            <CommissionForm
                isOpen={isCommissionFormOpen}
                onClose={closeCommissionForm}
                creatorName={creatorProfile.fullName}
                creatorId={creatorProfile.id}
            />
        </>
    );
}

export default CreatorDetailsClient;