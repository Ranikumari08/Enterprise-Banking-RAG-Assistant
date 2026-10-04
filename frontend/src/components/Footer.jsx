import React from 'react';
import { Building2, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-primary text-white pt-16 pb-8 border-t border-primary-light">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Col */}
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-6">
                            <div className="bg-white p-2 rounded-lg">
                                <Building2 className="w-6 h-6 text-primary" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-white">Apex Global</span>
                        </Link>
                        <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                            Secure, trusted, and global financial solutions tailored for your success. Empowering your investments every step of the way.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-gray-300 hover:text-accent transition-colors"><Facebook className="w-5 h-5" /></a>
                            <a href="#" className="text-gray-300 hover:text-accent transition-colors"><Twitter className="w-5 h-5" /></a>
                            <a href="#" className="text-gray-300 hover:text-accent transition-colors"><Linkedin className="w-5 h-5" /></a>
                            <a href="#" className="text-gray-300 hover:text-accent transition-colors"><Instagram className="w-5 h-5" /></a>
                        </div>
                    </div>

                    {/* Contact Col */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6 text-white border-b border-primary-light pb-2 inline-block">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-gray-300 text-sm">
                                <Phone className="w-5 h-5 text-accent shrink-0" />
                                <span>+1 800 123 4567<br />+1 800 987 6543</span>
                            </li>
                            <li className="flex items-start gap-3 text-gray-300 text-sm">
                                <Mail className="w-5 h-5 text-accent shrink-0" />
                                <span>support@apexglobalbank.com</span>
                            </li>
                            <li className="flex items-start gap-3 text-gray-300 text-sm">
                                <MapPin className="w-5 h-5 text-accent shrink-0" />
                                <span>123 Financial District,<br />New York, NY 10004</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter Col */}
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-lg font-semibold mb-6 text-white border-b border-primary-light pb-2 inline-block">Subscribe to our newsletter</h3>
                        <p className="text-gray-300 text-sm mb-6">
                            Stay updated with our latest financial insights and service announcements.
                        </p>
                        <form className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="flex-grow px-4 py-3 rounded-md bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                                required
                            />
                            <button type="submit" className="bg-accent text-primary font-semibold px-6 py-3 rounded-md hover:bg-accent-light transition-colors whitespace-nowrap">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
                    <p>© {new Date().getFullYear()} Apex Global Bank. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-accent transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-accent transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
