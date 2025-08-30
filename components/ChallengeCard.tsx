import type {ClientChallenge} from "@/types/challenge";
import {ArrowRight, Clock, Code} from "lucide-react";
import Link from "next/link";
import {motion, type Variants} from "framer-motion";

const difficultyGradients = {
	Beginner: 'bg-gradient-to-r from-green-400 to-green-600',
	Intermediate: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
	Advanced: 'bg-gradient-to-r from-red-400 to-red-600',
};

const isDifficulty = (difficulty: string): difficulty is keyof typeof difficultyGradients => {
	return difficulty in difficultyGradients;
};

// Card animation variants - removed vertical movement and scaling
const cardVariants: Variants = {
	idle: {
		rotateY: 0,
		boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
		transition: {
			type: "spring" as const,
			damping: 20,
			stiffness: 300,
			duration: 0.3
		}
	},
	hover: {
		rotateY: 1,
		boxShadow: "0 8px 15px -3px rgba(0, 0, 0, 0.12), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
		transition: {
			type: "spring" as const,
			damping: 20,
			stiffness: 300,
			duration: 0.3
		}
	}
}


const ChallengeCard = ({
						   challenge, isHovered, onHover,
					   }: {
	challenge: ClientChallenge; isHovered: boolean; onHover: (title: string | null) => void;
}) => (
	<motion.div
		key={challenge.title}
		variants={cardVariants}
		initial="idle"
		animate={isHovered ? "hover" : "idle"}
		whileHover="hover"
	className="flex-shrink-0 w-80 sm:w-96 bg-[#fafafa] rounded-lg overflow-hidden border border-[#e4e4e7] flex flex-col cursor-pointer"
		onMouseEnter={() => onHover(challenge.slug)}
		onMouseLeave={() => onHover(null)}
		style={{ transformStyle: "preserve-3d" }}
	>
		<div className="p-3 sm:p-4 flex flex-col h-full min-h-[230px] sm:min-h-[250px]">
			<div className="flex justify-between items-start mb-2">
				<motion.h3 
					className="text-base sm:text-lg font-semibold text-primary leading-tight"
					initial={{ opacity: 0.8 }}
					whileHover={{ opacity: 1 }}
					transition={{ duration: 0.2 }}
				>
					{challenge.title}
				</motion.h3>
				<motion.span
					className={`text-xs font-medium px-2 py-1 rounded-full ${isDifficulty(challenge.difficulty) ? difficultyGradients[challenge.difficulty] : '' // Fallback if invalid
					} text-white`}
					whileHover={{ 
						scale: 1.05
					}}
					transition={{ type: "spring", damping: 15, stiffness: 300 }}
				>
          {challenge.difficulty}
        </motion.span>
			</div>
			<motion.p 
				className="text-xs sm:text-sm text-muted-foreground mb-2 line-clamp-2"
				initial={{ opacity: 0.7 }}
				whileHover={{ opacity: 1 }}
				transition={{ duration: 0.3 }}
			>
				{challenge.summary}
			</motion.p>
			<div className="flex flex-wrap gap-1 mb-2 sm:mb-3">
				{challenge.skills.slice(0, 2).map((skill, index) => (
					<motion.span
						key={index}
						className="text-xs bg-gray-200 text-muted-foreground px-2 py-1 rounded-full"
						whileHover={{ 
							scale: 1.05,
							backgroundColor: "#e5e5e5"
						}}
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ 
							delay: index * 0.1,
							type: "spring",
							damping: 15,
							stiffness: 300
						}}
					>
            {skill}
          </motion.span>
				))}
			</div>
			<div className="flex justify-between text-xs text-muted-foreground mb-3 sm:mb-4">
        <span className="flex items-center">
          <Clock className="mr-1 h-3 w-3"/>
			{challenge.estimatedTime}
        </span>
			</div>
			<div className="mt-auto">
				<Link href={`/challenge/${challenge.slug}`}>
					<motion.div
						className="inline-flex items-center justify-center w-full px-3 py-2 sm:py-1 bg-[--brand] text-white text-sm font-medium rounded-md cursor-pointer overflow-hidden relative"
						whileHover={{ 
							scale: 1.05,
							backgroundColor: "#175535"
						}}
						whileTap={{ scale: 0.95 }}
						transition={{ type: "spring", damping: 15, stiffness: 300 }}
					>
						<motion.span
							initial={{ x: 0 }}
							whileHover={{ x: -2 }}
							transition={{ duration: 0.2 }}
						>
							Start Challenge
						</motion.span>
						<motion.div
							initial={{ x: 4, scale: 1 }}
							whileHover={{ x: 6, scale: 1.1 }}
							transition={{ duration: 0.2 }}
							className="ml-1"
						>
							<ArrowRight className="h-3 w-3"/>
						</motion.div>
					</motion.div>
				</Link>
			</div>
		</div>
		<div className="bg-[#2c2c2c] p-2 border-t border-gray-700">
			<div className="flex justify-between items-center">
				<span className="text-xs text-gray-50">{challenge.category}</span>
				<motion.div
					initial={{scale: 1}}
					animate={{scale: isHovered ? 1.1 : 1}}
					transition={{duration: 0.2}}
				>
					<Code className="h-4 w-4 text-[--brand]"/>
				</motion.div>
			</div>
		</div>
	</motion.div>);

export default ChallengeCard;
