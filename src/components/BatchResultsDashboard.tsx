import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Trophy, AlertTriangle, ChevronRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnalysisResult } from "@/services/analysisService";
import ResultsDashboard from "@/components/ResultsDashboard";

interface BatchResult {
  fileName: string;
  jobDescription: string;
  result: AnalysisResult;
}

interface BatchResultsDashboardProps {
  results: BatchResult[];
  onReset: () => void;
}

const getScoreColor = (score: number) => {
  if (score >= 75) return "text-green-400";
  if (score >= 50) return "text-yellow-400";
  return "text-red-400";
};

const getScoreBg = (score: number) => {
  if (score >= 75) return "border-l-green-500";
  if (score >= 50) return "border-l-yellow-500";
  return "border-l-red-500";
};

const getRecommendationBadge = (score: number) => {
  if (score >= 75) return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Shortlist</Badge>;
  if (score >= 50) return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Maybe</Badge>;
  return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Reject</Badge>;
};

const BatchResultsDashboard = ({ results, onReset }: BatchResultsDashboardProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const sorted = [...results].sort((a, b) => b.result.fitScore - a.result.fitScore);

  // Drill into single candidate view
  if (selectedIndex !== null) {
    return (
      <div className="min-h-screen bg-background">
        <div className="fixed top-4 left-4 z-50">
          <Button
            variant="glass"
            size="sm"
            onClick={() => setSelectedIndex(null)}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Inbox Results
          </Button>
        </div>
        <ResultsDashboard
          result={sorted[selectedIndex].result}
          onReset={() => setSelectedIndex(null)}
        />
      </div>
    );
  }

  // Leaderboard view
  return (
    <section className="py-20 px-6 min-h-screen">
      <div className="max-w-4xl mx-auto">
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
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Gmail Inbox Results</h1>
              <p className="text-muted-foreground text-sm">
                {results.length} resume{results.length !== 1 ? "s" : ""} analysed · ranked by AI fit score
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="glass rounded-xl p-5 mb-8 grid grid-cols-3 gap-4 text-center"
        >
          <div>
            <p className="text-2xl font-bold text-green-400">
              {sorted.filter(r => r.result.fitScore >= 75).length}
            </p>
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Trophy className="w-3 h-3" /> Shortlist
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold text-yellow-400">
              {sorted.filter(r => r.result.fitScore >= 50 && r.result.fitScore < 75).length}
            </p>
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Users className="w-3 h-3" /> Maybe
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-400">
              {sorted.filter(r => r.result.fitScore < 50).length}
            </p>
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Reject
            </p>
          </div>
        </motion.div>

        {/* Ranked list */}
        <div className="space-y-4">
          {sorted.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + index * 0.07 }}
              onClick={() => setSelectedIndex(index)}
              className={`glass rounded-xl p-5 border-l-4 ${getScoreBg(item.result.fitScore)} cursor-pointer hover:bg-white/5 transition-all duration-200 group`}
            >
              <div className="flex items-center justify-between gap-4">
                {/* Rank + Info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <span className="text-2xl font-black text-muted-foreground/40 w-8 shrink-0">
                    #{index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-semibold truncate">{item.fileName}</p>
                      {getRecommendationBadge(item.result.fitScore)}
                      {item.result.redFlags && item.result.redFlags.length > 0 && (
                        <Badge variant="outline" className="text-destructive border-destructive/30 text-xs">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          {item.result.redFlags.length} flag{item.result.redFlags.length > 1 ? "s" : ""}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.result.candidateSummary}
                    </p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {item.result.matchedSkills?.slice(0, 3).map((skill, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {(item.result.matchedSkills?.length ?? 0) > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{item.result.matchedSkills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Score + Arrow */}
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <p className={`text-3xl font-black ${getScoreColor(item.result.fitScore)}`}>
                      {item.result.fitScore}
                    </p>
                    <p className="text-xs text-muted-foreground">fit score</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 text-center"
        >
          <Button variant="outline" onClick={onReset}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Start New Analysis
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default BatchResultsDashboard;
