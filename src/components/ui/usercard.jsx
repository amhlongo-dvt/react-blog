import { format } from 'date-fns'
import { User } from '../User'
import { Card, CardContent } from './card'
import PropTypes from 'prop-types'

export function UserCard({ post }) {
    return (
        <Card className='h-1/10 w-1/5 rounded-lg border-0 not-lg:hidden'>
            <CardContent className='px-6'>
                <div className='mb-2 flex items-center gap-4'>
                    <User id={post.author} oneLetter />
                    <div>
                        <p className='text-sm md:text-base'>
                            <User id={post.author} />
                        </p>
                        <p className='text-sm'>
                            {format(new Date(post.createdAt), 'MMMM d, yyyy')}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

UserCard.propTypes = {
    post: PropTypes.object,
}
