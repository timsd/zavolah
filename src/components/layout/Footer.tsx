import { Link } from 'react-router-dom';
import {
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  MessageCircle,
  Phone,
  MapPin,
  Mail,
  CreditCard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useAdminSettings } from '../../contexts/AdminSettingsContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function Footer() {
  const { settings } = useAdminSettings();
  const { isDarkMode } = useTheme();
  const [showEmails, setShowEmails] = useState(false);

  const handleEmailToggle = () => {
    if (window.innerWidth < 768) {
      setShowEmails(!showEmails);
    }
  };

  const handleMouseEnter = () => {
    if (window.innerWidth >= 768) {
      setShowEmails(true);
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth >= 768) {
      setShowEmails(false);
    }
  };

  return (
    <footer className={`${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} py-8 mt-auto`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-green-600 bg-clip-text text-transparent">
              Zavolah
            </h3>
            <p className="text-lg italic font-medium">...making a place called HOME</p>
            <p className="mt-4 text-sm opacity-80">
              Leading provider of renewable energy solutions, smart furniture, and construction services.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-2 text-sm">
              <p className="flex items-start">
                <MapPin className="inline-block mr-2 h-4 w-4 mt-1" />
                Market Road, OtaEfun, Osogbo;
              </p>
              <p className="flex items-start">
                <MapPin className="inline-block mr-2 h-4 w-4 mt-1" />
                Salawu Junction, Old Ife Road, Ibadan;
              </p>
              <p className="flex items-start">
                <MapPin className="inline-block mr-2 h-4 w-4 mt-1" />
                Alaba International, Ojo Lagos
              </p>
              <p>
                <a href="tel:+2348066404608" className="hover:underline flex items-center">
                  <Phone className="inline-block mr-2 h-4 w-4" />
                  +234 806 640 4608
                </a>
              </p>
              <p>
                <div
                  className="relative group cursor-pointer"
                  onClick={handleEmailToggle}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="hover:underline flex items-center">
                    <Mail className="inline-block mr-2 h-4 w-4" />
                    contact@zavolah.com
                  </div>
                  {showEmails && (
                    <div className="absolute left-0 top-full mt-2 bg-gray shadow-lg border rounded p-2 space-y-1 z-10 w-64">
                      <a href="mailto:sales@zavolah.com" className="flex items-center hover:underline">
                        <Mail className="inline-block mr-2 h-4 w-4" />
                        Sales: sales@zavolah.com
                      </a>
                      <a href="mailto:careers@zavolah.com" className="flex items-center hover:underline">
                        <Mail className="inline-block mr-2 h-4 w-4" />
                        Careers/Academy: careers@zavolah.com
                      </a>
                    </div>
                  )}
                </div>
              </p>
            </div>
          </div>
    
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {settings.showMarketplace && (
                <li>
                  <Link
                    to="/marketplace"
                    className={`${
                      isDarkMode
                        ? 'text-gray-300 hover:text-orange-400'
                        : 'text-gray-700 hover:text-green-600'
                    } transition-colors duration-200`}
                  >
                    Marketplace
                  </Link>
                </li>
              )}
              {settings.showStaffAccess && (
                <li>
                  <Link
                    to="/staff"
                    className={`${
                      isDarkMode
                        ? 'text-gray-300 hover:text-orange-400'
                        : 'text-gray-700 hover:text-green-600'
                    } transition-colors duration-200`}
                  >
                    Staff Access
                  </Link>
                </li>
              )}
              {settings.showZavCharge && settings.zavChargeEnabled && (
                <li>
                  <Link
                    to="/zavcharge-product"
                    className={`${
                      isDarkMode
                        ? 'text-gray-300 hover:text-orange-400'
                        : 'text-gray-700 hover:text-green-600'
                    } transition-colors duration-200`}
                  >
                    ZavCharge Product
                  </Link>
                </li>
              )}
              {settings.showZavCharge && settings.zavChargeEnabled && (
                <li>
                  <Link
                    to="/zavcharge"
                    className={`${
                      isDarkMode
                        ? 'text-gray-300 hover:text-orange-400'
                        : 'text-gray-700 hover:text-green-600'
                    } transition-colors duration-200`}
                  >
                    ZavCharge Network
                  </Link>
                </li>
              )}
              {settings.showReferEarn && settings.referEarnEnabled && (
                <li>
                  <Link
                    to="/refer-earn"
                    className={`${
                      isDarkMode
                        ? 'text-gray-300 hover:text-orange-400'
                        : 'text-gray-700 hover:text-green-600'
                    } transition-colors duration-200`}
                  >
                    Refer & Earn
                  </Link>
                </li>
              )}
              <li>
                <a
                  href="https://paragraph.xyz/@zavolah"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${
                    isDarkMode
                      ? 'text-gray-300 hover:text-orange-400'
                      : 'text-gray-700 hover:text-green-600'
                  } transition-colors duration-200`}
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="mb-4 text-sm">
              Subscribe to our newsletter for the latest updates and offers
            </p>
            <form className="flex flex-col space-y-2">
              <Input type="email" placeholder="Your email" className="text-sm" />
              <Button type="submit" className="bg-orange-500 hover:bg-green-600 text-white">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Social Media and Footer Bottom */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex space-x-4">
              <a
                href="https://facebook.com/zavolah"
                target="_blank"
                rel="noopener noreferrer"
                className={`${
                  isDarkMode ? 'text-gray-300 hover:text-orange-400' : 'text-gray-700 hover:text-green-600'
                } transition-colors duration-200`}
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="https://x.com/zavolah"
                target="_blank"
                rel="noopener noreferrer"
                className={`${
                  isDarkMode ? 'text-gray-300 hover:text-orange-400' : 'text-gray-700 hover:text-green-600'
                } transition-colors duration-200`}
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://instagram.com/zavolah_hq"
                target="_blank"
                rel="noopener noreferrer"
                className={`${
                  isDarkMode ? 'text-gray-300 hover:text-orange-400' : 'text-gray-700 hover:text-green-600'
                } transition-colors duration-200`}
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="https://linkedin.com/company/zavolah"
                target="_blank"
                rel="noopener noreferrer"
                className={`${
                  isDarkMode ? 'text-gray-300 hover:text-orange-400' : 'text-gray-700 hover:text-green-600'
                } transition-colors duration-200`}
              >
                <Linkedin className="h-6 w-6" />
              </a>
              <a
                href="https://youtube.com/@zavolah"
                target="_blank"
                rel="noopener noreferrer"
                className={`${
                  isDarkMode ? 'text-gray-300 hover:text-orange-400' : 'text-gray-700 hover:text-green-600'
                } transition-colors duration-200`}
              >
                <Youtube className="h-6 w-6" />
              </a>
              <a
                href="#chat"
                className={`${
                  isDarkMode ? 'text-gray-300 hover:text-orange-400' : 'text-gray-700 hover:text-green-600'
                } transition-colors duration-200`}
              >
                <MessageCircle className="h-6 w-6" />
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm">We Accept:</span>
              <CreditCard className="h-6 w-6" />
              <img src="/placeholder.svg?text=Visa&width=40&height=24" alt="Visa" className="h-6" />
              <img src="/placeholder.svg?text=MasterCard&width=40&height=24" alt="MasterCard" className="h-6" />
              <img src="/placeholder.svg?text=PayPal&width=40&height=24" alt="PayPal" className="h-6" />
            </div>
          </div>

          <div className="text-center mt-6">
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              &copy; 💚 Since 2024, Zavolah Limited. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
