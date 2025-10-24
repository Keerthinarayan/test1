import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarChart3, Shield, ArrowRight, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

const EnterPin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pin, setPin] = useState('');
  const [attempts, setAttempts] = useState(0);
  const navigate = useNavigate();
  const { user, verifySecretPin, isAuthenticated, signOut } = useAuth();

  // Redirect if not authenticated
  if (!isAuthenticated || !user) {
    navigate('/login', { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (pin.length !== 4) {
      setError('Please enter your 4-digit PIN');
      setIsLoading(false);
      return;
    }

    console.log('EnterPin: Verifying PIN');

    try {
      const result = await verifySecretPin(pin);
      
      if (result.success) {
        console.log('EnterPin: PIN verified successfully');
        // Mark PIN as verified in session storage
        sessionStorage.setItem(`pin_verified_${user.id}`, 'true');
        navigate('/dashboard', { replace: true });
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        if (newAttempts >= 3) {
          setError('Too many failed attempts. For security, you have been signed out.');
          setTimeout(async () => {
            await signOut();
            navigate('/login', { replace: true });
          }, 2000);
        } else {
          setError(`Incorrect PIN. ${3 - newAttempts} attempts remaining.`);
        }
        setPin(''); // Clear PIN input
      }
    } catch (err) {
      console.error('EnterPin: Error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinChange = (value) => {
    // Only allow numbers and limit to 4 digits
    const numericValue = value.replace(/\D/g, '').slice(0, 4);
    setPin(numericValue);
    
    // Clear error when user starts typing
    if (error && numericValue.length > 0) {
      setError(null);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-success/5 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-success rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">Finatics.AI</span>
          </Link>
        </div>

        <Card className="border-0 shadow-2xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Enter Security PIN
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Welcome back, {user?.user_metadata?.full_name || user?.email}! <br />
              Please enter your 4-digit PIN to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="pin">Security PIN</Label>
                <Input
                  id="pin"
                  type="password"
                  placeholder="••••••"
                  value={pin}
                  onChange={(e) => handlePinChange(e.target.value)}
                  className="text-center text-3xl tracking-[0.5em] font-mono"
                  maxLength={4}
                  autoFocus
                  required
                />
                <p className="text-xs text-muted-foreground text-center">
                  Enter your 4-digit security PIN
                </p>
              </div>

              {/* PIN input progress indicator */}
              <div className="flex justify-center space-x-2">
                {[...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full border-2 ${
                      index < pin.length
                        ? 'bg-primary border-primary'
                        : 'bg-transparent border-muted'
                    }`}
                  />
                ))}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-success"
                disabled={isLoading || pin.length !== 4 || attempts >= 3}
              >
                {isLoading ? "Verifying..." : "Access Dashboard"}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Sign out and use different account
                </Button>
              </div>
            </form>

            {attempts > 0 && attempts < 3 && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs text-amber-800 text-center">
                  <AlertCircle className="w-4 h-4 inline mr-1" />
                  Failed attempts: {attempts}/3. Account will be locked after 3 failed attempts.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Forgot your PIN? Contact support for assistance
          </p>
        </div>
      </div>
    </div>
  );
};

export default EnterPin;
