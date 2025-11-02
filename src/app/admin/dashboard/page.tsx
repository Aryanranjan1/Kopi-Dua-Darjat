
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BookOpen, FileText, Mail, Users, BarChart, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Admin Dashboard for Kopi Dua Darjat',
};

const StatCard = ({ title, value, icon: Icon, change, changeType = 'increase' }: { title: string; value: string; icon: React.ElementType, change: string, changeType?: 'increase' | 'decrease' }) => (
    <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-zinc-400">{title}</CardTitle>
        <Icon className="h-4 w-4 text-zinc-500" />
        </CardHeader>
        <CardContent>
        <div className="text-2xl font-bold text-white">{value}</div>
        <p className={`text-xs ${changeType === 'increase' ? 'text-green-400' : 'text-red-400'}`}>{change}</p>
        </CardContent>
    </Card>
);

const recentActivities = [
    { user: 'admin@kopi.com', action: 'published a new blog post:', target: 'The Secret Behind Our Kopi Kampung', time: '2h ago' },
    { user: 'admin@kopi.com', action: 'updated an outlet:', target: 'Kajang Prima', time: '5h ago' },
    { user: 'admin@kopi.com', action: 'added a new menu item:', target: 'Darjat Pandan', time: '1d ago' },
    { user: 'azad@kopi.com', action: 'marked a message as read', target: 'Partnership Inquiry', time: '2d ago' },
];


export default function DashboardPage() {
  return (
    <div className="space-y-8">
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-headline font-bold text-white">Dashboard</h1>
            <Button asChild className="bg-primary/90 text-primary-foreground hover:bg-primary/80">
                <a href="/" target="_blank" rel="noopener noreferrer">
                    View Live Site <ExternalLink className="ml-2 h-4 w-4" />
                </a>
            </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Unread Messages" value="12" icon={Mail} change="+2 from yesterday" changeType="increase"/>
            <StatCard title="Franchise Leads" value="8" icon={Users} change="+3 new this week" changeType="increase"/>
            <StatCard title="Published Posts" value="24" icon={BookOpen} change="+5 this month" changeType="increase" />
            <StatCard title="Total Sales (Month)" value="RM12,450" icon={BarChart} change="-2.1% from last month" changeType="decrease"/>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-white">Recent Activity</CardTitle>
                    <CardDescription className="text-zinc-400">What's been happening across the CMS.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {recentActivities.map((activity, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <div className="text-zinc-500 text-xs w-16 text-right shrink-0">{activity.time}</div>
                                <div className="h-full w-px bg-zinc-700"></div>
                                <div className="text-sm">
                                    <span className="font-semibold text-zinc-300">{activity.user}</span>
                                    <span className="text-zinc-400"> {activity.action} </span>
                                    <span className="font-medium text-primary hover:underline cursor-pointer">{activity.target}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
            <div className="space-y-8">
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <Button asChild variant="outline" className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 hover:text-white"><Link href="/admin/blog">New Blog Post</Link></Button>
                        <Button asChild variant="outline" className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 hover:text-white"><Link href="/admin/menu">Add Menu Item</Link></Button>
                        <Button asChild variant="outline" className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 hover:text-white"><Link href="/admin/outlets">Add Outlet</Link></Button>
                        <Button asChild variant="outline" className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 hover:text-white"><Link href="/admin/promotions">New Promotion</Link></Button>
                    </CardContent>
                </Card>
                 <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white">Website Health</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <span className="text-zinc-400">Hosting Status</span>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="text-green-400 font-bold">Online</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
