"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface Testimonial {
  text: string
  image?: string
  name: string
  role: string
}

export function TestimonialsColumn({
  testimonials,
  className,
  duration = 20,
}: {
  testimonials: Testimonial[]
  className?: string
  duration?: number
}) {
  return (
    <div
      className={cn(
        "relative flex h-full w-[320px] flex-col gap-6 overflow-hidden p-1",
        className
      )}
    >
      <motion.div
        className="flex h-max flex-col gap-6"
        animate={{
          y: "-50%",
          transition: {
            repeat: Infinity,
            duration: duration,
            ease: "linear",
          },
        }}
      >
        {[...testimonials, ...testimonials].map((testimonial, i) => (
          <div
            key={i}
            className="break-inside-avoid rounded-2xl border border-primary bg-white p-6"
          >
            <p className="text-foreground">{testimonial.text}</p>

            <div className="mt-6 flex items-center gap-4">
              {testimonial.image && (
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <p className="font-bold text-foreground">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
