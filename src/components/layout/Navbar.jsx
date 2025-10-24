import { useState, useEffect } from "react";
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
  LogOut,
  Receipt
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState("Profile");
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, signOut, supabase } = useAuth();

  // Fetch user's full name from database
  useEffect(() => {
    const fetchUserName = async () => {
      if (!user?.id) {
        setUserName("Profile");
        return;
      }
      
      console.log('Fetching user name for:', user.id);
      console.log('User metadata:', user.user_metadata);
      
      try {
        // PRIORITY 1: Check if full_name is in user metadata (from sign-up)
        if (user.user_metadata?.full_name) {
          console.log('Found name in user_metadata:', user.user_metadata.full_name);
          setUserName(user.user_metadata.full_name);
          return;
        }

        // PRIORITY 2: Try to get full_name from users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('full_name')
          .eq('user_id', user.id)
          .single();

        console.log('Users table query result:', userData);

        if (userData?.full_name) {
          console.log('Found name in users table:', userData.full_name);
          setUserName(userData.full_name);
          return;
        }

        // PRIORITY 3: Fallback to user_profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('full_name')
          .eq('user_id', user.id)
          .single();

        console.log('User_profiles table query result:', profileData);

        if (profileData?.full_name) {
          console.log('Found name in user_profiles table:', profileData.full_name);
          setUserName(profileData.full_name);
          return;
        }

        // Default to "Profile" if no name found
        console.log('No name found, defaulting to Profile');
        setUserName("Profile");
      } catch (error) {
        console.error('Error fetching user name:', error);
        // Try metadata as last resort
        if (user.user_metadata?.full_name) {
          setUserName(user.user_metadata.full_name);
        } else {
          setUserName("Profile");
        }
      }
    };

    fetchUserName();
  }, [user, supabase]);

  // Handle logout
  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  // Navigation items for Tubelight Navbar
  const navItems = [
    { name: "Dashboard", url: "/dashboard", icon: BarChart3 },
    { name: "Expenses", url: "/expenses", icon: CreditCard },
    { name: "Transactions", url: "/transactions", icon: Receipt },
    { name: "Loan", url: "/loan-analyzer", icon: PieChart },
    { name: "Goals", url: "/goals", icon: Target },
    { name: "Stocks", url: "/stocks", icon: TrendingUp },
    { name: "Reports", url: "/reports", icon: FileText },
    { name: "Learn", url: "/learn", icon: GraduationCap },
  ];

  // Additional items for authenticated users (user's name next to Sign Out)
  const allNavItems = isAuthenticated 
    ? [
        ...navItems,
        { name: userName, url: "/profile", icon: User, isButton: true },
        { name: "Sign Out", url: "#", icon: LogOut, isButton: true, onClick: handleLogout },
      ]
    : navItems;

  const isActive = (href) => location.pathname === href;

  return (
    <>
      {/* Tubelight Animated Navbar (now includes Finatics.AI text) */}
      <TubelightNavbar items={allNavItems} />

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-16" />
    </>
  );
};

export default Navbar;