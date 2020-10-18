import React from 'react'
import Lock from './Lock'

export default function LockedItem({extraClasses, handler, lockSize, unlockTry, price}) {
    return (
        <div onClick={() => unlockTry()} className={`item-locked item-covered ${extraClasses ? extraClasses.join(' ') : ''}`}>
            <Lock handler={handler} price={price} size={lockSize}/>
        </div>
    )
}