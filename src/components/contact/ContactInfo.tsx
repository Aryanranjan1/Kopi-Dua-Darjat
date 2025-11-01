'use client';

import { Phone, Mail, MessageSquare, MapPin } from "lucide-react";

const contactDetails = [
    {
        icon: Phone,
        title: "Phone Number",
        value: "+60 12-345 6789",
        href: "tel:+60123456789",
    },
    {
        icon: Mail,
        title: "Email Address",
        value: "hello@kopidua.com",
        href: "mailto:hello@kopidua.com",
    },
    {
        icon: MessageSquare,
        title: "WhatsApp",
        value: "+60 19-876 5432",
        href: "https://wa.me/60198765432",
    },
    {
        icon: MapPin,
        title: "Our Office",
        value: "Kuala Lumpur, Malaysia",
        href: "#", // Link to map anchor or full address on Google Maps
    },
];

const InfoItem = ({ icon: Icon, title, value, href }: (typeof contactDetails)[0]) => (
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
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8">
            {contactDetails.map((item) => (
                <InfoItem key={item.title} {...item} />
            ))}
        </div>
    );
}
