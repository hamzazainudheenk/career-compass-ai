import { motion } from "framer-motion";
import { Check, X, Minus } from "lucide-react";

interface SkillPillProps {
  skill: string;
  type: "matched" | "missing" | "unrelated";
  delay?: number;
}

const SkillPill = ({ skill, type, delay = 0 }: SkillPillProps) => {
  const getStyles = () => {
    switch (type) {
      case "matched":
        return {
          bg: "bg-success/15 border-success/30 hover:bg-success/25",
          text: "text-success",
          icon: Check,
        };
      case "missing":
        return {
          bg: "bg-destructive/15 border-destructive/30 hover:bg-destructive/25",
          text: "text-destructive",
          icon: X,
        };
      case "unrelated":
        return {
          bg: "bg-muted/50 border-border hover:bg-muted",
          text: "text-muted-foreground",
          icon: Minus,
        };
    }
  };

  const styles = getStyles();
  const Icon = styles.icon;

  return (
    <motion.span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${styles.bg} ${styles.text}`}
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ scale: 1.05 }}
    >
      <Icon className="w-3.5 h-3.5" />
      {skill}
    </motion.span>
  );
};

export default SkillPill;
