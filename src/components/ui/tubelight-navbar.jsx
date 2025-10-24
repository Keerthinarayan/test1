import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

/**
 * Tubelight Navbar Component
 * 
 * A modern animated navbar with a "tubelight" effect that follows the active tab.
 * Features:
 * - Smooth animated highlight with glowing effect
 * - Responsive: Shows text on desktop, icons on mobile
 * - Fixed position at bottom on mobile, top on desktop
 * - Backdrop blur with glass morphism effect
 * 
 * @param {Object} props
 * @param {Array<{name: string, url: string, icon: LucideIcon}>} props.items - Navigation items
 * @param {string} props.className - Additional CSS classes
 */
export function TubelightNavbar({ items, className }) {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(items[0]?.name);
  const [isMobile, setIsMobile] = useState(false);

  // Separate main navigation items from profile/signout items
  const mainNavItems = items.filter(item => !item.isButton);
  const userActionItems = items.filter(item => item.isButton);

  // Set active tab based on current route
  useEffect(() => {
    const currentItem = items.find(item => item.url === location.pathname);
    if (currentItem) {
      setActiveTab(currentItem.name);
    }
  }, [location.pathname, items]);

  // Detect mobile viewport
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={cn(
        "fixed bottom-0 sm:top-0 left-0 right-0 z-50",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3 bg-slate-900/95 border-b border-slate-700/50 backdrop-blur-lg py-3 px-6 shadow-lg">
        {/* Finatics.AI Logo and Text - Clickable */}
        <RouterLink to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-success rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="M3 3v18h18"/>
              <path d="m19 9-5 5-4-4-3 3"/>
            </svg>
          </div>
          <span className="text-xl font-bold text-white hidden sm:inline">Finatics.AI</span>
        </RouterLink>

        {/* Main Navigation Items - Center */}
        <div className="flex items-center gap-2 flex-1 justify-center">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;

          return (
            <RouterLink
              key={item.name}
              to={item.url}
              onClick={() => setActiveTab(item.name)}
              className={cn(
                "relative cursor-pointer text-sm font-semibold px-4 py-2 rounded-full transition-colors",
                "text-white/80 hover:text-primary",
                isActive && "bg-primary/10 text-primary"
              )}
            >
              <span className="hidden md:inline">{item.name}</span>
              <span className="md:hidden">
                <Icon size={18} strokeWidth={2.5} />
              </span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-primary/5 rounded-full -z-10"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full">
                    <div className="absolute w-12 h-6 bg-primary/20 rounded-full blur-md -top-2 -left-2" />
                    <div className="absolute w-8 h-6 bg-primary/20 rounded-full blur-md -top-1" />
                    <div className="absolute w-4 h-4 bg-primary/20 rounded-full blur-sm top-0 left-2" />
                  </div>
                </motion.div>
              )}
            </RouterLink>
          );
        })}
        </div>

        {/* Profile and Sign Out - Right Side */}
        <div className="flex items-center gap-2">
        {userActionItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;

          // Handle items with custom onClick (like Sign Out)
          if (item.onClick) {
            return (
              <button
                key={item.name}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab(item.name);
                  item.onClick();
                }}
                className={cn(
                  "relative cursor-pointer text-sm font-semibold px-4 py-2 rounded-full transition-colors",
                  item.name === "Sign Out" 
                    ? "text-red-400 hover:text-red-300"
                    : "text-white/80 hover:text-primary",
                  isActive && "bg-primary/10"
                )}
              >
                <span className="hidden md:inline">{item.name}</span>
                <span className="md:hidden">
                  <Icon size={18} strokeWidth={2.5} />
                </span>
                {isActive && (
                  <motion.div
                    layoutId="lamp"
                    className="absolute inset-0 w-full bg-primary/5 rounded-full -z-10"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  >
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full">
                      <div className="absolute w-12 h-6 bg-primary/20 rounded-full blur-md -top-2 -left-2" />
                      <div className="absolute w-8 h-6 bg-primary/20 rounded-full blur-md -top-1" />
                      <div className="absolute w-4 h-4 bg-primary/20 rounded-full blur-sm top-0 left-2" />
                    </div>
                  </motion.div>
                )}
              </button>
            );
          }

          return (
            <RouterLink
              key={item.name}
              to={item.url}
              onClick={() => setActiveTab(item.name)}
              className={cn(
                "relative cursor-pointer text-sm font-semibold px-4 py-2 rounded-full transition-colors",
                item.name === "Profile" || (item.isButton && item.name !== "Sign Out")
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-white/80 hover:text-primary",
                isActive && "bg-primary/10 text-primary"
              )}
            >
              <span className="hidden md:inline">{item.name}</span>
              <span className="md:hidden">
                <Icon size={18} strokeWidth={2.5} />
              </span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-primary/5 rounded-full -z-10"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full">
                    <div className="absolute w-12 h-6 bg-primary/20 rounded-full blur-md -top-2 -left-2" />
                    <div className="absolute w-8 h-6 bg-primary/20 rounded-full blur-md -top-1" />
                    <div className="absolute w-4 h-4 bg-primary/20 rounded-full blur-sm top-0 left-2" />
                  </div>
                </motion.div>
              )}
            </RouterLink>
          );
        })}
        </div>
      </div>
    </div>
  );
}
