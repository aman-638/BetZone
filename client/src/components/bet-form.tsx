import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle, Loader2 } from "lucide-react";

const betFormSchema = z.object({
  matchId: z.string().optional(),
  teamType: z.enum(["home", "away"]).optional(),
  amount: z.coerce.number().positive("Amount must be greater than 0").min(5, "Minimum bet is $5"),
});

type BetFormValues = z.infer<typeof betFormSchema>;

interface BetFormProps {
  selectedMatch: any;
  selectedTeam: string;
  onTeamSelect: (team: string) => void;
}

export function BetForm({ selectedMatch, selectedTeam, onTeamSelect }: BetFormProps) {
  const { toast } = useToast();
  const { balance } = useAuth();
  const [potentialWinnings, setPotentialWinnings] = useState<number>(0);
  
  const form = useForm<BetFormValues>({
    resolver: zodResolver(betFormSchema),
    defaultValues: {
      matchId: "",
      teamType: undefined,
      amount: 0,
    },
  });
  
  const { mutate: placeBet, isPending } = useMutation({
    mutationFn: async (data: BetFormValues) => {
      const res = await apiRequest("POST", "/api/bets", data);
      return await res.json();
    },
    onSuccess: (betData) => {
      toast({
        title: "Bet placed successfully",
        description: "Your bet will be processed in 30 seconds.",
      });
      // Reset form
      form.reset();
      // Refresh bet history immediately
      queryClient.invalidateQueries({ queryKey: ["/api/bets"] });
      // Refresh user data (balance)
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      
      // Setup refresh after 30 seconds to show bet result automatically
      setTimeout(() => {
        // Refresh bet history after 30 seconds to see results
        queryClient.invalidateQueries({ queryKey: ["/api/bets"] });
        // Refresh user data again (in case of winning)
        queryClient.invalidateQueries({ queryKey: ["/api/user"] });
        
        toast({
          title: "Bet result is in!",
          description: "Your bet result has been determined. Check the bet history.",
        });
      }, 30000);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to place bet",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Update form when selected match or team changes
  useEffect(() => {
    if (selectedMatch) {
      form.setValue("matchId", selectedMatch.id);
    } else {
      form.setValue("matchId", undefined);
    }
    
    form.setValue("teamType", selectedTeam as any || undefined);
  }, [selectedMatch, selectedTeam, form]);
  
  // Calculate potential winnings when amount or selection changes
  useEffect(() => {
    const amount = form.watch("amount") || 0;
    const teamType = form.watch("teamType");
    
    if (selectedMatch && teamType && amount > 0) {
      const odds = teamType === "home" 
        ? selectedMatch.teams.home.odds 
        : selectedMatch.teams.away.odds;
      
      setPotentialWinnings(parseFloat((amount * odds).toFixed(2)));
    } else {
      setPotentialWinnings(0);
    }
  }, [form.watch("amount"), form.watch("teamType"), selectedMatch, form]);
  
  const onSubmit = (data: BetFormValues) => {
    // Validate that match and team are selected
    if (!selectedMatch || !selectedTeam) {
      toast({
        title: "Cannot place bet",
        description: "Please select a match and team first",
        variant: "destructive",
      });
      return;
    }
    
    if (data.amount > balance) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough funds to place this bet",
        variant: "destructive",
      });
      return;
    }
    
    // Place bet
    placeBet({
      matchId: selectedMatch.id,
      teamType: selectedTeam as any,
      amount: data.amount,
    });
  };
  
  if (!selectedMatch) {
    return (
      <div className="mt-10 mb-6">
        <h2 className="text-xl font-bold text-white mb-4">Place Your Bet</h2>
        <Card className="bg-secondary border-gray-700">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Select a match from above to place a bet.</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="mt-10 mb-6">
      <h2 className="text-xl font-bold text-white mb-4">Place Your Bet</h2>
      <Card className="bg-secondary border-gray-700">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 pr-0 md:pr-4 mb-6 md:mb-0">
              <Form {...form}>
                <form className="space-y-4">
                  <FormField
                    control={form.control}
                    name="matchId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Selected Match</FormLabel>
                        <div className="p-3 bg-secondary-foreground/10 rounded-lg text-sm">
                          {selectedMatch ? (
                            <div className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-accent mr-2" />
                              <span>{selectedMatch.teams.home.name} vs {selectedMatch.teams.away.name}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">No match selected</span>
                          )}
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="teamType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Select Team</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => {
                              field.onChange(value);
                              onTeamSelect(value);
                            }}
                            value={field.value}
                            className="grid grid-cols-2 gap-3"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="home" id="team-home" />
                              <label htmlFor="team-home" className="text-sm cursor-pointer">
                                {selectedMatch.teams.home.name} ({selectedMatch.teams.home.odds.toFixed(2)})
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="away" id="team-away" />
                              <label htmlFor="team-away" className="text-sm cursor-pointer">
                                {selectedMatch.teams.away.name} ({selectedMatch.teams.away.odds.toFixed(2)})
                              </label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bet Amount</FormLabel>
                        <div className="relative rounded-md">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-muted-foreground sm:text-sm">$</span>
                          </div>
                          <FormControl>
                            <Input
                              type="number"
                              min="5"
                              placeholder="0.00"
                              className="pl-7 pr-12"
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value === "" ? "0" : e.target.value;
                                field.onChange(value);
                              }}
                            />
                          </FormControl>
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-muted-foreground sm:text-sm">USD</span>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </div>
            
            <div className="w-full md:w-1/2 pl-0 md:pl-4 border-t md:border-t-0 md:border-l border-gray-700 pt-5 md:pt-0 md:pl-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white mb-2">Bet Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Match:</span>
                    <span className="text-white">
                      {selectedMatch.teams.home.name} vs {selectedMatch.teams.away.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Selection:</span>
                    <span className="text-white">
                      {selectedTeam === 'home' 
                        ? selectedMatch.teams.home.name 
                        : selectedTeam === 'away'
                          ? selectedMatch.teams.away.name
                          : 'Not selected'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Odds:</span>
                    <span className="text-white">
                      {selectedTeam === 'home' 
                        ? selectedMatch.teams.home.odds.toFixed(2)
                        : selectedTeam === 'away'
                          ? selectedMatch.teams.away.odds.toFixed(2)
                          : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Stake:</span>
                    <span className="text-white">
                      ${form.watch("amount") ? (+form.watch("amount")).toFixed(2) : "0.00"}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gray-700">
                    <span className="text-muted-foreground">Potential Winnings:</span>
                    <span className="text-[#10B981]">${potentialWinnings.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <Button 
                className="w-full bg-accent hover:bg-accent/90 text-white font-semibold glow-teal"
                onClick={form.handleSubmit(onSubmit)}
                disabled={isPending || !selectedMatch || !selectedTeam || form.watch("amount") <= 0}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Place Bet
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
