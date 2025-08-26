interface SpinnerProps {
  size?: 'small' | 'medium' | 'large'
  className?: string
}

export default function Spinner({ size = 'medium', className = '' }: SpinnerProps) {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8'
  }

  return (
    <div className={`inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent ${sizeClasses[size]} ${className}`}>
      <span className="sr-only">로딩 중...</span>
    </div>
  )
}