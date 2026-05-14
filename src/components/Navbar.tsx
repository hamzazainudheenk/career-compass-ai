import { motion } from "framer-motion";
import { Compass, LogOut, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Show, SignInButton, UserButton } from "@clerk/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto glass-strong rounded-2xl px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-[hsl(190_80%_50%)] flex items-center justify-center">
            <Compass className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">
            Career<span className="text-gradient">Compass</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="hidden md:flex text-muted-foreground hover:text-foreground"
            onClick={() => {
              if (window.location.pathname !== "/") {
                navigate("/");
                setTimeout(() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }), 100);
              } else {
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            How it works
          </Button>

          <Show when="signed-in">
            <Button variant="ghost" size="sm" onClick={() => navigate("/history")}>
              <Compass className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <UserButton />
          </Show>
          <Show when="signed-out">
            <SignInButton mode="modal">
              <Button size="sm">Sign In</Button>
            </SignInButton>
          </Show>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
