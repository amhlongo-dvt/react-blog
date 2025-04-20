import PropTypes from 'prop-types'
import { base64ToDataUrl } from '../lib/utils'

export const HeroSection = ({ title, featuredImageId }) => {
    let imageUrl = 'https://placehold.co/200x200/000000/FFFFFF/png'
    if (featuredImageId) {
        imageUrl = base64ToDataUrl(featuredImageId.data, featuredImageId.type)
    }
    return (
        <div
            className='relative flex h-96 w-full items-center justify-center bg-cover bg-center' // Added items-center
            style={{
                backgroundImage: `url("${imageUrl}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className='bg-background absolute inset-0 opacity-40 dark:opacity-60'></div>
            <h1 className='text-foreground absolute bottom-4 left-4 z-10 text-4xl font-bold'>
                {title}
            </h1>
        </div>
    )
}

HeroSection.propTypes = {
    title: PropTypes.string,
    featuredImageId: PropTypes.object,
}
