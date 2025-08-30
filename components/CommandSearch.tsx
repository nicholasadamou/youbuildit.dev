'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { ClientChallenge } from '@/types/challenge'
import { 
  Search, 
  Clock, 
  Code, 
  ArrowRight
} from 'lucide-react'

const difficultyColors = {
  Beginner: 'bg-green-100 text-green-800 border-green-200',
  Intermediate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Advanced: 'bg-red-100 text-red-800 border-red-200',
}

const isDifficulty = (difficulty: string): difficulty is keyof typeof difficultyColors => {
  return difficulty in difficultyColors
}

interface CommandSearchProps {
  isOpen: boolean
  onClose: () => void
}

export default function CommandSearch({ isOpen, onClose }: CommandSearchProps) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [allChallenges, setAllChallenges] = useState<ClientChallenge[]>([])
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  // Load challenges
  useEffect(() => {
    async function loadChallenges() {
      try {
        const response = await fetch('/api/challenges')
        if (!response.ok) {
          throw new Error('Failed to fetch challenges')
        }
        const challenges = await response.json()
        setAllChallenges(challenges)
      } catch (error) {
        console.error('Error loading challenges:', error)
      }
    }
    loadChallenges()
  }, [])

  // Filter challenges based on search query
  const filteredChallenges = allChallenges.filter((challenge: ClientChallenge) =>
    challenge.title.toLowerCase().includes(query.toLowerCase()) ||
    challenge.summary.toLowerCase().includes(query.toLowerCase()) ||
    challenge.skills.some(skill => skill.toLowerCase().includes(query.toLowerCase()))
  ).slice(0, 5) // Limit to 5 results for better UX

  // Handle challenge selection
  const handleSelectChallenge = useCallback((challenge: ClientChallenge) => {
    router.push(`/challenge/${challenge.slug}`)
    onClose()
  }, [router, onClose])

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIndex(0)
      // Focus the input after the modal animation
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => 
            prev < filteredChallenges.length - 1 ? prev + 1 : 0
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : filteredChallenges.length - 1
          )
          break
        case 'Enter':
          e.preventDefault()
          if (filteredChallenges[selectedIndex]) {
            handleSelectChallenge(filteredChallenges[selectedIndex])
          }
          break
        case 'Escape':
          e.preventDefault()
          onClose()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, filteredChallenges, selectedIndex, onClose, handleSelectChallenge])

  // Update selected index when results change
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-[20vh]"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-2xl mx-4 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center px-4 py-3 border-b border-gray-200">
          <Search className="h-5 w-5 text-gray-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search challenges..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-lg text-gray-700 placeholder-gray-400 bg-transparent border-none outline-none"
          />
          {query && (
            <span className="text-sm text-gray-400 ml-2">
              {filteredChallenges.length} result{filteredChallenges.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {query === '' ? (
            <div className="p-6 text-center">
              <Search className="h-8 w-8 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-2">Search for challenges</p>
              <p className="text-sm text-gray-400">
                Try searching for &quot;shell&quot;, &quot;web server&quot;, or &quot;JSON parser&quot;
              </p>
            </div>
          ) : filteredChallenges.length === 0 ? (
            <div className="p-6 text-center">
              <Search className="h-8 w-8 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-2">No challenges found</p>
              <p className="text-sm text-gray-400">
                Try a different search term
              </p>
            </div>
          ) : (
            <div className="py-2">
              {filteredChallenges.map((challenge: ClientChallenge, index: number) => (
                <button
                  key={challenge.slug}
                  onClick={() => handleSelectChallenge(challenge)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                    index === selectedIndex ? 'bg-gray-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {challenge.title}
                        </h3>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                            isDifficulty(challenge.difficulty) 
                              ? difficultyColors[challenge.difficulty] 
                              : 'bg-gray-100 text-gray-800 border-gray-200'
                          }`}
                        >
                          {challenge.difficulty}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {challenge.summary}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {challenge.estimatedTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <Code className="h-3 w-3" />
                          {challenge.category}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 ml-4 flex-shrink-0" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {query !== '' && (
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <ArrowRight className="h-3 w-3 rotate-90" />
                  <ArrowRight className="h-3 w-3 -rotate-90" />
                  to navigate
                </span>
                <span className="flex items-center gap-1">
                  ↵ to select
                </span>
              </div>
              <span>ESC to close</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Hook to trigger the command search
export function useCommandSearch() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K on Mac, Ctrl+K on Windows/Linux
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return {
    isOpen,
    openSearch: () => setIsOpen(true),
    closeSearch: () => setIsOpen(false)
  }
}
