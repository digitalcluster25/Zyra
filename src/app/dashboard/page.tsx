import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { RecoveryCard } from "@/components/dashboard/recovery-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome to your project management dashboard
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Recovery Score Card */}
          <RecoveryCard score={75} total={100} />

          {/* Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle>Active Tasks</CardTitle>
              <CardDescription>Tasks in progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">12</div>
              <p className="text-sm text-muted-foreground mt-2">
                +3 from last week
              </p>
            </CardContent>
          </Card>

          {/* Team Card */}
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Active contributors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">8</div>
              <p className="text-sm text-muted-foreground mt-2">
                2 online now
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <p className="font-medium">Task completed</p>
                  <p className="text-sm text-muted-foreground">
                    Design system implementation finished
                  </p>
                </div>
                <span className="text-sm text-muted-foreground">2h ago</span>
              </div>
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <p className="font-medium">New team member</p>
                  <p className="text-sm text-muted-foreground">
                    Sarah Johnson joined the team
                  </p>
                </div>
                <span className="text-sm text-muted-foreground">5h ago</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Project milestone</p>
                  <p className="text-sm text-muted-foreground">
                    Sprint 3 completed successfully
                  </p>
                </div>
                <span className="text-sm text-muted-foreground">1d ago</span>
              </div>
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                View All Activity
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
