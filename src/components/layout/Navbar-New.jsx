import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { TubelightNavbar } from "@/components/ui/tubelight-navbar";
import { 
  BarChart3, 
  CreditCard, 
  PieChart, 
  Target, 
  TrendingUp, 
  FileText, 
  GraduationCap,
  Menu,
  X,
  User,
  LogOut
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, signOut } = useAuth();

  // Navigation items for Tubelight Navbar
  const navItems = [
    { name: "Dashboard", url: "/dashboard", icon: BarChart3 },
    { name: "Expenses", url: "/expenses", icon: CreditCard },
    { name: "Loan", url: "/loan-analyzer", icon: PieChart },
    { name: "Goals", url: "/goals", icon: Target },
    { name: "Stocks", url: "/stocks", icon: TrendingUp },
    { name: "Reports", url: "/reports", icon: FileText },
    { name: "Learn", url: "/learn", icon: GraduationCap },
  ];

  const isActive = (href) => location.pathname === href;

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <>
      {/* Desktop & Mobile: Tubelight Animated Navbar */}
      <TubelightNavbar items={navItems} />

      {/* Top Bar with Logo and User Menu (Desktop Only) */}
      <nav className="hidden md:block bg-card/80 backdrop-blur-md border-b border-border shadow-sm relative z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-success rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">Finatics.AI</span>
            </Link>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{user?.user_metadata?.full_name || user?.email || 'User'}</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="outline" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="sm" className="bg-gradient-to-r from-primary to-success">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile: Top Bar with Logo and Hamburger Menu */}
      <nav className="md:hidden bg-card/80 backdrop-blur-md border-b border-border shadow-sm relative z-40">
        <div className="px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-success rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">Finatics.AI</span>
            </Link>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="border-t border-border mt-2 pt-2 pb-4">
              <div className="mt-4 pt-4 space-y-2">
                <div className="flex justify-center mb-3">
                  <ThemeToggle />
                </div>
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 px-3 py-2 text-sm">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">{user?.user_metadata?.full_name || user?.email || 'User'}</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <>
                    <Link to="/login" className="block">
                      <Button variant="outline" size="sm" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/login" className="block">
                      <Button size="sm" className="w-full bg-gradient-to-r from-primary to-success">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-16 md:h-[88px]" />
    </>
  );
};

export default Navbar;
