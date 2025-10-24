import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AnimatedButton } from '@/components/ui/animated-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import Navbar from '@/components/layout/Navbar';
import { Target, TrendingUp, Calendar, DollarSign, Bot, Plus, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';

const Goals = () => {
  const [goals, setGoals] = useState([
    {
      id: '1',
      title: 'Emergency Fund',
      amount: 100000,
      currentAmount: 45000,
      targetDate: '2024-12-31',
      category: 'Emergency',
      aiSuggestion: 'Save ₹9,200 monthly to reach your goal. Consider automating transfers to a high-yield savings account.',
      status: 'active'
    },
    {
      id: '2',
      title: 'Vacation to Europe',
      amount: 250000,
      currentAmount: 80000,
      targetDate: '2025-06-15',
      category: 'Travel',
      aiSuggestion: 'Save ₹15,000 monthly. Consider opening a separate travel fund and look for travel deals.',
      status: 'active'
    }
  ]);

  const [newGoal, setNewGoal] = useState({
    title: '',
    amount: '',
    targetDate: '',
    category: 'Savings'
  });

  const [showAIAnalysis, setShowAIAnalysis] = useState(false);

  const handleCreateGoal = () => {
    if (!newGoal.title || !newGoal.amount || !newGoal.targetDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Simulate AI analysis
    setShowAIAnalysis(true);
    
    setTimeout(() => {
      const goal = {
        id: Date.now().toString(),
        title: newGoal.title,
        amount: parseInt(newGoal.amount),
        currentAmount: 0,
        targetDate: newGoal.targetDate,
        category: newGoal.category,
        aiSuggestion: `To reach ₹${parseInt(newGoal.amount).toLocaleString()}, save ₹${Math.ceil(parseInt(newGoal.amount) / 12).toLocaleString()} monthly. Consider setting up an automatic transfer and investing in moderate-risk mutual funds for better returns.`,
        status: 'active'
      };

      setGoals([...goals, goal]);
      setNewGoal({ title: '', amount: '', targetDate: '', category: 'Savings' });
      setShowAIAnalysis(false);
      
      toast.success("Financial Goal Created! AI analysis complete. Your goal has been added to expenses tracker.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }, 2000);
  };

  const categories = ['Savings', 'Emergency', 'Travel', 'Education', 'Home', 'Investment', 'Health'];

  return (
    <div className="min-h-screen bg-transparent relative"><Navbar />
      
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Target className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">Financial Goals</h1>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Set your financial goals and let AI guide you with personalized strategies to achieve them faster.
            </p>
          </div>

          <Tabs defaultValue="goals" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="goals">My Goals</TabsTrigger>
              <TabsTrigger value="create">Create New Goal</TabsTrigger>
            </TabsList>

            <TabsContent value="goals" className="space-y-6">
              {/* Goals Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <Target className="h-8 w-8 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Active Goals</p>
                        <p className="text-2xl font-bold text-foreground">{goals.filter(g => g.status === 'active').length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-8 w-8 text-success" />
                      <div>
                        <p className="text-sm text-muted-foreground">Total Target</p>
                        <p className="text-2xl font-bold text-foreground">
                          ₹{goals.reduce((sum, goal) => sum + goal.amount, 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-8 w-8 text-warning" />
                      <div>
                        <p className="text-sm text-muted-foreground">Total Saved</p>
                        <p className="text-2xl font-bold text-foreground">
                          ₹{goals.reduce((sum, goal) => sum + goal.currentAmount, 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Goals List */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {goals.map((goal) => {
                  const progress = (goal.currentAmount / goal.amount) * 100;
                  const isCompleted = progress >= 100;
                  
                  return (
                    <Card key={goal.id} className="relative overflow-hidden">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <CardTitle className="flex items-center gap-2">
                              {goal.title}
                              {isCompleted && <CheckCircle2 className="h-5 w-5 text-success" />}
                            </CardTitle>
                            <CardDescription>Target: {new Date(goal.targetDate).toLocaleDateString()}</CardDescription>
                          </div>
                          <Badge variant={goal.status === 'active' ? 'default' : 'secondary'}>
                            {goal.category}
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{progress.toFixed(1)}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>₹{goal.currentAmount.toLocaleString()}</span>
                            <span>₹{goal.amount.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="bg-secondary/30 p-4 rounded-lg border border-secondary/50">
                          <div className="flex items-start gap-3">
                            <Bot className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-foreground mb-1">AI Suggestion</p>
                              <p className="text-sm text-muted-foreground">{goal.aiSuggestion}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <AnimatedButton size="sm" className="flex-1">
                            Update Progress
                          </AnimatedButton>
                          <AnimatedButton size="sm" variant="outline">
                            Modify Goal
                          </AnimatedButton>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="create" className="space-y-6">
              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Create New Financial Goal
                  </CardTitle>
                  <CardDescription>
                    Set your goal and get AI-powered recommendations to achieve it faster.
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Goal Title *</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Emergency Fund, Dream Car"
                        value={newGoal.title}
                        onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="amount">Target Amount (₹) *</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="100000"
                        value={newGoal.amount}
                        onChange={(e) => setNewGoal({ ...newGoal, amount: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="targetDate">Target Date *</Label>
                      <Input
                        id="targetDate"
                        type="date"
                        value={newGoal.targetDate}
                        onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <select
                        id="category"
                        className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm"
                        value={newGoal.category}
                        onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <AnimatedButton 
                    onClick={handleCreateGoal} 
                    className="w-full"
                    disabled={showAIAnalysis}
                  >
                    {showAIAnalysis ? (
                      <>
                        <Bot className="h-4 w-4 mr-2 animate-spin" />
                        AI is analyzing your goal...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Goal
                      </>
                    )}
                  </AnimatedButton>

                  {showAIAnalysis && (
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Bot className="h-5 w-5 text-primary animate-pulse" />
                        <span className="font-medium text-primary">AI Analysis in Progress</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Analyzing your financial goal and creating personalized recommendations...
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Goals;
