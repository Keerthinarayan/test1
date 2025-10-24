import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { 
  CreditCard, 
  Plus, 
  Filter, 
  Search,
  Calendar,
  DollarSign,
  Repeat,
  Shield,
  MoreHorizontal
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";

const Expenses = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - will be replaced with real data later
  const expenses = [
    { id: 1, name: "Grocery Store", amount: 85.50, date: "2024-04-15", category: "Food", type: "expense", recurring: false },
    { id: 2, name: "Netflix", amount: 15.99, date: "2024-04-14", category: "Entertainment", type: "subscription", recurring: true },
    { id: 3, name: "Electric Bill", amount: 120.30, date: "2024-04-10", category: "Utilities", type: "expense", recurring: true },
    { id: 4, name: "Car Payment", amount: 450.00, date: "2024-04-01", category: "Transportation", type: "emi", recurring: true },
    { id: 5, name: "Health Insurance", amount: 280.00, date: "2024-04-01", category: "Insurance", type: "insurance", recurring: true },
    { id: 6, name: "Restaurant", amount: 45.80, date: "2024-04-13", category: "Food", type: "expense", recurring: false },
    { id: 7, name: "Spotify", amount: 9.99, date: "2024-04-12", category: "Entertainment", type: "subscription", recurring: true },
    { id: 8, name: "Gym Membership", amount: 35.00, date: "2024-04-01", category: "Health", type: "subscription", recurring: true },
  ];

  const emis = expenses.filter(e => e.type === "emi");
  const subscriptions = expenses.filter(e => e.type === "subscription");
  const insurance = expenses.filter(e => e.type === "insurance");
  const regularExpenses = expenses.filter(e => e.type === "expense");

  const totalMonthlyRecurring = expenses
    .filter(e => e.recurring)
    .reduce((sum, e) => sum + e.amount, 0);

  const getCategoryColor = (category) => {
    const colors = {
      "Food": "bg-orange-100 text-orange-800",
      "Entertainment": "bg-purple-100 text-purple-800",
      "Utilities": "bg-blue-100 text-blue-800",
      "Transportation": "bg-green-100 text-green-800",
      "Insurance": "bg-red-100 text-red-800",
      "Health": "bg-pink-100 text-pink-800",
    };
    return colors[category] || "bg-muted text-foreground";
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "emi": return <CreditCard className="w-4 h-4" />;
      case "subscription": return <Repeat className="w-4 h-4" />;
      case "insurance": return <Shield className="w-4 h-4" />;
      default: return <DollarSign className="w-4 h-4" />;
    }
  };

  const ExpenseCard = ({ expense }) => (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
              {getTypeIcon(expense.type)}
            </div>
            <div>
              <h3 className="font-medium text-foreground">{expense.name}</h3>
              <p className="text-sm text-muted-foreground">{expense.date}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="secondary" className={getCategoryColor(expense.category)}>
              {expense.category}
            </Badge>
            {expense.recurring && (
              <Badge variant="outline" className="text-primary border-primary">
                Recurring
              </Badge>
            )}
            <span className="font-semibold text-foreground">${expense.amount.toFixed(2)}</span>
            <AnimatedButton variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </AnimatedButton>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-transparent relative">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Expense Management</h1>
            <p className="text-muted-foreground">Track and categorize all your expenses</p>
          </div>
          <AnimatedButton className="bg-gradient-to-r from-primary to-success">
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </AnimatedButton>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium opacity-90">Monthly Recurring</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalMonthlyRecurring.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">EMIs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ${emis.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">{emis.length} active EMIs</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Subscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ${subscriptions.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">{subscriptions.length} subscriptions</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Insurance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ${insurance.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">{insurance.length} policies</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <AnimatedButton variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </AnimatedButton>
          <AnimatedButton variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Date Range
          </AnimatedButton>
        </div>

        {/* Expense Categories */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All Expenses</TabsTrigger>
            <TabsTrigger value="emi">EMIs</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="insurance">Insurance</TabsTrigger>
            <TabsTrigger value="regular">Regular</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-6">
            {expenses.map((expense) => (
              <ExpenseCard key={expense.id} expense={expense} />
            ))}
          </TabsContent>

          <TabsContent value="emi" className="space-y-4 mt-6">
            {emis.map((expense) => (
              <ExpenseCard key={expense.id} expense={expense} />
            ))}
          </TabsContent>

          <TabsContent value="subscriptions" className="space-y-4 mt-6">
            {subscriptions.map((expense) => (
              <ExpenseCard key={expense.id} expense={expense} />
            ))}
          </TabsContent>

          <TabsContent value="insurance" className="space-y-4 mt-6">
            {insurance.map((expense) => (
              <ExpenseCard key={expense.id} expense={expense} />
            ))}
          </TabsContent>

          <TabsContent value="regular" className="space-y-4 mt-6">
            {regularExpenses.map((expense) => (
              <ExpenseCard key={expense.id} expense={expense} />
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Expenses;
