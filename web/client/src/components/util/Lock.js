import React from 'react'

export default function Lock({size, price, handler}) {
    return (
        <div className={`lock-icon lock-icon-${size ?? 'md'}`}>
            <span>{handler} -{price}$</span>
        </div>
    )
}
