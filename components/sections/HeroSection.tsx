'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { useRef } from 'react'
import type { ClientChallenge } from '@/types/challenge'
import { InfiniteCarousel } from '@/components/InfiniteCarousel'
import ChallengeCard from "@/components/ChallengeCard";
import FadeIn from "@/components/FadeIn";

// Animation variants for staggered animations
const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.2,
			delayChildren: 0.1
		}
	}
}

const itemVariants = {
	hidden: {
		opacity: 0,
		y: 30,
		scale: 0.95
	},
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: {
			type: "spring" as const,
			damping: 20,
			stiffness: 100,
			duration: 0.8
		}
	}
}

const gradientVariants = {
	hidden: {
		opacity: 0,
		backgroundPosition: "200% center"
	},
	visible: {
		opacity: 1,
		backgroundPosition: "0% center",
		transition: {
			type: "spring" as const,
			damping: 15,
			stiffness: 80,
			delay: 0.4,
			duration: 1.2
		}
	}
}

const HeroHeading = () => {
	const ref = useRef(null)
	const isInView = useInView(ref, { once: true, margin: "-100px" })

	return (
		<motion.div
			ref={ref}
			variants={containerVariants}
			initial="hidden"
			animate={isInView ? "visible" : "hidden"}
			className="text-center"
		>
			<motion.h1
				variants={itemVariants}
				className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4 sm:mb-6 text-primary"
				style={{ lineHeight: '1.2' }}
			>
					<motion.div className="flex flex-wrap justify-center items-center gap-x-2 sm:gap-x-3 text-center">
						<motion.span
							variants={itemVariants}
							className="sm:whitespace-nowrap"
						>
							Become a
						</motion.span>
						<motion.span
							variants={gradientVariants}
							className="text-transparent bg-clip-text bg-gradient-to-r from-[#2fbc77] to-[#2fb676] bg-[length:200%_100%] sm:whitespace-nowrap"
						>
							Great Engineer
						</motion.span>
						<motion.span
							variants={itemVariants}
							className="block sm:inline w-full sm:w-auto"
						>
							Through Real Challenges
						</motion.span>
					</motion.div>
			</motion.h1>
			<motion.p
				variants={itemVariants}
				className="mt-4 sm:mt-6 text-xl sm:text-xl md:text-2xl text-secondary-foreground px-4 sm:px-0"
			>
				Master software engineering by building real applications not toys.
			</motion.p>
		</motion.div>
	)
}

// Loading animation variants
const loadingVariants = {
	hidden: { opacity: 0, scale: 0.8 },
	visible: {
		opacity: 1,
		scale: 1,
		transition: {
			type: "spring" as const,
			damping: 15,
			stiffness: 200
		}
	},
	exit: {
		opacity: 0,
		scale: 0.8,
		transition: {
			duration: 0.3
		}
	}
}

const carouselVariants = {
	hidden: {
		opacity: 0,
		y: 50,
		filter: "blur(10px)"
	},
	visible: {
		opacity: 1,
		y: 0,
		filter: "blur(0px)",
		transition: {
			type: "spring" as const,
			damping: 20,
			stiffness: 100,
			delay: 0.2,
			duration: 0.8
		}
	}
}

export default function HeroSection() {
	const [hoveredChallenge, setHoveredChallenge] = useState<string | null>(null)
	const [allChallenges, setAllChallenges] = useState<ClientChallenge[]>([]);
	const [loading, setLoading] = useState(true);
	const sectionRef = useRef(null)
	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ["start end", "end start"]
	})

	// Parallax effect for background
	const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
	const backgroundOpacity = useTransform(scrollYProgress, [0, 0.8, 1], [0.3, 0.2, 0.1])

	useEffect(() => {
		async function loadChallenges() {
			try {
				const response = await fetch('/api/challenges');
				if (!response.ok) {
					throw new Error('Failed to fetch challenges');
				}
				const challenges = await response.json();
				setAllChallenges(challenges);
			} catch (error) {
				console.error('Error loading challenges:', error);
			} finally {
				setLoading(false);
			}
		}
		loadChallenges();
	}, []);

	return (
		<div
			ref={sectionRef}
			className="relative mt-0 md:mt-16 pb-20 flex flex-col"
		>
			{/* Static Background Layer */}
			<div className="absolute inset-0 bg-gradient-to-t from-[#2fbc77]/15 to-transparent" />

			{/* Animated Parallax Background */}
			<motion.div
				className="absolute inset-0 bg-gradient-to-t from-[#2fbc77]/10 to-transparent"
				style={{
					y: backgroundY,
					opacity: backgroundOpacity
				}}
			/>

			<div className="relative z-10 flex flex-col">
				<div className="flex flex-col">
					{/* Hero Section */}
					<motion.div
						className="flex items-center justify-center p-4 sm:p-8 pb-8 sm:pb-12"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5 }}
					>
						<div className="max-w-3xl mx-auto w-full">
							<HeroHeading />
						</div>
					</motion.div>

					{/* Popular Challenges Section */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 1, duration: 0.5 }}
							className="py-4 sm:py-6 -mb-32 sm:-mb-64"
						>
						<div className="max-w-full mx-auto">
							<div className="relative">
								{loading ? (
									<motion.div
										variants={loadingVariants}
										initial="hidden"
										animate="visible"
										exit="exit"
										className="flex flex-col justify-center items-center h-64 space-y-4"
									>
										<motion.div
											className="w-12 h-12 border-4 border-[--brand] border-t-transparent rounded-full"
											animate={{ rotate: 360 }}
											transition={{
												duration: 1,
												repeat: Infinity,
												ease: "linear"
											}}
										/>
										<motion.p
											className="text-secondary-foreground text-lg"
											animate={{ opacity: [0.5, 1, 0.5] }}
											transition={{
												duration: 2,
												repeat: Infinity,
												ease: "easeInOut"
											}}
										>
											Loading amazing challenges...
										</motion.p>
									</motion.div>
								) : (
									<motion.div
										variants={carouselVariants}
										initial="hidden"
										animate="visible"
									>
										<InfiniteCarousel pauseOnHover reverseDirection>
											{allChallenges.map((challenge: ClientChallenge, index: number) => (
										<FadeIn
											key={challenge.slug}
											delay={index * 0.1}
											duration={0.6}
											className="flex-shrink-0 items-center justify-center carousel-item"
										>
													<ChallengeCard
														challenge={challenge}
														isHovered={hoveredChallenge === challenge.slug}
														onHover={setHoveredChallenge}
													/>
												</FadeIn>
											))}
										</InfiniteCarousel>
									</motion.div>
								)}
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</div>
	)
}
