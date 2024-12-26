'use client'

import { Clock, Laptop, Code } from 'lucide-react'
import React from "react";
import FeatureCard from "@/components/FeatureCard";
import { motion } from 'framer-motion';

const features = [
	{
		title: 'Easy to Get Started',
		description:
			'Coding challenges designed to create an application in less than 8 hours, perfect for busy schedules.',
		icon: Clock,
	},
	{
		title: 'Real-World Applications',
		description:
			'Focus on creating practical software that addresses real-world challenges, rather than developing toy applications.',
		icon: Laptop,
	},
	{
		title: 'Language Agnostic',
		description:
			'Choose your preferred programming language or tackle challenges in multiple languages to broaden your skills.',
		icon: Code,
	},
]

export default function Features() {
	return (
		<section className="bg-white mt-24 py-16 sm:py-24">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<motion.div
					className="text-center mb-12"
					initial={{opacity: 0, y: 20}}
					animate={{opacity: 1, y: 0}}
					transition={{duration: 0.5}}
				>
						<h2 className="text-3xl font-extrabold text-primary sm:text-4xl">
							Why Choose Our Challenges?
						</h2>
						<p className="mt-4 text-xl text-muted-foreground">
							Designed to help you grow as a software engineer through practical, real-world projects.
						</p>
				</motion.div>
					<div className="mt-16 grid gap-8 md:grid-cols-3">
						{features.map((feature, index) => (
							<FeatureCard
								key={feature.title}
								title={feature.title}
								description={feature.description}
								Icon={feature.icon}
								delay={0.1 + index * 0.1}
							/>
						))}
					</div>
			</div>
		</section>
)
}
