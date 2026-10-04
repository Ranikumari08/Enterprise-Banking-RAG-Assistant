import React from 'react';
import { ArrowRight, ShieldCheck, Clock, BrainCircuit, Users, Building, Laptop, ChevronRight, ChevronLeft, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import ServiceCard from '../components/ServiceCard';

const Home = () => {
    return (
        <div className="pt-20">
            {/* Hero Section */}
            <section className="relative overflow-hidden min-h-[90vh] flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid md:grid-cols-2 gap-12 items-center">
                    <div className="animate-in slide-in-from-left duration-700">
                        <h1 className="text-5xl md:text-6xl font-extrabold text-primary leading-tight mb-6">
                            The right <span className="text-accent underline decoration-4 underline-offset-8">decision</span><br />
                            at the right time.
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-lg leading-relaxed">
                            Welcome to Apex Global Bank.<br />
                            Secure. Trusted. Global.<br />
                            We provide awesome services, it's here.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/apply" className="btn-primary flex items-center gap-2 group">
                                Apply Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/#services" className="btn-secondary">
                                Explore Services
                            </Link>
                        </div>
                    </div>
                    <div className="hidden md:block relative animate-in slide-in-from-right duration-700 delay-150">
                        {/* Abstract illustration representation */}
                        <div className="relative w-full aspect-square max-w-md mx-auto">
                            <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl"></div>
                            <img
                                src="https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                alt="Professional Workspace"
                                className="rounded-2xl shadow-2xl relative z-10 object-cover w-full h-full border-4 border-white"
                            />
                            {/* Floating badges equivalent to screenshot */}
                            <div className="absolute top-10 -left-10 bg-white p-4 rounded-xl shadow-xl z-20 animate-bounce" style={{ animationDuration: '3s' }}>
                                <div className="flex items-center gap-3">
                                    <div className="bg-green-100 p-2 rounded-lg text-green-600"><Building className="w-5 h-5" /></div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Home Loan</p>
                                        <p className="font-bold text-primary">9.35%</p>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute bottom-20 -right-5 bg-white p-4 rounded-xl shadow-xl z-20 animate-bounce" style={{ animationDuration: '4s' }}>
                                <div className="flex items-center gap-3">
                                    <div className="bg-accent/20 p-2 rounded-lg text-accent-dark"><ShieldCheck className="w-5 h-5" /></div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Secure Banking</p>
                                        <p className="font-bold text-primary">100% Protected</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats / Application Process Overview */}
            <section className="bg-white py-16 border-y border-gray-100 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="heading-md mb-4">Fast and very easy application process here</h2>
                        <p className="text-body max-w-2xl mx-auto">Follow our simple 3-step process to get started with your financial journey.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
                        <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-gray-100 -z-10 -translate-y-1/2"></div>

                        {[
                            { num: "01", title: "Apply Bank Loan", desc: "Fill out our secured online form in just 5 mins." },
                            { num: "02", title: "Approved Bank Loan", desc: "Our global team evaluates and approves instantly." },
                            { num: "03", title: "Get Your Loan", desc: "Funds transferred directly to your secure account." }
                        ].map((step, i) => (
                            <div key={i} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-50 text-center relative card-hover">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-2xl mx-auto mb-6">
                                    {step.num}
                                </div>
                                <h3 className="text-lg font-bold text-primary mb-2">{step.title}</h3>
                                <p className="text-sm text-gray-500">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="py-24 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div className="max-w-2xl">
                            <span className="text-accent font-semibold tracking-wider uppercase text-sm mb-2 block">Our Expertise</span>
                            <h2 className="text-4xl font-bold text-primary mb-4">Financial Solutions</h2>
                            <p className="text-gray-600 text-lg">We provide awesome services, tailored exactly to your financial aspirations.</p>
                        </div>
                        <Link to="/apply" className="btn-secondary whitespace-nowrap hidden md:inline-flex">View All Services</Link>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <ServiceCard
                            icon={<Users className="w-8 h-8" />}
                            title="Personal Banking"
                            description="High-yield savings, checking accounts, and premium credit cards designed for your lifestyle."
                            badge="Popular"
                        />
                        <ServiceCard
                            icon={<Building className="w-8 h-8" />}
                            title="Home & Business Loans"
                            description="Competitive rates for mortgages, commercial real estate, and enterprise expansion capital."
                            badge="Lowest Rates"
                        />
                        <ServiceCard
                            icon={<ShieldCheck className="w-8 h-8" />}
                            title="Insurance & Investments"
                            description="Secure your future with our wealth management and comprehensive global insurance fleets."
                        />
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="bg-primary pt-24 pb-32 text-white relative overflow-hidden">
                {/* Subtle background pattern */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-4xl font-bold mb-6">Our manager will contact you to clear the details.</h2>
                            <p className="text-gray-300 mb-8 text-lg">Leave the complexity securely to us. We combine human expertise with our customized AI Assistant to give you the exact banking experience you deserve.</p>

                            <ul className="space-y-6 mb-10">
                                <li className="flex items-center gap-4">
                                    <div className="bg-accent/20 p-2 rounded-full text-accent"><ShieldCheck className="w-6 h-6" /></div>
                                    <span className="text-lg font-medium">Secure Transactions</span>
                                </li>
                                <li className="flex items-center gap-4">
                                    <div className="bg-accent/20 p-2 rounded-full text-accent"><Clock className="w-6 h-6" /></div>
                                    <span className="text-lg font-medium">24/7 Global Support</span>
                                </li>
                                <li className="flex items-center gap-4">
                                    <div className="bg-accent/20 p-2 rounded-full text-accent"><BrainCircuit className="w-6 h-6" /></div>
                                    <span className="text-lg font-medium">AI-Powered Banking Assistance</span>
                                </li>
                            </ul>

                            <Link to="/about" className="bg-accent text-primary px-8 py-4 rounded-md font-bold hover:bg-accent-light transition-colors inline-block">
                                Learn More About Us
                            </Link>
                        </div>

                        <div className="relative justify-self-center lg:justify-self-end w-full max-w-md">
                            <div className="aspect-square bg-gradient-to-br from-primary-light to-primary rounded-3xl overflow-hidden shadow-2xl shadow-primary-dark border border-white/10 relative">
                                <img
                                    src="https://images.unsplash.com/photo-1556761175-5973ecc0f329?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                    className="w-full h-full object-cover mix-blend-overlay opacity-80"
                                    alt="Customer Support"
                                />
                                <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xl font-bold">28.6%</span>
                                        <span className="bg-green-500 w-2 h-2 rounded-full animate-pulse"></span>
                                    </div>
                                    <p className="text-sm text-gray-300">Growth in client satisfaction via our new Chatbot Integration.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-24 bg-background relative -mt-10 rounded-t-[3rem] z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-accent font-semibold tracking-wider uppercase text-sm mb-2 block">Leadership</span>
                        <h2 className="text-4xl font-bold text-primary mb-4">Expert team members</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">Meet the global minds powering Apex Global Bank's secure foundation.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
                        {[
                            { name: "Richard Wright", role: "Chief Executive Officer", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
                            { name: "Sarah Jenkins", role: "Chief Financial Officer", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
                            { name: "Michael Chen", role: "Head of Operations", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" }
                        ].map((member, i) => (
                            <div key={i} className="group text-center">
                                <div className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white shadow-xl group-hover:-translate-y-2 transition-transform duration-300 bg-primary-light">
                                    <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                                </div>
                                <h3 className="text-xl font-bold text-primary">{member.name}</h3>
                                <p className="text-accent font-medium mt-1">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-primary mb-4">How to say our most honorable customer</h2>
                        <p className="text-gray-600">The trust we share reflects the security we build.</p>
                    </div>

                    <div className="max-w-4xl mx-auto bg-primary rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row shadow-primary/20">
                        <div className="md:w-1/2 p-12 text-white relative">
                            <Quote className="absolute top-8 left-8 w-20 h-20 text-white/10" />
                            <div className="relative z-10">
                                <p className="text-xl leading-relaxed italic mb-8">"Apex Global Bank helped scale our enterprise operations worldwide. Their AI Assistant answers my secure finance questions accurately at 3 AM. Completely unparalleled service."</p>
                                <div>
                                    <h4 className="font-bold text-lg">David Mitchell</h4>
                                    <p className="text-accent text-sm">CEO of TechFirm Global</p>
                                </div>
                                <div className="flex gap-4 mt-8">
                                    <button className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white hover:text-primary transition-colors"><ChevronLeft className="w-5 h-5" /></button>
                                    <button className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white hover:text-primary transition-colors"><ChevronRight className="w-5 h-5" /></button>
                                </div>
                            </div>
                        </div>
                        <div className="md:w-1/2 bg-gray-100 min-h-[300px]">
                            <img src="https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Customer" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
