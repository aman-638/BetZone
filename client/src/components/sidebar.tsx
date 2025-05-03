import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, BarChart2, LogOut, DollarSign, User } from "lucide-react";

export function Sidebar() {
  const { user, balance, logoutMutation } = useAuth();
  const [location, setLocation] = useLocation();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const scrollToSection = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-gray-700 bg-secondary">
      <nav className="flex-1 pt-5 pb-4 overflow-y-auto">
        <div className="px-4 mb-6">
          <div className="flex items-center p-2 rounded-lg bg-secondary-foreground/30">
            <div className="mr-3 h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
              <User className="h-6 w-6 text-gray-300" />
            </div>
            <div>
              <p className="text-sm font-medium">
                {user?.username.split("@")[0] || "User"}
              </p>
              <p className="text-xs text-muted-foreground">{user?.username}</p>
            </div>
          </div>
        </div>

        <div className="px-2 space-y-1">
          <Button
            variant="ghost"
            className={`w-full justify-start ${
              location === "/"
                ? "bg-secondary-foreground/30 text-white"
                : "text-gray-300 hover:text-white"
            }`}
            onClick={() => setLocation("/")}
          >
            <Home className="mr-3 h-5 w-5 text-accent" />
            Dashboard
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start text-gray-300 hover:text-white"
            onClick={() => scrollToSection("bet-form-section")}
          >
            <DollarSign className="mr-3 h-5 w-5 text-gray-400 group-hover:text-accent" />
            My Bets
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start text-gray-300 hover:text-white"
            onClick={() => scrollToSection("bet-history-section")}
          >
            <BarChart2 className="mr-3 h-5 w-5 text-gray-400 group-hover:text-accent" />
            Bet History
          </Button>

          <div className="pt-6">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:text-white"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-accent" />
              {logoutMutation.isPending ? "Logging out..." : "Log out"}
            </Button>
          </div>
        </div>
      </nav>
    </aside>
  );
}
