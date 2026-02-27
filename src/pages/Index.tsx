import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AnalysisSection from "@/components/AnalysisSection";
import ResultsDashboard from "@/components/ResultsDashboard";
import HowItWorksSection from "@/components/HowItWorksSection";
import { toast } from "sonner";
import { analyzeResume, saveAnalysisResult, AnalysisResult } from "@/services/analysisService";
import { useAuth } from "@/contexts/AuthContext";

type AppState = "landing" | "analysis" | "results";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appState, setAppState] = useState<AppState>("landing");
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const analysisRef = useRef<HTMLDivElement>(null);

  const handleGetStarted = () => {
    if (!user) {
      toast.info("Please sign up to analyze your resume.");
      navigate("/auth?tab=signup");
      return;
    }

    setAppState("analysis");
    setTimeout(() => {
      analysisRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleAnalyze = async (file: File, jobDescription: string) => {
    setIsLoading(true);

    try {
      // Call the service
      const result = await analyzeResume(file, jobDescription);
      setAnalysisResult(result);

      // Save result if user is logged in
      if (user) {
        try {
          await saveAnalysisResult(user.id, file.name, jobDescription, result);
          toast.success("Analysis saved to your history!");
        } catch (error) {
          console.error("Failed to save history", error);
          toast.error("Analysis complete, but failed to save to history.");
        }
      } else {
        toast.success("Analysis complete!", {
          description: "Sign in to save your results history.",
        });
      }

      setAppState("results");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error(error);
      toast.error("Analysis failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAppState("landing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <AnimatePresence mode="wait">
        {appState === "results" && analysisResult ? (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="pt-20">
              <ResultsDashboard result={analysisResult} onReset={handleReset} />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <HeroSection onGetStarted={handleGetStarted} />

            <div id="how-it-works">
              <HowItWorksSection />
            </div>

            <div ref={analysisRef}>
              {appState === "analysis" && (
                <AnalysisSection onAnalyze={handleAnalyze} isLoading={isLoading} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>Career Compass — AI-Powered Resume Matching</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
