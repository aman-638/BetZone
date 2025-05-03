import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface BetHistoryItem {
  id: string;
  matchId: string;
  matchName: string;
  sport: string;
  league: string;
  teamSelected: string;
  odds: number;
  amount: number;
  potentialWin: number;
  status: "PENDING" | "WIN" | "LOSE";
  createdAt: string;
}

export function BetHistory() {
  const { data: bets, isLoading, error } = useQuery<BetHistoryItem[]>({
    queryKey: ["/api/bets"],
  });

  // Function to get the status color class
  const getStatusColor = (status: string) => {
    switch (status) {
      case "WIN":
        return "bg-[#10B981] bg-opacity-20 text-[#10B981]";
      case "LOSE":
        return "bg-[#EF4444] bg-opacity-20 text-[#EF4444]";
      case "PENDING":
        return "bg-[#F59E0B] bg-opacity-20 text-[#F59E0B]";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (isLoading) {
    return (
      <div className="mt-10">
        <h2 className="text-xl font-bold text-white mb-4">Bet History</h2>
        <Card className="p-6 flex justify-center items-center h-32 bg-secondary border-gray-700">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-10">
        <h2 className="text-xl font-bold text-white mb-4">Bet History</h2>
        <Card className="p-6 text-center bg-secondary border-gray-700">
          <p className="text-destructive">Error loading bet history</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold text-white mb-4">Bet History</h2>
      
      <Card className="bg-secondary border-gray-700 p-0">
        <div className="overflow-x-auto">
          {bets && bets.length > 0 ? (
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-secondary-foreground/30 text-gray-300">
                <tr>
                  <th scope="col" className="px-6 py-3">Match</th>
                  <th scope="col" className="px-6 py-3">Selection</th>
                  <th scope="col" className="px-6 py-3">Odds</th>
                  <th scope="col" className="px-6 py-3">Amount</th>
                  <th scope="col" className="px-6 py-3">Potential Win</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {bets.map((bet) => (
                  <tr key={bet.id} className="border-b border-gray-700 hover:bg-secondary-foreground/10">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold">{bet.matchName}</div>
                      <div className="text-xs text-muted-foreground">{bet.sport} · {bet.league}</div>
                    </td>
                    <td className="px-6 py-4">{bet.teamSelected}</td>
                    <td className="px-6 py-4">{bet.odds.toFixed(2)}</td>
                    <td className="px-6 py-4">${bet.amount.toFixed(2)}</td>
                    <td className="px-6 py-4">${bet.potentialWin.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(bet.status)}`}>
                        {bet.status === "PENDING" && (
                          <svg className="w-3 h-3 mr-1 animate-spin inline-block" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        )}
                        {bet.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-6 text-center">
              <p className="text-muted-foreground">No bet history available yet. Place your first bet!</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
