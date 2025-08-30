import React, { Children, ReactNode, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface InfiniteCarouselProps {
	className?: string
	children: ReactNode
	reverseDirection?: boolean
	pauseOnHover?: boolean
	gap?: number
}

export const InfiniteCarousel = ({
	className,
	children,
	reverseDirection = false,
	pauseOnHover = false,
	gap = 24,
}: InfiniteCarouselProps) => {
	const containerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const container = containerRef.current
		if (!container) return

		// Set up CSS animation
		const animation = container.animate(
			[
				{ transform: 'translateX(0)' },
				{ transform: `translateX(-${container.scrollWidth / 2}px)` },
			],
			{
				duration: 160000,
				iterations: Infinity,
				direction: reverseDirection ? 'reverse' : 'normal',
				easing: 'linear',
			}
		)

		// Handle pause on hover
		const handleMouseEnter = () => {
			if (pauseOnHover) {
				animation.pause()
			}
		}

		const handleMouseLeave = () => {
			if (pauseOnHover) {
				animation.play()
			}
		}

		if (pauseOnHover) {
			container.addEventListener('mouseenter', handleMouseEnter)
			container.addEventListener('mouseleave', handleMouseLeave)
		}

		return () => {
			if (pauseOnHover) {
				container.removeEventListener('mouseenter', handleMouseEnter)
				container.removeEventListener('mouseleave', handleMouseLeave)
			}
			animation.cancel()
		}
	}, [reverseDirection, pauseOnHover])

	// Create two sets of children for seamless looping
	const childrenArray = Children.toArray(children)
	const duplicatedChildren = [...childrenArray, ...childrenArray]

	return (
		<div className="w-full overflow-hidden">
			<div
				ref={containerRef}
				className={cn(
					"flex items-center gap-x-" + gap/4, // Convert gap to tailwind spacing
					className
				)}
				style={{
					gap: `${gap}px`,
					width: 'fit-content',
					minWidth: '200%',
				}}
			>
				{duplicatedChildren.map((child, index) => (
					<div
						key={index}
						className="flex-shrink-0"
					>
						{child}
					</div>
				))}
			</div>
		</div>
	)
}
