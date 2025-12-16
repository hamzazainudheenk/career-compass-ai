import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import FileUploader from "./FileUploader";
import JDTextArea from "./JDTextArea";
import { Button } from "./ui/button";

interface AnalysisSectionProps {
  onAnalyze: (file: File, jobDescription: string) => void;
  isLoading: boolean;
}

const AnalysisSection = ({ onAnalyze, isLoading }: AnalysisSectionProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");

  const handleAnalyze = () => {
    if (selectedFile && jobDescription.trim()) {
      onAnalyze(selectedFile, jobDescription);
    }
  };

  const isValid = selectedFile && jobDescription.trim().length > 50;

  return (
    <section id="analysis" className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Start Your Analysis
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Upload your resume and paste the job description you're interested in. 
            Our AI will analyze the match and provide detailed insights.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Resume Upload */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-1">Step 1: Upload Resume</h3>
              <p className="text-sm text-muted-foreground">Your resume will be analyzed securely</p>
            </div>
            <FileUploader onFileSelect={setSelectedFile} />
          </motion.div>
          
          {/* Job Description */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-1">Step 2: Paste Job Description</h3>
              <p className="text-sm text-muted-foreground">Copy the full job posting for best results</p>
            </div>
            <JDTextArea
              value={jobDescription}
              onChange={setJobDescription}
              placeholder="Paste the complete job description here including requirements, qualifications, responsibilities..."
            />
          </motion.div>
        </div>
        
        {/* Analyze Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 text-center"
        >
          <Button
            variant="hero"
            size="xl"
            onClick={handleAnalyze}
            disabled={!isValid || isLoading}
            className="min-w-[250px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                Analyze Match
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </Button>
          {!isValid && selectedFile && (
            <p className="mt-3 text-sm text-muted-foreground">
              Please add a job description (at least 50 characters)
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default AnalysisSection;
