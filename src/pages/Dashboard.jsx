import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  PiggyBank, 
  CreditCard, 
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Eye,
  MoreHorizontal,
  Building2,
  ChevronRight
} from "lucide-react";
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bankAccounts, setBankAccounts] = useState([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);
  
  // Check if user has bank accounts
  const hasBankAccounts = bankAccounts.length > 0;

  console.log('Dashboard State:', {
    isLoadingAccounts,
    bankAccountsCount: bankAccounts.length,
    hasBankAccounts,
    bankAccounts
  });

  // Fetch user's bank accounts
  useEffect(() => {
    const fetchBankAccounts = async () => {
      if (!user?.id) return;
      
      try {
        const response = await fetch(`http://localhost:3000/api/bank-accounts/${user.id}`);
        const result = await response.json();
        
        if (result.success) {
          setBankAccounts(result.data || []);
        } else {
          console.error('Failed to fetch bank accounts:', result.error);
        }
      } catch (error) {
        console.error('Error fetching bank accounts:', error);
      } finally {
        setIsLoadingAccounts(false);
      }
    };

    fetchBankAccounts();
  }, [user?.id]);
  
  // Mock data - will be replaced with real data later
  const accountData = {
    balance: 12450.75,
    monthlyExpenses: 2340.50,
    monthlySavings: 1200.00,
    mutualFunds: 8500.25,
    stocks: 15750.80
  };

  const recentTransactions = [
    { id: 1, description: "Grocery Store", amount: -85.50, date: "Today", category: "Food", type: "expense" },
    { id: 2, description: "Salary Deposit", amount: 3500.00, date: "Yesterday", category: "Income", type: "income" },
    { id: 3, description: "Netflix Subscription", amount: -15.99, date: "2 days ago", category: "Entertainment", type: "expense" },
    { id: 4, description: "Investment Return", amount: 245.80, date: "3 days ago", category: "Investment", type: "income" },
    { id: 5, description: "Electric Bill", amount: -120.30, date: "5 days ago", category: "Utilities", type: "expense" },
  ];

  const monthlyData = [
    { month: "Jan", income: 3500, expenses: 2800 },
    { month: "Feb", income: 3500, expenses: 2600 },
    { month: "Mar", income: 3700, expenses: 2900 },
    { month: "Apr", income: 3500, expenses: 2340 },
    { month: "May", income: 3800, expenses: 2450 },
    { month: "Jun", income: 3600, expenses: 2680 },
  ];

  const expenseCategories = [
    { name: 'Housing', value: 1200, color: 'hsl(var(--primary))' },
    { name: 'Food', value: 450, color: 'hsl(var(--success))' },
    { name: 'Transportation', value: 320, color: 'hsl(var(--warning))' },
    { name: 'Entertainment', value: 180, color: 'hsl(var(--destructive))' },
    { name: 'Utilities', value: 190, color: 'hsl(var(--muted))' }
  ];

  return (
    <div className="min-h-screen bg-transparent relative">
      <Navbar />
      
      <main 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative" 
        style={{ position: 'relative', zIndex: 1000, pointerEvents: 'auto' }}
      >
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user?.email?.split('@')[0] || 'User'}!
          </h1>
          <p className="text-muted-foreground">Here's your financial overview</p>
        </div>

        {/* New User Welcome Card - Show if no bank accounts */}
        {!hasBankAccounts && (
          <Card 
            className="border-0 shadow-lg bg-gradient-to-r from-primary/10 via-success/10 to-primary/5 mb-8"
            style={{ 
              position: 'relative', 
              zIndex: 1001, 
              pointerEvents: 'auto',
              backdropFilter: 'none',
              WebkitBackdropFilter: 'none'
            }}
          >
            <CardContent 
              className="p-6" 
              style={{ 
                position: 'relative', 
                zIndex: 1002, 
                pointerEvents: 'auto' 
              }}
            >
              <div 
                className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4" 
                style={{ 
                  position: 'relative', 
                  zIndex: 1003, 
                  pointerEvents: 'auto' 
                }}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Connect Your Bank Account
                    </h3>
                    <p className="text-muted-foreground">
                      Get started by connecting your bank account to track expenses and get personalized insights
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    console.log('Button clicked!');
                    navigate('/add-bank-account');
                  }}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    position: 'relative',
                    zIndex: 10004,
                    pointerEvents: 'auto'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#2563eb';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#3b82f6';
                  }}
                >
                  <Plus style={{ width: '16px', height: '16px' }} />
                  Add Bank Account
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Account Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className={`border-0 shadow-lg ${
            hasBankAccounts 
              ? 'bg-gradient-to-br from-primary to-primary-glow text-primary-foreground' 
              : 'bg-muted/50'
          }`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${
                hasBankAccounts ? 'opacity-90' : 'text-muted-foreground'
              }`}>
                Account Balance
              </CardTitle>
              <DollarSign className={`h-4 w-4 ${
                hasBankAccounts ? 'opacity-90' : 'text-muted-foreground'
              }`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${
                hasBankAccounts ? '' : 'text-muted-foreground'
              }`}>
                {hasBankAccounts ? `$${accountData.balance.toLocaleString()}` : '$0.00'}
              </div>
              <p className={`text-xs mt-1 ${
                hasBankAccounts ? 'opacity-90' : 'text-muted-foreground'
              }`}>
                {hasBankAccounts ? (
                  <>
                    <TrendingUp className="inline w-3 h-3 mr-1" />
                    +2.5% from last month
                  </>
                ) : (
                  'Connect bank account to see balance'
                )}
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Expenses</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {hasBankAccounts ? `$${accountData.monthlyExpenses.toLocaleString()}` : '$0.00'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {hasBankAccounts ? (
                  <>
                    <TrendingDown className="inline w-3 h-3 mr-1" />
                    -5.2% from last month
                  </>
                ) : (
                  'Connect bank account to track expenses'
                )}
              </p>
            </CardContent>
          </Card>

          <Card className={`border-0 shadow-lg ${
            hasBankAccounts 
              ? 'bg-gradient-to-br from-success to-success/80 text-success-foreground' 
              : 'bg-muted/50'
          }`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${
                hasBankAccounts ? 'opacity-90' : 'text-muted-foreground'
              }`}>
                Monthly Savings
              </CardTitle>
              <PiggyBank className={`h-4 w-4 ${
                hasBankAccounts ? 'opacity-90' : 'text-muted-foreground'
              }`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${
                hasBankAccounts ? '' : 'text-muted-foreground'
              }`}>
                {hasBankAccounts ? `$${accountData.monthlySavings.toLocaleString()}` : '$0.00'}
              </div>
              <p className={`text-xs mt-1 ${
                hasBankAccounts ? 'opacity-90' : 'text-muted-foreground'
              }`}>
                {hasBankAccounts ? (
                  <>
                    <TrendingUp className="inline w-3 h-3 mr-1" />
                    +8.1% from last month
                  </>
                ) : (
                  'Connect bank account to track savings'
                )}
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Investments</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {hasBankAccounts 
                  ? `$${(accountData.mutualFunds + accountData.stocks).toLocaleString()}`
                  : '$0.00'
                }
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {hasBankAccounts ? (
                  <span className="text-success">
                    <ArrowUpRight className="inline w-3 h-3 mr-1" />
                    +12.3% this month
                  </span>
                ) : (
                  'Connect bank account to track investments'
                )}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Charts Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Income vs Expenses Chart */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-foreground">Income vs Expenses</CardTitle>
                <CardDescription>6-month financial trend</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="income" 
                        stroke="hsl(var(--success))" 
                        strokeWidth={3}
                        name="Income"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="expenses" 
                        stroke="hsl(var(--destructive))" 
                        strokeWidth={3}
                        name="Expenses"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Expense Categories Chart */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-foreground">Expense Categories</CardTitle>
                <CardDescription>Current month breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expenseCategories}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {expenseCategories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl text-foreground">Recent Transactions</CardTitle>
                    <CardDescription>Your latest financial activities</CardDescription>
                  </div>
                  <button
                    type="button"
                    style={{
                      padding: '6px 12px',
                      backgroundColor: 'transparent',
                      color: 'inherit',
                      border: '1px solid currentColor',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Plus style={{ width: '16px', height: '16px' }} />
                    Add Transaction
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'income' 
                          ? 'bg-success/20 text-success' 
                          : 'bg-destructive/20 text-destructive'
                      }`}>
                        {transaction.type === 'income' ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">{transaction.category} • {transaction.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`font-semibold ${
                        transaction.type === 'income' ? 'text-success' : 'text-foreground'
                      }`}>
                        {transaction.type === 'income' ? '+' : ''}{transaction.amount.toLocaleString()}
                      </span>
                      <button
                        type="button"
                        style={{
                          padding: '4px',
                          backgroundColor: 'transparent',
                          color: 'inherit',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <MoreHorizontal style={{ width: '16px', height: '16px' }} />
                      </button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Investment Overview */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-foreground">Investment Portfolio</CardTitle>
                <CardDescription>Your current holdings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium text-foreground">Mutual Funds</p>
                    <p className="text-sm text-success">+3.2% today</p>
                  </div>
                  <span className="font-semibold text-foreground">${accountData.mutualFunds.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium text-foreground">Stocks</p>
                    <p className="text-sm text-success">+1.8% today</p>
                  </div>
                  <span className="font-semibold text-foreground">${accountData.stocks.toLocaleString()}</span>
                </div>
                <button
                  type="button"
                  style={{
                    width: '100%',
                    marginTop: '16px',
                    padding: '10px 16px',
                    backgroundColor: 'transparent',
                    color: 'inherit',
                    border: '1px solid currentColor',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <Eye style={{ width: '16px', height: '16px' }} />
                  View All Investments
                </button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-foreground">Monthly Summary</CardTitle>
                <CardDescription>Income vs Expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyData.map((data, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{data.month}</span>
                        <span className="text-foreground font-medium">
                          ${(data.income - data.expenses).toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-primary to-success h-2 rounded-full"
                          style={{ 
                            width: `${Math.min(((data.income - data.expenses) / data.income) * 100, 100)}%` 
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
