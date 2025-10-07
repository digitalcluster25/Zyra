"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Mock data for Recovery and TSS (Training Stress Score)
const mockData = [
  { date: "Mon", recovery: 75, tss: 120 },
  { date: "Tue", recovery: 78, tss: 135 },
  { date: "Wed", recovery: 72, tss: 145 },
  { date: "Thu", recovery: 80, tss: 110 },
  { date: "Fri", recovery: 85, tss: 95 },
  { date: "Sat", recovery: 82, tss: 160 },
  { date: "Sun", recovery: 88, tss: 85 },
];

export function TrendChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recovery & Training Trends</CardTitle>
        <CardDescription>
          Weekly overview of recovery score and training stress
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mockData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="date" 
              className="text-sm"
              stroke="currentColor"
            />
            <YAxis 
              className="text-sm"
              stroke="currentColor"
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="recovery"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              name="Recovery Score"
              dot={{ fill: "hsl(var(--primary))" }}
            />
            <Line
              type="monotone"
              dataKey="tss"
              stroke="hsl(142.1 76.2% 36.3%)"
              strokeWidth={2}
              name="Training Stress (TSS)"
              dot={{ fill: "hsl(142.1 76.2% 36.3%)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
