import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface RecoveryCardProps {
  score: number;
  total: number;
}

export function RecoveryCard({ score, total }: RecoveryCardProps) {
  const percentage = Math.round((score / total) * 100);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recovery Score</CardTitle>
        <CardDescription>Your current recovery progress</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold">{score}</span>
            <span className="text-muted-foreground">/ {total}</span>
          </div>
          
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${percentage}%` }}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{percentage}% Complete</span>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
