import React from 'react'

interface LogoProps {
	className?: string
}

const Logo: React.FC<LogoProps> = ({ className = 'h-8 w-8' }) => (
	<svg
		className={className}
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<rect width="24" height="24" rx="6" fill="#2fbc77" />
		<path
			d="M6 8L10 12L6 16"
			stroke="white"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M12 16H18"
			stroke="white"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
)

export default Logo
