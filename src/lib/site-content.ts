
export const siteContentData = {
  home: {
    hero: {
      title: "Good Coffee for Great Morning",
      subtitle: "From bean to cup, every pour is crafted with passion and precision. Our coffee celebrates the art of flavor , a golden mix of comfort, creativity, and caffeine confidence.",
      buttonText: "Find an Outlet",
      buttonLink: "/outlets",
    },
    activePromotions: {
      title: "Sip Smart. <br /> <span class=\"text-accent\">Stay Sharp.</span>",
      subtitle: "We know your day is challenging. Kopi Dua Darjat is more than just coffee; it's a daily ritual that connects you to a vibrant community and rich heritage. We're here to elevate your day.",
      promoCard: {
        title: "Latest Promos & Offers",
        subtitle: "Stay ahead with our latest deals, new drink alerts, and exclusive offers for our community.",
        button1Text: "Weekday Specials",
        button1Link: "/promotions",
        button2Text: "New Drinks",
        button2Link: "/menu",
      },
      communityCard: {
        title: "Join The Community",
        subtitle: "Get daily updates, news, and see what's brewing in our vibrant community.",
        buttonText: "Follow on Instagram",
        buttonLink: "#",
      }
    },
    brandStory: {
      title: "Antara Warisan & Artisan",
      content: "Kopi Dua Darjat was born from a simple vision: to honour the rich legacy of Malaysian Kopi Kampung while embracing the meticulous craft of artisan coffee. We bridge generations, serving nostalgic flavours with a modern touch.",
      buttonText: "Discover Our Story",
      buttonLink: "/about",
    },
    community: {
        title: "Brewing Community, One Cup at a Time",
        subtitle: "From our baristas to our customers, we're a family united by a love for authentic Malaysian coffee.",
        items: [
            {
              type: 'portrait',
              name: 'Marina Mogilko',
              imageUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500',
              bgColor: 'bg-cyan-300',
              className: 'sm:col-span-1',
            },
            {
              type: 'logo',
              name: 'Superhuman',
              imageUrl: '/image/1.svg', 
              className: 'sm:col-span-1',
            },
            {
              type: 'quote',
              quote: "Passionfroot makes it incredibly easy for me to secure sponsorship deals with brands that resonate with my audience.",
              name: 'Jörg Storm',
              role: 'Founder of AI Newsletter Weekly Storm, Top 50 Creator Worldwide',
              bgColor: 'bg-yellow-300',
              textColor: 'text-black',
              className: 'sm:col-span-2',
            },
            {
              type: 'logo',
              name: 'Milk Road',
              imageUrl: '/image/1.svg', 
              className: 'sm:col-span-1',
            },
            {
              type: 'portrait',
              name: 'Zain Kahn',
              imageUrl: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=500',
              bgColor: 'bg-green-400',
              className: 'sm:col-span-1',
            },
            {
              type: 'logo',
              name: 'Every',
              imageUrl: '/image/1.svg', 
              className: 'sm:col-span-1',
            },
            {
              type: 'portrait',
              name: 'Ali Abdaal',
              imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
              bgColor: 'bg-orange-400',
              className: 'sm:col-span-1',
            },
            {
              type: 'quote',
              quote: "Passionfroot has become a valuable channel for connecting with sponsors. The platform simplifies the process, and payments are always secure, making it a reliable tool for managing our sponsorships.",
              name: 'Paula Echeverria',
              role: 'Manager at Youtube Channel Slidebean',
              bgColor: 'bg-black',
              textColor: 'text-white',
              className: 'sm:col-span-2',
            },
            {
              type: 'portrait',
              name: 'Bonnie Dilber',
              imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500',
              bgColor: 'bg-blue-400',
              className: 'sm:col-span-1',
            },
            {
              type: 'logo',
              name: 'Sketchy',
              imageUrl: '/image/1.svg', 
              className: 'sm:col-span-1',
            },
        ]
    },
    latestStories: {
        title: "Latest Stories",
        buttonText: "Read all articles",
        buttonLink: "/news",
    },
  },
  about: {
    hero: {
        title: "Our Journey, Our Passion",
        subtitle: "The story of a local brand that hopes to unite authenticity, heritage, and a love for the perfect cup of coffee.",
    },
    whoAreWe: {
        title: "Who Are We?",
        subtitle: "We are the bridge between Malaysia's rich coffee heritage and modern artisan craft.",
        content: "Kopi Dua Darjat ('Two-Class Coffee') was founded on a simple idea: to honour the nostalgic taste of traditional Kopi Kampung while elevating it with the quality and care of artisan brewing. We believe that authentic, high-quality coffee should be accessible to everyone. From our humble beginnings as a small stall, we've grown into a nationwide family, but our mission remains the same: to serve a cup of coffee that feels like home, yet excites the senses.",
    },
    stats: [
        {
            value: 50,
            label: 'Outlets Nationwide',
            suffix: '+',
        },
        {
            value: 30,
            label: 'Happy Franchisees',
            suffix: '+',
        },
        {
            value: 150,
            label: 'Signature Drinks',
            suffix: '+',
        },
    ],
    milestones: {
      title: "Our Milestones",
      items: [
        {
          year: '2020',
          title: 'Humble Beginnings',
          description: 'Kopi Dua Darjat was born from a simple cart, with a big dream: to share authentic Malaysian kopi with everyone, affordably.',
          imageId: 'milestone-beginnings',
        },
        {
          year: '2021',
          title: 'Perfecting Recipes',
          description: 'Our obsession with quality led us to refine our recipes, balancing heritage flavors with artisan techniques to create our signature taste.',
          imageId: 'milestone-recipes',
        },
        {
          year: '2022',
          title: 'Culinary Innovation',
          description: 'We started innovating, introducing new series like Matcha and Menet, pushing the boundaries of what local coffee culture can be.',
          imageId: 'milestone-innovation',
        },
        {
          year: '2023',
          title: 'Community & Culture',
          description: 'More than just coffee, we became a community hub. Our stalls turned into meeting points for friends, family, and neighbors.',
          imageId: 'milestone-community',
        },
        {
          year: '2024',
          title: 'Future Forward',
          description: 'With over 50 outlets, we’re now looking ahead. Our focus is on sustainability, empowering local entrepreneurs, and continuing to innovate.',
          imageId: 'milestone-future',
        },
      ]
    },
    founders: {
        title: "A Message from Our Founders",
        items: [
          {
            name: "Ahmad Hadi",
            quote: "Every cup tells a story, a blend of heritage and dreams. We started Kopi Dua Darjat to share the true essence of Malaysian coffee with the world, one cup at a time.",
            imageId: "founder-hadi"
          },
          {
            name: "Azad",
            quote: "Our goal has always been to craft an authentic coffee experience that feels both nostalgic and new. We balance tradition with artistry, ensuring our methods are sustainable and our partners are empowered.",
            imageId: "founder-azad"
          }
        ]
    },
    visionMission: {
        visionTitle: "Our Vision",
        visionText: "To become the most beloved and accessible artisan coffee brand in Southeast Asia.",
        missionTitle: "Our Mission",
        missionItems: [
            "To serve high-quality, ethically-sourced Malaysian coffee that champions local flavors.",
            "To foster connection and culture in every community we serve, one cup at a time.",
            "To preserve and promote the rich heritage of Malaysian coffee for future generations.",
            "To innovate continuously with our products and experiences, empowering local entrepreneurs along the way."
        ]
    }
  },
  franchise: {
    hero: {
        badge: "50+ stalls & growing since 2020",
        title: "Own Your Kopi Dua Darjat Stall — Brew Success, One Cup at a Time.",
        subtitle: "We’re expanding our local kopi culture across Malaysia. Join our growing family and serve the taste everyone’s talking about.",
        primaryButtonText: "Apply for Franchise",
        primaryButtonLink: "/franchise/apply",
        secondaryButtonText: "Download Info Pack",
        secondaryButtonLink: "#",
    },
    valueProposition: {
        title: "The Winning Choice for Your Entrepreneurial Journey",
        subtitle: "Kopi Dua Darjat isn’t just another coffee brand. We are a movement built on heritage, quality, and community. We offer a proven, profitable, and accessible franchise model designed for your success.",
        features: [
            {
                title: 'Strong Brand Identity',
                description: 'Trusted by youth and working professionals across Malaysia.',
            },
            {
                title: 'Low Start-up Cost',
                description: 'Start small and scale fast with our affordable franchise model.',
            },
            {
                title: 'Full Training Provided',
                description: 'We make barista and operations skills easy to master.',
            },
            {
                title: 'Marketing Support',
                description: 'We handle social media and brand awareness to drive customers to you.',
            },
            {
                title: 'High Return Potential',
                description: 'Benefit from a proven business model with high profitability.',
            },
        ]
    },
    franchiseModel: {
        title: "How It Works",
        subtitle: "Our process is transparent and designed to get you started quickly and efficiently.",
        steps: [
            {
              title: 'Apply',
              description: 'Fill out the form below to express interest.',
            },
            {
              title: 'Interview',
              description: 'Our team will reach out to discuss your goals.',
            },
            {
              title: 'Setup',
              description: 'Choose your stall location and start setup.',
            },
            {
              title: 'Launch',
              description: 'Grand opening with our support and marketing.',
            },
            {
              title: 'Grow',
              description: 'Continuous support, seasonal menus, and local collabs.',
            },
          ]
    },
    investment: {
        title: "Affordable Cost, High Potential",
        subtitle: "Start your own Kopi Dua Darjat stall with an investment as low as RM25,000.",
        content: "This includes your kiosk, essential equipment, branding kit, initial stock, and comprehensive training for you and your team. We provide a detailed breakdown in our franchise kit to ensure full transparency.",
        buttonText: "Request Franchise Kit",
        buttonLink: "#",
    },
    support: {
        title: "Full Support, From Setup to Sales",
        subtitle: "We don’t just give you a logo — we provide a complete system for success.",
        items: [
            "Comprehensive Barista Training: From bean to cup, master the art of Kopi Dua Darjat.",
            "Operational Setup: We assist with site selection, kiosk setup, and equipment sourcing.",
            "Marketing & Branding: Leverage our national campaigns and localized marketing strategies.",
            "Supply Chain: Gain access to our network of premium, ethically-sourced ingredient suppliers.",
            "Ongoing Support: Our dedicated team is always here to help you grow and succeed."
        ],
        buttonText: "Talk to Our Team",
        buttonLink: "/franchise/apply",
    },
    faq: {
        title: "Frequently Asked Questions",
        subtitle: "Have questions? We have answers. Here are some of the most common inquiries from potential franchisees.",
    },
    finalCta: {
        title: "Your Stall. Your Story. Your Success.",
        subtitle: "Ready to become a part of Malaysia's favourite kopi movement? The next success story could be yours.",
        buttonText: "Become a Partner Today",
        buttonLink: "/franchise/apply",
    }
  }
};
