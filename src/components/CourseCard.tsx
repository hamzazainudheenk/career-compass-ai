import { motion } from "framer-motion";
import { ExternalLink, Clock, Star, GraduationCap } from "lucide-react";
import { Button } from "./ui/button";

interface CourseCardProps {
  skill: string;
  course: {
    title: string;
    provider: string;
    duration: string;
    rating: number;
    url: string;
    level: "Beginner" | "Intermediate" | "Advanced";
  };
  delay?: number;
}

const CourseCard = ({ skill, course, delay = 0 }: CourseCardProps) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "text-success bg-success/15";
      case "Intermediate":
        return "text-warning bg-warning/15";
      case "Advanced":
        return "text-destructive bg-destructive/15";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="glass rounded-xl p-4 hover:border-primary/40 transition-all group"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
          <GraduationCap className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              {skill}
            </span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getLevelColor(course.level)}`}>
              {course.level}
            </span>
          </div>
          <h4 className="font-semibold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {course.title}
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">{course.provider}</p>
          
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {course.duration}
            </div>
            <div className="flex items-center gap-1 text-xs text-warning">
              <Star className="w-3 h-3 fill-warning" />
              {course.rating.toFixed(1)}
            </div>
          </div>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="shrink-0 h-8 w-8 p-0 hover:bg-primary/20 hover:text-primary"
          onClick={() => window.open(course.url, "_blank")}
        >
          <ExternalLink className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default CourseCard;
