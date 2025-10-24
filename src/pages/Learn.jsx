import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { 
  Play, 
  BookOpen, 
  Search,
  Clock,
  Star,
  Users,
  TrendingUp,
  PieChart,
  Target,
  Banknote,
  Calculator,
  Shield
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";

const Learn = () => {
  const categories = [
    { id: "basics", name: "Financial Basics", icon: BookOpen, count: 12 },
    { id: "investing", name: "Investing", icon: TrendingUp, count: 18 },
    { id: "savings", name: "Savings & SIP", icon: PieChart, count: 8 },
    { id: "stocks", name: "Stock Market", icon: TrendingUp, count: 15 },
    { id: "mutual-funds", name: "Mutual Funds", icon: Target, count: 10 },
    { id: "insurance", name: "Insurance", icon: Shield, count: 6 },
    { id: "loans", name: "Loans & EMI", icon: Calculator, count: 9 },
    { id: "retirement", name: "Retirement Planning", icon: Banknote, count: 7 }
  ];

  const featuredVideos = [
    {
      id: 1,
      title: "The Power of Compound Interest - Einstein's 8th Wonder",
      description: "Learn how compounding can turn small investments into massive wealth over time",
      duration: "12:45",
      instructor: "Warren Buffett",
      rating: 4.9,
      students: "2.3M",
      thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300&h=200&fit=crop",
      category: "basics",
      level: "Beginner"
    },
    {
      id: 2,
      title: "SIP Strategy: Monthly Investments for Long-term Wealth",
      description: "Systematic Investment Plans explained with real examples and calculations",
      duration: "18:30",
      instructor: "Peter Lynch",
      rating: 4.8,
      students: "1.8M",
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop",
      category: "savings",
      level: "Intermediate"
    },
    {
      id: 3,
      title: "Stock Market Fundamentals: From Zero to Hero",
      description: "Complete guide to understanding stocks, market mechanics, and investment strategies",
      duration: "45:20",
      instructor: "Benjamin Graham",
      rating: 4.9,
      students: "3.1M",
      thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300&h=200&fit=crop",
      category: "stocks",
      level: "Beginner"
    },
    {
      id: 4,
      title: "Mutual Fund Selection: How to Pick Winners",
      description: "Expert strategies for selecting high-performing mutual funds for your portfolio",
      duration: "25:15",
      instructor: "John Bogle",
      rating: 4.7,
      students: "1.5M",
      thumbnail: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop",
      category: "mutual-funds",
      level: "Intermediate"
    },
    {
      id: 5,
      title: "SWP Explained: Systematic Withdrawal Plans",
      description: "How to create regular income from your investments using SWP",
      duration: "16:40",
      instructor: "Ray Dalio",
      rating: 4.6,
      students: "950K",
      thumbnail: "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=300&h=200&fit=crop",
      category: "savings",
      level: "Advanced"
    },
    {
      id: 6,
      title: "Insurance Planning: Protect Your Financial Future",
      description: "Term vs whole life insurance, health insurance, and comprehensive protection strategies",
      duration: "22:10",
      instructor: "Suze Orman",
      rating: 4.8,
      students: "1.2M",
      thumbnail: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=300&h=200&fit=crop",
      category: "insurance",
      level: "Beginner"
    }
  ];

  const courses = [
    {
      title: "Complete Personal Finance Mastery",
      description: "From budgeting to investing - become financially literate in 30 days",
      lessons: 25,
      duration: "8 hours",
      level: "All Levels",
      rating: 4.9,
      students: "45K",
      price: "Free"
    },
    {
      title: "Advanced Investment Strategies",
      description: "Portfolio optimization, risk management, and advanced trading techniques",
      lessons: 18,
      duration: "6 hours",
      level: "Advanced",
      rating: 4.8,
      students: "12K",
      price: "$49"
    },
    {
      title: "Cryptocurrency & Digital Assets",
      description: "Understanding blockchain, Bitcoin, Ethereum, and crypto investing",
      lessons: 15,
      duration: "5 hours",
      level: "Intermediate",
      rating: 4.7,
      students: "28K",
      price: "$29"
    }
  ];

  const getLevelColor = (level) => {
    switch (level) {
      case "Beginner": return "bg-success/20 text-success border-success/30";
      case "Intermediate": return "bg-warning/20 text-warning border-warning/30";
      case "Advanced": return "bg-destructive/20 text-destructive border-destructive/30";
      default: return "bg-muted/20 text-muted-foreground border-muted/30";
    }
  };

  return (
    <div className="min-h-screen bg-transparent relative"><Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Finance Teacher</h1>
            <p className="text-muted-foreground">Master your finances with expert-led courses and tutorials</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search courses..." className="pl-9 w-64" />
            </div>
          </div>
        </div>

        <Tabs defaultValue="videos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="videos">Video Library</TabsTrigger>
            <TabsTrigger value="courses">Full Courses</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="videos" className="space-y-6">
            <div className="grid gap-6">
              {featuredVideos.map((video) => (
                <Card key={video.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="relative md:w-80 h-48 md:h-auto">
                        <img 
                          src={video.thumbnail} 
                          alt={video.title}
                          className="w-full h-full object-cover rounded-l-lg"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-l-lg">
                          <AnimatedButton size="sm" className="rounded-full bg-white/20 hover:bg-white/30 border-0">
                            <Play className="w-5 h-5 text-white" />
                          </AnimatedButton>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {video.duration}
                        </div>
                      </div>
                      
                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-foreground mb-2">{video.title}</h3>
                            <p className="text-sm text-muted-foreground mb-3">{video.description}</p>
                          </div>
                          <Badge variant="outline" className={getLevelColor(video.level)}>
                            {video.level}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">{video.instructor}</span>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 fill-warning text-warning" />
                              <span>{video.rating}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4" />
                              <span>{video.students}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{video.duration}</span>
                            </div>
                          </div>
                          <AnimatedButton className="bg-gradient-to-r from-primary to-success">
                            Watch Now
                          </AnimatedButton>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg text-foreground">{course.title}</CardTitle>
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                        {course.price}
                      </Badge>
                    </div>
                    <CardDescription className="text-sm">{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="w-4 h-4 text-muted-foreground" />
                        <span>{course.lessons} lessons</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 fill-warning text-warning" />
                        <span>{course.rating}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{course.students}</span>
                      </div>
                    </div>
                    
                    <Badge variant="outline" className={getLevelColor(course.level)}>
                      {course.level}
                    </Badge>
                    
                    <AnimatedButton className="w-full bg-gradient-to-r from-primary to-success">
                      {course.price === "Free" ? "Start Learning" : "Enroll Now"}
                    </AnimatedButton>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Card key={category.id} className="border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer group">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                        <IconComponent className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{category.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{category.count} videos available</p>
                      <AnimatedButton variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        Explore
                      </AnimatedButton>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Learn;
