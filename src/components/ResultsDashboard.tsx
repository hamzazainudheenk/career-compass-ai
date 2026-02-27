import { motion } from "framer-motion";
import { ArrowLeft, Download, RefreshCw, AlertTriangle, MessageSquare, FileText, Trophy, HeartHandshake, ShieldQuestion, Award } from "lucide-react";
import ScoreGauge from "./ScoreGauge";
import SkillsSection from "./SkillsSection";
import { Button } from "./ui/button";
import { AnalysisResult } from "@/services/analysisService";

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
              <h2 className="text-xl font-semibold mb-6">Candidate Fit Score</h2>
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
            {/* Candidate Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="glass rounded-xl p-6"
            >
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Candidate Summary</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {result.candidateSummary}
              </p>
            </motion.div>
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

            {/* Key Achievements */}
            {result.keyAchievements && result.keyAchievements.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="glass rounded-xl p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="w-5 h-5 text-warning" />
                  <h2 className="text-xl font-semibold">Key Achievements & Metrics</h2>
                </div>
                <ul className="space-y-3">
                  {result.keyAchievements.map((achievement, index) => (
                    <li key={index} className="flex gap-3 text-muted-foreground items-start bg-secondary/30 p-3 rounded-lg border border-border/50">
                      <span className="text-warning mt-0.5">•</span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Seniority & Culture Fit Dual Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.28 }}
                className="glass rounded-xl p-5 border-t-2 border-t-primary"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-lg">Seniority Assessment</h3>
                </div>
                <p className="text-sm text-muted-foreground">{result.seniorityAssessment}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="glass rounded-xl p-5 border-t-2 border-t-success"
              >
                <div className="flex items-center gap-2 mb-2">
                  <HeartHandshake className="w-5 h-5 text-success" />
                  <h3 className="font-semibold text-lg">Culture Fit</h3>
                </div>
                <p className="text-sm text-muted-foreground">{result.cultureFit}</p>
              </motion.div>
            </div>

            {/* Deep Dive Probing Areas */}
            {result.probingAreas && result.probingAreas.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <ShieldQuestion className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold">Technical Probing Areas</h2>
                </div>
                <div className="space-y-3">
                  {result.probingAreas.map((area, index) => (
                    <div key={index} className="glass rounded-xl p-5 border-l-4 border-l-primary/50">
                      <h4 className="font-semibold mb-1">{area.title}</h4>
                      <p className="text-sm text-muted-foreground">{area.description}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Red Flags */}
            {result.redFlags && result.redFlags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="glass rounded-xl p-6 border-l-4 border-l-destructive"
              >
                <div className="flex items-center gap-2 mb-4 text-destructive">
                  <AlertTriangle className="w-5 h-5" />
                  <h2 className="text-xl font-semibold">Potential Red Flags</h2>
                </div>
                <ul className="space-y-2">
                  {result.redFlags.map((flag, index) => (
                    <li key={index} className="flex gap-2 text-muted-foreground items-start">
                      <span className="text-destructive mt-1">•</span>
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Interview Questions */}
            {result.interviewQuestions && result.interviewQuestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="glass rounded-xl p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold">Suggested Interview Questions</h2>
                </div>
                <ul className="space-y-3">
                  {result.interviewQuestions.map((question, index) => (
                    <li key={index} className="flex gap-3 text-muted-foreground items-start bg-secondary/30 p-3 rounded-lg">
                      <span className="font-semibold text-primary">Q{index + 1}.</span>
                      <span>{question}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResultsDashboard;
