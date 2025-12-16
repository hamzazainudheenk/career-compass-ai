import { motion } from "framer-motion";
import { ArrowLeft, Download, RefreshCw } from "lucide-react";
import ScoreGauge from "./ScoreGauge";
import SkillsSection from "./SkillsSection";
import SuggestionCard from "./SuggestionCard";
import { Button } from "./ui/button";

interface AnalysisResult {
  fitScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  unrelatedSkills: string[];
  suggestions: Array<{
    title: string;
    description: string;
    priority: "high" | "medium" | "low";
  }>;
}

interface ResultsDashboardProps {
  result: AnalysisResult;
  onReset: () => void;
}

const ResultsDashboard = ({ result, onReset }: ResultsDashboardProps) => {
  return (
    <section className="py-20 px-6 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-10"
        >
          <Button variant="ghost" onClick={onReset} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            New Analysis
          </Button>
          <div className="flex gap-3">
            <Button variant="glass" size="sm">
              <Download className="w-4 h-4" />
              Export PDF
            </Button>
            <Button variant="glass" size="sm" onClick={onReset}>
              <RefreshCw className="w-4 h-4" />
              Re-analyze
            </Button>
          </div>
        </motion.div>
        
        {/* Main content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left column - Score */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="glass rounded-2xl p-8 text-center sticky top-28">
              <h2 className="text-xl font-semibold mb-6">Your Fit Score</h2>
              <ScoreGauge score={result.fitScore} size={220} />
              
              <div className="mt-8 pt-6 border-t border-border">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-success">{result.matchedSkills.length}</p>
                    <p className="text-xs text-muted-foreground">Matched</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-destructive">{result.missingSkills.length}</p>
                    <p className="text-xs text-muted-foreground">Missing</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-muted-foreground">{result.unrelatedSkills.length}</p>
                    <p className="text-xs text-muted-foreground">Other</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Right column - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold mb-4">Skills Analysis</h2>
              <SkillsSection
                matchedSkills={result.matchedSkills}
                missingSkills={result.missingSkills}
                unrelatedSkills={result.unrelatedSkills}
              />
            </motion.div>
            
            {/* Suggestions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-xl font-semibold mb-4">AI Recommendations</h2>
              <div className="space-y-3">
                {result.suggestions.map((suggestion, index) => (
                  <SuggestionCard
                    key={index}
                    title={suggestion.title}
                    description={suggestion.description}
                    priority={suggestion.priority}
                    delay={index * 0.1}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResultsDashboard;
