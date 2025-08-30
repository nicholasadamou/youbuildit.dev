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
}> = [];

function generateTestimonials(challenges: ClientChallenge[]) {
	return challenges.map((challenge: ClientChallenge, index: number) => {
	const names = [
		'Elon Musk',
		'Jeff Bezos',
		'Richard Branson',
		'Mark Zuckerberg',
		'Tim Cook',
		'Satya Nadella',
		'Sundar Pichai',
		'Jack Dorsey',
		'Reed Hastings',
		'Brian Chesky',
		'Daniel Ek',
	];
	const companies = [
		'SpaceX',
		'Amazon',
		'Virgin Group',
		'Meta',
		'Apple',
		'Microsoft',
		'Google',
		'Twitter',
		'Netflix',
		'Airbnb',
		'Spotify',
	];
	const quotes = [
		`Building ${challenge.title.toLowerCase()} was like launching a rocket—lots of pressure, but the thrill of seeing it work was worth every line of code!`,
		`I told my team to build ${challenge.title.toLowerCase()}, and now they are ready to take on the world!`,
		`I've taken on many challenges, but ${challenge.title.toLowerCase()} was a wild ride—like flying a balloon through a thunderstorm!`,
		`If I had a dollar for every time I built ${challenge.title.toLowerCase()}, I'd fund a new social network!`,
		`Creating ${challenge.title.toLowerCase()} taught me so much—it's like mastering a new art!`,
		`I've seen many challenges, but ${challenge.title.toLowerCase()} was a true test of my skills!`,
		`I asked my team to build ${challenge.title.toLowerCase()}, and they delivered a masterpiece!`,
	];

		return {
			name: names[index % names.length],
			role: 'CEO',
			company: companies[index % companies.length],
			quote: quotes[index % quotes.length],
			rating: Math.floor(Math.random() * 2) + 4, // Random 4 or 5
			challenge: challenge.title,
			challenge_link: challenge.slug,
		};
	});
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
