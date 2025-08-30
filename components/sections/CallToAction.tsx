'use client'

import {motion} from 'framer-motion'
import Link from 'next/link'
import {Zap} from 'lucide-react'
import {Button} from "@/components/ui/button"

export default function CallToAction() {
	// Animation variants
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2,
				delayChildren: 0.1,
				duration: 0.6
			}
		}
	}

	const itemVariants = {
		hidden: { opacity: 0, y: 30 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6
			}
		}
	}

	const titleVariants = {
		hidden: { opacity: 0, y: 40, scale: 0.9 },
		visible: {
			opacity: 1,
			y: 0,
			scale: 1,
			transition: {
				duration: 0.8
			}
		}
	}

	const highlightVariants = {
		hidden: { opacity: 0, scale: 0.8 },
		visible: {
			opacity: 1,
			scale: 1,
			transition: {
				duration: 0.6,
				delay: 0.3
			}
		}
	}

	const buttonVariants = {
		hidden: { opacity: 0, y: 20, scale: 0.9 },
		visible: {
			opacity: 1,
			y: 0,
			scale: 1,
			transition: {
				duration: 0.5
			}
		},
		hover: {
			scale: 1.05,
			y: -2,
			transition: {
				duration: 0.3
			}
		},
		tap: {
			scale: 0.95,
			y: 0
		}
	}

	const backgroundVariants = {
		hidden: { opacity: 0, scale: 1.2 },
		visible: {
			opacity: 1,
			scale: 1,
			transition: {
				duration: 1.2
			}
		}
	}

	const zapVariants = {
		hidden: { scale: 0, rotate: -180 },
		visible: {
			scale: 1,
			rotate: 0,
			transition: {
				duration: 0.6,
				delay: 0.2
			}
		},
		hover: {
			rotate: [0, -10, 10, -10, 0],
			scale: 1.1,
			transition: {
				duration: 0.6
			}
		}
	}

	return (
		<motion.section 
			className="bg-secondary py-20 md:py-32 relative overflow-hidden"
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, amount: 0.3 }}
			variants={containerVariants}
		>
			{/* Animated Background Gradient */}
			<motion.div 
				className="absolute inset-0 bg-gradient-to-br from-[#2fbc77]/20 to-transparent"
				variants={backgroundVariants}
			/>
			
			{/* Floating Background Elements */}
			<motion.div
				className="absolute top-10 left-10 w-20 h-20 bg-[--brand]/10 rounded-full blur-xl"
				animate={{
					y: [-10, 10, -10],
					x: [-5, 5, -5],
					scale: [1, 1.1, 1]
				}}
				transition={{
					duration: 6,
					repeat: Infinity,
					ease: "easeInOut"
				}}
			/>
			<motion.div
				className="absolute bottom-16 right-16 w-32 h-32 bg-[--brand]/5 rounded-full blur-2xl"
				animate={{
					y: [10, -10, 10],
					x: [5, -5, 5],
					scale: [1.1, 1, 1.1]
				}}
				transition={{
					duration: 8,
					repeat: Infinity,
					ease: "easeInOut",
					delay: 1
				}}
			/>

			<motion.div 
				className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
				variants={itemVariants}
			>
				<div className="grid place-items-center items-center">
					<div className="text-center">
						<motion.h2 
							className="text-4xl font-extrabold text-primary sm:text-5xl mb-6 leading-tight"
							variants={titleVariants}
						>
							Ready to Become a{' '}
							<motion.span 
								className="text-[--brand] inline-block"
								variants={highlightVariants}
								whileHover={{ 
									scale: 1.05,
									textShadow: "0 0 8px rgba(47, 188, 119, 0.6)",
									transition: { duration: 0.3 }
								}}
							>
								Better Engineer?
							</motion.span>
						</motion.h2>
						
						<motion.p 
							className="text-xl text-primary mb-8"
							variants={itemVariants}
						>
							Start your journey today with our practical coding challenges and take your skills to
							the next level.
						</motion.p>
						
						<motion.div
							variants={buttonVariants}
							whileHover="hover"
							whileTap="tap"
						>
							<Button asChild size="lg" className="bg-[--brand] text-white hover:bg-[--brand]/90 p-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
								<Link href="/challenges" className="inline-flex items-center">
									<motion.span
										initial={{ opacity: 0, x: -10 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: 0.6, duration: 0.4 }}
									>
										Explore our Challenges
									</motion.span>
									<motion.div
										variants={zapVariants}
										whileHover="hover"
										className="ml-2"
									>
										<Zap className="h-8 w-8"/>
									</motion.div>
								</Link>
							</Button>
						</motion.div>
					</div>
				</div>
			</motion.div>
		</motion.section>
	)
}

