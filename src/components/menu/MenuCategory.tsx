'use client';

import type { Drink } from '@/lib/types';

interface MenuCategoryProps {
    title: string;
    description: string;
    items: Drink[];
}

export default function MenuCategory({ title, description, items }: MenuCategoryProps) {
    return (
        <div className="relative">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2">
                <div className="border-t border-dashed border-foreground/20"></div>
            </div>
            <div className="relative bg-background inline-block pr-4">
                 <h3 className="text-2xl font-headline font-bold text-foreground tracking-wider">{title}</h3>
            </div>
            <p className="text-sm text-muted-foreground mt-1 mb-4">{description}</p>
            <div className="space-y-2">
                {items.map(item => (
                    <div key={item.id} className="flex justify-between items-baseline">
                        <div className="max-w-[75%]">
                            <span className="font-semibold text-foreground">{item.name}</span>
                            {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
                        </div>
                        <span className="font-bold text-foreground">RM{item.price}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
