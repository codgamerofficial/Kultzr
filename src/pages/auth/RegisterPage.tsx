import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Checkbox } from '../../components/ui/checkbox';
import { Separator } from '../../components/ui/separator';
import { toast } from 'sonner';
import { Eye, EyeOff, Mail, Lock, User, Phone, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    username: '',
    phone: '',
    acceptTerms: false,
    subscribeNewsletter: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.fullName) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (!formData.acceptTerms) {
      toast.error('Please accept the terms and conditions');
      return;
    }

    if (formData.username && formData.username.length < 3) {
      toast.error('Username must be at least 3 characters');
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await signUp(
        {
          email: formData.email,
          password: formData.password
        },
        {
          full_name: formData.fullName,
          username: formData.username || undefined,
          phone: formData.phone || undefined
        }
      );

      if (error) {
        if (error.message.includes('User already registered')) {
          toast.error('An account with this email already exists');
        } else if (error.message.includes('Password should be at least 6 characters')) {
          toast.error('Password must be at least 6 characters');
        } else {
          toast.error(error.message);
        }
        return;
      }

      toast.success('Account created! Please check your email to verify your account.');
      navigate('/');
      
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-[var(--kultzr-primary)] flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-[var(--kultzr-surface)] border-[var(--kultzr-border)]">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <h1 className="text-3xl font-bold text-[var(--kultzr-accent-neon)] mb-2">
                [KULTZR]
              </h1>
            </motion.div>
            <CardTitle className="text-[var(--kultzr-text-primary)] text-xl">
              Join the Culture
            </CardTitle>
            <CardDescription className="text-[var(--kultzr-text-muted)]">
              Create your account and be part of the streetwear revolution
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-[var(--kultzr-text-primary)]">
                    Full Name *
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--kultzr-text-muted)] h-4 w-4" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="pl-10 bg-[var(--kultzr-primary)] border-[var(--kultzr-border)] text-[var(--kultzr-text-primary)] focus:border-[var(--kultzr-accent-neon)]"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username" className="text-[var(--kultzr-text-primary)]">
                    Username
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--kultzr-text-muted)] h-4 w-4 text-sm">@</span>
                    <Input
                      id="username"
                      type="text"
                      placeholder="johndoe"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      className="pl-10 bg-[var(--kultzr-primary)] border-[var(--kultzr-border)] text-[var(--kultzr-text-primary)] focus:border-[var(--kultzr-accent-neon)]"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[var(--kultzr-text-primary)]">
                  Email *
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--kultzr-text-muted)] h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10 bg-[var(--kultzr-primary)] border-[var(--kultzr-border)] text-[var(--kultzr-text-primary)] focus:border-[var(--kultzr-accent-neon)]"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[var(--kultzr-text-primary)]">
                  Phone
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--kultzr-text-muted)] h-4 w-4" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="pl-10 bg-[var(--kultzr-primary)] border-[var(--kultzr-border)] text-[var(--kultzr-text-primary)] focus:border-[var(--kultzr-accent-neon)]"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[var(--kultzr-text-primary)]">
                  Password *
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--kultzr-text-muted)] h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="At least 6 characters"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-10 pr-10 bg-[var(--kultzr-primary)] border-[var(--kultzr-border)] text-[var(--kultzr-text-primary)] focus:border-[var(--kultzr-accent-neon)]"
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--kultzr-text-muted)] hover:text-[var(--kultzr-accent-neon)]"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-[var(--kultzr-text-primary)]">
                  Confirm Password *
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--kultzr-text-muted)] h-4 w-4" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="pl-10 pr-10 bg-[var(--kultzr-primary)] border-[var(--kultzr-border)] text-[var(--kultzr-text-primary)] focus:border-[var(--kultzr-accent-neon)]"
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--kultzr-text-muted)] hover:text-[var(--kultzr-accent-neon)]"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="acceptTerms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) => handleInputChange('acceptTerms', checked as boolean)}
                    className="border-[var(--kultzr-border)] data-[state=checked]:bg-[var(--kultzr-accent-neon)] data-[state=checked]:border-[var(--kultzr-accent-neon)]"
                  />
                  <Label 
                    htmlFor="acceptTerms" 
                    className="text-sm text-[var(--kultzr-text-muted)] cursor-pointer"
                  >
                    I accept the Terms of Service and Privacy Policy
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="subscribeNewsletter"
                    checked={formData.subscribeNewsletter}
                    onCheckedChange={(checked) => handleInputChange('subscribeNewsletter', checked as boolean)}
                    className="border-[var(--kultzr-border)] data-[state=checked]:bg-[var(--kultzr-accent-neon)] data-[state=checked]:border-[var(--kultzr-accent-neon)]"
                  />
                  <Label 
                    htmlFor="subscribeNewsletter" 
                    className="text-sm text-[var(--kultzr-text-muted)] cursor-pointer"
                  >
                    Subscribe to newsletter for exclusive drops and offers
                  </Label>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[var(--kultzr-accent-neon)] text-[var(--kultzr-primary)] hover:brightness-110 font-semibold py-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            <Separator className="my-6 bg-[var(--kultzr-border)]" />

            <div className="text-center">
              <p className="text-[var(--kultzr-text-muted)] text-sm">
                Already have an account?{' '}
                <Link
                  to="/auth/login"
                  className="text-[var(--kultzr-accent-neon)] hover:underline font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}