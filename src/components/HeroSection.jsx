import PropTypes from 'prop-types'

export const HeroSection = ({ title }) => {
    return (
        <div
            className='relative flex h-96 w-full items-center justify-center bg-cover bg-center' // Added items-center
            style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1496181133206-80ce9b88a853?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
            }}
        >
            <div className='absolute inset-0 bg-black opacity-60'></div>
            <h1 className='absolute bottom-4 left-4 z-10 text-4xl font-bold text-white'>
                {title}
            </h1>
        </div>
    )
}

HeroSection.propTypes = {
    title: PropTypes.string,
}
