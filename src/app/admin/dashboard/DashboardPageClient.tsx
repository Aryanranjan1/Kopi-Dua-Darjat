'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  BookOpen,
  FileText,
  Mail,
  Users,
  BarChart,
  ExternalLink,
  Coffee,
  Store,
  Sparkles,
  AreaChart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import {
  Area,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  AreaChart as RechartsAreaChart,
} from 'recharts';

const StatCard = ({
  title,
  value,
  icon: Icon,
  change,
  changeType = 'increase',
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  change?: string;
  changeType?: 'increase' | 'decrease';
}) => (
  <Card className="bg-zinc-900 border-zinc-800">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-zinc-400">
        {title}
      </CardTitle>
      <Icon className="h-4 w-4 text-zinc-500" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-white">{value}</div>
      {change && (
        <p
          className={`text-xs ${
            changeType === 'increase' ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {change}
        </p>
      )}
    </CardContent>
  </Card>
);

const salesData = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 4500 },
  { name: 'May', sales: 6000 },
  { name: 'Jun', sales: 5500 },
];

const leadsData = [
  { name: 'Week 1', leads: 5 },
  { name: 'Week 2', leads: 8 },
  { name: 'Week 3', leads: 6 },
  { name: 'Week 4', leads: 10 },
];

export default function DashboardPageClient() {
  const firestore = useFirestore();

  const { data: messages } = useCollection(
    useMemoFirebase(
      () => (firestore ? query(collection(firestore, 'contactMessages')) : null),
      [firestore]
    )
  );
  const { data: leads } = useCollection(
    useMemoFirebase(
      () =>
        firestore
          ? query(collection(firestore, 'franchiseApplications'))
          : null,
      [firestore]
    )
  );
  const { data: publishedPosts } = useCollection(
    useMemoFirebase(
      () =>
        firestore
          ? query(collection(firestore, 'blogs'), where('status', '==', 'published'))
          : null,
      [firestore]
    )
  );
  const { data: menuItems } = useCollection(
    useMemoFirebase(
      () => (firestore ? query(collection(firestore, 'menuItems')) : null),
      [firestore]
    )
  );
  const { data: outlets } = useCollection(
    useMemoFirebase(
      () => (firestore ? query(collection(firestore, 'outlets')) : null),
      [firestore]
    )
  );
  const { data: dailySpecials } = useCollection(
    useMemoFirebase(
      () => (firestore ? query(collection(firestore, 'dailySpecials')) : null),
      [firestore]
    )
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-headline font-bold text-white">
          Dashboard
        </h1>
        <Button
          asChild
          className="bg-primary/90 text-primary-foreground hover:bg-primary/80"
        >
          <a href="/" target="_blank" rel="noopener noreferrer">
            View Live Site <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <StatCard
          title="Unread Messages"
          value={String(messages?.length || 0)}
          icon={Mail}
        />
        <StatCard
          title="Franchise Leads"
          value={String(leads?.length || 0)}
          icon={Users}
        />
        <StatCard
          title="Published Posts"
          value={String(publishedPosts?.length || 0)}
          icon={BookOpen}
        />
        <StatCard
          title="Total Menu Items"
          value={String(menuItems?.length || 0)}
          icon={Coffee}
        />
        <StatCard
          title="Active Outlets"
          value={String(outlets?.length || 0)}
          icon={Store}
        />
        <StatCard
          title="Daily Specials"
          value={String(dailySpecials?.length || 0)}
          icon={Sparkles}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Monthly Sales</CardTitle>
            <CardDescription className="text-zinc-400">
              Placeholder data for sales analytics.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsBarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#888888" />
                <YAxis stroke="#888888" />
                <Tooltip contentStyle={{ backgroundColor: '#27272a', border: '1px solid #3f3f46' }} />
                <Legend />
                <Bar dataKey="sales" fill="#fecd0b" name="Sales (RM)" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">New Leads per Week</CardTitle>
            <CardDescription className="text-zinc-400">
              Placeholder data for lead generation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsAreaChart data={leadsData}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fecd0b" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#fecd0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#888888" />
                <YAxis stroke="#888888" />
                <Tooltip contentStyle={{ backgroundColor: '#27272a', border: '1px solid #3f3f46' }} />
                <Legend />
                <Area type="monotone" dataKey="leads" stroke="#fecd0b" fillOpacity={1} fill="url(#colorLeads)" />
              </RechartsAreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button asChild variant="outline" className="bg-primary/20 border-primary/50 text-primary hover:bg-primary/30">
                        <Link href="/admin/blog/edit/new">New Post</Link>
                    </Button>
                    <Button asChild variant="outline" className="bg-primary/20 border-primary/50 text-primary hover:bg-primary/30">
                        <Link href="/admin/menu">Add Item</Link>
                    </Button>
                    <Button asChild variant="outline" className="bg-primary/20 border-primary/50 text-primary hover:bg-primary/30">
                        <Link href="/admin/outlets">Add Outlet</Link>
                    </Button>
                    <Button asChild variant="outline" className="bg-primary/20 border-primary/50 text-primary hover:bg-primary/30">
                        <Link href="/admin/promotions">New Promo</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
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
  );
}
