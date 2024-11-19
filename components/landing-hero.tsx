"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle, Shield, Heart, LogOut } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuthStore } from "@/lib/firebase";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";

export function LandingHero() {
  const { user } = useAuthStore();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Signed out successfully",
        description: "Come back soon!",
      });
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-8"
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 text-transparent bg-clip-text">
              WhisperSpace
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A safe, anonymous space where you can express yourself freely and find
            the support you need. Connect with others who understand.
          </p>
          <div className="flex justify-center gap-4">
            {user ? (
              <>
                <Link href="/join">
                  <Button size="lg" className="rounded-full">
                    Join Support Group
                    <MessageCircle className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="rounded-full"
                  onClick={handleSignOut}
                >
                  Sign Out
                  <LogOut className="ml-2 h-5 w-5" />
                </Button>
              </>
            ) : (
              <Link href="/auth">
                <Button size="lg" className="rounded-full">
                  Get Started
                  <MessageCircle className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card">
            <Shield className="h-12 w-12 text-blue-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">100% Anonymous</h3>
            <p className="text-muted-foreground">
              Your privacy is our top priority. No personal information required.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card">
            <MessageCircle className="h-12 w-12 text-violet-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Smart Matching</h3>
            <p className="text-muted-foreground">
              Connect with people who share similar experiences and concerns.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card">
            <Heart className="h-12 w-12 text-pink-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Safe Space</h3>
            <p className="text-muted-foreground">
              Moderated environment ensuring respectful and supportive interactions.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}