'use client'

import {useEffect, useState} from "react";
import Link from 'next/link'
import {GitCommit, Github} from 'lucide-react'

import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip"
import Logo from "@/components/Logo";
import FadeIn from "@/components/FadeIn";

interface FooterProps {
	bgColor?: string
}

export default function Footer({bgColor = 'white'}: FooterProps) {
	const [commitHash, setCommitHash] = useState<string | null>(null)

	useEffect(() => {
		const fetchCommitHash = async () => {
			try {
				const response = await fetch('/api/commit')
				if (response.ok) {
					const data = await response.json()
					setCommitHash(data.commitHash)
				} else {
					console.error('Failed to fetch commit hash')
				}
			} catch (error) {
				console.error('Error fetching commit hash:', error)
			}
		}

		fetchCommitHash()
	}, [])

	return (<FadeIn>
		<footer className={`bg-[${bgColor}] text-background`}>
			<div className="container mx-auto px-6 py-6">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					<div className="md:col-span-2">
						<Link href="/" aria-label="Go to homepage" className="flex items-center">
							<Logo/>
							<span className="ml-3 text-xl font-semibold text-primary">You Build It</span>
						</Link>
						<p className="mt-4 text-sm text-muted-foreground">
							Helping you become a better software engineer through coding challenges that build real
							applications.
						</p>
						<nav className="mt-4 flex gap-4 items-center">
							{commitHash && (<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<>
											<Link
												className="text-sm transition-colors duration-200 text-secondary flex items-center gap-1 bg-[#fafafa] py-1 px-2 rounded-full"
												href={`https://github.com/nicholasadamou/youbuildit.dev/commit/${commitHash}`}
												target="_blank"
												rel="noopener noreferrer"
											>
												<GitCommit className="text-muted-foreground w-4 h-4"/>
												<span className="font-mono text-muted-foreground">{commitHash.slice(0, 7)}</span>
											</Link>
										</>
									</TooltipTrigger>
									<TooltipContent>
										<p>View latest commit</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>)}
							<div>
								<Link
									className="text-sm hover:text-primary transition-colors duration-200 text-muted-foreground flex items-center gap-1"
									href="https://github.com/nicholasadamou/youbuildit.dev"
									target="_blank"
									rel="noopener noreferrer"
								>
									<Github className="w-4 h-4"/>
								</Link>
							</div>
						</nav>
						<p className="mt-4 text-sm text-muted-foreground">
							© {new Date().getFullYear()} You Build It. All rights reserved.
						</p>
					</div>
					<div>
						<h3 className="text-md font-semibold mb-4 text-primary">Quick Links</h3>
						<ul className="space-y-2">
							<li>
								<Link href="/challenges"
									  className="text-muted-foreground transition-colors">
									Challenges
								</Link>
							</li>
						</ul>
					</div>
					<div>
						<h3 className="text-md font-semibold mb-4 text-primary">Connect</h3>
						<ul className="space-y-2">
							<li>
								<a href="https://github.com/youbuildit" target="_blank" rel="noopener noreferrer"
								   className="text-muted-foreground transition-colors">
									GitHub
								</a>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</footer>
	</FadeIn>)
}

