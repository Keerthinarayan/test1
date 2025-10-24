import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { BarChart3, Mail, Lock, User, ArrowRight, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState("signin");
  const [isSignUpInProgress, setIsSignUpInProgress] = useState(false);
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showSignInConfirmPassword, setShowSignInConfirmPassword] = useState(false);
  const [showSignUpConfirmPassword, setShowSignUpConfirmPassword] = useState(false);
  const [signUpPassword, setSignUpPassword] = useState('');
  const navigate = useNavigate();
  const { signIn, signUp, isAuthenticated, loading, user, checkUserStatus, checkEmailVerification } = useAuth();

  // Password validation functions
  const hasMinLength = signUpPassword.length >= 8;
  const hasMaxLength = signUpPassword.length <= 20;
  const hasCapitalLetter = /[A-Z]/.test(signUpPassword);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(signUpPassword);
  const isValidLength = hasMinLength && hasMaxLength;
  const isPasswordValid = isValidLength && hasCapitalLetter && hasSpecialChar;

  // Clear messages when switching tabs
  const handleTabChange = (value) => {
    setActiveTab(value);
    setError(null);
    setMessage(null);
    setShowSignInPassword(false);
    setShowSignUpPassword(false);
    setShowSignInConfirmPassword(false);
    setShowSignUpConfirmPassword(false);
    setSignUpPassword('');
  };

  // No automatic redirects - let manual navigation handle the flow

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-success/5 to-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    
    // Validate password confirmation
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please try again.');
      setIsLoading(false);
      return;
    }
    
    console.log('SignIn: Attempting to authenticate:', email);
    
    try {
      const { data, error } = await signIn(email, password);
      
      console.log('SignIn: Response:', { 
        hasData: !!data, 
        hasUser: !!data?.user, 
        userEmail: data?.user?.email,
        error: error?.message 
      });
      
      if (error) {
        // Handle specific error cases for better user experience
        if (error.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials or sign up if you don\'t have an account.');
        } else if (error.message.includes('Email not confirmed')) {
          setError('Please check your email and click the confirmation link before signing in.');
        } else if (error.message.includes('User not found')) {
          setError('No account found with this email. Please sign up first.');
        } else {
          setError(error.message);
        }
        console.error('SignIn: Error:', error);
      } else if (data?.user) {
        console.log('SignIn: Successful login for:', data.user.email);
        // Clear PIN verification for existing users so they need to enter PIN
        try {
          sessionStorage.removeItem(`pin_verified_${data.user.id}`);
        } catch (err) {
          console.warn('SignIn: Could not clear pin verification from sessionStorage', err);
        }
        // For sign-in, redirect to dashboard (ProtectedRoute will handle PIN check)
        navigate('/dashboard', { replace: true });
      } else {
        console.warn('SignIn: No error but no user data received');
        setError('Login failed - please check your credentials');
      }
    } catch (err) {
      console.error('SignIn: Unexpected error:', err);
      setError('An unexpected error occurred: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const fullName = formData.get('name');
    
    // Validate password confirmation
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please try again.');
      setIsLoading(false);
      return;
    }

    // Validate password requirements
    if (password.length < 8 || password.length > 20) {
      setError('Password must be between 8-20 characters long.');
      setIsLoading(false);
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError('Password must contain at least 1 capital letter.');
      setIsLoading(false);
      return;
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      setError('Password must contain at least 1 special character.');
      setIsLoading(false);
      return;
    }
    
    console.log('=== SIGNUP PROCESS START ===');
    console.log('SignUp: Email:', email);
    console.log('SignUp: Current URL before signup:', window.location.href);
    
    try {
      const { data, error } = await signUp(email, password, {
        full_name: fullName
      });
      
      console.log('SignUp: Supabase response received');
      console.log('SignUp: Error:', error?.message || 'None');
      console.log('SignUp: User created:', !!data?.user);
      
      if (error) {
        console.log('SignUp: Handling error case');
        setError(error.message);
      } else if (data?.user) {
        console.log('SignUp: SUCCESS - User created:', data.user.email);
        
        // Show verification message on the same page
        setMessage(`Account created successfully! Please check your email (${email}) for a verification link. After verifying your email, you can sign in.`);
        
        // Switch to sign-in tab after showing the message
        setTimeout(() => {
          setActiveTab('signin');
        }, 2000);
      } else {
        console.log('SignUp: No user data received');
        setError('Account creation failed - please try again');
      }
    } catch (err) {
      console.error('SignUp: Exception caught:', err);
      setError('An unexpected error occurred: ' + err.message);
    } finally {
      console.log('SignUp: Setting loading to false');
      setIsLoading(false);
      console.log('=== SIGNUP PROCESS END ===');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-success/5 to-background flex items-center justify-center p-4 relative"><div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-success rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">Finatics.AI</span>
          </Link>
        </div>

        <Card className="border-0 shadow-2xl bg-card/95 backdrop-blur-md dark:bg-slate-900/95">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-foreground">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Sign in to access your financial dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="space-y-4 mt-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {message && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{message}</AlertDescription>
                  </Alert>
                )}
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password"
                        type={showSignInPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowSignInPassword(!showSignInPassword)}
                      >
                        {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="confirm-password"
                        name="confirmPassword"
                        type={showSignInConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowSignInConfirmPassword(!showSignInConfirmPassword)}
                      >
                        {showSignInConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <Link 
                      to="/forgot-password" 
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <AnimatedButton 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-primary to-success whitespace-nowrap"
                    disabled={isLoading}
                  >
                    <span className="flex items-center justify-center">
                      {isLoading ? "Signing in..." : "Sign In"}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </span>
                  </AnimatedButton>
                </form>
                
                {/* Temporary Test Button */}
                <AnimatedButton 
                  type="button" 
                  variant="outline"
                  className="w-full mt-2" 
                  onClick={() => {
                    console.log('Test: Navigating to verify-email page from:', window.location.pathname);
                    navigate('/verify-email');
                  }}
                >
                  🔧 Test Navigate to Verify Email
                </AnimatedButton>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4 mt-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {message && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{message}</AlertDescription>
                  </Alert>
                )}
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter your full name"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        name="password"
                        type={showSignUpPassword ? "text" : "password"}
                        placeholder="Create a password"
                        className="pl-10 pr-10"
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                      >
                        {showSignUpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="signup-confirm-password"
                        name="confirmPassword"
                        type={showSignUpConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowSignUpConfirmPassword(!showSignUpConfirmPassword)}
                      >
                        {showSignUpConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Password Requirements */}
                  {signUpPassword.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">
                        Password Requirements:
                      </div>
                      <div className="space-y-1">
                        <div className={`flex items-center space-x-2 text-xs ${isValidLength ? 'text-green-600' : 'text-muted-foreground'}`}>
                          <div className={`w-2 h-2 rounded-full ${isValidLength ? 'bg-green-600' : 'bg-muted'}`}></div>
                          <span>8-20 characters {signUpPassword.length > 0 && `(${signUpPassword.length})`}</span>
                        </div>
                        <div className={`flex items-center space-x-2 text-xs ${hasCapitalLetter ? 'text-green-600' : 'text-muted-foreground'}`}>
                          <div className={`w-2 h-2 rounded-full ${hasCapitalLetter ? 'bg-green-600' : 'bg-muted'}`}></div>
                          <span>At least 1 capital letter (A-Z)</span>
                        </div>
                        <div className={`flex items-center space-x-2 text-xs ${hasSpecialChar ? 'text-green-600' : 'text-muted-foreground'}`}>
                          <div className={`w-2 h-2 rounded-full ${hasSpecialChar ? 'bg-green-600' : 'bg-muted'}`}></div>
                          <span>At least 1 special character (!@#$%^&*)</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <AnimatedButton 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-primary to-success whitespace-nowrap"
                    disabled={isLoading || !isPasswordValid}
                  >
                    <span className="flex items-center justify-center">
                      {isLoading ? "Creating account..." : "Create Account"}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </span>
                  </AnimatedButton>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              By signing in, you agree to our{" "}
              <Link to="/terms" className="text-primary hover:text-primary/80">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-primary hover:text-primary/80">
                Privacy Policy
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link 
            to="/" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
