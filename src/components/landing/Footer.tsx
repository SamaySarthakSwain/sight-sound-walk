import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Instagram, Facebook, Linkedin } from "lucide-react"; 
import { toast } from "sonner";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }
    toast.success("Subscribed successfully! Check your inbox.");
    setEmail("");
  };

  const handleComingSoon = (e: React.MouseEvent) => {
    e.preventDefault();
    toast.info("This feature is coming soon!");
  };

  return (
    <footer className="relative bg-card dark:bg-[#0a0a0c] text-foreground dark:text-white pt-24 pb-12 overflow-hidden mt-20 border-t border-border/40 dark:border-none">
      {/* Curved top edge using SVG */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180">
        <svg
          className="relative block w-[calc(100%+1.3px)] h-[80px] md:h-[120px]"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="fill-background"
          ></path>
        </svg>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-16">
          
          {/* Column 1 */}
          <div className="flex flex-col space-y-3">
            <h4 className="font-semibold text-sm mb-2 text-foreground/90 dark:text-white/90">Explore</h4>
            <Link to="/explore" className="text-muted-foreground hover:text-foreground dark:text-white/70 dark:hover:text-white text-sm transition-colors">Destinations</Link>
            <Link to="/flash" className="text-muted-foreground hover:text-foreground dark:text-white/70 dark:hover:text-white text-sm transition-colors">Flashcards</Link>
            <Link to="/ar" className="text-muted-foreground hover:text-foreground dark:text-white/70 dark:hover:text-white text-sm transition-colors">AR Experience</Link>
            <Link to="/crowd" className="text-muted-foreground hover:text-foreground dark:text-white/70 dark:hover:text-white text-sm transition-colors">Live Crowd</Link>
            <Link to="/food" className="text-muted-foreground hover:text-foreground dark:text-white/70 dark:hover:text-white text-sm transition-colors">Food Trails</Link>
            <Link to="/hotels" className="text-muted-foreground hover:text-foreground dark:text-white/70 dark:hover:text-white text-sm transition-colors">Hotels</Link>
            <Link to="/cabs" className="text-muted-foreground hover:text-foreground dark:text-white/70 dark:hover:text-white text-sm transition-colors">Cabs</Link>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col space-y-3">
            <h4 className="font-semibold text-sm mb-2 text-foreground/90 dark:text-white/90">Learn</h4>
            <a href="#" onClick={handleComingSoon} className="text-muted-foreground hover:text-foreground dark:text-white/70 dark:hover:text-white text-sm transition-colors">Our Story</a>
            <a href="#" onClick={handleComingSoon} className="text-muted-foreground hover:text-foreground dark:text-white/70 dark:hover:text-white text-sm transition-colors">Blog</a>
            <a href="#" onClick={handleComingSoon} className="text-muted-foreground hover:text-foreground dark:text-white/70 dark:hover:text-white text-sm transition-colors">Heritage Context</a>
            <a href="#" onClick={handleComingSoon} className="text-muted-foreground hover:text-foreground dark:text-white/70 dark:hover:text-white text-sm transition-colors">Sustainability</a>
            <a href="#" onClick={handleComingSoon} className="text-muted-foreground hover:text-foreground dark:text-white/70 dark:hover:text-white text-sm transition-colors">Artisan Network</a>
            <a href="#" onClick={handleComingSoon} className="text-muted-foreground hover:text-foreground dark:text-white/70 dark:hover:text-white text-sm transition-colors">Quality & Safety</a>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col space-y-3">
            <h4 className="font-semibold text-sm mb-2 text-foreground/90 dark:text-white/90">Help</h4>
            <Link to="/help" className="text-muted-foreground hover:text-foreground dark:text-white/70 dark:hover:text-white text-sm transition-colors">FAQ</Link>
            <a href="#" onClick={handleComingSoon} className="text-muted-foreground hover:text-foreground dark:text-white/70 dark:hover:text-white text-sm transition-colors">Contact Us</a>
            <a href="#" onClick={handleComingSoon} className="text-muted-foreground hover:text-foreground dark:text-white/70 dark:hover:text-white text-sm transition-colors">Accessibility</a>
            <a href="#" onClick={handleComingSoon} className="text-muted-foreground hover:text-foreground dark:text-white/70 dark:hover:text-white text-sm transition-colors">Satisfaction Guarantee</a>
            <a href="#" onClick={handleComingSoon} className="text-muted-foreground hover:text-foreground dark:text-white/70 dark:hover:text-white text-sm transition-colors">Manage Bookings</a>
          </div>

          {/* Column 4 */}
          <div className="flex flex-col space-y-3">
            <h4 className="font-semibold text-sm mb-2 text-foreground/90 dark:text-white/90">Lets Explore</h4>
            <Link to="/profile" className="text-muted-foreground hover:text-foreground dark:text-white/70 dark:hover:text-white text-sm transition-colors">My Account</Link>
            <a href="#" onClick={handleComingSoon} className="text-muted-foreground hover:text-foreground dark:text-white/70 dark:hover:text-white text-sm transition-colors">Travel Agent Line</a>
            <a href="#" onClick={handleComingSoon} className="text-muted-foreground hover:text-foreground dark:text-white/70 dark:hover:text-white text-sm transition-colors">Press</a>
            <a href="#" onClick={handleComingSoon} className="text-muted-foreground hover:text-foreground dark:text-white/70 dark:hover:text-white text-sm transition-colors">Careers</a>
            <a href="#" onClick={handleComingSoon} className="text-muted-foreground hover:text-foreground dark:text-white/70 dark:hover:text-white text-sm transition-colors">Affiliate Program</a>
            <a href="#" onClick={handleComingSoon} className="text-muted-foreground hover:text-foreground dark:text-white/70 dark:hover:text-white text-sm transition-colors">Guide Program</a>
          </div>

          {/* Newsletter Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 flex flex-col items-start lg:items-end w-full mt-6 lg:mt-0">
            <h4 className="font-medium text-sm mb-4 text-foreground dark:text-white text-left lg:text-right w-full">
              Sign up to get 15% off your first guided tour
            </h4>
            <form onSubmit={handleSubscribe} className="flex w-full max-w-sm flex-col sm:flex-row gap-2 sm:gap-3">
              <Input
                type="email"
                placeholder="Your Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-muted dark:bg-white text-foreground dark:text-black border-none rounded-full h-11 px-5 w-full focus-visible:ring-2 focus-visible:ring-amber-400"
              />
              <Button type="submit" className="bg-amber-400 hover:bg-amber-500 text-black font-semibold rounded-full h-11 px-6 whitespace-nowrap">
                Subscribe
              </Button>
            </form>
            
            <div className="flex items-center gap-5 mt-8 w-full justify-start lg:justify-end text-muted-foreground dark:text-white/80">
              <a href="#" onClick={handleComingSoon} className="hover:text-foreground dark:hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" onClick={handleComingSoon} className="hover:text-foreground dark:hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" onClick={handleComingSoon} className="hover:text-foreground dark:hover:text-white transition-colors">
                {/* Custom X / Twitter SVG */}
                <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4 fill-current">
                  <g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.007 4.25H5.078z"></path></g>
                </svg>
              </a>
              <a href="#" onClick={handleComingSoon} className="hover:text-foreground dark:hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
              <a href="#" onClick={handleComingSoon} className="hover:text-foreground dark:hover:text-white transition-colors">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.624 0 12.017 0z"/></svg>
              </a>
              <a href="#" onClick={handleComingSoon} className="hover:text-foreground dark:hover:text-white transition-colors">
                {/* Custom TikTok SVG */}
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
              </a>
            </div>
            
            {/* Trust Badge Placeholder */}
            <div className="mt-8 flex justify-start lg:justify-end w-full">
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-medium text-muted-foreground dark:text-white/80 mb-1">Certified</span>
                <div className="w-12 h-12 border-2 border-muted-foreground dark:border-white/80 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-muted-foreground dark:text-white/80">B</span>
                </div>
                <span className="text-[8px] mt-1 text-muted-foreground dark:text-white/80">Corporation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border dark:border-white/10 text-xs text-muted-foreground dark:text-white/60 gap-4">
          <p>© {new Date().getFullYear()} Lets Explore, Inc. All Rights Reserved</p>
          <div className="flex gap-4 md:gap-6">
            <a href="#" onClick={handleComingSoon} className="hover:text-foreground dark:hover:text-white transition-colors">Terms of Service</a>
            <a href="#" onClick={handleComingSoon} className="hover:text-foreground dark:hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" onClick={handleComingSoon} className="hover:text-foreground dark:hover:text-white transition-colors">Do Not Sell My Information</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
