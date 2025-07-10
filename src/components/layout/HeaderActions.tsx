import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  User,
  Sun,
  Moon,
  X,
  BriefcaseBusinessIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

interface HeaderActionsProps {
  cartItems?: any[];
}

export default function HeaderActions({ cartItems = [] }: HeaderActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { isDarkMode, toggleDarkMode } = useTheme();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleActions = () => {
    setIsOpen(!isOpen);
  };

  return (
    <motion.div
      className={`fixed top-2 right-2 sm:top-4 sm:right-4 z-50 ${
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      } border shadow-lg overflow-hidden`}
      initial={{ width: 40, height: 40, borderRadius: 8 }}
      animate={{
        width: isOpen
          ? isMobile
            ? Math.min(320, window.innerWidth - 16)
            : 320
          : isMobile
          ? 40
          : 48,
        height: isOpen
          ? isMobile
            ? Math.min(280, window.innerHeight - 100)
            : 220
          : isMobile
          ? 40
          : 48,
        borderRadius: isOpen ? 12 : 8,
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleActions}
        className={`absolute top-1 right-1 sm:top-2 sm:right-2 z-10 ${
          isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
        } w-8 h-8 sm:w-10 sm:h-10`}
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? (
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          ) : (
            <BriefcaseBusinessIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          )}
        </motion.div>
      </Button>

      {/* Actions Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="p-3 sm:p-4 pt-10 sm:pt-12 w-full h-full overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 h-full">
              {/* Account Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <User className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
                  <span className="text-xs sm:text-sm font-medium">
                    Account
                  </span>
                </div>
                <div className="space-y-1">
                  <Link
                    to="/marketplace/buyer-dashboard"
                    className={`block text-xs ${
                      isDarkMode
                        ? "text-gray-300 hover:text-orange-400"
                        : "text-gray-600 hover:text-green-600"
                    } transition-colors py-1`}
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/marketplace/become-seller"
                    className={`block text-xs ${
                      isDarkMode
                        ? "text-gray-300 hover:text-orange-400"
                        : "text-gray-600 hover:text-green-600"
                    } transition-colors py-1`}
                    onClick={() => setIsOpen(false)}
                  >
                    Become Seller
                  </Link>
                  <button
                    className={`block text-xs ${
                      isDarkMode
                        ? "text-gray-300 hover:text-orange-400"
                        : "text-gray-600 hover:text-green-600"
                    } transition-colors py-1`}
                  >
                    Profile
                  </button>
                </div>
              </motion.div>

              {/* Cart Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <div className="relative">
                    <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
                    {cartItems.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-orange-500 text-white rounded-full w-2.5 h-2.5 sm:w-3 sm:h-3 flex items-center justify-center text-xs">
                        {cartItems.length}
                      </span>
                    )}
                  </div>
                  <span className="text-xs sm:text-sm font-medium">Cart</span>
                </div>
                <div className="text-xs text-gray-500">
                  {cartItems.length === 0
                    ? "Empty cart"
                    : `${cartItems.length} items`}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs w-full"
                  onClick={() => setIsOpen(false)}
                >
                  View Cart
                </Button>
              </motion.div>

              {/* Theme Toggle */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2 mb-2">
                  {isDarkMode ? (
                    <Sun className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
                  ) : (
                    <Moon className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
                  )}
                  <span className="text-xs sm:text-sm font-medium">Theme</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleDarkMode}
                  className="h-6 px-2 text-xs w-full"
                >
                  {isDarkMode ? "Light Mode" : "Dark Mode"}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
