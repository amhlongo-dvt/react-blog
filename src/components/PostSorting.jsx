import PropTypes from 'prop-types'

export function PostSorting({
    fields = [],
    value,
    onChange,
    orderValue,
    onOrderChange,
}) {
    return (
        <div className='sort-container'>
            <div className='drop-down-container'>
                <select
                    className='drop-down'
                    name='sortBy'
                    id='sortBy'
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                >
                    {fields.map((field) => (
                        <option key={field} value={field}>
                            {field}
                        </option>
                    ))}
                </select>
            </div>
            <div className='drop-down-container'>
                <select
                    className='drop-down'
                    name='sortOrder'
                    id='sortOrder'
                    value={orderValue}
                    onChange={(e) => onOrderChange(e.target.value)}
                >
                    <option className='drop-down__option' value={'ascending'}>
                        ascending
                    </option>
                    <option className='drop-down__option' value={'descending'}>
                        descending
                    </option>
                </select>
            </div>
        </div>
    )
}

PostSorting.propTypes = {
    fields: PropTypes.arrayOf(PropTypes.string).isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    orderValue: PropTypes.string.isRequired,
    onOrderChange: PropTypes.func.isRequired,
}
