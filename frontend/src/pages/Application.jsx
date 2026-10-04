import React, { useState } from 'react';
import { Send, CheckCircle2, Building, User, Mail, Phone, Briefcase, Landmark } from 'lucide-react';

const Application = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        accountType: 'savings',
        monthlyIncome: '',
        loanAmount: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API delay
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
        }, 1500);
    };

    return (
        <div className="pt-20 bg-background min-h-screen">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 relative z-10">
                <div className="text-center mb-12">
                    <span className="text-accent font-semibold tracking-wider uppercase text-sm mb-2 block">Get Started</span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4">Secure Application</h1>
                    <p className="text-gray-600 text-lg">Join Apex Global Bank today and experience seamless global finance.</p>
                </div>

                {isSubmitted ? (
                    <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-100 text-center animate-in zoom-in-95 duration-500">
                        <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-12 h-12" />
                        </div>
                        <h2 className="text-3xl font-bold text-primary mb-4">Application Received!</h2>
                        <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                            Thank you, {formData.fullName}. Your application for a {formData.accountType} account has been securely submitted. Our management team will contact you shortly.
                        </p>
                        <button
                            onClick={() => { setIsSubmitted(false); setFormData({ ...formData, fullName: '', email: '', phone: '' }) }}
                            className="btn-primary"
                        >
                            Submit Another Application
                        </button>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl p-8 shadow-xl shadow-primary/5 border border-gray-100 animate-in fade-in slide-in-from-bottom-5">
                        <form onSubmit={handleSubmit} className="space-y-6">

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Full Name */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 block">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            required type="text" name="fullName" value={formData.fullName} onChange={handleChange}
                                            placeholder="John Doe"
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 block">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            required type="email" name="email" value={formData.email} onChange={handleChange}
                                            placeholder="john@example.com"
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Phone */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 block">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            required type="tel" name="phone" value={formData.phone} onChange={handleChange}
                                            placeholder="+1 (555) 000-0000"
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Account Type */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 block">Account Type</label>
                                    <div className="relative">
                                        <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <select
                                            name="accountType" value={formData.accountType} onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all appearance-none"
                                        >
                                            <option value="savings">Premium Savings Account</option>
                                            <option value="current">Business Current Account</option>
                                            <option value="home_loan">Home Loan</option>
                                            <option value="personal_loan">Personal Loan</option>
                                            <option value="investment">Investment Portfolio</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                                {/* Income */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 block">Monthly Income ($)</label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            required type="number" name="monthlyIncome" value={formData.monthlyIncome} onChange={handleChange}
                                            placeholder="5000" min="0"
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Loan Amount (Conditional styling, always present for simplicity) */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 block">Requested Loan Amount (Optional)</label>
                                    <div className="relative">
                                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="number" name="loanAmount" value={formData.loanAmount} onChange={handleChange}
                                            placeholder="Leave blank if opening an account" min="0" disabled={!formData.accountType.includes('loan')}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all disabled:opacity-50 disabled:bg-gray-100"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-light flex items-center justify-center gap-2 transition-all disabled:opacity-70 shadow-lg shadow-primary/20"
                                >
                                    {isSubmitting ? (
                                        <>Processing Application <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div></>
                                    ) : (
                                        <>Submit Secure Application <Send className="w-5 h-5" /></>
                                    )}
                                </button>
                                <p className="text-xs text-center text-gray-400 mt-4 flex items-center justify-center gap-1">
                                    <Shield className="w-3 h-3" /> Your data is protected by bank-level 256-bit encryption.
                                </p>
                            </div>

                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Application;
