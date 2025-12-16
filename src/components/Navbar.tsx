import { motion } from "framer-motion";
import { Compass, Github } from "lucide-react";
import { Button } from "./ui/button";

const Navbar = () => {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto glass-strong rounded-2xl px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-[hsl(190_80%_50%)] flex items-center justify-center">
            <Compass className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">
            Career<span className="text-gradient">Compass</span>
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            How it works
          </Button>
          <Button variant="glass" size="sm">
            <Github className="w-4 h-4" />
            Star on GitHub
          </Button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
