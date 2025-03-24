import PropTypes from 'prop-types'

export function PostFilter({ field = '', value, onChange }) {
    return (
        <div className='filter-container w-52 shrink'>
            <input
                className='text-field w-full rounded-sm border-2 border-gray-400 px-2 focus:border-gray-500 focus:outline-0'
                type='text'
                name={`filter-${field}`}
                id={`filter-${field}`}
                value={value}
                placeholder={field.at(0).toUpperCase() + field.slice(1)}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    )
}

PostFilter.propTypes = {
    field: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
}
