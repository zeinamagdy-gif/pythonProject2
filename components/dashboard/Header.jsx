import React from "react";
import { motion } from "framer-motion";
import { Bell, Search, User, Sun, Moon, LogOut, LayoutDashboard, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = ({ isCollapsed, onLogout, userProfile, showSearch = true }) => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <motion.header 
      className="h-16 border-b border-border/50 bg-card/60 dark:bg-card/30 backdrop-blur-md fixed top-0 right-0 left-0 z-20 flex items-center justify-between px-4"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{ 
        paddingLeft: showSearch ? (isCollapsed ? "88px" : "288px") : "16px",
        left: showSearch ? "0" : "0", 
        transition: "padding-left 0.3s ease-in-out"
      }}
    >
      <div className="flex items-center">
        {showSearch && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input 
              type="text" 
              placeholder="Search reports..." 
              className="h-10 w-64 rounded-md border border-input bg-background pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <Sun className="h-5 w-5 text-yellow-500" />
          <Switch
            id="theme-switcher"
            checked={theme === "dark"}
            onCheckedChange={toggleTheme}
            aria-label="Toggle theme"
          />
          <Moon className="h-5 w-5 text-blue-400" />
        </div>
        <Button variant="ghost" size="icon">
          <Bell size={20} />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <User size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <p className="font-medium">{userProfile?.name || "User"}</p>
              <p className="text-xs text-muted-foreground">{userProfile?.email || "No email"}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              <UserCircle size={16} className="mr-2" />
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/')}>
              <LayoutDashboard size={16} className="mr-2" />
              View Dashboard
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout}>
              <LogOut size={16} className="mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
};

export default Header;