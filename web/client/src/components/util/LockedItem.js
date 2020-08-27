import React from 'react'
import Lock from './Lock'

export default function LockedItem({extraClasses, lockSize, unlockTry}) {
    return (
        <div onClick={() => unlockTry()} className={`item-locked item-covered ${extraClasses ? extraClasses.join(' ') : ''}`}>
            <Lock size={lockSize}/>
        </div>
    )
}