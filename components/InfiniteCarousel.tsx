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
	const childrenArray = Children.toArray(children)
	const combinedChildren = [
		...childrenArray,
		...childrenArray.map((child, index) => {
			if (React.isValidElement(child)) {
				return React.cloneElement(child, {
					...child.props,
					key: `${child.key || index}-duplicate`
				})
			}
			return child
		}),
	]

	return (
		<>
			{/* Global CSS to hide scrollbars for this specific carousel */}
			<style dangerouslySetInnerHTML={{
				__html: `
					.carousel-container {
						scrollbar-width: none; /* Firefox */
						-ms-overflow-style: none; /* IE and Edge */
					}
					.carousel-container::-webkit-scrollbar {
						display: none; /* Chrome, Safari, Opera */
					}
				`
			}} />
			
			<div className="relative w-full" style={{ height: '320px' }}>
				<div className="absolute inset-0">
					<div
						ref={containerRef}
						className={cn("carousel-container w-full h-full overflow-x-auto overflow-y-visible", className)}
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
