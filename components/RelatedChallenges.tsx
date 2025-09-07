'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { type Challenge } from '@/lib/mdx';
import DifficultyTag from '@/components/ui/DifficultyTag';
import { Clock, Code, ArrowRight } from 'lucide-react';

interface RelatedChallengesProps {
  challenges: Challenge[];
  title?: string;
  description?: string;
  animationDelay?: number;
}

export default function RelatedChallenges({
  challenges,
  title = 'Related Challenges',
  description = 'Ready for more? Try these challenges that share similar skills and concepts.',
  animationDelay = 1.6,
}: RelatedChallengesProps) {
  if (!challenges || challenges.length === 0) {
    return null;
  }

  return (
    <motion.div
      className="mt-12"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: animationDelay }}
    >
      <motion.div
        className="flex items-center gap-2 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: animationDelay + 0.1 }}
      >
        <ArrowRight className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      </motion.div>

      <motion.p
        className="text-muted-foreground mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: animationDelay + 0.2 }}
      >
        {description}
      </motion.p>

      <div className="grid md:grid-cols-2 gap-6">
        {challenges.map((challenge: Challenge, index: number) => (
          <motion.div
            key={challenge.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: animationDelay + 0.3 + index * 0.1,
            }}
            whileHover={{ y: -5 }}
          >
            <Link
              href={`/challenge/${challenge.slug}`}
              className="group block p-6 bg-card border border-border rounded-lg hover:border-[--brand] hover:shadow-lg transition-all duration-200 h-full"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-card-foreground group-hover:text-[--brand] transition-colors">
                  {challenge.title}
                </h3>
                <DifficultyTag
                  difficulty={challenge.difficulty}
                  size="sm"
                  animated={false}
                />
              </div>

              <p className="text-muted-foreground mb-4 line-clamp-2">
                {challenge.summary}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {challenge.estimatedTime}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Code className="h-4 w-4" />
                    {challenge.category}
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-[--brand] group-hover:translate-x-1 transition-transform" />
              </div>

              <div className="mt-3">
                <div className="flex flex-wrap gap-1">
                  {challenge.skills
                    .slice(0, 3)
                    .map((skill: string, skillIndex: number) => (
                      <span
                        key={skillIndex}
                        className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-secondary text-secondary-foreground border border-border"
                      >
                        {skill}
                      </span>
                    ))}
                  {challenge.skills.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-muted text-muted-foreground">
                      +{challenge.skills.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
