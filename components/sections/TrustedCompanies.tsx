'use client'

import Image from 'next/image'
import Link from "next/link";
import {InfiniteCarousel} from "@/components/InfiniteCarousel";
import { motion } from 'framer-motion';
import React from "react";
import FadeIn from "@/components/FadeIn";

const companies = ['1password', 'airbnb', 'amazon', 'facebook', 'google', 'instagram', 'linkedin', 'meta', 'microsoft', 'netflix', 'twitch', 'youtube']

export default function TrustedCompanies() {
	return (
		<section className="bg-[#fafafa] py-16 sm:py-24">
			<motion.div
				className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
				initial={{opacity: 0, y: 20}}
				animate={{opacity: 1, y: 0}}
				transition={{duration: 0.5}}
			>
				<h2 className="text-3xl font-extrabold text-primary sm:text-4xl">Trusted by Engineers from Top
					Companies</h2>
				<p className="mt-4 text-xl text-muted-foreground">
					Our platform is used by software engineers from leading tech companies worldwide.
				</p>
			</motion.div>
			<div className="relative overflow-hidden mt-12">
				<InfiniteCarousel pauseOnHover gap={64}>
					{companies.map((company, index) => (
						<FadeIn
							key={company}
							className="flex-shrink-0 items-center justify-center"
						>
							<Link
								href={`https://www.${company}.com`}
								target="_blank"
								rel="noopener noreferrer"
								className="flex-shrink-0"
							>
								<Image
									src={`/logos/${company}.svg`}
									alt={`${company} logo`}
									width={120}
									height={20}
									className="transition-all duration-300 ease-in-out filter grayscale-[0.85] hover:grayscale-0"
								/>
							</Link>
						</FadeIn>
					))}
				</InfiniteCarousel>
			</div>
		</section>
	)
}
