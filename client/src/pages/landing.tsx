import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, CheckCircle, BookOpen, Users, TrendingUp, Shield } from "lucide-react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Landing() {
  const [, setLocation] = useLocation();
  const logoRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // 3D logo animation
    if (logoRef.current) {
      gsap.to(logoRef.current, {
        duration: 4,
        rotationY: 360,
        transformStyle: "preserve-3d",
        perspective: 1000,
        repeat: -1,
        ease: "power2.inOut"
      });
    }

    // Features animation
    if (featuresRef.current) {
      gsap.fromTo(featuresRef.current.children, 
        { 
          opacity: 0, 
          y: 50,
          scale: 0.8,
          rotationX: -20
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationX: 0,
          duration: 1,
          stagger: 0.2,
          ease: "back.out"
        }
      );
    }
  }, []);
  
  const handleLogin = () => {
    setLocation("/auth");
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Animated Background */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/70"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 text-white items-center justify-center p-12 relative z-10">
        <div className="max-w-md text-center">
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "backOut" }}
          >
            <div 
              ref={logoRef}
              className="w-24 h-24 bg-white rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-2xl"
              style={{
                transform: "perspective(1000px) rotateX(10deg) rotateY(10deg)",
                boxShadow: "0 25px 50px rgba(0,0,0,0.3)"
              }}
            >
              <GraduationCap className="text-4xl text-primary" size={48} />
            </div>
            <motion.h1 
              className="text-4xl font-bold mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              E.M.S.U
            </motion.h1>
            <motion.p 
              className="text-primary-foreground/80 text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              Educational Management System United
            </motion.p>
          </motion.div>
          
          <div ref={featuresRef} className="space-y-4 text-left">
            <motion.div 
              className="flex items-center space-x-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm"
              whileHover={{ scale: 1.05, x: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <BookOpen className="text-green-400" size={24} />
              <span className="font-medium">Comprehensive School Management</span>
            </motion.div>
            <motion.div 
              className="flex items-center space-x-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm"
              whileHover={{ scale: 1.05, x: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <TrendingUp className="text-blue-400" size={24} />
              <span className="font-medium">Real-time Analytics & Reports</span>
            </motion.div>
            <motion.div 
              className="flex items-center space-x-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm"
              whileHover={{ scale: 1.05, x: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Users className="text-purple-400" size={24} />
              <span className="font-medium">Multi-Role Access Control</span>
            </motion.div>
            <motion.div 
              className="flex items-center space-x-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm"
              whileHover={{ scale: 1.05, x: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Shield className="text-orange-400" size={24} />
              <span className="font-medium">Mobile-First Design</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10 bg-gradient-to-br from-background/95 to-background/90 backdrop-blur-sm">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-xl mx-auto mb-4 flex items-center justify-center">
              <GraduationCap className="text-2xl text-white" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-foreground">E.M.S.U</h1>
            <p className="text-muted-foreground">Educational Management System</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50, rotateX: -10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <Card className="shadow-2xl border-0 backdrop-blur-sm bg-card/90">
              <CardContent className="p-8">
                <motion.h2 
                  className="text-2xl font-bold text-foreground mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  Welcome Back
                </motion.h2>
                
                <div className="space-y-6">
                  <motion.p 
                    className="text-muted-foreground text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    Click below to sign in with your school credentials
                  </motion.p>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                  >
                    <Button 
                      onClick={handleLogin}
                      className="w-full py-3 text-white font-medium relative overflow-hidden"
                      size="lg"
                    >
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.4 }}
                      >
                        Sign In
                      </motion.span>
                    </Button>
                  </motion.div>
                </div>

                <motion.div 
                  className="mt-6 pt-6 border-t border-border"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.6 }}
                >
                  <p className="text-center text-sm text-muted-foreground">
                    Need an account? <span className="text-primary font-medium">Contact your school administrator</span>
                  </p>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
