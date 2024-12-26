import React, { Children, ReactNode, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface InfiniteCarouselProps {
	className?: string
	children: ReactNode
	reverseDirection?: boolean
	pauseOnHover?: boolean
	gap?: number // Gap in pixels
}

export const InfiniteCarousel = ({
									 className,
									 children,
									 reverseDirection = false,
									 pauseOnHover = false,
									 gap = 16,
								 }: InfiniteCarouselProps) => {
	const containerRef = useRef<HTMLDivElement>(null)
	const contentRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const container = containerRef.current
		const content = contentRef.current

		if (!container || !content) return

		const animate = () => {
			if (reverseDirection) {
				if (container.scrollLeft <= 0) {
					container.scrollLeft = content.scrollWidth / 2
				}
				container.scrollLeft -= 1
			} else {
				if (container.scrollLeft >= content.scrollWidth / 2) {
					container.scrollLeft = 0
				}
				container.scrollLeft += 1
			}
		}

		let animationId: number
		let lastTime = performance.now()
		const step = (currentTime: number) => {
			const deltaTime = currentTime - lastTime
			if (deltaTime >= 1000 / 60) {
				animate()
				lastTime = currentTime
			}
			animationId = requestAnimationFrame(step)
		}

		animationId = requestAnimationFrame(step)

		const handleMouseEnter = () => {
			if (pauseOnHover) {
				cancelAnimationFrame(animationId)
			}
		}

		const handleMouseLeave = () => {
			if (pauseOnHover) {
				animationId = requestAnimationFrame(step)
			}
		}

		container.addEventListener('mouseenter', handleMouseEnter)
		container.addEventListener('mouseleave', handleMouseLeave)

		return () => {
			cancelAnimationFrame(animationId)
			container.removeEventListener('mouseenter', handleMouseEnter)
			container.removeEventListener('mouseleave', handleMouseLeave)
		}
	}, [reverseDirection, pauseOnHover])

	// Duplicate the children for infinite scrolling
	const combinedChildren = [
		...Children.toArray(children),
		...Children.toArray(children),
	]

	return (
		<div
			ref={containerRef}
			className={cn("w-full overflow-x-hidden", className)}
			style={{
				"--gap": `${gap}px`,
			} as React.CSSProperties}
		>
			<div
				ref={contentRef}
				className="flex items-center"
				style={{gap: 'var(--gap)'}}
			>
				{combinedChildren}
			</div>
		</div>
	)
}
