'use client'

import {motion} from 'framer-motion'
import Link from 'next/link'
import {Zap} from 'lucide-react'
import {Button} from "@/components/ui/button"
import FadeIn from "@/components/FadeIn";

export default function CallToAction() {
	return (
		<FadeIn>
			<section className="bg-secondary py-20 md:py-32 relative overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-br from-[#2fbc77]/20 to-transparent"></div>
				<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
					<div className="grid place-items-center items-center">
						<div className="text-center">
							<h2 className="text-4xl font-extrabold text-primary sm:text-5xl mb-6 leading-tight">
								Ready to Become a{' '}
								<span className="text-[--brand]">Better Engineer?</span>
							</h2>
							<p className="text-xl text-primary mb-8">
								Start your journey today with our practical coding challenges and take your skills to
								the next level.
							</p>
							<motion.div
								whileHover={{scale: 1.05}}
								whileTap={{scale: 0.95}}
							>
								<Button asChild size="lg" className="bg-[--brand] text-white hover:bg-[--brand]/90 p-4">
									<Link href="/challenges" className="inline-flex items-center">
										Explore our Challenges
										<Zap className="ml-2 h-8 w-8"/>
									</Link>
								</Button>
							</motion.div>
						</div>
					</div>
				</div>
			</section>
		</FadeIn>
	)
}

