import { useAuth } from "@/hooks/use-auth";
import { DollarSign, User } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function Header() {
  const { user, balance, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="bg-secondary border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-primary">BetZone</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-secondary-foreground/30 px-3 py-1 rounded-full flex items-center">
              <DollarSign className="h-4 w-4 text-[#10B981] mr-1" />
              <span className="text-sm font-medium">${balance.toFixed(2)}</span>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="h-8 w-8 rounded-full bg-primary p-0 flex items-center justify-center"
                >
                  <span className="font-semibold">{user?.username.charAt(0).toUpperCase() || 'U'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center p-2">
                  <div className="mr-2 h-8 w-8 rounded-full bg-secondary-foreground/30 flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium truncate">{user?.username}</p>
                  </div>
                </div>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}

// Import LogOut icon since it's used in the component
import { LogOut } from "lucide-react";
