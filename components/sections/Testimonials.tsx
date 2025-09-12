'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import Link from 'next/link';
import type { ClientChallenge } from '@/types/challenge';
import { useChallenges } from '@/hooks/useChallenges';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Type definition for testimonial data
type TestimonialType = {
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  challenge: string;
  challenge_link: string;
  style?: string;
  industry?: string;
};

// CEO data with their matching companies and industries
const ceoData = [
  { name: 'Elon Musk', company: 'SpaceX', industry: 'space' },
  { name: 'Jeff Bezos', company: 'Amazon', industry: 'ecommerce' },
  {
    name: 'Richard Branson',
    company: 'Virgin Group',
    industry: 'conglomerate',
  },
  { name: 'Mark Zuckerberg', company: 'Meta', industry: 'social' },
  { name: 'Tim Cook', company: 'Apple', industry: 'hardware' },
  { name: 'Satya Nadella', company: 'Microsoft', industry: 'cloud' },
  { name: 'Sundar Pichai', company: 'Google', industry: 'search' },
  { name: 'Reed Hastings', company: 'Netflix', industry: 'streaming' },
  { name: 'Brian Chesky', company: 'Airbnb', industry: 'marketplace' },
  { name: 'Daniel Ek', company: 'Spotify', industry: 'streaming' },
  { name: 'Neal Mohan', company: 'YouTube', industry: 'video' },
  {
    name: 'Melinda French Gates',
    company: 'Pivotal Ventures',
    industry: 'investment',
  },
  { name: 'Arvind Krishna', company: 'IBM', industry: 'enterprise' },
  { name: 'Safra Catz', company: 'Oracle', industry: 'database' },
  { name: 'Lisa Su', company: 'AMD', industry: 'semiconductors' },
  { name: 'Jensen Huang', company: 'NVIDIA', industry: 'ai' },
  { name: 'Marc Benioff', company: 'Salesforce', industry: 'crm' },
  { name: 'Dara Khosrowshahi', company: 'Uber', industry: 'rideshare' },
  { name: 'Andy Jassy', company: 'AWS', industry: 'cloud' },
  { name: 'Patrick Collison', company: 'Stripe', industry: 'fintech' },
  { name: 'John Collison', company: 'Stripe', industry: 'fintech' },
  { name: 'Drew Houston', company: 'Dropbox', industry: 'storage' },
  { name: 'Melanie Perkins', company: 'Canva', industry: 'design' },
  { name: 'Tony Xu', company: 'DoorDash', industry: 'delivery' },
  { name: 'Logan Green', company: 'Lyft', industry: 'rideshare' },
  { name: 'John Zimmer', company: 'Lyft', industry: 'rideshare' },
  { name: 'Garrett Camp', company: 'Uber', industry: 'rideshare' },
  { name: 'Joe Gebbia', company: 'Airbnb', industry: 'marketplace' },
  { name: 'Nathan Blecharczyk', company: 'Airbnb', industry: 'marketplace' },
  { name: 'Evan Spiegel', company: 'Snapchat', industry: 'social' },
  { name: 'Bobby Murphy', company: 'Snapchat', industry: 'social' },
  { name: 'Kevin Systrom', company: 'Instagram', industry: 'social' },
  { name: 'Mike Krieger', company: 'Instagram', industry: 'social' },
  { name: 'Jan Koum', company: 'WhatsApp', industry: 'messaging' },
  { name: 'Brian Acton', company: 'WhatsApp', industry: 'messaging' },
  { name: 'Palmer Luckey', company: 'Oculus', industry: 'vr' },
  { name: 'Brendan Iribe', company: 'Oculus', industry: 'vr' },
  { name: 'John Carmack', company: 'id Software', industry: 'gaming' },
  { name: 'Gabe Newell', company: 'Valve', industry: 'gaming' },
  { name: 'Tim Sweeney', company: 'Epic Games', industry: 'gaming' },
  { name: 'David Baszucki', company: 'Roblox', industry: 'gaming' },
  { name: 'John Riccitiello', company: 'Unity', industry: 'gaming' },
  { name: 'Tobias Lütke', company: 'Shopify', industry: 'ecommerce' },
  { name: 'Jack Dorsey', company: 'Block', industry: 'fintech' },
  { name: 'Dan Schulman', company: 'PayPal', industry: 'fintech' },
  { name: 'Eric Yuan', company: 'Zoom', industry: 'video' },
  { name: 'Stewart Butterfield', company: 'Slack', industry: 'communication' },
  { name: 'Jason Citron', company: 'Discord', industry: 'communication' },
  { name: 'Emmett Shear', company: 'Twitch', industry: 'streaming' },
  { name: 'Steve Huffman', company: 'Reddit', industry: 'social' },
  { name: 'Bill Ready', company: 'Pinterest', industry: 'social' },
  { name: 'Shou Zi Chew', company: 'TikTok', industry: 'social' },
  { name: 'Ryan Roslansky', company: 'LinkedIn', industry: 'professional' },
  { name: 'Thomas Dohmke', company: 'GitHub', industry: 'developer' },
  { name: 'Sid Sijbrandij', company: 'GitLab', industry: 'developer' },
  { name: 'Scott Johnston', company: 'Docker', industry: 'developer' },
  { name: 'Dev Ittycheria', company: 'MongoDB', industry: 'database' },
  { name: 'Frank Slootman', company: 'Snowflake', industry: 'data' },
  { name: 'Ali Ghodsi', company: 'Databricks', industry: 'data' },
  { name: 'Alex Karp', company: 'Palantir', industry: 'analytics' },
  { name: 'Matthew Prince', company: 'Cloudflare', industry: 'cdn' },
  { name: 'Joshua Bixby', company: 'Fastly', industry: 'cdn' },
  { name: 'Guillermo Rauch', company: 'Vercel', industry: 'deployment' },
  { name: 'Matt Biilmann', company: 'Netlify', industry: 'deployment' },
  { name: 'Zach Perret', company: 'Plaid', industry: 'fintech' },
  { name: 'Vlad Tenev', company: 'Robinhood', industry: 'trading' },
  { name: 'Brian Armstrong', company: 'Coinbase', industry: 'crypto' },
  { name: 'Devin Finzer', company: 'OpenSea', industry: 'nft' },
  { name: 'Jesse Powell', company: 'Kraken', industry: 'crypto' },
  { name: 'Cameron Winklevoss', company: 'Gemini', industry: 'crypto' },
  { name: 'Whitney Wolfe Herd', company: 'Bumble', industry: 'dating' },
  { name: 'Julia Hartz', company: 'Eventbrite', industry: 'events' },
  { name: 'Katrina Lake', company: 'Stitch Fix', industry: 'fashion' },
  { name: 'Anne Wojcicki', company: '23andMe', industry: 'biotech' },
  { name: 'Stewart Lyons', company: 'Peloton', industry: 'fitness' },
  { name: 'Apoorva Mehta', company: 'Instacart', industry: 'delivery' },
  { name: 'Logan Allin', company: 'Gopuff', industry: 'delivery' },
  { name: 'Bastian Lehmann', company: 'Postmates', industry: 'delivery' },
  { name: 'Arash Ferdowsi', company: 'Dropbox', industry: 'storage' },
  { name: 'Dylan Field', company: 'Figma', industry: 'design' },
  { name: 'Vlad Magdalin', company: 'Webflow', industry: 'nocode' },
];

// Funny project-specific quotes mapped to challenge slugs
const funnyQuotes = {
  'build-your-own-cat': [
    "I thought I knew what 'cat' was until I tried to build it myself. Turns out, it's not just about printing files—it's about understanding the very essence of Unix philosophy. My therapist says I'm making progress.",
    'Building my own cat was like discovering fire, except instead of warmth, I got carpal tunnel from all the edge case handling. Worth every keystroke!',
    "Who knew something as simple as 'cat' could be so complex? I now have deep respect for whoever first invented this command. Also, I may never look at actual cats the same way again.",
    'After building cat from scratch, I finally understand why my terminal has been judging me all these years. The original developers were geniuses... or masochists. Probably both.',
  ],
  'build-your-own-cut': [
    "I used to think 'cut' was just about removing parts of text. Now I realize it's actually about cutting through the illusion that command-line tools are simple. My mind is blown, and slightly bruised.",
    "Building cut taught me that parsing command-line arguments is like trying to understand what your cat wants at 3 AM. Eventually you figure it out, but there's a lot of confusion along the way.",
    "The cut command: simple in theory, existential crisis in practice. I've never been more proud of handling delimiter edge cases. My family doesn't understand, but the terminal does.",
    "Who knew that 'cutting' text could be so... cutting edge? (I'll see myself out, but not before I implement proper field separation!)",
  ],
  'build-your-own-database': [
    'I built my own database and now I understand why database administrators have that distant look in their eyes. Also, I may have accidentally achieved enlightenment while implementing B-trees.',
    'Building a database from scratch is like playing chess with yourself while blindfolded and riding a unicycle. Surprisingly fun, definitely humbling, probably inadvisable.',
    "After creating my own database, I have a new appreciation for the phrase 'it's not a bug, it's a feature.' Especially when ACID compliance becomes more of a suggestion.",
    "I used to mock database administrators. Now I understand they're not grumpy—they're enlightened beings who've transcended the need for sleep and sanity.",
  ],
  'build-your-own-diff': [
    "Building diff made me realize that finding differences between files is a lot like marriage counseling—it's all about patience, precision, and occasionally wanting to throw your computer out the window.",
    "I thought diff was just about showing what changed. Turns out, it's actually about confronting the fundamental nature of change itself. Also, dynamic programming is hard.",
    'After implementing my own diff, I now see differences everywhere. The barista gave me a weird look when I started explaining the longest common subsequence algorithm while ordering coffee.',
    "Who knew that comparing two files could be so philosophical? I've achieved inner peace through edit distance calculations. My meditation app is confused.",
  ],
  'build-your-own-docker': [
    "Building my own Docker taught me that containers aren't just about isolation—they're about isolating yourself from the crushing reality that systems programming is really, really hard.",
    "I created a container runtime and now I understand why Docker became so popular. It's not magic, it's just really, really clever use of Linux kernel features. Also, namespaces are wild.",
    "After building Docker from scratch, I have a new respect for the phrase 'it works on my machine.' Now it truly works on ANY machine! (Terms and conditions may apply.)",
    'Who needs therapy when you can debug namespace conflicts at 2 AM? Building a container runtime is cheaper than a psychiatrist and twice as enlightening.',
  ],
  'build-your-own-find': [
    "Building find made me realize that searching for files is like searching for meaning in life—sometimes you find what you're looking for, sometimes you find something better, and sometimes you just find pain.",
    "I implemented my own find command and now I can locate any file on my system. Unfortunately, I still can't find my keys, my purpose in life, or why I chose systems programming as a hobby.",
    "After building find from scratch, I've developed an unhealthy emotional attachment to directory traversal algorithms. My friends are concerned, but my file system has never been more organized.",
    "Who knew that walking a directory tree could be so therapeutic? It's like forest bathing, but for programmers, and occasionally you find that config file you lost three months ago.",
  ],
  'build-your-own-git': [
    "Building my own Git finally helped me understand what all those cryptic error messages mean. Turns out, Git isn't angry at me—it's just disappointed. Which is somehow worse.",
    "After implementing Git from scratch, I've achieved a zen-like understanding of version control. I am one with the commit graph. The merge conflicts are part of me now.",
    "I built my own Git and now I understand why Linus Torvalds seems so confident all the time. When you've created something this elegant, why wouldn't you be a little smug?",
    "Building Git taught me that version control isn't just about managing code—it's about managing the versions of yourself that wrote that code. Past me was an idiot, but at least I can blame him specifically now.",
  ],
  'build-your-own-grep': [
    'I built my own grep and now I can find patterns in everything—text files, code, my life choices, the fundamental structure of reality. My therapist says this might be a problem.',
    "Building grep from scratch taught me that regular expressions aren't just patterns—they're a way of life. A very confusing, occasionally magical way of life.",
    "After implementing grep, I've developed the ability to see patterns everywhere. The barista's foam art? That's just /^[A-Za-z]+$/ with extra steps.",
    "Who knew that searching text could be so existential? I'm not just finding patterns anymore—I'm finding myself. Also, regex is still terrifying.",
  ],
  'build-your-own-head-tail': [
    "Building head and tail made me realize that sometimes you don't need to see the whole file—just like how you don't need to understand the entire universe to appreciate a good coffee. Wisdom through truncation.",
    'I implemented head and tail, and now I have a philosophical appreciation for beginnings and endings. Also, buffer management is harder than it looks.',
    "After building head and tail, I've learned to appreciate the beauty of seeing just enough. It's like mindfulness, but for file reading, and with more memory allocation.",
    'Who knew that reading the first or last lines of a file could teach you so much about life? Sometimes the middle parts are just noise anyway.',
  ],
  'build-your-own-http-client': [
    'Building an HTTP client taught me that the internet is held together by standards, hope, and an alarming amount of error handling. Also, HTTP is surprisingly chatty.',
    'I created my own HTTP client and now I understand why browsers are so complicated. Turns out, fetching a webpage is like ordering food at a restaurant where the menu changes every second.',
    'After implementing HTTP from scratch, I have a new appreciation for curl. What I thought would be simple became a journey through the seven layers of networking hell.',
    "Building an HTTP client is like learning to speak a foreign language, except the language is made of headers and the grammar is 'good luck, figure it out.'",
  ],
};

// Function to create unique combinations without repetition
function createUniqueTestimonialCombinations(challenges: ClientChallenge[]) {
  const usedCombinations = new Set<string>();
  const availableCeos = [...ceoData];

  // Shuffle arrays to ensure randomness
  function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  const shuffledCeos = shuffleArray(availableCeos);

  return challenges.map((challenge, index) => {
    // Ensure we don't run out of CEOs by cycling through if needed
    const ceoIndex = index % shuffledCeos.length;
    const ceo = shuffledCeos[ceoIndex];

    // Get funny quotes for this specific challenge
    const challengeQuotes =
      funnyQuotes[challenge.slug as keyof typeof funnyQuotes];

    // Fallback to generic funny programming quotes if challenge-specific ones don't exist
    const fallbackQuotes = [
      'I built this and now I understand why programmers drink so much coffee. Also, why we have trust issues with our own code.',
      "This challenge taught me that debugging is like being a detective in a crime novel where you're also the murderer. Plot twist: I'm terrible at both roles.",
      "After completing this project, I've achieved enlightenment. Also, carpal tunnel. But mostly enlightenment.",
      'Building this was like solving a puzzle, except half the pieces were missing and the other half were on fire. 10/10 would recommend.',
    ];

    const quotesToUse = challengeQuotes || fallbackQuotes;
    const quoteIndex = index % quotesToUse.length;

    // Create unique combination key
    const combinationKey = `${ceo.name}-${challenge.slug}-${quoteIndex}`;

    // If we've used this combination, find an alternative
    let finalCeo = ceo;
    let finalQuoteIndex = quoteIndex;
    let attempts = 0;

    while (usedCombinations.has(combinationKey) && attempts < 50) {
      // Try different CEO
      const altCeoIndex = (ceoIndex + attempts + 1) % shuffledCeos.length;
      finalCeo = shuffledCeos[altCeoIndex];

      // Try different quote
      finalQuoteIndex = (quoteIndex + attempts + 1) % quotesToUse.length;

      const newCombinationKey = `${finalCeo.name}-${challenge.slug}-${finalQuoteIndex}`;
      if (!usedCombinations.has(newCombinationKey)) {
        usedCombinations.add(newCombinationKey);
        break;
      }
      attempts++;
    }

    usedCombinations.add(combinationKey);

    // Select final quote
    const finalQuote = quotesToUse[finalQuoteIndex];

    return {
      name: finalCeo.name,
      role: 'CEO',
      company: finalCeo.company,
      quote: finalQuote,
      rating: Math.floor(Math.random() * 2) + 4, // Random 4 or 5
      challenge: challenge.title,
      challenge_link: challenge.slug,
      industry: finalCeo.industry,
    };
  });
}

function generateTestimonials(challenges: ClientChallenge[]) {
  return createUniqueTestimonialCombinations(challenges);
}

// Function to select a diverse set of testimonials
function selectDiverseTestimonials(
  testimonials: TestimonialType[],
  count: number
): TestimonialType[] {
  if (testimonials.length <= count) {
    return testimonials;
  }

  // Create a map to track industries and challenges we've already included
  const includedIndustries = new Set<string>();
  const includedChallenges = new Set<string>();

  // First, randomly shuffle the testimonials
  const shuffled = [...testimonials];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Then select diverse testimonials
  const selected: TestimonialType[] = [];

  // First pass: try to get diverse industries and challenges
  for (const testimonial of shuffled) {
    // Skip if we already have enough testimonials
    if (selected.length >= count) break;

    // Check if this industry or challenge is already included
    const industryIncluded =
      testimonial.industry && includedIndustries.has(testimonial.industry);
    const challengeIncluded = includedChallenges.has(
      testimonial.challenge_link
    );

    // Prioritize testimonials that add diversity
    if (!industryIncluded || !challengeIncluded) {
      selected.push(testimonial);

      // Track what we've included
      if (testimonial.industry) {
        includedIndustries.add(testimonial.industry);
      }
      includedChallenges.add(testimonial.challenge_link);
    }
  }

  // Second pass: fill remaining slots if needed
  if (selected.length < count) {
    for (const testimonial of shuffled) {
      if (selected.length >= count) break;

      // Skip testimonials we've already selected
      if (!selected.includes(testimonial)) {
        selected.push(testimonial);
      }
    }
  }

  return selected;
}

export default function Testimonials() {
  const [testimonialData, setTestimonialData] = useState<TestimonialType[]>([]);
  const { challenges, loading, error } = useChallenges();

  useEffect(() => {
    if (!loading && !error && challenges.length > 0) {
      console.log('Loaded challenges:', challenges.length);
      const generatedTestimonials = generateTestimonials(challenges);
      console.log('Generated testimonials:', generatedTestimonials.length);

      // Limit the number of testimonials displayed to 6
      const limitedTestimonials = selectDiverseTestimonials(
        generatedTestimonials,
        6
      );
      setTestimonialData(limitedTestimonials);
    } else if (!loading && (error || challenges.length === 0)) {
      console.error('Error loading challenges or no challenges found:', error);
      // Create fallback testimonials if API fails or no challenges
      const fallbackTestimonials = [
        {
          name: 'Sarah Chen',
          role: 'Senior Developer',
          company: 'TechCorp',
          quote:
            'The coding challenges helped me improve my problem-solving skills significantly. The real-world applications make learning much more engaging.',
          rating: 5,
          challenge: 'React Dashboard',
          challenge_link: 'react-dashboard',
        },
        {
          name: 'Michael Johnson',
          role: 'Full Stack Engineer',
          company: 'StartupXYZ',
          quote:
            'These challenges bridge the gap between theoretical knowledge and practical application. Perfect for skill development.',
          rating: 5,
          challenge: 'API Integration',
          challenge_link: 'api-integration',
        },
        {
          name: 'Emily Rodriguez',
          role: 'Frontend Developer',
          company: 'DesignHub',
          quote:
            'The step-by-step approach and detailed explanations make complex concepts easy to understand and implement.',
          rating: 4,
          challenge: 'Component Library',
          challenge_link: 'component-library',
        },
      ];
      setTestimonialData(fallbackTestimonials);
    }
  }, [challenges, loading, error]);

  // Simplified animation variants for better mobile performance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
        duration: 0.4,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 40,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
      },
    },
    hover: {
      scale: 1.02,
      y: -5,
      boxShadow:
        '0 10px 20px -5px rgba(0, 0, 0, 0.1), 0 5px 8px -3px rgba(0, 0, 0, 0.04)',
      transition: {
        duration: 0.2,
      },
    },
    tap: {
      scale: 0.98,
    },
  };

  const starVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: (i: number) => ({
      scale: 1,
      rotate: 0,
      transition: {
        delay: 0.5 + i * 0.1,
        duration: 0.4,
      },
    }),
    hover: {
      scale: 1.2,
      rotate: 360,
      transition: {
        duration: 0.4,
      },
    },
  };

  const quoteVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -5 },
    visible: {
      opacity: 0.25,
      scale: 1,
      rotate: 0,
      transition: {
        delay: 0.6,
        duration: 0.6,
      },
    },
    hover: {
      opacity: 0.4,
      scale: 1.1,
      rotate: 5,
      transition: {
        duration: 0.3,
      },
    },
  };

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        delay: 0.8,
        duration: 0.4,
      },
    },
    hover: {
      scale: 1.05,
      y: -2,
      transition: {
        duration: 0.2,
      },
    },
    tap: {
      scale: 0.95,
    },
  };

  return (
    <motion.section
      className="bg-background py-12 sm:py-16 md:py-24 relative overflow-hidden w-full max-w-full"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1, margin: '0px 0px -100px 0px' }}
      variants={containerVariants}
    >
      {/* Floating background elements */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 bg-[--brand]/5 rounded-full blur-xl"
        animate={{
          y: [-20, 20, -20],
          x: [-10, 10, -10],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-20 right-16 w-24 h-24 bg-yellow-400/10 rounded-full blur-2xl"
        animate={{
          y: [15, -15, 15],
          x: [8, -8, 8],
          scale: [1.1, 1, 1.1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-8 sm:mb-12 px-4"
          variants={headerVariants}
        >
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            What Our Users Say
          </motion.h2>
          <motion.p
            className="mt-4 text-lg sm:text-xl text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Hear from engineers who have improved their skills through our
            platform
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          variants={containerVariants}
        >
          {loading ? (
            <div className="col-span-full flex justify-center items-center py-12">
              <div className="text-muted-foreground">
                Loading testimonials...
              </div>
            </div>
          ) : (
            testimonialData.map((testimonial, index) => (
              <motion.div
                key={`${testimonial.name}-${index}`}
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
                style={{ perspective: '1000px' }}
              >
                <Card className="h-full flex flex-col overflow-hidden bg-card border-2 hover:border-[--brand]/20 transition-colors duration-300">
                  <CardHeader className="relative p-4 sm:p-6">
                    <motion.div
                      className="flex items-center space-x-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                    >
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-card-foreground">
                          {testimonial.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {testimonial.role}, {testimonial.company}
                        </p>
                      </div>
                    </motion.div>
                  </CardHeader>

                  <CardContent className="flex-grow p-4 sm:p-6">
                    <motion.div
                      className="mb-3 sm:mb-4 flex"
                      initial="hidden"
                      animate="visible"
                    >
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          variants={starVariants}
                          custom={i}
                          whileHover="hover"
                        >
                          <Star
                            className={`h-5 w-5 ${
                              i < testimonial.rating
                                ? 'text-yellow-400'
                                : 'text-muted-foreground'
                            }`}
                            fill={
                              i < testimonial.rating ? 'currentColor' : 'none'
                            }
                          />
                        </motion.div>
                      ))}
                    </motion.div>

                    <div className="relative">
                      <motion.div variants={quoteVariants} whileHover="hover">
                        <Quote className="absolute top-0 left-0 h-8 w-8 text-[--brand]" />
                      </motion.div>
                      <motion.p
                        className="italic pl-8 sm:pl-10 text-card-foreground text-sm sm:text-base leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
                      >
                        &#34;{testimonial.quote}&#34;
                      </motion.p>
                    </div>
                  </CardContent>

                  <CardFooter className="flex flex-col items-start space-y-2 border-t border-border pt-3 sm:pt-4 bg-secondary/50 p-4 sm:p-6">
                    <motion.p
                      className="text-xs sm:text-sm text-muted-foreground"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.9 + index * 0.1, duration: 0.4 }}
                    >
                      Challenge Completed:
                    </motion.p>
                    <Link href={`/challenge/${testimonial.challenge_link}`}>
                      <motion.div
                        variants={badgeVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <Badge
                          variant="secondary"
                          className="hover:bg-[--brand] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                        >
                          {testimonial.challenge}
                        </Badge>
                      </motion.div>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </motion.section>
  );
}
