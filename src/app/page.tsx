import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, LayoutDashboard, Users, Settings } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <main className="max-w-6xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
            Welcome to Zyra
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Modern project management platform built with Next.js, TypeScript, and shadcn/ui
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/dashboard">
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
        </div>

        {/* Features */}
        <div id="features" className="grid gap-6 md:grid-cols-3 mb-16">
          <Card>
            <CardHeader>
              <LayoutDashboard className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>Intuitive Dashboard</CardTitle>
              <CardDescription>
                Clean and modern dashboard with real-time updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Track your projects, tasks, and team performance all in one place
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>Team Collaboration</CardTitle>
              <CardDescription>
                Work together seamlessly with your team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Invite team members, assign tasks, and communicate effectively
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Settings className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>Fully Customizable</CardTitle>
              <CardDescription>
                Tailor the platform to your needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Configure workflows, customize views, and integrate with your tools
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tech Stack */}
        <Card>
          <CardHeader>
            <CardTitle>Built with Modern Technologies</CardTitle>
            <CardDescription>
              Powered by the latest tools and frameworks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <p className="font-semibold">Next.js 15</p>
                <p className="text-sm text-muted-foreground">App Router</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="font-semibold">TypeScript</p>
                <p className="text-sm text-muted-foreground">Type Safety</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="font-semibold">Tailwind CSS</p>
                <p className="text-sm text-muted-foreground">Styling</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="font-semibold">shadcn/ui</p>
                <p className="text-sm text-muted-foreground">Components</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
