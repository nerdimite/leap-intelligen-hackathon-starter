import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    return (
      <Button
        variant="ghost"
        className="rounded-full"
        size="icon"
        onClick={(e) => {
          e.preventDefault();
          setTheme(theme === "dark" ? "light" : "dark");
        }}
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 ease-in-out transition-all duration-300 dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 ease-in-out transition-all duration-300 dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  export default ThemeToggle;