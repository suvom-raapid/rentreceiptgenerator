interface AdPlaceholderProps {
  slot: string
  className?: string
}

export default function AdPlaceholder({ slot, className = '' }: AdPlaceholderProps) {
  return (
    <div
      id={`ad-${slot}`}
      className={`border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-gray-400 text-sm my-4 min-h-[90px] rounded ${className}`}
    >
      <span>Ad Space — {slot}</span>
    </div>
  )
}
