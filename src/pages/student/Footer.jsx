import { Instagram, LinkedinIcon, ArrowUpRight, ShieldCheck, Mail, Globe } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AboutUs from "./AboutUs";

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#050505] text-zinc-400 border-t border-zinc-900/50 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* 1. Brand & Trust Section */}
          <div className="space-y-5">
            <h2 className="text-3xl font-black text-white tracking-tighter italic">
              Proxima<span className="text-blue-500">.</span>
            </h2>
            <p className="text-sm leading-relaxed text-zinc-500">
              High-quality digital learning for the next generation of creators and engineers.
            </p>
            <div className="flex gap-3 pt-2">
              <a href="#" className="p-2.5 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:text-blue-400 transition-all">
                <LinkedinIcon size={18} />
              </a>
              <a href="#" className="p-2.5 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:text-pink-400 transition-all">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* 2. Platform (Internal Links) */}
          <div className="space-y-5 md:justify-self-center">
            <h3 className="text-white font-bold text-xs uppercase tracking-[0.2em] opacity-50">Platform</h3>
            <ul className="space-y-3">
              <li>
                <button onClick={() => {window.scrollTo(0, 0); navigate("/about")}} className="text-sm font-medium hover:text-white transition-colors">About Us</button>
              </li>
              <li>
                <button onClick={() => navigate("/contact")} className="text-sm font-medium hover:text-white transition-colors">Contact Us</button>
              </li>
              <li>
                <button onClick={() => navigate("/roadmap-requests")} className="text-sm font-medium hover:text-white transition-colors">Roadmap & Requests</button>
              </li>
            </ul>
          </div>

          {/* 3. Legal & Compliance (Razorpay Mandatory) */}
          <div className="space-y-5 md:justify-self-center">
            <h3 className="text-white font-bold text-xs uppercase tracking-[0.2em] opacity-50 text-blue-500/80">Legal Policy</h3>
            <ul className="space-y-3">
              <li>
                <button onClick={() => navigate("/privacy-policy")} className="text-sm font-medium hover:text-white transition-colors">Privacy Policy</button>
              </li>
              <li>
                <button onClick={() => navigate("/terms-conditions")} className="text-sm font-medium hover:text-white transition-colors">Terms & Conditions</button>
              </li>
              <li>
                <button onClick={() => navigate("/refund-policy")} className="text-sm font-medium hover:text-white transition-colors">Refund & Cancellation</button>
              </li>
            </ul>
          </div>

          {/* 4. Quick Contact (Trust Signal) */}
          <div className="space-y-5 md:justify-self-end">
            <h3 className="text-white font-bold text-xs uppercase tracking-[0.2em] opacity-50">Secure Payment</h3>
            <div className="space-y-4">
               <div className="flex items-center gap-3 text-xs text-zinc-500">
                  <ShieldCheck size={16} className="text-green-500" />
                  <span>SSL Encrypted Checkout</span>
               </div>
               <div className="flex items-center gap-3 text-xs text-zinc-500">
                  <Mail size={16} className="text-blue-500" />
                  <span>proximahello@gmail.com</span>
               </div>
               {/* Razorpay Trust Badge or Payment Icons can go here */}
               <div className="pt-2 opacity-50 grayscale hover:grayscale-0 transition-all">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" alt="Razorpay" className="h-4" />
               </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-900/50 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-[11px] font-medium tracking-wide text-zinc-600">
            © {currentYear} <span className="text-zinc-300">Proxima Inc.</span> All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-[10px] text-zinc-500 bg-zinc-900/30 px-3 py-1 rounded-full border border-zinc-800">
             <Globe size={12} />
             <span>Designed for Global Learning</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;