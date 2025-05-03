import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";

interface MatchCardProps {
  match: {
    id: string;
    league: string;
    sport: string;
    startTime: string;
    startingIn: string;
    teams: {
      home: {
        name: string;
        initial: string;
        odds: number;
      };
      away: {
        name: string;
        initial: string;
        odds: number;
      };
    };
  };
  isSelected: boolean;
  onSelect: () => void;
  onSelectTeam: (team: string) => void;
  selectedTeam: string;
}

export function MatchCard({ match, isSelected, onSelect, onSelectTeam, selectedTeam }: MatchCardProps) {
  const handleTeamSelect = (team: string) => {
    if (!isSelected) {
      onSelect();
    }
    onSelectTeam(team);
  };

  // Format date from ISO string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + 
           ', ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <div 
      className={`bg-secondary rounded-xl overflow-hidden shadow-lg border ${
        isSelected ? 'border-primary' : 'border-gray-700'
      } relative card-hover transition-all`}
      onClick={onSelect}
    >
      <div className="absolute top-0 right-0 bg-primary text-white px-2 py-1 text-xs font-semibold rounded-bl">
        {match.startingIn}
      </div>
      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <PlayCircle className="h-5 w-5 text-accent mr-1" />
            <span className="text-sm font-semibold text-gray-300">{match.league}</span>
          </div>
          <span className="text-xs text-gray-400">{match.sport}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex flex-col items-center text-center w-2/5">
            <div className="w-12 h-12 bg-secondary-foreground/20 rounded-full flex items-center justify-center mb-2">
              <span className="text-lg font-bold">{match.teams.home.initial}</span>
            </div>
            <h3 className="font-semibold text-white">{match.teams.home.name}</h3>
          </div>
          
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-400 mb-1">VS</span>
            <span className="text-xs text-gray-500">{formatDate(match.startTime)}</span>
          </div>
          
          <div className="flex flex-col items-center text-center w-2/5">
            <div className="w-12 h-12 bg-secondary-foreground/20 rounded-full flex items-center justify-center mb-2">
              <span className="text-lg font-bold">{match.teams.away.initial}</span>
            </div>
            <h3 className="font-semibold text-white">{match.teams.away.name}</h3>
          </div>
        </div>
        
        <div className="mt-6 flex justify-between">
          <Button
            variant="secondary"
            className={`w-[48%] group ${selectedTeam === 'home' ? 'bg-primary hover:bg-primary/90' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              handleTeamSelect('home');
            }}
          >
            {match.teams.home.name}
            <span className={`ml-2 ${selectedTeam === 'home' ? 'bg-accent' : 'bg-primary'} px-2 py-0.5 rounded text-xs group-hover:bg-accent`}>
              {match.teams.home.odds.toFixed(2)}
            </span>
          </Button>
          <Button
            variant="secondary"
            className={`w-[48%] group ${selectedTeam === 'away' ? 'bg-primary hover:bg-primary/90' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              handleTeamSelect('away');
            }}
          >
            {match.teams.away.name}
            <span className={`ml-2 ${selectedTeam === 'away' ? 'bg-accent' : 'bg-primary'} px-2 py-0.5 rounded text-xs group-hover:bg-accent`}>
              {match.teams.away.odds.toFixed(2)}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
