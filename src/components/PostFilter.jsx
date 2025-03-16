import PropTypes from 'prop-types'

export function PostFilter({ field = '', value, onChange }) {
    return (
        <div className='filter-container'>
            {/* <label className='text' htmlFor={`filter-${field}`}>
                {field.at(0).toUpperCase() + field.slice(1)}:{' '}
            </label> */}
            <input
                className='text-field'
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
