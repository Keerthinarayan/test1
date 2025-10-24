import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { CreditCard, Plus, Loader2, CheckCircle, XCircle, Clock, Calendar } from "lucide-react";
import { toast } from "sonner";

const Transactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const [newPayment, setNewPayment] = useState({
    type: 'expense',
    name: '',
    amount: '',
    due_date: '',
    recurrence: 'none',
  });

  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
  });

  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user?.id]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [transactionsRes, paymentsRes] = await Promise.all([
        supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('pending_payments')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_paid', false)
          .order('due_date', { ascending: true }),
      ]);

      if (transactionsRes.error) throw transactionsRes.error;
      if (paymentsRes.error) throw paymentsRes.error;

      setTransactions(transactionsRes.data || []);
      setPendingPayments(paymentsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPayment = async () => {
    if (!newPayment.name || !newPayment.amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsAddingPayment(true);
    try {
      const { error } = await supabase.from('pending_payments').insert([
        {
          user_id: user.id,
          type: newPayment.type,
          name: newPayment.name,
          amount: parseFloat(newPayment.amount),
          due_date: newPayment.due_date || null,
          recurrence: newPayment.recurrence,
          is_paid: false,
        },
      ]);

      if (error) throw error;

      toast.success('Payment added successfully');
      setShowAddDialog(false);
      setNewPayment({
        type: 'expense',
        name: '',
        amount: '',
        due_date: '',
        recurrence: 'none',
      });
      fetchData();
    } catch (error) {
      console.error('Error adding payment:', error);
      toast.error('Failed to add payment');
    } finally {
      setIsAddingPayment(false);
    }
  };

  const handlePayNow = (payment) => {
    setSelectedPayment(payment);
    setShowPaymentDialog(true);
  };

  const processPayment = async () => {
    if (!paymentDetails.cardNumber || !paymentDetails.expiry || !paymentDetails.cvc) {
      toast.error('Please fill in all card details');
      return;
    }

    setIsProcessing(true);
    try {
      console.log('Starting payment process for:', selectedPayment);

      const transactionRes = await supabase.from('transactions').insert([
        {
          user_id: user.id,
          type: selectedPayment.type,
          category: selectedPayment.type,
          amount: selectedPayment.amount,
          description: selectedPayment.name,
          status: 'completed',
          payment_method: 'card',
        },
      ]).select().single();

      console.log('Transaction insert result:', transactionRes);

      if (transactionRes.error) {
        console.error('Transaction insert error:', transactionRes.error);
        throw transactionRes.error;
      }

      const updateRes = await supabase
        .from('pending_payments')
        .update({ is_paid: true })
        .eq('id', selectedPayment.id)
        .select();

      console.log('Pending payment update result:', updateRes);

      if (updateRes.error) {
        console.error('Update error:', updateRes.error);
        throw updateRes.error;
      }

      await new Promise(resolve => setTimeout(resolve, 1500));

      toast.success('Payment processed successfully!');
      setShowPaymentDialog(false);
      setPaymentDetails({ cardNumber: '', expiry: '', cvc: '' });
      setSelectedPayment(null);
      await fetchData();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'expense':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'loan':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'subscription':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-transparent">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Transactions</h1>
          <p className="text-muted-foreground">Manage your expenses, loans, and subscriptions</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Pending Payments</CardTitle>
                    <CardDescription>Items awaiting payment</CardDescription>
                  </div>
                  <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Payment
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Payment</DialogTitle>
                        <DialogDescription>
                          Create a new pending payment for expenses, loans, or subscriptions
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div>
                          <Label htmlFor="type">Type</Label>
                          <Select value={newPayment.type} onValueChange={(value) => setNewPayment({ ...newPayment, type: value })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="expense">Expense</SelectItem>
                              <SelectItem value="loan">Loan</SelectItem>
                              <SelectItem value="subscription">Subscription</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            value={newPayment.name}
                            onChange={(e) => setNewPayment({ ...newPayment, name: e.target.value })}
                            placeholder="e.g., Electric Bill"
                          />
                        </div>
                        <div>
                          <Label htmlFor="amount">Amount</Label>
                          <Input
                            id="amount"
                            type="number"
                            step="0.01"
                            value={newPayment.amount}
                            onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                            placeholder="0.00"
                          />
                        </div>
                        <div>
                          <Label htmlFor="due_date">Due Date (Optional)</Label>
                          <Input
                            id="due_date"
                            type="date"
                            value={newPayment.due_date}
                            onChange={(e) => setNewPayment({ ...newPayment, due_date: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="recurrence">Recurrence</Label>
                          <Select value={newPayment.recurrence} onValueChange={(value) => setNewPayment({ ...newPayment, recurrence: value })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">One-time</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="yearly">Yearly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button onClick={handleAddPayment} disabled={isAddingPayment} className="w-full">
                          {isAddingPayment ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Adding...
                            </>
                          ) : (
                            'Add Payment'
                          )}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  </div>
                ) : pendingPayments.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <div className="bg-muted/50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                      <CreditCard className="w-10 h-10 opacity-50" />
                    </div>
                    <p className="text-lg font-medium mb-1">No pending payments</p>
                    <p className="text-sm">Add a payment to get started</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingPayments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-5 rounded-xl bg-gradient-to-r from-muted/40 to-muted/20 hover:from-muted/60 hover:to-muted/40 transition-all border border-border/50 hover:border-border">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg text-foreground">{payment.name}</h3>
                            <span className={`text-xs px-3 py-1 rounded-full font-medium ${getTypeColor(payment.type)}`}>
                              {payment.type.charAt(0).toUpperCase() + payment.type.slice(1)}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="font-bold text-xl text-foreground">${payment.amount.toFixed(2)}</span>
                            {payment.due_date && (
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                Due: {new Date(payment.due_date).toLocaleDateString()}
                              </span>
                            )}
                            {payment.recurrence !== 'none' && (
                              <span className="text-xs bg-secondary px-2 py-1 rounded-md">
                                {payment.recurrence.charAt(0).toUpperCase() + payment.recurrence.slice(1)}
                              </span>
                            )}
                          </div>
                        </div>
                        <Button onClick={() => handlePayNow(payment)} size="lg" className="bg-green-600 hover:bg-green-700 ml-4">
                          <CreditCard className="w-4 h-4 mr-2" />
                          Pay Now
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50">
              <CardHeader>
                <CardTitle className="text-2xl">Transaction History</CardTitle>
                <CardDescription>All your completed transactions</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <div className="bg-muted/50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-10 h-10 opacity-50" />
                    </div>
                    <p className="text-lg font-medium mb-1">No transactions yet</p>
                    <p className="text-sm">Your payment history will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {transactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-5 rounded-xl bg-gradient-to-r from-muted/30 to-muted/10 hover:from-muted/50 hover:to-muted/30 transition-all border border-border/30">
                        <div className="flex items-center gap-4">
                          <div className="bg-background rounded-full p-2">
                            {getStatusIcon(transaction.status)}
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-semibold text-lg text-foreground">{transaction.description}</h3>
                              <span className={`text-xs px-3 py-1 rounded-full font-medium ${getTypeColor(transaction.type)}`}>
                                {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {new Date(transaction.created_at).toLocaleDateString()} at {new Date(transaction.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-xl text-foreground">
                            ${transaction.amount.toFixed(2)}
                          </span>
                          <p className="text-xs text-muted-foreground capitalize mt-1">
                            {transaction.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="border-0 shadow-lg sticky top-8 bg-gradient-to-br from-card to-card/50">
              <CardHeader>
                <CardTitle className="text-2xl">Summary</CardTitle>
                <CardDescription>Your payment overview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="p-5 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/10 border-2 border-yellow-500/30">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Total Pending</p>
                  <p className="text-3xl font-bold text-foreground">
                    ${pendingPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0).toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {pendingPayments.length} payment{pendingPayments.length !== 1 ? 's' : ''} awaiting
                  </p>
                </div>
                <div className="p-5 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/10 border-2 border-green-500/30">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Total Paid</p>
                  <p className="text-3xl font-bold text-foreground">
                    ${transactions.filter(t => t.status === 'completed').reduce((sum, t) => sum + parseFloat(t.amount), 0).toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {transactions.filter(t => t.status === 'completed').length} completed transaction{transactions.filter(t => t.status === 'completed').length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="space-y-3 pt-4 border-t-2">
                  <p className="text-sm font-semibold text-muted-foreground mb-3">Payment Breakdown</p>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <span className="text-sm font-medium text-foreground">Expenses</span>
                    <span className="font-bold text-lg bg-blue-600 text-white px-3 py-1 rounded-full">
                      {pendingPayments.filter(p => p.type === 'expense').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                    <span className="text-sm font-medium text-foreground">Loans</span>
                    <span className="font-bold text-lg bg-orange-600 text-white px-3 py-1 rounded-full">
                      {pendingPayments.filter(p => p.type === 'loan').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                    <span className="text-sm font-medium text-foreground">Subscriptions</span>
                    <span className="font-bold text-lg bg-purple-600 text-white px-3 py-1 rounded-full">
                      {pendingPayments.filter(p => p.type === 'subscription').length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">Process Payment</DialogTitle>
            <DialogDescription>
              Complete the payment for {selectedPayment?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5 mt-2">
            <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-2 border-blue-500/20">
              <p className="text-sm text-muted-foreground mb-1">Amount to pay</p>
              <p className="text-3xl font-bold text-foreground">
                ${selectedPayment?.amount.toFixed(2)}
              </p>
            </div>
            <div className="space-y-4 bg-muted/30 p-4 rounded-xl">
              <div>
                <Label htmlFor="cardNumber" className="text-sm font-medium">Card Number</Label>
                <Input
                  id="cardNumber"
                  value={paymentDetails.cardNumber}
                  onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
                  placeholder="4242 4242 4242 4242"
                  maxLength="19"
                  className="mt-1.5"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry" className="text-sm font-medium">Expiry</Label>
                  <Input
                    id="expiry"
                    value={paymentDetails.expiry}
                    onChange={(e) => setPaymentDetails({ ...paymentDetails, expiry: e.target.value })}
                    placeholder="MM/YY"
                    maxLength="5"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="cvc" className="text-sm font-medium">CVC</Label>
                  <Input
                    id="cvc"
                    value={paymentDetails.cvc}
                    onChange={(e) => setPaymentDetails({ ...paymentDetails, cvc: e.target.value })}
                    placeholder="123"
                    maxLength="3"
                    className="mt-1.5"
                  />
                </div>
              </div>
            </div>
            <Button onClick={processPayment} disabled={isProcessing} className="w-full h-12 text-base bg-green-600 hover:bg-green-700">
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  Pay ${selectedPayment?.amount.toFixed(2)}
                </>
              )}
            </Button>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <p className="text-xs text-center text-muted-foreground">
                <span className="font-medium">Test Mode:</span> Use card 4242 4242 4242 4242 with any future expiry and any 3-digit CVC
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Transactions;
