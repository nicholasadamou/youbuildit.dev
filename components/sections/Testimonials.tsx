'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import Link from "next/link";
import type { ClientChallenge } from '@/types/challenge';
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";

// This will be populated in a React component
let testimonials: Array<{
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  challenge: string;
  challenge_link: string;
  style?: string;
  industry?: string;
}> = [];

// CEO data with their matching companies and industries
const ceoData = [
	{ name: 'Elon Musk', company: 'SpaceX', industry: 'space' },
	{ name: 'Jeff Bezos', company: 'Amazon', industry: 'ecommerce' },
	{ name: 'Richard Branson', company: 'Virgin Group', industry: 'conglomerate' },
	{ name: 'Mark Zuckerberg', company: 'Meta', industry: 'social' },
	{ name: 'Tim Cook', company: 'Apple', industry: 'hardware' },
	{ name: 'Satya Nadella', company: 'Microsoft', industry: 'cloud' },
	{ name: 'Sundar Pichai', company: 'Google', industry: 'search' },
	{ name: 'Reed Hastings', company: 'Netflix', industry: 'streaming' },
	{ name: 'Brian Chesky', company: 'Airbnb', industry: 'marketplace' },
	{ name: 'Daniel Ek', company: 'Spotify', industry: 'streaming' },
	{ name: 'Neal Mohan', company: 'YouTube', industry: 'video' },
	{ name: 'Melinda French Gates', company: 'Pivotal Ventures', industry: 'investment' },
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
	{ name: 'Vlad Magdalin', company: 'Webflow', industry: 'nocode' }
];

// Quote templates organized by tone and style
const quoteTemplates = {
	visionary: [
		"Building {challenge} opened up entirely new possibilities for how we think about {industry}. This is the kind of innovative thinking that drives breakthrough solutions.",
		"When we tackled {challenge}, it reminded me why I'm passionate about {industry}. The future belongs to those who can solve complex problems like this.",
		"The {challenge} project exemplifies the kind of forward-thinking approach we need more of in {industry}. Absolutely game-changing work.",
		"Working through {challenge} was like peering into the future of {industry}. This is exactly the type of innovation that transforms entire markets."
	],
	pragmatic: [
		"We've implemented similar solutions to {challenge} at {company}, and I can tell you firsthand—this approach works. Solid engineering fundamentals.",
		"The {challenge} problem is one every {industry} company faces. This solution demonstrates real understanding of the core issues.",
		"Having built {company} from the ground up, I recognize quality work when I see it. The {challenge} implementation is exactly what we need.",
		"At {company}, we've tackled problems like {challenge} many times. This solution shows the kind of systematic thinking that scales."
	],
	entrepreneurial: [
		"If I were starting {company} today, projects like {challenge} would be exactly what I'd want my team working on. This is how you build the future.",
		"The {challenge} challenge reminds me of the early days at {company}—complex problems that require both creativity and technical excellence.",
		"Building {challenge} captures that startup energy I love. This is the kind of innovative problem-solving that disrupts entire industries.",
		"When I see work like {challenge}, it takes me back to {company}'s founding. This demonstrates the entrepreneurial spirit that drives real change."
	],
	technical: [
		"The technical approach to {challenge} is impressive. As someone who's built systems at {company} scale, I appreciate the attention to architectural detail.",
		"Having worked on similar challenges in {industry}, I can see the engineering sophistication behind {challenge}. Really well-executed solution.",
		"The {challenge} implementation demonstrates deep technical understanding. This is the caliber of work that drives {industry} forward.",
		"From a systems perspective, {challenge} tackles some genuinely difficult problems. The kind of engineering work that makes {company} successful."
	],
	inspirational: [
		"Projects like {challenge} inspire me to keep pushing boundaries in {industry}. This represents the best of what's possible when talent meets opportunity.",
		"Seeing {challenge} reminds me why I fell in love with {industry} in the first place. This is innovation in its purest form.",
		"The passion and skill evident in {challenge} gives me tremendous optimism for the future of {industry}. Exceptional work.",
		"Work like {challenge} is why I'm excited about the next generation of {industry} leaders. This demonstrates both vision and execution."
	],
	experienced: [
		"After decades in {industry}, I can recognize groundbreaking work when I see it. {challenge} represents exactly this kind of breakthrough thinking.",
		"Having led {company} through multiple technology transitions, I know quality when I see it. The {challenge} solution is top-tier.",
		"In my years building {company}, I've seen many approaches to problems like {challenge}. This one stands out for its clarity and effectiveness.",
		"The {challenge} project demonstrates the kind of strategic thinking that took {company} from startup to industry leader. Impressive work."
	]
};

// Industry-specific contexts for better personalization
const industryContexts = {
	space: 'aerospace innovation',
	ecommerce: 'digital commerce',
	conglomerate: 'business strategy',
	social: 'social platforms',
	hardware: 'consumer technology',
	cloud: 'enterprise solutions',
	search: 'information systems',
	streaming: 'content delivery',
	marketplace: 'platform economics',
	video: 'media technology',
	investment: 'technology investment',
	enterprise: 'enterprise software',
	database: 'data management',
	semiconductors: 'hardware architecture',
	ai: 'artificial intelligence',
	crm: 'customer solutions',
	rideshare: 'mobility solutions',
	fintech: 'financial technology',
	storage: 'data infrastructure',
	design: 'creative technology',
	delivery: 'logistics technology',
	messaging: 'communication platforms',
	vr: 'immersive technology',
	gaming: 'interactive entertainment',
	communication: 'collaboration tools',
	professional: 'professional networking',
	developer: 'developer tools',
	data: 'data analytics',
	analytics: 'business intelligence',
	cdn: 'web infrastructure',
	deployment: 'development platforms',
	trading: 'financial markets',
	crypto: 'blockchain technology',
	nft: 'digital assets',
	dating: 'social connections',
	events: 'event technology',
	fashion: 'fashion technology',
	biotech: 'biotechnology',
	fitness: 'health technology',
	nocode: 'visual development'
};

// Function to create unique combinations without repetition
function createUniqueTestimonialCombinations(challenges: ClientChallenge[]) {
	const usedCombinations = new Set<string>();
	const availableCeos = [...ceoData];
	const quoteStyles = Object.keys(quoteTemplates);
	
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
	const shuffledQuoteStyles = shuffleArray(quoteStyles);
	
	return challenges.map((challenge, index) => {
		// Ensure we don't run out of CEOs by cycling through if needed
		const ceoIndex = index % shuffledCeos.length;
		const ceo = shuffledCeos[ceoIndex];
		
		// Ensure we don't run out of quote styles
		const styleIndex = index % shuffledQuoteStyles.length;
		const style = shuffledQuoteStyles[styleIndex];
		
		// Get quote templates for this style
		const templates = quoteTemplates[style as keyof typeof quoteTemplates];
		const templateIndex = index % templates.length;
		const template = templates[templateIndex];
		
		// Create unique combination key
		const combinationKey = `${ceo.name}-${challenge.slug}-${style}-${templateIndex}`;
		
		// If we've used this combination, find an alternative
		let finalCeo = ceo;
		let finalStyle = style;
		let finalTemplate = template;
		let attempts = 0;
		
		while (usedCombinations.has(combinationKey) && attempts < 50) {
			// Try different CEO
			const altCeoIndex = (ceoIndex + attempts + 1) % shuffledCeos.length;
			finalCeo = shuffledCeos[altCeoIndex];
			
			// Try different style
			const altStyleIndex = (styleIndex + attempts + 1) % shuffledQuoteStyles.length;
			finalStyle = shuffledQuoteStyles[altStyleIndex];
			
			// Try different template
			const altTemplates = quoteTemplates[finalStyle as keyof typeof quoteTemplates];
			const altTemplateIndex = (templateIndex + attempts + 1) % altTemplates.length;
			finalTemplate = altTemplates[altTemplateIndex];
			
			const newCombinationKey = `${finalCeo.name}-${challenge.slug}-${finalStyle}-${altTemplateIndex}`;
			if (!usedCombinations.has(newCombinationKey)) {
				usedCombinations.add(newCombinationKey);
				break;
			}
			attempts++;
		}
		
		usedCombinations.add(combinationKey);
		
		// Generate personalized quote
		const industryContext = industryContexts[finalCeo.industry as keyof typeof industryContexts] || finalCeo.industry;
		const personalizedQuote = finalTemplate
			.replace('{challenge}', challenge.title)
			.replace('{company}', finalCeo.company)
			.replace('{industry}', industryContext);
		
		return {
			name: finalCeo.name,
			role: 'CEO',
			company: finalCeo.company,
			quote: personalizedQuote,
			rating: Math.floor(Math.random() * 2) + 4, // Random 4 or 5
			challenge: challenge.title,
			challenge_link: challenge.slug,
			style: finalStyle,
			industry: finalCeo.industry
		};
	});
}

function generateTestimonials(challenges: ClientChallenge[]) {
	return createUniqueTestimonialCombinations(challenges);
}

export default function Testimonials() {
	const [, setChallenges] = useState<ClientChallenge[]>([]);
	const [, setLoading] = useState(true);

	useEffect(() => {
		async function loadChallenges() {
			try {
				const response = await fetch('/api/challenges');
				if (!response.ok) {
					throw new Error('Failed to fetch challenges');
				}
				const allChallenges = await response.json();
				setChallenges(allChallenges);
				testimonials = generateTestimonials(allChallenges);
			} catch (error) {
				console.error('Error loading challenges:', error);
			} finally {
				setLoading(false);
			}
		}
		loadChallenges();
	}, []);

	// Animation variants
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
				delayChildren: 0.2,
				duration: 0.6
			}
		}
	}

	const headerVariants = {
		hidden: { opacity: 0, y: 30, scale: 0.95 },
		visible: {
			opacity: 1,
			y: 0,
			scale: 1,
			transition: {
				duration: 0.7
			}
		}
	}

	const cardVariants = {
		hidden: { 
			opacity: 0, 
			y: 60, 
			scale: 0.9,
			rotateX: 15 
		},
		visible: {
			opacity: 1,
			y: 0,
			scale: 1,
			rotateX: 0,
			transition: {
				duration: 0.6
			}
		},
		hover: {
			scale: 1.03,
			y: -10,
			rotateX: -5,
			boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
			transition: {
				duration: 0.3
			}
		},
		tap: {
			scale: 0.98,
			y: -5
		}
	}

	const starVariants = {
		hidden: { scale: 0, rotate: -180 },
		visible: (i: number) => ({
			scale: 1,
			rotate: 0,
			transition: {
				delay: 0.5 + (i * 0.1),
				duration: 0.4
			}
		}),
		hover: {
			scale: 1.2,
			rotate: 360,
			transition: {
				duration: 0.4
			}
		}
	}

	const quoteVariants = {
		hidden: { opacity: 0, scale: 0.8, rotate: -5 },
		visible: {
			opacity: 0.25,
			scale: 1,
			rotate: 0,
			transition: {
				delay: 0.6,
				duration: 0.6
			}
		},
		hover: {
			opacity: 0.4,
			scale: 1.1,
			rotate: 5,
			transition: {
				duration: 0.3
			}
		}
	}

	const badgeVariants = {
		hidden: { opacity: 0, scale: 0.8, y: 10 },
		visible: {
			opacity: 1,
			scale: 1,
			y: 0,
			transition: {
				delay: 0.8,
				duration: 0.4
			}
		},
		hover: {
			scale: 1.05,
			y: -2,
			transition: {
				duration: 0.2
			}
		},
		tap: {
			scale: 0.95
		}
	}

	return (
		<motion.section 
			className="bg-background py-16 sm:py-24 relative overflow-hidden"
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, amount: 0.2 }}
			variants={containerVariants}
		>
			{/* Floating background elements */}
			<motion.div
				className="absolute top-20 left-10 w-32 h-32 bg-[--brand]/5 rounded-full blur-xl"
				animate={{
					y: [-20, 20, -20],
					x: [-10, 10, -10],
					scale: [1, 1.2, 1]
				}}
				transition={{
					duration: 8,
					repeat: Infinity,
					ease: "easeInOut"
				}}
			/>
			<motion.div
				className="absolute bottom-20 right-16 w-24 h-24 bg-yellow-400/10 rounded-full blur-2xl"
				animate={{
					y: [15, -15, 15],
					x: [8, -8, 8],
					scale: [1.1, 1, 1.1]
				}}
				transition={{
					duration: 10,
					repeat: Infinity,
					ease: "easeInOut",
					delay: 2
				}}
			/>

			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<motion.div
					className="text-center mb-12"
					variants={headerVariants}
				>
					<motion.h2 
						className="text-3xl font-extrabold text-foreground sm:text-4xl"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
					>
						What Our Users Say
					</motion.h2>
					<motion.p 
						className="mt-4 text-xl text-muted-foreground"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.4 }}
					>
						Hear from engineers who have improved their skills through our platform
					</motion.p>
				</motion.div>
				
				<motion.div 
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
					variants={containerVariants}
				>
					{testimonials.map((testimonial, index) => (
						<motion.div
							key={`${testimonial.name}-${index}`}
							variants={cardVariants}
							whileHover="hover"
							whileTap="tap"
							style={{ perspective: "1000px" }}
						>
							<Card className="h-full flex flex-col overflow-hidden bg-gradient-to-br from-white to-gray-50 border-2 hover:border-[--brand]/20 transition-colors duration-300">
								<CardHeader className="relative">
									<motion.div 
										className="flex items-center space-x-4"
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: 0.3 + (index * 0.1), duration: 0.5 }}
									>
										<div>
											<h3 className="text-lg font-semibold">{testimonial.name}</h3>
											<p className="text-sm text-muted-foreground">
												{testimonial.role}, {testimonial.company}
											</p>
										</div>
									</motion.div>
								</CardHeader>
								
								<CardContent className="flex-grow">
									<motion.div 
										className="mb-4 flex"
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
														i < testimonial.rating ? 'text-yellow-400' : 'text-muted-foreground'
													}`}
													fill={i < testimonial.rating ? 'currentColor' : 'none'}
												/>
											</motion.div>
										))}
									</motion.div>
									
									<div className="relative">
										<motion.div
											variants={quoteVariants}
											whileHover="hover"
										>
											<Quote className="absolute top-0 left-0 h-8 w-8 text-[--brand]"/>
										</motion.div>
										<motion.p 
											className="italic pl-10 text-foreground"
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.7 + (index * 0.1), duration: 0.6 }}
										>
											&#34;{testimonial.quote}&#34;
										</motion.p>
									</div>
								</CardContent>
								
								<CardFooter className="flex flex-col items-start space-y-2 border-t pt-4 bg-white/50">
									<motion.p 
										className="text-sm text-muted-foreground"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ delay: 0.9 + (index * 0.1), duration: 0.4 }}
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
					))}
				</motion.div>
			</div>
		</motion.section>
	);
}
