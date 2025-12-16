import { motion } from "framer-motion";
import { Lightbulb, ArrowRight, CheckCircle } from "lucide-react";
import { useState } from "react";

interface SuggestionCardProps {
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  delay?: number;
}

const SuggestionCard = ({ title, description, priority, delay = 0 }: SuggestionCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isApplied, setIsApplied] = useState(false);

  const getPriorityStyles = () => {
    switch (priority) {
      case "high":
        return {
          badge: "bg-destructive/15 text-destructive border-destructive/30",
          glow: "group-hover:shadow-destructive/20",
          label: "High Priority"
        };
      case "medium":
        return {
          badge: "bg-warning/15 text-warning border-warning/30",
          glow: "group-hover:shadow-warning/20",
          label: "Medium Priority"
        };
      case "low":
        return {
          badge: "bg-success/15 text-success border-success/30",
          glow: "group-hover:shadow-success/20",
          label: "Suggested"
        };
    }
  };

  const styles = getPriorityStyles();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group glass rounded-xl p-5 transition-all duration-300 cursor-pointer hover:border-primary/30 ${styles.glow} hover:shadow-lg ${
        isApplied ? "opacity-60" : ""
      }`}
      onClick={() => setIsApplied(!isApplied)}
    >
      <div className="flex items-start gap-4">
        <motion.div
          className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0"
          animate={isHovered ? { rotate: [0, -10, 10, 0] } : {}}
          transition={{ duration: 0.5 }}
        >
          {isApplied ? (
            <CheckCircle className="w-5 h-5 text-success" />
          ) : (
            <Lightbulb className="w-5 h-5 text-primary" />
          )}
        </motion.div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h4 className={`font-semibold ${isApplied ? "line-through text-muted-foreground" : ""}`}>
              {title}
            </h4>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${styles.badge}`}>
              {styles.label}
            </span>
          </div>
          <p className={`text-sm text-muted-foreground leading-relaxed ${isApplied ? "line-through" : ""}`}>
            {description}
          </p>
        </div>
        
        <motion.div
          animate={isHovered && !isApplied ? { x: [0, 5, 0] } : {}}
          transition={{ duration: 0.5, repeat: isHovered ? Infinity : 0 }}
          className="flex-shrink-0"
        >
          <ArrowRight className={`w-5 h-5 transition-colors ${
            isHovered ? "text-primary" : "text-muted-foreground/30"
          }`} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SuggestionCard;
