
'use client';

import Image from 'next/image';
import type { MenuItem } from '@/lib/types';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface FloatingDrinkCardProps {
    drink: MenuItem;
    isFeatured?: boolean;
    size?: number;
    className?: string;
    style?: React.CSSProperties;
    delay?: number;
}

export default function FloatingDrinkCard({ 
    drink, 
    isFeatured = false, 
    size = 100, 
    className, 
    style,
    delay = 0
}: FloatingDrinkCardProps) {

    if (isFeatured) {
        return (
             <motion.div 
                className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-2 pr-4 flex items-center gap-2"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay, type: 'spring', stiffness: 200, damping: 15 }}
             >
                <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                    <Image src={drink.imageUrl} alt={drink.name} fill className="object-cover" />
                </div>
                <div>
                    <p className="text-sm font-bold text-black">{drink.name}</p>
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        ))}
                    </div>
                </div>
            </motion.div>
        )
    }

    return (
        <motion.div
            className={className}
            style={style}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay, type: 'spring', stiffness: 200, damping: 15 }}
        >
            <div 
                className="relative rounded-full overflow-hidden shadow-xl ring-2 ring-white"
                style={{ width: size, height: size }}
            >
                <Image src={drink.imageUrl} alt={drink.name} fill className="object-cover"/>
            </div>
        </motion.div>
    )
}
