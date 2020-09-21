import React from 'react'

export default function CurrentPoints({amount}) {
    return (
        <div className="currentPoints">
            <h2>Current balance: {amount}$</h2>
        </div>
    )
}
