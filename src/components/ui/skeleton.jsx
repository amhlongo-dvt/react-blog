import { cn } from '@/lib/utils'
import PropTypes from 'prop-types'

function Skeleton({ className, ...props }) {
    return (
        <div
            data-slot='skeleton'
            className={cn('bg-accent animate-pulse rounded-md', className)}
            {...props}
        />
    )
}

export { Skeleton }

Skeleton.propTypes = {
    className: PropTypes.string,
}
