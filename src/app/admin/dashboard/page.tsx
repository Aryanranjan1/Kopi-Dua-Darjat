
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, FileText, Mail, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Admin Dashboard for Kopi Dua Darjat',
};

const StatCard = ({ title, value, icon: Icon, change }: { title: string; value: string; icon: React.ElementType, change: string }) => (
    <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-zinc-400">{title}</CardTitle>
        <Icon className="h-4 w-4 text-zinc-500" />
        </CardHeader>
        <CardContent>
        <div className="text-2xl font-bold text-white">{value}</div>
        <p className="text-xs text-zinc-500">{change} from last month</p>
        </CardContent>
    </Card>
);


export default function DashboardPage() {
  return (
    <div className="space-y-8">
        <h1 className="text-3xl font-headline font-bold text-white">Dashboard</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Unread Messages" value="12" icon={Mail} change="+2 unread" />
            <StatCard title="Franchise Leads" value="8" icon={Users} change="+3 new leads" />
            <StatCard title="Published Posts" value="24" icon={BookOpen} change="+5 this month" />
            <StatCard title="Drafts" value="3" icon={FileText} change="-1 from last month" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-white">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-zinc-400">Activity log coming soon...</p>
                    {/* Placeholder for recent activity feed */}
                </CardContent>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-white">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-zinc-400">Quick stats coming soon...</p>
                    {/* Placeholder for quick stats */}
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
