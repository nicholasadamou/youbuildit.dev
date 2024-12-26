import React from 'react';
import { motion } from 'framer-motion';

interface FadeInProps extends React.HTMLProps<HTMLDivElement> {
	children: React.ReactNode; // Prop for the content to fade in
}

const FadeIn: React.FC<FadeInProps> = ({ children, ...rest }) => {
	return (
		<>
			{/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
			{/*@ts-expect-error*/}
			<motion.div
				initial={{opacity: 0}} // Initial state
				animate={{opacity: 1}} // Animate to this state
				transition={{duration: 0.5}} // Duration of the fade-in
				{...rest} // Spread the rest of the props onto the motion.div
			>
				{children} {/* Render the children inside the motion div */}
			</motion.div>
		</>
	);
};

export default FadeIn;
