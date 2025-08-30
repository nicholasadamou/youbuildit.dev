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

		// Reduced animation speed on mobile for better performance
		const isMobile = window.innerWidth < 768
		const speed = isMobile ? 0.5 : 1

		const animate = () => {
			if (reverseDirection) {
				if (container.scrollLeft <= 0) {
					container.scrollLeft = content.scrollWidth / 2
				}
				container.scrollLeft -= speed
			} else {
				if (container.scrollLeft >= content.scrollWidth / 2) {
					container.scrollLeft = 0
				}
				container.scrollLeft += speed
			}
		}

		let animationId: number
		let lastTime = performance.now()
		const step = (currentTime: number) => {
			const deltaTime = currentTime - lastTime
			if (deltaTime >= 1000 / (isMobile ? 30 : 60)) { // Reduced FPS on mobile
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

		// Add touch support for mobile
		const handleTouchStart = () => {
			if (pauseOnHover) {
				cancelAnimationFrame(animationId)
			}
		}

		const handleTouchEnd = () => {
			if (pauseOnHover) {
				animationId = requestAnimationFrame(step)
			}
		}

		container.addEventListener('mouseenter', handleMouseEnter)
		container.addEventListener('mouseleave', handleMouseLeave)
		container.addEventListener('touchstart', handleTouchStart)
		container.addEventListener('touchend', handleTouchEnd)

		return () => {
			cancelAnimationFrame(animationId)
			container.removeEventListener('mouseenter', handleMouseEnter)
			container.removeEventListener('mouseleave', handleMouseLeave)
			container.removeEventListener('touchstart', handleTouchStart)
			container.removeEventListener('touchend', handleTouchEnd)
		}
	}, [reverseDirection, pauseOnHover])

	// Duplicate the children for infinite scrolling
	const childrenArray = Children.toArray(children)
	const combinedChildren = [
		...childrenArray,
		...childrenArray.map((child, index) => {
			if (React.isValidElement(child)) {
				return React.cloneElement(child, {
					...(child.props as Record<string, unknown>),
					key: `${child.key || index}-duplicate`
				})
			}
			return child
		}),
	]

	return (
		<>
			{/* Global CSS to hide scrollbars and prevent manual scrolling */}
			<style dangerouslySetInnerHTML={{
				__html: `
					.carousel-container {
						scrollbar-width: none; /* Firefox */
						-ms-overflow-style: none; /* IE and Edge */
						pointer-events: none; /* Prevent manual scrolling */
						touch-action: pan-y; /* Allow vertical scrolling but prevent horizontal */
					}
					.carousel-container::-webkit-scrollbar {
						display: none; /* Chrome, Safari, Opera */
					}
					.carousel-item {
						pointer-events: auto; /* Re-enable pointer events for individual items */
						touch-action: auto; /* Allow normal touch interactions on items */
					}
				`
			}} />
			
			<div className="relative w-full" style={{ height: 'clamp(280px, 80vw, 320px)' }}>
				<div className="absolute inset-0">
					<div
						ref={containerRef}
						className={cn("carousel-container w-full h-full overflow-x-hidden overflow-y-visible", className)}
						style={{
							"--gap": `${gap}px`,
						} as React.CSSProperties}
					>
						<div
							ref={contentRef}
							className="flex items-center h-full"
							style={{
								gap: 'var(--gap)'
							}}
						>
							{combinedChildren}
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
