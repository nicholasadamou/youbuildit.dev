'use client'

import Link from "next/link";
import MDXContent from "@/components/mdx/MDXContent";
import Footer from "@/components/sections/Footer";
import { Clock, Code, Tag, Github, MessageCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { type Challenge } from "@/lib/mdx";

const difficultyColors = {
  Beginner: 'bg-green-100 text-green-800 border-green-200',
  Intermediate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Advanced: 'bg-red-100 text-red-800 border-red-200',
};

const isDifficulty = (difficulty: string): difficulty is keyof typeof difficultyColors => {
  return difficulty in difficultyColors;
};

interface ChallengePageContentProps {
  challenge: Challenge;
  relatedChallenges: Challenge[];
}

export default function ChallengePageContent({ challenge, relatedChallenges }: ChallengePageContentProps) {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Challenge Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <motion.h1 
              className="text-4xl font-bold text-gray-900"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {challenge.title}
            </motion.h1>
            <motion.span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                isDifficulty(challenge.difficulty) 
                  ? difficultyColors[challenge.difficulty] 
                  : 'bg-gray-100 text-gray-800 border-gray-200'
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {challenge.difficulty}
            </motion.span>
          </div>
          
          <motion.p 
            className="text-xl text-gray-600 mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {challenge.summary}
          </motion.p>

          {/* Challenge Metadata */}
          <motion.div 
            className="flex flex-wrap items-center gap-6 p-4 bg-gray-50 rounded-lg border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <Clock className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-700">
                <strong>Estimated Time:</strong> {challenge.estimatedTime}
              </span>
            </motion.div>
            
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <Code className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-700">
                <strong>Category:</strong> {challenge.category}
              </span>
            </motion.div>
          </motion.div>

          {/* Skills */}
          <motion.div 
            className="mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <motion.div 
              className="flex items-center gap-2 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <Tag className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Skills you&apos;ll learn:</span>
            </motion.div>
            <div className="flex flex-wrap gap-2">
              {challenge.skills.map((skill: string, index: number) => (
                <motion.span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.7 + (index * 0.1) }}
                  whileHover={{ scale: 1.05 }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Challenge Content */}
        <motion.div 
          className="prose prose-lg max-w-none"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <MDXContent content={challenge.content} />
        </motion.div>

        {/* Footer Call-to-Action */}
        <motion.div 
          className="mt-12 p-6 bg-gradient-to-r from-[--brand] to-green-600 rounded-lg text-white"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          whileHover={{ scale: 1.02 }}
        >
          <motion.h3 
            className="text-xl font-semibold mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 1.2 }}
          >
            Ready to start building?
          </motion.h3>
          <motion.p 
            className="text-green-100 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 1.3 }}
          >
            This challenge will help you understand {challenge.category.toLowerCase()} concepts 
            and improve your skills in {challenge.skills.slice(0, 3).join(", ")}.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.4 }}
          >
            <motion.a 
              href="https://github.com/youbuildit/challenges" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-white text-[--brand] font-medium rounded-md hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Github className="w-4 h-4" />
              View on GitHub
            </motion.a>
            <motion.a 
              href={`https://github.com/youbuildit/challenges/issues/new?template=challenge-feedback.md&title=Feedback: ${encodeURIComponent(challenge.title)}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-2 border border-green-200 text-white font-medium rounded-md hover:bg-green-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageCircle className="w-4 h-4" />
              Share Feedback
            </motion.a>
          </motion.div>
          <motion.div 
            className="mt-4 pt-4 border-t border-green-400/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 1.5 }}
          >
            <p className="text-sm text-green-100">
              💡 <strong>Tip:</strong> Fork the challenges repository to track your progress and share your solutions with the community!
            </p>
          </motion.div>
        </motion.div>

        {/* Related Challenges Section */}
        {relatedChallenges.length > 0 && (
          <motion.div 
            className="mt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.6 }}
          >
            <motion.div 
              className="flex items-center gap-2 mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.7 }}
            >
              <ArrowRight className="h-5 w-5 text-gray-600" />
              <h2 className="text-2xl font-bold text-gray-900">Related Challenges</h2>
            </motion.div>
            <motion.p 
              className="text-gray-600 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 1.8 }}
            >
              Ready for more? Try these challenges that share similar skills and concepts.
            </motion.p>
            <div className="grid md:grid-cols-2 gap-6">
            {relatedChallenges.map((relatedChallenge: Challenge, index: number) => (
                <motion.div
                  key={relatedChallenge.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.9 + (index * 0.1) }}
                  whileHover={{ y: -5 }}
                >
                  <Link 
                    href={`/challenge/${relatedChallenge.slug}`}
                    className="group block p-6 bg-white border border-gray-200 rounded-lg hover:border-[--brand] hover:shadow-lg transition-all duration-200 h-full"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[--brand] transition-colors">
                        {relatedChallenge.title}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                          isDifficulty(relatedChallenge.difficulty) 
                            ? difficultyColors[relatedChallenge.difficulty] 
                            : 'bg-gray-100 text-gray-800 border-gray-200'
                        }`}
                      >
                        {relatedChallenge.difficulty}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {relatedChallenge.summary}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          {relatedChallenge.estimatedTime}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Code className="h-4 w-4" />
                          {relatedChallenge.category}
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-[--brand] group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div className="mt-3">
                      <div className="flex flex-wrap gap-1">
                        {relatedChallenge.skills.slice(0, 3).map((skill: string, skillIndex: number) => (
                          <span
                            key={skillIndex}
                            className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                          >
                            {skill}
                          </span>
                        ))}
                        {relatedChallenge.skills.length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-50 text-gray-500">
                            +{relatedChallenge.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
      <Footer bgColor="bg-gray-50" />
    </div>
  );
}
