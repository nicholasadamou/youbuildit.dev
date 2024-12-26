'use client';

import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import Link from "next/link";
import { allChallenges } from "contentlayer/generated";
import type { Challenge } from "contentlayer/generated";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";

const testimonials = allChallenges.map((challenge: Challenge, index: number) => {
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
		challenge_link: encodeURIComponent(challenge.title.toLowerCase().split(' ').join('-')),
	};
});

export default function Testimonials() {
	const [hoveredTestimonial, setHoveredTestimonial] = useState<string | null>(null);
	const controls = useAnimation();

	useEffect(() => {
		controls.start((i) => ({
			opacity: 1,
			y: 0,
			transition: { delay: i * 0.1 },
		}));
	}, [controls]);

	return (
		<section className="bg-background py-16 sm:py-24">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<motion.div
					className="text-center mb-12"
					initial={{opacity: 0, y: 20}}
					animate={{opacity: 1, y: 0}}
					transition={{duration: 0.5}}
				>
					<h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
						What Our Users Say
					</h2>
					<p className="mt-4 text-xl text-muted-foreground">
						Hear from engineers who have improved their skills through our platform
					</p>
				</motion.div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{testimonials.map((testimonial, index) => (
					<motion.div
						key={`${testimonial.name}-${index}`}
							initial={{opacity: 0, y: 50}}
							animate={controls}
							custom={index}
							whileHover={{scale: 1.02}}
							onHoverStart={() => setHoveredTestimonial(testimonial.name)}
							onHoverEnd={() => setHoveredTestimonial(null)}
						>
							<Card className="h-full flex flex-col">
								<CardHeader>
									<div className="flex items-center space-x-4">
										<div>
											<h3 className="text-lg font-semibold">{testimonial.name}</h3>
											<p className="text-sm text-muted-foreground">
												{testimonial.role}, {testimonial.company}
											</p>
										</div>
									</div>
								</CardHeader>
								<CardContent className="flex-grow">
									<div className="mb-4 flex">
										{[...Array(5)].map((_, i) => (
											<Star
												key={i}
												className={`h-5 w-5 ${
													i < testimonial.rating ? 'text-yellow-400' : 'text-muted-foreground'
												}`}
												fill={i < testimonial.rating ? 'currentColor' : 'none'}
											/>
										))}
									</div>
									<div className="relative">
										<Quote className="absolute top-0 left-0 h-8 w-8 text-[--brand] opacity-25"/>
										<p className="italic pl-10 text-foreground">&#34;{testimonial.quote}&#34;</p>
									</div>
								</CardContent>
								<CardFooter className="flex flex-col items-start space-y-2 border-t pt-4">
									<p className="text-sm text-muted-foreground">Challenge Completed:</p>
									<Link href={`/challenges/${testimonial.challenge_link}`}>
										<Badge variant="secondary"
											   className="hover:bg-[--brand] hover:text-secondary transition-colors">
											{testimonial.challenge}
										</Badge>
									</Link>
								</CardFooter>
							</Card>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
