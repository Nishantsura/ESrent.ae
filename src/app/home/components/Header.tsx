import { Home, Car, Building2, Grid3X3, HelpCircle, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { NavBar } from '@/components/ui/tubelight-navbar';

export function Header() {
  // Nav items for center nav only (exclude Quick Book)
  const navItems = [
    { name: 'Home', url: '/', icon: Home },
    { name: 'Cars', url: '/cars', icon: Car },
    { name: 'Brands', url: '/brands', icon: Building2 },
    { name: 'Categories', url: '/categories', icon: Grid3X3 },
    { name: 'FAQ', url: '/faq', icon: HelpCircle },
  ];

  return (
    <>
      {/* Top Navbar: Logo | Nav | Quick Book */}
      <header className="w-full bg-background/80 backdrop-blur-lg border-b border-border h-24 text-foreground">
        <div className="relative w-full max-w-7xl mx-auto h-24">
          {/* Logo left */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Link href="/">
              <img
                src="/images/ES logo (1).svg"
                alt="AutoLuxe Logo"
                className="w-20 h-20 sm:w-24 sm:h-24"
                style={{ 
                  minWidth: '80px', 
                  minHeight: '80px',
                  filter: 'invert(100%)' 
                }}
              />
            </Link>
          </div>

          {/* Centered NavBar */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <NavBar items={navItems} className="static mb-0 text-foreground" />
          </div>

          {/* Quick Book Button right */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <a
              href="https://wa.me/971553553626"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-secondary hover:bg-secondary/80 text-black font-semibold shadow transition-colors text-base"
              style={{ boxShadow: '0 2px 16px 0 rgba(65, 205, 173, 0.15)' }}
            >
              <MessageCircle size={22} className="text-black" />
              <span className="hidden sm:inline">Quick Book</span>
            </a>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden">
        <NavBar items={navItems} />
      </div>
    </>
  );
}
