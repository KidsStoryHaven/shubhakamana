import React from 'react';
import { Mail, ShieldCheck, Info, FileText, Heart, Globe, Sun } from 'lucide-react';
import { getAllCategories } from '../data/wishesData';

interface SiteFooterProps {
  onNavigateToPath: (path: string) => void;
}

export const SiteFooter: React.FC<SiteFooterProps> = ({ onNavigateToPath }) => {
  const categories = getAllCategories();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-14 border-t border-amber-500/20 bg-stone-950/95 py-10 px-4 sm:px-6 lg:px-8 text-stone-300">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Section: Brand Info + Primary Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Brand & Mission (Col 1-5) */}
          <div className="md:col-span-5 space-y-3">
            <button
              onClick={() => onNavigateToPath('/')}
              className="text-left focus:outline-none cursor-pointer block"
              title="Shubhakamna.in Homepage"
            >
              <img 
                src="/logo.svg" 
                alt="Shubhakamna - Festival Wishes" 
                className="h-10 sm:h-12 w-auto max-w-[240px] object-contain drop-shadow-[0_2px_8px_rgba(245,158,11,0.2)] mb-2"
              />
            </button>
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-md">
              Shubhakamna.in is an independent platform dedicated to sharing heartfelt festival wishes, relationship greetings, Hindu Panchang, and auspicious timings to help you celebrate every festive milestone.
            </p>
            <div className="pt-1 flex items-center gap-2 text-xs text-amber-300">
              <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Contact Email: </span>
              <a 
                href="mailto:mthawkar72@gmail.com" 
                className="font-mono text-amber-300 hover:text-white underline font-semibold"
              >
                mthawkar72@gmail.com
              </a>
            </div>
          </div>

          {/* Quick Links: Trust & Legal Pages (Col 6-8) */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
              Company & Legal
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a
                  href="/shubh-prabhat/"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigateToPath('/shubh-prabhat/');
                  }}
                  className="text-amber-400 hover:text-amber-300 font-bold transition-colors flex items-center gap-1.5"
                >
                  <Sun className="w-3.5 h-3.5 text-yellow-400" />
                  <span>🌅 शुभ प्रभात (Daily 100 Suvichar)</span>
                </a>
              </li>
              <li>
                <a
                  href="/about/"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigateToPath('/about/');
                  }}
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
                >
                  <Info className="w-3.5 h-3.5 text-amber-400" />
                  <span>About Us</span>
                </a>
              </li>
              <li>
                <a
                  href="/privacy-policy/"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigateToPath('/privacy-policy/');
                  }}
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Privacy Policy</span>
                </a>
              </li>
              <li>
                <a
                  href="/contact/"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigateToPath('/contact/');
                  }}
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>Contact Us</span>
                </a>
              </li>
              <li className="pt-2">
                <a
                  href="https://whatsapp.com/channel/0029VbCzmQCHrDZfjZlBGR3U"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 font-bold text-xs transition shadow-md"
                >
                  <span>🟢 WhatsApp चैनल</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Popular Wishing Categories (Col 9-12) */}
          <div className="md:col-span-4 space-y-3">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
              Popular Wishing Hubs
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {categories.slice(0, 6).map(cat => (
                <a
                  key={cat.slug}
                  href={`/${cat.slug}/`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigateToPath(`/${cat.slug}/`);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 text-[11px] text-stone-300 hover:text-amber-300 transition"
                >
                  {cat.theme.accentEmoji} {cat.nameHi}
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright + Sitemap + Robots */}
        <div className="border-t border-stone-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 text-center sm:text-left">
          <div>
            © {currentYear} Shubhakamna.in · All rights reserved. Independently operated.
          </div>

          <div className="flex items-center gap-4 text-stone-400 text-[11px]">
            <a 
              href="/about/" 
              onClick={(e) => { e.preventDefault(); onNavigateToPath('/about/'); }} 
              className="hover:text-amber-300"
            >
              About Us
            </a>
            <span>·</span>
            <a 
              href="/privacy-policy/" 
              onClick={(e) => { e.preventDefault(); onNavigateToPath('/privacy-policy/'); }} 
              className="hover:text-amber-300"
            >
              Privacy Policy
            </a>
            <span>·</span>
            <a 
              href="/contact/" 
              onClick={(e) => { e.preventDefault(); onNavigateToPath('/contact/'); }} 
              className="hover:text-amber-300"
            >
              Contact Us
            </a>
            <span>·</span>
            <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="hover:text-amber-300">
              Sitemap.xml
            </a>
            <span>·</span>
            <a href="/robots.txt" target="_blank" rel="noopener noreferrer" className="hover:text-amber-300">
              Robots.txt
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
