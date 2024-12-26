'use client'

import Link from 'next/link'
import { Menu, Zap, Github } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Logo from "@/components/Logo"
import { motion, useScroll, useTransform } from 'framer-motion'

export default function Navbar() {
	const [isScrolled, setIsScrolled] = useState(false)
	const { scrollY } = useScroll()

	const backgroundColor = useTransform(
		scrollY,
		[0, 50],
		['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.8)']
	)

	const boxShadow = useTransform(
		scrollY,
		[0, 50],
		['none', '0 1px 2px 0 rgba(0, 0, 0, 0.05)']
	)

	useEffect(() => {
		const unsubscribe = scrollY.onChange(latest => {
			setIsScrolled(latest > 0)
		})

		return () => unsubscribe()
	}, [scrollY])

	return (
		<motion.nav
			style={{ backgroundColor, boxShadow }}
			className="sticky top-0 z-50 transition-all duration-300 backdrop-blur-md"
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
					>
						<Link href="/" className="flex items-center space-x-3" aria-label="Go to homepage">
							<Logo />
							<span className="text-xl font-bold text-primary">You Build It</span>
						</Link>
					</motion.div>
					<div className="hidden md:flex items-center space-x-4">
						<motion.div
							initial={{opacity: 0, y: -20}}
							animate={{opacity: 1, y: 0}}
							transition={{duration: 0.5}}
						>
							<Button asChild variant="default" className="bg-[--brand] hover:bg-[#175535] text-white">
								<Link href="/challenges" className="inline-flex items-center space-x-2">
									<span>Explore Challenges</span>
									<Zap className="h-4 w-4"/>
								</Link>
							</Button>
						</motion.div>
					</div>
					<div className="md:hidden">
						<Sheet>
							<SheetTrigger asChild>
								<motion.div
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
								>
									<Button variant="secondary" size="icon" aria-label="Open main menu">
										<Menu className="h-6 w-6" />
									</Button>
								</motion.div>
							</SheetTrigger>
							<SheetContent side="right" className="w-72 flex flex-col">
								<nav className="mt-6 flex flex-col space-y-4 flex-grow">
									<Link href="/" className="flex items-center space-x-3 mb-6">
										<Logo />
										<span className="text-xl font-bold text-primary">You Build It</span>
									</Link>
									<motion.div
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
									>
										<Link href="/challenges" className="inline-flex items-center space-x-2 text-[--brand] hover:text-[#37d388]">
											<span>Explore Challenges</span>
											<Zap className="h-4 w-4" />
										</Link>
									</motion.div>
								</nav>
								<div className="mt-auto pb-6">
									<h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
										Connect with us
									</h3>
									<div className="flex space-x-4">
										<motion.a
											whileHover={{ scale: 1.2 }}
											whileTap={{ scale: 0.9 }}
											href="https://github.com/youbuildit"
											target="_blank"
											rel="noopener noreferrer"
											className="text-gray-400 hover:text-gray-500"
											aria-label="You Build It on GitHub"
										>
											<Github className="h-4 w-4" />
										</motion.a>
									</div>
								</div>
							</SheetContent>
						</Sheet>
					</div>
				</div>
			</div>
		</motion.nav>
	)
}
