"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";

interface Poll {
  id: number;
  question: string;
  totalVotes: number;
  options: { id: number; text: string; votes: number }[];
  userVote?: number;
}

export const EventPolls = ({ isParticipant }: { isParticipant: boolean }) => {
  const [polls, setPolls] = useState<Poll[]>([
    {
      id: 1,
      question: "¿Qué música prefieren para el cierre?",
      totalVotes: 25,
      userVote: 1,
      options: [
        { id: 1, text: "Techno / House", votes: 15 },
        { id: 2, text: "Rock Nacional", votes: 7 },
        { id: 3, text: "Cumbia / Reggaeton", votes: 3 },
      ]
    }
  ]);

  const handleVote = (pollId: number, optionId: number) => {
    if (!isParticipant) return;
    // Lógica mock para actualizar votos
    setPolls(polls.map(p => {
      if (p.id === pollId) {
        return {
          ...p,
          userVote: optionId,
          totalVotes: p.totalVotes + 1,
          options: p.options.map(o => o.id === optionId ? { ...o, votes: o.votes + 1 } : o)
        };
      }
      return p;
    }));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-primary" />
        Encuestas activas
      </h3>

      {polls.map((poll) => (
        <Card key={poll.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{poll.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {poll.options.map((option) => {
              const percentage = Math.round((option.votes / poll.totalVotes) * 100);
              return (
                <div key={option.id} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className={poll.userVote === option.id ? "font-bold text-primary" : ""}>
                      {option.text} {poll.userVote === option.id && "(Tu voto)"}
                    </span>
                    <span className="text-muted-foreground">{percentage}%</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                  {!poll.userVote && isParticipant && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 px-2 text-xs" 
                      onClick={() => handleVote(poll.id, option.id)}
                    >
                      Votar
                    </Button>
                  )}
                </div>
              );
            })}
            <p className="text-[10px] text-muted-foreground text-right pt-2">
              Total de votos: {poll.totalVotes}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};