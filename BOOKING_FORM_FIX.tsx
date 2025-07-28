// Updated BookingForm component with Airtable integration and debugging
const BookingForm = ({ isOpen, onClose, creatorName }: { 
    isOpen: boolean; 
    onClose: () => void; 
    creatorName: string;
}) => {
    console.log('🎯 BookingForm: Component rendered', { isOpen, creatorName });
    
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
        console.log('📝 BookingForm: Input changed', { name, value });
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleClose = () => {
        console.log('❌ BookingForm: Closing form');
        setIsClosing(true);
        setTimeout(() => {
            onClose();
            setIsClosing(false);
            setErrorMessage('');
        }, 400);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('🔄 BookingForm: Form submitted');
        console.log('📝 BookingForm: Form data:', formData);
        console.log('👤 BookingForm: Creator info:', { creatorName });
        
        setIsSubmitting(true);
        setErrorMessage('');
        
        try {
            console.log('🌐 BookingForm: Making API call to /api/booking/airtable');
            
            const requestData = {
                ...formData,
                creatorName,
                creatorId: 'test-creator-id' // We'll use a test ID for now
            };
            
            console.log('📤 BookingForm: Request data:', requestData);
            
            const response = await fetch('/api/booking/airtable', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            console.log('📡 BookingForm: API response status:', response.status);
            
            const result = await response.json();
            console.log('📊 BookingForm: API response data:', result);

            if (response.ok) {
                console.log('✅ BookingForm: Booking submitted successfully');
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
                console.error('❌ BookingForm: API error:', result.error);
                setSubmitStatus('error');
                setErrorMessage(result.error || 'Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error('❌ BookingForm: Network error:', error);
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
                        {/* Debug Info */}
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-lg text-sm">
                            <strong>Debug Info:</strong><br/>
                            Creator: {creatorName}<br/>
                            Form Status: {submitStatus}<br/>
                            Submitting: {isSubmitting ? 'Yes' : 'No'}
                        </div>

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

            {/* All the existing styles remain the same... */}
        </>
    );
};