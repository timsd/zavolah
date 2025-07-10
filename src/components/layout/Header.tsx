import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/contexts/ThemeContext";
import HeaderActions from "./HeaderActions";

interface HeaderProps {
  cartItems?: any[];
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  showSearch?: boolean;
}

export default function Header({
  cartItems = [],
  searchQuery = "",
  onSearchChange = () => {},
  showSearch = false,
}: HeaderProps) {
  const { isDarkMode } = useTheme();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={`${
        isDarkMode ? "bg-gray-900" : "bg-gray-100"
      } py-2 sm:py-4 sticky top-0 z-40`}
    >
      <div className="container mx-auto px-3 sm:px-4">
        {/* Top row with logo and mobile menu */}
        <div className="flex items-center justify-between mb-2 sm:mb-0">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden p-1"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Link to="/" className="flex items-center space-x-1 sm:space-x-2">
              <img
                src="/placeholder.svg?text=Logo&width=40&height=40"
                alt="Zavolah Logo"
                className="w-8 h-8 sm:w-10 sm:h-10"
              />
              <span className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-orange-500 to-green-600 bg-clip-text text-transparent">
                Zavolah
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - hidden on mobile */}
          <nav className="hidden sm:block mr-20">
            <ul className="flex space-x-4">
              {[
                { name: "Home", path: "/" },
                { name: "Store", path: "/store" },
                { name: "Academy", path: "/academy" },
                { name: "Services", path: "/services" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`block px-3 py-2 rounded-md transition-colors duration-200 ${
                      isActive(item.path)
                        ? "bg-orange-500 text-white"
                        : `${
                            isDarkMode
                              ? "text-gray-300 hover:text-orange-400"
                              : "text-gray-700 hover:text-green-600"
                          } hover:bg-opacity-10`
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Search Bar - responsive layout */}
        {showSearch && (
          <div className="mt-2 sm:mt-0 sm:absolute sm:left-1/2 sm:transform sm:-translate-x-1/2 sm:top-4 w-full sm:w-96 px-0 sm:px-4">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search products, brands..."
                className="w-full pl-8 sm:pl-10 pr-4 py-1.5 sm:py-2 text-sm"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
              <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>
          </div>
        )}

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div
            className={`sm:hidden mt-3 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } rounded-lg shadow-lg border`}
          >
            <ul className="py-2">
              {[
                { name: "Home", path: "/" },
                { name: "Store", path: "/store" },
                { name: "Academy", path: "/academy" },
                { name: "Services", path: "/services" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-4 py-2 transition-colors duration-200 ${
                      isActive(item.path)
                        ? "bg-orange-500 text-white"
                        : `${
                            isDarkMode
                              ? "text-gray-300 hover:text-orange-400 hover:bg-gray-700"
                              : "text-gray-700 hover:text-green-600 hover:bg-gray-50"
                          }`
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Collapsible Header Actions - Fixed positioned */}
      <HeaderActions cartItems={cartItems} />
    </header>
  );
}
