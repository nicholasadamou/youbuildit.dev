'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { allChallenges } from "contentlayer/generated";
import type { Challenge } from "contentlayer/generated";
import { InfiniteCarousel } from '@/components/InfiniteCarousel'
import ChallengeCard from "@/components/ChallengeCard";
import FadeIn from "@/components/FadeIn";

const HeroHeading = () => (
	<motion.div
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.8 }}
		className="text-center"
	>
		<h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-4 text-primary">
			Become a{' '}
			<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2fbc77] to-[#2fb676]">
        Great Engineer
      </span>{' '}
			Through Real Challenges
		</h1>
		<p className="mt-6 text-xl sm:text-2xl text-secondary-foreground">
			Master software engineering by building real applications not toys.
		</p>
	</motion.div>
)

export default function HeroSection() {
	const [hoveredChallenge, setHoveredChallenge] = useState<string | null>(null)

	return (
		<div className="relative bg-gradient-to-t from-[#2fbc77]/20 to-transparent mt-16 pb-6 flex flex-col">
			<div className="relative z-10 flex flex-col">
				<div className="flex flex-col">
					{/* Hero Section */}
					<div className="flex items-center justify-center p-8">
						<div className="max-w-3xl mx-auto">
							<HeroHeading />
						</div>
					</div>

					{/* Popular Challenges Section */}
					<div>
						<div className="max-w-full mx-auto mt-0 md:mt-8 -mb-36">
							<div className="relative">
								<InfiniteCarousel pauseOnHover reverseDirection>
									{allChallenges.map((challenge: Challenge, index: number) => (
										<FadeIn
											key={index}
											className="flex-shrink-0 items-center justify-center"
										>
											<ChallengeCard
												key={challenge.slug}
												challenge={challenge}
												isHovered={hoveredChallenge === challenge.slug}
												onHover={setHoveredChallenge}
											/>
										</FadeIn>
									))}
								</InfiniteCarousel>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
