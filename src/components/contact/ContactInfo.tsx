'use client';

import { Phone, Mail, MessageSquare, MapPin } from "lucide-react";
import { useSettings } from "../layout/SettingsProvider";
import { Skeleton } from "../ui/skeleton";

const InfoItem = ({ icon: Icon, title, value, href }: { icon: React.ElementType, title: string, value: string, href: string }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
        <div className="bg-zinc-900/80 text-primary p-4 rounded-full transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <h3 className="font-headline text-xl text-white">{title}</h3>
            <p className="text-muted-foreground transition-colors group-hover:text-primary">{value}</p>
        </div>
    </a>
)

export default function ContactInfo() {
    const { settings, isLoading } = useSettings();

    if (isLoading) {
        return (
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
             </div>
        )
    }

    const contactDetails = [
        {
            icon: Phone,
            title: "Phone Number",
            value: settings?.contact?.phone || '+60 12-345 6789',
            href: `tel:${settings?.contact?.phone || '+60123456789'}`,
        },
        {
            icon: Mail,
            title: "Email Address",
            value: settings?.contact?.email || 'hello@kopidua.com',
            href: `mailto:${settings?.contact?.email || 'hello@kopidua.com'}`,
        },
        {
            icon: MessageSquare,
            title: "WhatsApp",
            value: settings?.socials?.whatsapp ? `+${settings.socials.whatsapp.replace(/\D/g, '')}` : '+60 19-876 5432',
            href: settings?.socials?.whatsapp || '#',
        },
        {
            icon: MapPin,
            title: "Our Office",
            value: settings?.contact?.address || 'Kuala Lumpur, Malaysia',
            href: settings?.contact?.googleMapsLink || '#',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8">
            {contactDetails.map((item) => (
                <InfoItem key={item.title} {...item} />
            ))}
        </div>
    );
}