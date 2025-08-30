import type {ClientChallenge} from "@/types/challenge";
import {ArrowRight, Clock, Code} from "lucide-react";
import Link from "next/link";
import {motion} from "framer-motion";

const difficultyGradients = {
	Beginner: 'bg-gradient-to-r from-green-400 to-green-600',
	Intermediate: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
	Advanced: 'bg-gradient-to-r from-red-400 to-red-600',
};

const isDifficulty = (difficulty: string): difficulty is keyof typeof difficultyGradients => {
	return difficulty in difficultyGradients;
};

const ChallengeCard = ({
						   challenge, isHovered, onHover,
					   }: {
	challenge: ClientChallenge; isHovered: boolean; onHover: (title: string | null) => void;
}) => (<div
		key={challenge.title}
		className="flex-shrink-0 w-96 bg-[#fafafa] rounded-lg overflow-hidden border border-[#e4e4e7] flex flex-col"
		onMouseEnter={() => onHover(challenge.title)}
		onMouseLeave={() => onHover(null)}
	>
		<div className="p-4 flex flex-col h-full min-h-[250px]">
			<div className="flex justify-between items-start mb-2">
				<h3 className="text-lg font-semibold text-primary">{challenge.title}</h3>
				<span
					className={`text-xs font-medium px-2 py-1 rounded-full ${isDifficulty(challenge.difficulty) ? difficultyGradients[challenge.difficulty] : '' // Fallback if invalid
					} text-white`}
				>
          {challenge.difficulty}
        </span>
			</div>
			<p className="text-xs text-muted-foreground mb-2">{challenge.summary}</p>
			<div className="flex flex-wrap gap-1 mb-2">
				{challenge.skills.slice(0, 2).map((skill, index) => (<span
						key={index}
						className="text-xs bg-gray-200 text-muted-foreground px-2 py-1 rounded-full"
					>
            {skill}
          </span>))}
			</div>
			<div className="flex justify-between text-xs text-muted-foreground mb-4">
        <span className="flex items-center">
          <Clock className="mr-1 h-3 w-3"/>
			{challenge.estimatedTime}
        </span>
			</div>
			<div className="mt-auto">
				<Link
					href={`/challenge/${challenge.slug}`}
					className="inline-flex items-center justify-center w-full px-3 py-1 bg-[--brand] hover:bg-[#175535] text-white text-sm font-medium rounded-md transition duration-150 ease-in-out"
				>
					Start Challenge
					<ArrowRight className="ml-1 h-3 w-3"/>
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
	</div>);

export default ChallengeCard;
