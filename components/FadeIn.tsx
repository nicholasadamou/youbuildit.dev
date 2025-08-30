import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface FadeInProps extends Omit<React.HTMLProps<HTMLDivElement>, 'children'> {
	children: React.ReactNode;
	delay?: number;
	duration?: number;
	direction?: 'up' | 'down' | 'left' | 'right' | 'none';
	distance?: number;
	once?: boolean;
	threshold?: number;
	scale?: boolean;
	blur?: boolean;
}

const FadeIn: React.FC<FadeInProps> = ({ 
	children, 
	delay = 0,
	duration = 0.6,
	direction = 'up',
	distance = 30,
	once = true,
	threshold = 0.1,
	scale = false,
	blur = false,
	...rest 
}) => {
	const ref = useRef(null)
	const isInView = useInView(ref, { 
		once, 
		margin: `-${Math.round(threshold * 100)}%`,
		amount: threshold
	})

	// Direction mappings
	const directionMap = {
		up: { y: distance },
		down: { y: -distance },
		left: { x: distance },
		right: { x: -distance },
		none: {}
	}

	const initialState = {
		opacity: 0,
		...directionMap[direction],
		...(scale && { scale: 0.95 }),
		...(blur && { filter: 'blur(4px)' })
	}

	const animateState = {
		opacity: 1,
		x: 0,
		y: 0,
		...(scale && { scale: 1 }),
		...(blur && { filter: 'blur(0px)' })
	}

	const transition = {
		type: "spring",
		damping: 25,
		stiffness: 120,
		delay,
		duration
	}

	return (
		<motion.div
			ref={ref}
			initial={initialState}
			animate={isInView ? animateState : initialState}
			transition={transition}
			{...rest}
		>
			{children}
		</motion.div>
	);
};

export default FadeIn;
