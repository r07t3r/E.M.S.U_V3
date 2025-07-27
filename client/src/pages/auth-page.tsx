import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, GraduationCap, Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import gsap from "gsap";

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [, setLocation] = useLocation();
  const cardRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  
  const [registerForm, setRegisterForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "",
  });

  useEffect(() => {
    // 3D card animation
    if (cardRef.current) {
      gsap.fromTo(cardRef.current, 
        { 
          opacity: 0, 
          y: 100, 
          rotationX: -20,
          scale: 0.8
        },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          scale: 1,
          duration: 1.2,
          ease: "back.out"
        }
      );
    }

    // Features animation
    if (featuresRef.current) {
      gsap.fromTo(featuresRef.current.children, 
        { 
          opacity: 0, 
          x: -50,
          scale: 0.9
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out"
        }
      );
    }
  }, []);

  // Redirect if already logged in
  if (user) {
    setLocation("/");
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginForm);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerForm.role) return;
    registerMutation.mutate({
      ...registerForm,
      role: registerForm.role as any,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div 
        className="absolute top-10 left-10 w-32 h-32 bg-blue-300/20 rounded-full blur-xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute bottom-10 right-10 w-48 h-48 bg-purple-300/20 rounded-full blur-xl"
        animate={{
          x: [0, -80, 0],
          y: [0, 60, 0],
          scale: [1, 0.8, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left side - Hero section */}
        <motion.div 
          className="text-center md:text-left space-y-6"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "power2.out" }}
        >
          <div className="flex items-center justify-center md:justify-start gap-3 mb-8">
            <motion.div 
              className="bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-lg shadow-xl"
              whileHover={{ 
                scale: 1.1, 
                rotateY: 180,
                boxShadow: "0 25px 50px rgba(0,0,0,0.2)"
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <GraduationCap className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              E.M.S.U
            </h1>
          </div>
          
          <div className="space-y-4">
            <motion.h2 
              className="text-4xl font-bold text-gray-900 dark:text-white leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Educational Management System United
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 dark:text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Comprehensive school management platform designed specifically for Nigerian schools
            </motion.p>
            
            <div ref={featuresRef} className="space-y-3 pt-4">
              <motion.div 
                className="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm shadow-lg"
                whileHover={{ scale: 1.02, x: 10 }}
              >
                <div className="w-3 h-3 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full shadow-lg"></div>
                <span className="text-gray-700 dark:text-gray-300 font-medium">Student & Teacher Management</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm shadow-lg"
                whileHover={{ scale: 1.02, x: 10 }}
              >
                <div className="w-3 h-3 bg-gradient-to-r from-green-600 to-green-400 rounded-full shadow-lg"></div>
                <span className="text-gray-700 dark:text-gray-300 font-medium">Grade & Attendance Tracking</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm shadow-lg"
                whileHover={{ scale: 1.02, x: 10 }}
              >
                <div className="w-3 h-3 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full shadow-lg"></div>
                <span className="text-gray-700 dark:text-gray-300 font-medium">Fee Management & Communication</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm shadow-lg"
                whileHover={{ scale: 1.02, x: 10 }}
              >
                <div className="w-3 h-3 bg-gradient-to-r from-orange-600 to-orange-400 rounded-full shadow-lg"></div>
                <span className="text-gray-700 dark:text-gray-300 font-medium">Multi-Role Dashboard System</span>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Right side - Auth forms */}
        <div ref={cardRef}>
          <Card className="w-full max-w-md mx-auto shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Welcome to E.M.S.U</CardTitle>
              <CardDescription>
                Sign in to your account or create a new one
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="space-y-4 mt-6">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10"
                          value={loginForm.email}
                          onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="pl-10 pr-10"
                          value={loginForm.password}
                          onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Sign In
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="register" className="space-y-4 mt-6">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="register-firstName">First Name</Label>
                        <Input
                          id="register-firstName"
                          type="text"
                          placeholder="First name"
                          value={registerForm.firstName}
                          onChange={(e) => setRegisterForm(prev => ({ ...prev, firstName: e.target.value }))}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="register-lastName">Last Name</Label>
                        <Input
                          id="register-lastName"
                          type="text"
                          placeholder="Last name"
                          value={registerForm.lastName}
                          onChange={(e) => setRegisterForm(prev => ({ ...prev, lastName: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10"
                          value={registerForm.email}
                          onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="register-password"
                          type={showRegisterPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="pl-10 pr-10"
                          value={registerForm.password}
                          onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                        >
                          {showRegisterPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-role">Role</Label>
                      <Select onValueChange={(value) => setRegisterForm(prev => ({ ...prev, role: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="teacher">Teacher</SelectItem>
                          <SelectItem value="parent">Parent</SelectItem>
                          <SelectItem value="principal">Principal</SelectItem>
                          <SelectItem value="proprietor">Proprietor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Create Account
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}