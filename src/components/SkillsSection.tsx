import { motion, AnimatePresence } from "framer-motion";
import SkillPill from "./SkillPill";
import { CheckCircle2, XCircle, MinusCircle } from "lucide-react";

interface SkillsSectionProps {
  matchedSkills: string[];
  missingSkills: string[];
  unrelatedSkills: string[];
}

const SkillsSection = ({ matchedSkills, missingSkills, unrelatedSkills }: SkillsSectionProps) => {

  return (
    <div className="space-y-6">
      {/* Matched Skills */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass rounded-xl p-5"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-success" />
          </div>
          <div>
            <h3 className="font-semibold">Matched Skills</h3>
            <p className="text-xs text-muted-foreground">Skills found in both your resume and the job description</p>
          </div>
          <span className="ml-auto text-2xl font-bold text-success">{matchedSkills.length}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {matchedSkills.map((skill, index) => (
            <SkillPill key={skill} skill={skill} type="matched" delay={index * 0.05} />
          ))}
        </div>
      </motion.div>

      {/* Missing Skills */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="glass rounded-xl p-5"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-destructive/20 flex items-center justify-center">
            <XCircle className="w-4 h-4 text-destructive" />
          </div>
          <div>
            <h3 className="font-semibold">Missing Skills</h3>
            <p className="text-xs text-muted-foreground">Skills required by the job but not found in your resume</p>
          </div>
          <span className="ml-auto text-2xl font-bold text-destructive">{missingSkills.length}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {missingSkills.map((skill, index) => (
            <SkillPill key={skill} skill={skill} type="missing" delay={index * 0.05} />
          ))}
        </div>


      </motion.div>

      {/* Unrelated Skills */}
      {unrelatedSkills.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="glass rounded-xl p-5"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
              <MinusCircle className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold">Other Skills</h3>
              <p className="text-xs text-muted-foreground">Skills in your resume not specifically mentioned in this job</p>
            </div>
            <span className="ml-auto text-2xl font-bold text-muted-foreground">{unrelatedSkills.length}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {unrelatedSkills.map((skill, index) => (
              <SkillPill key={skill} skill={skill} type="unrelated" delay={index * 0.05} />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SkillsSection;
