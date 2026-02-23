import React from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RatingStarsProps {
    rating: number
    maxRating?: number
    interactive?: boolean
    onChange?: (rating: number) => void
    size?: number
    className?: string
}

export const RatingStars: React.FC<RatingStarsProps> = ({
    rating,
    maxRating = 5,
    interactive = false,
    onChange,
    size = 20,
    className,
}) => {
    const [hoverRating, setHoverRating] = React.useState<number | null>(null)

    const handleMouseEnter = (index: number) => {
        if (interactive) {
            setHoverRating(index + 1)
        }
    }

    const handleMouseLeave = () => {
        if (interactive) {
            setHoverRating(null)
        }
    }

    const handleClick = (index: number) => {
        if (interactive && onChange) {
            onChange(index + 1)
        }
    }

    return (
        <div className={cn('flex gap-1', className)}>
            {Array.from({ length: maxRating }).map((_, index) => {
                const isFilled = (hoverRating ?? rating) > index
                return (
                    <Star
                        key={index}
                        size={size}
                        className={cn(
                            'transition-colors',
                            isFilled
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-transparent text-gray-300',
                            interactive ? 'cursor-pointer' : 'cursor-default'
                        )}
                        onMouseEnter={() => handleMouseEnter(index)}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => handleClick(index)}
                    />
                )
            })}
        </div>
    )
}
