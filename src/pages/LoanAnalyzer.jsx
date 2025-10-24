import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { 
  Calculator, 
  Brain, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  DollarSign
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";

const LoanAnalyzer = () => {
  const [loanAmount, setLoanAmount] = useState("");
  const [analysis, setAnalysis] = useState(null);
  
  // Mock user financial data - in real app, this would come from user profile
  const userFinancialData = {
    monthlyIncome: 8500,
    monthlyExpenses: 4200,
    currentSavings: 75000,
    creditScore: 720,
    employmentYears: 5
  };

  const analyzeWithAI = () => {
    const loan = parseFloat(loanAmount);
    const { monthlyIncome, monthlyExpenses, currentSavings, creditScore } = userFinancialData;
    const availableMonthlyIncome = monthlyIncome - monthlyExpenses;
    
    // AI suggests loan terms based on user's financial profile
    let suggestedTerm;
    let suggestedRate;
    let suggestedType;
    let affordabilityLevel;
    
    // Determine loan type based on amount
    if (loan > 100000) {
      suggestedType = "Home Loan";
      suggestedRate = creditScore > 750 ? 6.2 : creditScore > 700 ? 6.8 : 7.5;
      suggestedTerm = loan > 400000 ? 30 : 25;
    } else if (loan > 20000) {
      suggestedType = "Personal Loan";
      suggestedRate = creditScore > 750 ? 8.5 : creditScore > 700 ? 10.2 : 12.5;
      suggestedTerm = 7;
    } else {
      suggestedType = "Personal Loan";
      suggestedRate = creditScore > 750 ? 9.5 : creditScore > 700 ? 11.5 : 14.0;
      suggestedTerm = 5;
    }
    
    // Calculate payment with suggested terms
    const monthlyPayment = (loan * (suggestedRate/100/12)) / 
      (1 - Math.pow(1 + (suggestedRate/100/12), -suggestedTerm * 12));
    
    const totalPayment = monthlyPayment * suggestedTerm * 12;
    const totalInterest = totalPayment - loan;
    const paymentToIncomeRatio = (monthlyPayment / monthlyIncome) * 100;
    
    // Determine affordability
    if (paymentToIncomeRatio < 20) affordabilityLevel = "Low Risk";
    else if (paymentToIncomeRatio < 28) affordabilityLevel = "Moderate Risk";
    else affordabilityLevel = "High Risk";
    
    const mockAnalysis = {
      monthlyPayment: monthlyPayment.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      suggestedTerm,
      suggestedRate: suggestedRate.toFixed(2),
      suggestedType,
      paymentToIncomeRatio: paymentToIncomeRatio.toFixed(1),
      recommendations: [
        {
          type: paymentToIncomeRatio < 28 ? "good" : "warning",
          title: "Payment-to-Income Analysis",
          description: `Your monthly payment of $${monthlyPayment.toFixed(0)} represents ${paymentToIncomeRatio.toFixed(1)}% of your income. ${paymentToIncomeRatio < 28 ? 'This is within safe lending guidelines.' : 'Consider reducing the loan amount or extending the term.'}`
        },
        {
          type: currentSavings > loan * 0.2 ? "good" : "warning",
          title: "Emergency Fund Assessment", 
          description: currentSavings > loan * 0.2 
            ? "Your savings provide good financial cushion for this loan."
            : "Consider building more emergency savings before taking this loan."
        },
        {
          type: "tip",
          title: "Interest Rate Optimization",
          description: `Based on your ${creditScore} credit score, you qualify for our ${suggestedRate}% rate. Improving your score could reduce this by 0.5-1%.`
        }
      ],
      creditScore: `${creditScore >= 750 ? 'Excellent' : creditScore >= 700 ? 'Good' : 'Fair'} (${creditScore})`,
      affordability: affordabilityLevel
    };
    
    setAnalysis(mockAnalysis);
  };

  const getRecommendationIcon = (type) => {
    switch (type) {
      case "good": return <CheckCircle className="w-5 h-5 text-success" />;
      case "warning": return <AlertTriangle className="w-5 h-5 text-warning" />;
      default: return <TrendingUp className="w-5 h-5 text-primary" />;
    }
  };

  const getRecommendationColor = (type) => {
    switch (type) {
      case "good": return "border-success/30 bg-success/10";
      case "warning": return "border-warning/30 bg-warning/10"; 
      default: return "border-primary/30 bg-primary/10";
    }
  };

  return (
    <div className="min-h-screen bg-transparent relative"><Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Loan Analyzer</h1>
            <p className="text-muted-foreground">Get AI-powered insights for your loan decisions</p>
          </div>
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-primary" />
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
              AI Powered
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Loan Calculator */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Calculator className="w-5 h-5 text-primary" />
                <CardTitle className="text-xl text-foreground">Loan Details</CardTitle>
              </div>
              <CardDescription>Enter your loan amount - AI will suggest optimal terms</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="loanAmount">Loan Amount ($)</Label>
                <Input
                  id="loanAmount"
                  type="number"
                  placeholder="250000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                />
              </div>

              {/* User Financial Profile Display */}
              <div className="p-4 rounded-lg bg-muted/30 border">
                <h3 className="font-medium text-foreground mb-3">Your Financial Profile</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Monthly Income</span>
                    <div className="font-medium text-foreground">${userFinancialData.monthlyIncome.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Monthly Expenses</span>
                    <div className="font-medium text-foreground">${userFinancialData.monthlyExpenses.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Current Savings</span>
                    <div className="font-medium text-foreground">${userFinancialData.currentSavings.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Credit Score</span>
                    <div className="font-medium text-foreground">{userFinancialData.creditScore}</div>
                  </div>
                </div>
              </div>

              <AnimatedButton 
                onClick={analyzeWithAI} 
                className="w-full bg-gradient-to-r from-primary to-success"
                disabled={!loanAmount}
              >
                <Brain className="w-4 h-4 mr-2" />
                Get AI Loan Suggestions
              </AnimatedButton>
            </CardContent>
          </Card>

          {/* AI Analysis Results */}
          <div className="space-y-6">
            {analysis ? (
              <>
                {/* Payment Summary */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl text-foreground">Payment Analysis</CardTitle>
                    <CardDescription>AI-calculated loan breakdown</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                        <div className="flex items-center space-x-2 mb-2">
                          <DollarSign className="w-4 h-4 text-primary" />
                          <span className="text-sm text-muted-foreground">Monthly Payment</span>
                        </div>
                        <div className="text-2xl font-bold text-primary">${analysis.monthlyPayment}</div>
                      </div>
                      
                      <div className="p-4 rounded-lg bg-muted/30">
                        <span className="text-sm text-muted-foreground">Total Interest</span>
                        <div className="text-xl font-semibold text-foreground">${analysis.totalInterest}</div>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-muted/30">
                      <span className="text-sm text-muted-foreground">Total Payment Over {analysis.suggestedTerm} Years</span>
                      <div className="text-xl font-semibold text-foreground">${analysis.totalPayment}</div>
                    </div>

                    {/* AI Suggested Terms */}
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                      <h4 className="font-medium text-foreground mb-3">AI Suggested Loan Terms</h4>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Loan Type</span>
                          <div className="font-medium text-primary">{analysis.suggestedType}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Interest Rate</span>
                          <div className="font-medium text-primary">{analysis.suggestedRate}%</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Term</span>
                          <div className="font-medium text-primary">{analysis.suggestedTerm} years</div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Credit Score Impact</span>
                        <div className="font-medium text-foreground">{analysis.creditScore}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Affordability</span>
                        <div className="font-medium text-foreground">{analysis.affordability}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Recommendations */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl text-foreground">AI Recommendations</CardTitle>
                    <CardDescription>Personalized insights for your loan</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {analysis.recommendations.map((rec, index) => (
                      <div key={index} className={`p-4 rounded-lg border ${getRecommendationColor(rec.type)}`}>
                        <div className="flex items-start space-x-3">
                          {getRecommendationIcon(rec.type)}
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground mb-1">{rec.title}</h4>
                            <p className="text-sm text-muted-foreground">{rec.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-12 text-center">
                  <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">Ready for AI Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter your loan amount to get AI-powered loan suggestions based on your financial profile
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoanAnalyzer;
