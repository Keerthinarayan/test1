import { AnimatedButton } from "@/components/ui/animated-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { Spotlight } from "@/components/ui/spotlight";
import { SpotlightAceternity } from "@/components/ui/spotlight-aceternity";
import { SplineScene } from "@/components/ui/spline-scene";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Footer } from "@/components/ui/footer-section";
import { 
  TrendingUp, 
  Shield, 
  Brain, 
  PieChart, 
  Target, 
  BarChart3,
  ArrowRight,
  Play
} from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Get personalized financial advice and smart recommendations powered by advanced AI"
    },
    {
      icon: PieChart,
      title: "Expense Tracking",
      description: "Track and categorize your expenses with intelligent categorization and budgeting tools"
    },
    {
      icon: TrendingUp,
      title: "Investment Management",
      description: "Monitor your stocks, mutual funds, and portfolio performance with real-time data"
    },
    {
      icon: Target,
      title: "Financial Goals",
      description: "Set and achieve your financial goals with AI-driven planning and progress tracking"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Bank-level security ensures your financial data is always protected and private"
    },
    {
      icon: BarChart3,
      title: "Smart Analytics",
      description: "Comprehensive reports and analytics to understand your financial patterns"
    }
  ];

  return (
    <div className="min-h-screen bg-black dark:bg-black relative overflow-hidden">
      {/* Spline 3D Animated Background - Full Page with Black Theme */}
      <div className="fixed inset-0 z-0">
        <SplineScene 
          scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
          className="w-full h-full opacity-80"
        />
      </div>
      
      {/* Aceternity Spotlight - Animated entrance effect */}
      <SpotlightAceternity 
        className="-top-40 left-0 md:left-60 md:-top-20 z-[1]" 
        fill="rgba(59, 130, 246, 0.5)" 
      />
      
      {/* Interactive Spotlight Effect - Follows cursor */}
      <Spotlight size={300} className="z-[2]" />
      
      {/* Landing Page Navbar */}
      <nav className="bg-slate-900/90 backdrop-blur-lg border-b border-slate-700/50 shadow-sm relative z-20 pointer-events-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-success rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Finatics.AI</span>
            </Link>

            {/* Right side - Auth buttons and theme toggle */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link to="/login">
                <AnimatedButton variant="outline" size="sm" className="border-blue-500 text-blue-400 hover:bg-blue-500/10 whitespace-nowrap">
                  Sign In
                </AnimatedButton>
              </Link>
              <Link to="/login">
                <AnimatedButton size="sm" className="bg-gradient-to-r from-primary to-success whitespace-nowrap">
                  Get Started
                </AnimatedButton>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Centered */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center z-10 pointer-events-none">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pointer-events-auto">
          {/* Animated gradient glow behind title */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/20 via-success/20 to-primary/20 rounded-full blur-[120px] animate-pulse opacity-50 pointer-events-none" />
          
          <div className="relative z-10">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
                AI-Powered{" "}
              </span>
              <span className="bg-gradient-to-r from-primary via-success to-primary bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                Finatics.AI
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-neutral-300 mb-12 leading-relaxed max-w-3xl mx-auto">
              Take control of your finances with intelligent insights, automated tracking, 
              and personalized recommendations. Make smarter financial decisions with AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/login">
                <AnimatedButton 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-success hover:from-primary/90 hover:to-success/90 text-lg px-10 py-6 h-auto shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] transition-shadow whitespace-nowrap"
                >
                  <span className="flex items-center">
                    Get Started Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </span>
                </AnimatedButton>
              </Link>
              <AnimatedButton 
                variant="outline" 
                size="lg" 
                className="text-lg px-10 py-6 h-auto border-blue-500 text-blue-400 hover:bg-blue-500/20 hover:border-blue-400 transition-all whitespace-nowrap"
              >
                <span className="flex items-center">
                  <Play className="mr-2 w-5 h-5" />
                  Watch Demo
                </span>
              </AnimatedButton>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-zinc-950/50 relative z-10 pointer-events-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
                Powerful Features for Complete
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary via-success to-primary bg-clip-text text-transparent animate-gradient-text bg-[length:200%_auto]">
                Financial Control
              </span>
            </h2>
            <p className="text-xl text-neutral-300 max-w-3xl mx-auto">
              Everything you need to manage, track, and grow your wealth in one intelligent platform
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <BackgroundGradient 
                  key={index} 
                  className="rounded-[22px] p-1"
                  animate={true}
                >
                  <Card className="group h-full border-0 bg-slate-100/20 dark:bg-slate-950/40 backdrop-blur-sm rounded-[20px] overflow-hidden card-shimmer hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all duration-300">
                    <CardHeader className="pb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-primary to-success rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg group-hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <CardTitle className="text-xl text-white font-bold group-hover:text-primary transition-colors">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-neutral-300 leading-relaxed text-base">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </BackgroundGradient>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default Landing;
