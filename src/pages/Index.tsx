import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AnalysisSection from "@/components/AnalysisSection";
import ResultsDashboard from "@/components/ResultsDashboard";
import HowItWorksSection from "@/components/HowItWorksSection";
import BatchResultsDashboard from "@/components/BatchResultsDashboard";
import { toast } from "sonner";
import { analyzeResume, saveAnalysisResult, AnalysisResult } from "@/services/analysisService";
import { useUser, useClerk } from "@clerk/react";

type AppState = "landing" | "analysis" | "results" | "batch-results";

const Index = () => {
  const { user } = useUser();
  const { openSignUp } = useClerk();
  const navigate = useNavigate();
  const [appState, setAppState] = useState<AppState>("landing");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingEmail, setIsFetchingEmail] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [batchResults, setBatchResults] = useState<Array<{
    fileName: string;
    jobDescription: string;
    result: AnalysisResult;
  }>>([]);
  const analysisRef = useRef<HTMLDivElement>(null);

  const handleGetStarted = () => {
    if (!user) {
      toast.info("Please sign up to analyze your resume.");
      openSignUp();
      return;
    }

    setAppState("analysis");
    setTimeout(() => {
      analysisRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleFetchEmail = async () => {
    if (!user) {
      toast.info("Please sign in to fetch emails.");
      openSignUp();
      return;
    }

    if (!jobDescription.trim() || jobDescription.trim().length < 50) {
      toast.warning("Please paste a job description (at least 50 characters) before fetching emails.");
      return;
    }

    setIsFetchingEmail(true);
    try {
      const response = await fetch(
        `http://localhost:3001/api/fetch-emails?userId=${user.id}&jobDescription=${encodeURIComponent(jobDescription)}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch emails");
      }

      if (data.count === 0) {
        toast.info("No resume emails found. Make sure emails have 'resume' or 'cv' in the subject or filename.");
        return;
      }

      toast.success(`Successfully analysed ${data.count} resume(s) from your inbox!`);
      setBatchResults(data.results);
      setAppState("batch-results");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error: any) {
      console.error("Error fetching emails:", error);
      toast.error(error.message || "Failed to connect to email worker. Make sure it is running on port 3001.");
    } finally {
      setIsFetchingEmail(false);
    }
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
        {appState === "batch-results" && batchResults.length > 0 ? (
          <motion.div
            key="batch-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="pt-20">
              <BatchResultsDashboard
                results={batchResults}
                onReset={handleReset}
              />
            </div>
          </motion.div>
        ) : appState === "results" && analysisResult ? (
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
                <AnalysisSection 
                  onAnalyze={handleAnalyze} 
                  onFetchEmail={handleFetchEmail}
                  isLoading={isLoading} 
                  isFetchingEmail={isFetchingEmail}
                  jobDescription={jobDescription}
                  onJobDescriptionChange={setJobDescription}
                />
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
