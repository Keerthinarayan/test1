import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { BarChart3, User, Phone, Calendar, Briefcase, DollarSign, Lock, ArrowRight, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

const CreateProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const navigate = useNavigate();
  const { user, createUserProfile, isAuthenticated } = useAuth();

  // Redirect if not authenticated
  if (!isAuthenticated || !user) {
    navigate('/login', { replace: true });
    return null;
  }

  // Check if email is verified - if not, redirect to login with message
  if (!user.email_confirmed_at) {
    navigate('/login', { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.target);
    const pin = formData.get('pin');
    const confirmPin = formData.get('confirmPin');

    // Validate PIN
    if (pin !== confirmPin) {
      setError('PINs do not match. Please try again.');
      setIsLoading(false);
      return;
    }

    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      setError('PIN must be exactly 4 digits.');
      setIsLoading(false);
      return;
    }

    const profileData = {
      full_name: formData.get('fullName'),
      phone: formData.get('phone'),
      date_of_birth: formData.get('dateOfBirth'),
      occupation: formData.get('occupation'),
      monthly_income: parseFloat(formData.get('monthlyIncome')) || null,
      pin: pin
    };

    console.log('CreateProfile: Submitting profile data:', { ...profileData, pin: '****' });

    try {
      const result = await createUserProfile(profileData);
      
      if (result.success) {
        console.log('CreateProfile: Profile created successfully');
        // Mark PIN as verified for this session since they just created it
        try {
          sessionStorage.setItem(`pin_verified_${user.id}`, 'true');
        } catch (err) {
          console.warn('CreateProfile: Could not set pin verification in sessionStorage', err);
        }
        // For new users, redirect to Add Bank Account page first
        navigate('/add-bank-account', { replace: true });
      } else {
        setError(result.error || 'Failed to create profile');
      }
    } catch (err) {
      console.error('CreateProfile: Error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-success/5 to-background flex items-center justify-center p-4 relative"><div className="w-full max-w-2xl relative z-10">
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
              <User className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Complete Your Profile
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Help us personalize your financial experience
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
              {/* Name and Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Date of Birth and Occupation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation *</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="occupation"
                      name="occupation"
                      type="text"
                      placeholder="Your job title/profession"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Monthly Income */}
              <div className="space-y-2">
                <Label htmlFor="monthlyIncome">Monthly Income *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="monthlyIncome"
                    name="monthlyIncome"
                    type="number"
                    placeholder="Enter your monthly income"
                    className="pl-10"
                    min="0"
                    step="100"
                    required
                  />
                </div>
              </div>

              {/* PIN Setup */}
              <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
                <h3 className="text-lg font-semibold text-foreground flex items-center">
                  <Lock className="w-5 h-5 mr-2" />
                  Set Security PIN
                </h3>
                <p className="text-sm text-muted-foreground">
                  Create a 4-digit PIN for secure access to your account
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pin">PIN (4 digits) *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="pin"
                        name="pin"
                        type={showPin ? "text" : "password"}
                        placeholder="Enter 4-digit PIN"
                        className="pl-10 pr-10"
                        maxLength="4"
                        pattern="[0-9]{4}"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPin(!showPin)}
                      >
                        {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPin">Confirm PIN *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="confirmPin"
                        name="confirmPin"
                        type={showConfirmPin ? "text" : "password"}
                        placeholder="Confirm 4-digit PIN"
                        className="pl-10 pr-10"
                        maxLength="4"
                        pattern="[0-9]{4}"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowConfirmPin(!showConfirmPin)}
                      >
                        {showConfirmPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-success"
                disabled={isLoading}
              >
                {isLoading ? "Creating Profile..." : "Continue"}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Your information is secure and will be used to personalize your financial experience
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateProfile;
