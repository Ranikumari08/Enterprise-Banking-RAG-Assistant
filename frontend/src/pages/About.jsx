import React from 'react';
import { Target, Eye, Shield, Users, Globe2, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
    return (
        <div className="pt-20">
            {/* Page Header */}
            <section className="bg-primary pt-24 pb-20 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-6">About Apex Global</h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        Leading the financial revolution with secure, trusted, and globally accessible banking solutions.
                    </p>
                </div>
            </section>

            {/* Company Overview */}
            <section className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-16 items-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/5 rounded-3xl transform -rotate-3 scale-105"></div>
                        <img
                            src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                            alt="Apex Office"
                            className="rounded-3xl shadow-xl relative z-10"
                        />
                    </div>
                    <div>
                        <span className="text-accent font-semibold tracking-wider uppercase text-sm mb-2 block">Our History</span>
                        <h2 className="text-4xl font-bold text-primary mb-6">Banking excellence since 1995</h2>
                        <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                            For over two decades, Apex Global Bank has stood as a pillar of financial stability and innovation. We combine traditional institutional security with cutting-edge AI technology to provide our clients with an unparalleled banking experience.
                        </p>
                        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                            We manage over $50B in assets globally, ensuring that whether you are opening your first savings account or scaling a multinational enterprise, your capital is protected and primed for growth.
                        </p>
                        <div className="grid grid-cols-2 gap-6 border-t border-gray-100 pt-8">
                            <div>
                                <h4 className="text-4xl font-bold text-primary mb-2">2M+</h4>
                                <p className="text-gray-500 font-medium">Global Customers</p>
                            </div>
                            <div>
                                <h4 className="text-4xl font-bold text-primary mb-2">150+</h4>
                                <p className="text-gray-500 font-medium">Countries Served</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-24 bg-background border-y border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 card-hover">
                            <div className="w-14 h-14 bg-accent/20 rounded-xl flex items-center justify-center text-accent-light mb-6">
                                <Target className="w-8 h-8 text-accent-dark" />
                            </div>
                            <h3 className="text-2xl font-bold text-primary mb-4">Our Mission</h3>
                            <p className="text-gray-600 leading-relaxed">
                                To empower individuals and businesses worldwide by providing transparent, secure, and highly efficient financial instruments backed by state-of-the-art technological infrastructure.
                            </p>
                        </div>
                        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 card-hover">
                            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                                <Eye className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-primary mb-4">Our Vision</h3>
                            <p className="text-gray-600 leading-relaxed">
                                To become the world's most trusted digital-first banking institution, where artificial intelligence and human expertise seamlessly converge to deliver perfect financial guidance.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="text-accent font-semibold tracking-wider uppercase text-sm mb-2 block">What Drives Us</span>
                    <h2 className="text-4xl font-bold text-primary mb-16">Our Core Values</h2>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: <Shield className="w-6 h-6" />, title: "Uncompromising Security", desc: "Military-grade encryption for every transaction." },
                            { icon: <Users className="w-6 h-6" />, title: "Client First", desc: "Your financial health is our solitary metric for success." },
                            { icon: <Globe2 className="w-6 h-6" />, title: "Global Perspective", desc: "Borderless banking for an interconnected world economy." },
                            { icon: <Briefcase className="w-6 h-6" />, title: "Absolute Integrity", desc: "Transparent fees and honest advice, always." }
                        ].map((val, i) => (
                            <div key={i} className="p-6">
                                <div className="w-12 h-12 mx-auto bg-primary/5 rounded-full flex items-center justify-center text-primary mb-4">
                                    {val.icon}
                                </div>
                                <h4 className="text-lg font-bold text-primary mb-2">{val.title}</h4>
                                <p className="text-gray-500 text-sm">{val.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-primary py-20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-4xl font-bold text-white mb-6">Ready to secure your financial future?</h2>
                    <p className="text-xl text-gray-300 mb-10">Join millions of satisfied customers experiencing the Apex Global difference.</p>
                    <Link to="/apply" className="bg-accent text-primary px-10 py-4 rounded-md font-bold text-lg hover:bg-accent-light transition-colors inline-flex items-center gap-2 shadow-xl shadow-accent/20">
                        Start Banking With Us <Target className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default About;
