import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Search,
  Brain,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign
} from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Navbar from "@/components/layout/Navbar";

const Stocks = () => {
  // Mock data - will be replaced with real data later
  const portfolio = [
    { 
      symbol: "AAPL", 
      name: "Apple Inc.", 
      shares: 10, 
      avgPrice: 150.25, 
      currentPrice: 175.50, 
      change: 25.25, 
      changePercent: 16.8,
      value: 1755.00
    },
    { 
      symbol: "GOOGL", 
      name: "Alphabet Inc.", 
      shares: 5, 
      avgPrice: 2800.00, 
      currentPrice: 2650.75, 
      change: -149.25, 
      changePercent: -5.3,
      value: 13253.75
    },
    { 
      symbol: "MSFT", 
      name: "Microsoft Corp.", 
      shares: 8, 
      avgPrice: 300.00, 
      currentPrice: 320.80, 
      change: 20.80, 
      changePercent: 6.9,
      value: 2566.40
    },
    { 
      symbol: "TSLA", 
      name: "Tesla Inc.", 
      shares: 15, 
      avgPrice: 220.00, 
      currentPrice: 185.60, 
      change: -34.40, 
      changePercent: -15.6,
      value: 2784.00
    }
  ];

  const marketData = [
    { symbol: "NIFTY", name: "NIFTY 50", price: 21450.75, change: 125.30, changePercent: 0.59 },
    { symbol: "SENSEX", name: "BSE SENSEX", price: 70856.23, change: -89.45, changePercent: -0.13 },
    { symbol: "BANKNIFTY", name: "BANK NIFTY", price: 46780.40, change: 245.80, changePercent: 0.53 },
  ];

  const aiInsights = [
    {
      type: "buy",
      symbol: "AAPL",
      title: "Strong Buy Signal for Apple",
      description: "Technical indicators suggest continued upward momentum with strong support at $170",
      confidence: 85
    },
    {
      type: "hold",
      symbol: "MSFT",
      title: "Hold Microsoft Position",
      description: "Consolidation phase expected. Good long-term fundamentals remain intact",
      confidence: 78
    },
    {
      type: "sell",
      symbol: "TSLA",
      title: "Consider Profit Booking in Tesla",
      description: "Overbought conditions with potential for short-term correction",
      confidence: 72
    }
  ];

  const stockChartData = [
    { time: '9:30', AAPL: 175.20, GOOGL: 2645.50, MSFT: 318.40, TSLA: 187.80 },
    { time: '10:00', AAPL: 175.80, GOOGL: 2650.75, MSFT: 320.80, TSLA: 185.60 },
    { time: '10:30', AAPL: 174.90, GOOGL: 2648.20, MSFT: 319.50, TSLA: 186.30 },
    { time: '11:00', AAPL: 175.50, GOOGL: 2652.10, MSFT: 321.20, TSLA: 184.90 },
    { time: '11:30', AAPL: 176.10, GOOGL: 2655.80, MSFT: 320.60, TSLA: 185.40 },
    { time: '12:00', AAPL: 175.75, GOOGL: 2650.30, MSFT: 319.80, TSLA: 186.70 },
    { time: '12:30', AAPL: 176.20, GOOGL: 2653.45, MSFT: 321.10, TSLA: 185.80 },
    { time: '1:00', AAPL: 175.90, GOOGL: 2649.75, MSFT: 320.40, TSLA: 187.20 },
  ];

  const totalPortfolioValue = portfolio.reduce((sum, stock) => sum + stock.value, 0);
  const totalGainLoss = portfolio.reduce((sum, stock) => sum + (stock.change * stock.shares), 0);
  const totalGainLossPercent = (totalGainLoss / (totalPortfolioValue - totalGainLoss)) * 100;

  const getInsightColor = (type) => {
    switch (type) {
      case "buy": return "bg-success/20 text-success border-success/30";
      case "sell": return "bg-destructive/20 text-destructive border-destructive/30";
      case "hold": return "bg-warning/20 text-warning border-warning/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-transparent relative"><Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Stock Portfolio</h1>
            <p className="text-muted-foreground">Track your investments and get AI-powered insights</p>
          </div>
          <AnimatedButton className="bg-gradient-to-r from-primary to-success">
            <Plus className="w-4 h-4 mr-2" />
            Add Stock
          </AnimatedButton>
        </div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium opacity-90">Total Portfolio Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalPortfolioValue.toLocaleString()}</div>
              <p className="text-xs opacity-90 mt-1">
                {totalGainLoss >= 0 ? (
                  <TrendingUp className="inline w-3 h-3 mr-1" />
                ) : (
                  <TrendingDown className="inline w-3 h-3 mr-1" />
                )}
                {totalGainLossPercent >= 0 ? '+' : ''}{totalGainLossPercent.toFixed(2)}% today
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Day's Gain/Loss</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-success' : 'text-destructive'}`}>
                {totalGainLoss >= 0 ? '+' : ''}${totalGainLoss.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">{portfolio.length} holdings</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">AI Confidence Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {Math.round(aiInsights.reduce((sum, insight) => sum + insight.confidence, 0) / aiInsights.length)}%
              </div>
              <p className="text-xs text-success">High confidence</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Holdings and Market Data */}
          <div className="lg:col-span-2 space-y-6">
            {/* Live Stock Chart */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-foreground">Live Portfolio Performance</CardTitle>
                <CardDescription>Real-time stock price movements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stockChartData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="AAPL" 
                        stackId="1"
                        stroke="hsl(var(--primary))" 
                        fill="hsl(var(--primary))" 
                        fillOpacity={0.3}
                        strokeWidth={2}
                        name="Apple (AAPL)"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="GOOGL" 
                        stackId="2"
                        stroke="hsl(var(--success))" 
                        fill="hsl(var(--success))" 
                        fillOpacity={0.3}
                        strokeWidth={2}
                        name="Google (GOOGL)"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="MSFT" 
                        stackId="3"
                        stroke="hsl(var(--warning))" 
                        fill="hsl(var(--warning))" 
                        fillOpacity={0.3}
                        strokeWidth={2}
                        name="Microsoft (MSFT)"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="TSLA" 
                        stackId="4"
                        stroke="hsl(var(--destructive))" 
                        fill="hsl(var(--destructive))" 
                        fillOpacity={0.3}
                        strokeWidth={2}
                        name="Tesla (TSLA)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Market Indices */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-foreground">Market Overview</CardTitle>
                <CardDescription>Live market indices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {marketData.map((index) => (
                    <div key={index.symbol} className="p-4 rounded-lg bg-muted/30">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-foreground">{index.name}</h3>
                        {index.change >= 0 ? (
                          <TrendingUp className="w-4 h-4 text-success" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-destructive" />
                        )}
                      </div>
                      <div className="text-lg font-semibold text-foreground">{index.price.toLocaleString()}</div>
                      <div className={`text-sm ${index.change >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)} ({index.changePercent >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%)
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Holdings */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-foreground">Your Holdings</CardTitle>
                <CardDescription>Current stock positions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {portfolio.map((stock) => (
                  <div key={stock.symbol} className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                          <DollarSign className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{stock.symbol}</h3>
                          <p className="text-sm text-muted-foreground">{stock.name}</p>
                          <p className="text-xs text-muted-foreground">{stock.shares} shares • Avg: ${stock.avgPrice}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-foreground">${stock.currentPrice}</div>
                        <div className={`text-sm flex items-center ${stock.change >= 0 ? 'text-success' : 'text-destructive'}`}>
                          {stock.change >= 0 ? (
                            <ArrowUpRight className="w-3 h-3 mr-1" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3 mr-1" />
                          )}
                          {stock.change >= 0 ? '+' : ''}${stock.change.toFixed(2)} ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(1)}%)
                        </div>
                        <div className="text-xs text-muted-foreground">Value: ${stock.value.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* AI Insights */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg text-foreground">AI Insights</CardTitle>
                </div>
                <CardDescription>Personalized recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiInsights.map((insight, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {insight.symbol}
                      </Badge>
                      <span className="text-xs font-medium">{insight.confidence}% confidence</span>
                    </div>
                    <h4 className="font-medium mb-1">{insight.title}</h4>
                    <p className="text-xs opacity-90">{insight.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-foreground">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <AnimatedButton variant="outline" className="w-full justify-start">
                  <Search className="w-4 h-4 mr-2" />
                  Stock Screener
                </AnimatedButton>
                <AnimatedButton variant="outline" className="w-full justify-start">
                  <Eye className="w-4 h-4 mr-2" />
                  Watchlist
                </AnimatedButton>
                <AnimatedButton variant="outline" className="w-full justify-start">
                  <Brain className="w-4 h-4 mr-2" />
                  AI Analysis
                </AnimatedButton>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Stocks;
