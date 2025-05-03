import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { MobileNavigation } from "@/components/mobile-navigation";
import { MatchCard } from "@/components/match-card";
import { BetForm } from "@/components/bet-form";
import { BetHistory } from "@/components/bet-history";

export default function HomePage() {
  const [sportFilter, setSportFilter] = useState<string>("all");
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  
  // Fetch matches
  const { data: matches, isLoading: isLoadingMatches } = useQuery<any[]>({
    queryKey: ["/api/matches"],
  });

  // Filter matches by sport if filter is applied
  const filteredMatches = matches?.filter(match => 
    sportFilter === "all" || match.sport.toLowerCase() === sportFilter.toLowerCase()
  );

  // Select match handler
  const handleSelectMatch = (match: any) => {
    setSelectedMatch(match);
    setSelectedTeam(""); // Reset selected team when changing match
  };

  // Change sport filter
  const handleSportFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSportFilter(e.target.value);
  };

  return (
    <div className="min-h-screen flex flex-col bg-primary-900">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 relative z-0 overflow-y-auto pb-16 md:pb-6 focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="md:flex md:items-center md:justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-bold leading-7 text-white sm:text-3xl sm:truncate">
                    Upcoming Matches
                  </h2>
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4">
                  <select 
                    className="bg-secondary border border-gray-600 text-sm rounded-lg block p-2.5 text-white focus:ring-accent focus:border-accent"
                    value={sportFilter}
                    onChange={handleSportFilterChange}
                  >
                    <option value="all">All Sports</option>
                    <option value="football">Football</option>
                    <option value="basketball">Basketball</option>
                    <option value="tennis">Tennis</option>
                    <option value="hockey">Hockey</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {/* Match List */}
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {isLoadingMatches ? (
                  Array(3).fill(0).map((_, index) => (
                    <div key={index} className="bg-secondary rounded-xl overflow-hidden shadow-lg border border-gray-700 h-64 animate-pulse" />
                  ))
                ) : filteredMatches && filteredMatches.length > 0 ? (
                  filteredMatches.map((match) => (
                    <MatchCard 
                      key={match.id} 
                      match={match} 
                      onSelect={() => handleSelectMatch(match)}
                      isSelected={selectedMatch?.id === match.id}
                      onSelectTeam={(team) => setSelectedTeam(team)}
                      selectedTeam={selectedTeam}
                    />
                  ))
                ) : (
                  <div className="col-span-3 p-8 text-center">
                    <p className="text-muted-foreground">No matches available for the selected filter.</p>
                  </div>
                )}
              </div>

              {/* Betting Form */}
              <div id="bet-form-section">
                <BetForm 
                  selectedMatch={selectedMatch} 
                  selectedTeam={selectedTeam}
                  onTeamSelect={setSelectedTeam}
                />
              </div>

              {/* Bet History */}
              <div id="bet-history-section">
                <BetHistory />
              </div>
            </div>
          </div>
        </main>
      </div>
      
      <MobileNavigation />
    </div>
  );
}
