import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AnalysisSection from "@/components/AnalysisSection";
import ResultsDashboard from "@/components/ResultsDashboard";
import { toast } from "sonner";

// Mock analysis result for demo
const mockAnalysisResult = {
  fitScore: 72,
  matchedSkills: [
    "React", "TypeScript", "JavaScript", "REST APIs", "Git", 
    "Agile", "Problem Solving", "Team Collaboration"
  ],
  missingSkills: [
    "GraphQL", "AWS", "Docker", "CI/CD", "Kubernetes"
  ],
  unrelatedSkills: [
    "Photoshop", "Video Editing", "Public Speaking"
  ],
  suggestions: [
    {
      title: "Add GraphQL Experience",
      description: "The job requires GraphQL expertise. Consider adding any GraphQL projects or coursework to your resume, or highlight any API development experience that could transfer.",
      priority: "high" as const,
    },
    {
      title: "Highlight Cloud Experience",
      description: "AWS knowledge is important for this role. If you have any cloud experience (even personal projects), make sure to include it prominently.",
      priority: "high" as const,
    },
    {
      title: "Include DevOps Skills",
      description: "Docker and CI/CD are mentioned in requirements. Add any experience with containerization, deployment pipelines, or infrastructure as code.",
      priority: "medium" as const,
    },
    {
      title: "Quantify Your Achievements",
      description: "Your matched skills are strong. Make them more impactful by adding metrics (e.g., 'Improved app performance by 40%').",
      priority: "medium" as const,
    },
    {
      title: "Tailor Your Summary",
      description: "Customize your resume summary to mention the specific technologies and values mentioned in this job description.",
      priority: "low" as const,
    },
  ],
};

type AppState = "landing" | "analysis" | "results";

const Index = () => {
  const [appState, setAppState] = useState<AppState>("landing");
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(mockAnalysisResult);
  const analysisRef = useRef<HTMLDivElement>(null);

  const handleGetStarted = () => {
    setAppState("analysis");
    setTimeout(() => {
      analysisRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleAnalyze = async (file: File, jobDescription: string) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // In production, this would call the backend API
    // For now, we show mock results with slight randomization
    const randomScore = Math.floor(Math.random() * 30) + 55;
    setAnalysisResult({
      ...mockAnalysisResult,
      fitScore: randomScore,
    });
    
    setIsLoading(false);
    setAppState("results");
    toast.success("Analysis complete!", {
      description: `Your resume has a ${randomScore}% match with this job.`,
    });
    
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    setAppState("landing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <AnimatePresence mode="wait">
        {appState === "results" ? (
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
