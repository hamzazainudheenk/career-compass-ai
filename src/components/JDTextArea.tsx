import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Sparkles } from "lucide-react";
import { Textarea } from "./ui/textarea";

interface JDTextAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const JDTextArea = ({ value, onChange, placeholder }: JDTextAreaProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;

  return (
    <div className="w-full">
      <motion.div
        className={`relative rounded-xl border-2 transition-all duration-300 ${
          isFocused 
            ? "border-primary bg-card shadow-lg shadow-primary/10" 
            : "border-border bg-card/50 hover:border-border/80"
        }`}
        animate={isFocused ? { scale: 1.01 } : { scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border/50">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
            isFocused ? "bg-primary/20" : "bg-secondary"
          }`}>
            <FileText className={`w-4 h-4 transition-colors ${isFocused ? "text-primary" : "text-muted-foreground"}`} />
          </div>
          <span className="text-sm font-medium text-muted-foreground">Job Description</span>
          {wordCount > 0 && (
            <span className="ml-auto text-xs text-muted-foreground/60">
              {wordCount} words
            </span>
          )}
        </div>
        
        {/* Textarea */}
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder || "Paste the job description here..."}
          className="min-h-[250px] border-0 bg-transparent resize-none focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground/50 p-4"
        />
        
        {/* Footer hint */}
        <div className="px-4 py-2 border-t border-border/50 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs text-muted-foreground">
            Include requirements, qualifications, and responsibilities for best results
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default JDTextArea;
