import { useLocation } from "wouter";
import { Home, ListChecks, BarChart2, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function MobileNavigation() {
  const [location, setLocation] = useLocation();
  const { logoutMutation } = useAuth();

  const scrollToSection = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="md:hidden bg-secondary border-t border-gray-700 fixed bottom-0 left-0 right-0 z-40">
      <div className="grid grid-cols-4 h-16">
        <button
          className="flex flex-col items-center justify-center text-accent"
          onClick={() => setLocation("/")}
        >
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Home</span>
        </button>
        <button
          className="flex flex-col items-center justify-center text-gray-400 hover:text-accent"
          onClick={() => scrollToSection("bet-form-section")}
        >
          <ListChecks className="h-6 w-6" />
          <span className="text-xs mt-1">Bets</span>
        </button>
        <button
          className="flex flex-col items-center justify-center text-gray-400 hover:text-accent"
          onClick={() => scrollToSection("bet-history-section")}
        >
          <BarChart2 className="h-6 w-6" />
          <span className="text-xs mt-1">History</span>
        </button>
        <button
          className="flex flex-col items-center justify-center text-gray-400 hover:text-accent"
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
        >
          <LogOut className="h-6 w-6" />
          <span className="text-xs mt-1">Logout</span>
        </button>
      </div>
    </div>
  );
}
